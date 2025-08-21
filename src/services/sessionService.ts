import { apiClient } from "@/lib/api";
import { authService } from "./authService";

/**
 * Session Service para gerenciar a sessão persistente do usuário
 * similar ao sistema do YouTube que mantém o usuário logado
 * mesmo quando fecha o navegador
 */
export const sessionService = {
  // Estado para evitar verificações simultâneas ou muito frequentes
  _checkingSession: false,
  _lastCheckTime: 0,
  _checkPromise: null as Promise<boolean> | null,
  // Estado para monitorar tentativas e erros de sessão
  _checkAttempts: 0,
  _lastError: null as Error | null,
  
  // Check if we have a persistent session
  async checkPersistentSession(): Promise<boolean> {
    // Verificar se estamos em processo de logout
    if (sessionStorage.getItem('logout_in_progress') === 'true') {
      console.log("🔒 Logout in progress, skipping session check");
      return false;
    }
    
    // Evitar chamadas múltiplas simultâneas
    if (this._checkingSession && this._checkPromise) {
      console.log("🔒 Session check already in progress, reusing promise");
      return this._checkPromise;
    }
    
    // Limitar a frequência de verificações para no máximo uma a cada 10 segundos
    const now = Date.now();
    const timeSinceLastCheck = now - this._lastCheckTime;
    
    // Se a última verificação foi há menos de 10 segundos e já foi marcado como autenticado, retornar rapidamente
    if (timeSinceLastCheck < 10000 && localStorage.getItem('is_authenticated') === 'true') {
      console.log("🔒 Using cached auth status (checked " + (timeSinceLastCheck/1000).toFixed(1) + "s ago)");
      return true;
    }
    
    // Se a última verificação foi há menos de 10 segundos e não autenticado, não verificar novamente tão cedo
    // A menos que tenhamos muitos erros consecutivos, nesse caso aumentamos o tempo de espera exponencialmente
    const backoffTime = Math.min(10000 * Math.pow(2, this._checkAttempts), 60000); // máximo 1 minuto
    
    if (timeSinceLastCheck < backoffTime) {
      console.log(`🔒 Rate limiting auth check, last check was ${(timeSinceLastCheck/1000).toFixed(1)}s ago (waiting ${(backoffTime/1000).toFixed(1)}s)`);
      return localStorage.getItem('is_authenticated') === 'true';
    }
    
    this._checkingSession = true;
    this._checkPromise = (async () => {
      try {
        console.log("🔒 Checking for persistent session...");
        this._lastCheckTime = Date.now();
        
        // Verificar se marcamos o usuário como autenticado localmente
        const isAuthenticatedLocally = localStorage.getItem('is_authenticated') === 'true';
        if (isAuthenticatedLocally) {
          console.log("🔒 User is marked as authenticated locally");
        }
        
        // Try to get auth status first
        try {
          console.log("🔒 Checking authentication status via API...");
          const status = await apiClient.getAuthStatus();
          
          if (status && status.authenticated) {
            console.log("🔒 User is already authenticated according to status endpoint");
            localStorage.setItem('is_authenticated', 'true');
            // Resetar contadores de erro quando autenticação é bem sucedida
            this._checkAttempts = 0;
            this._lastError = null;
            return true;
          } else if (isAuthenticatedLocally) {
            console.log("🔒 Auth status says not authenticated but marked locally - trying refresh");
            
            // Tentar refresh do token
            try {
              await apiClient.refreshToken();
              console.log("🔒 Successfully refreshed token");
              
              // Verificar status após refresh
              const statusAfterRefresh = await apiClient.getAuthStatus();
              
              if (statusAfterRefresh && statusAfterRefresh.authenticated) {
                console.log("🔒 User authenticated after refresh");
                localStorage.setItem('is_authenticated', 'true');
                return true;
              } else {
                console.log("🔒 User still not authenticated even after refresh");
                localStorage.removeItem('is_authenticated');
                return false;
              }
            } catch (refreshError) {
              console.log("🔒 Token refresh failed:", refreshError);
              localStorage.removeItem('is_authenticated');
              return false;
            }
          } else {
            console.log("🔒 User is not authenticated");
            localStorage.removeItem('is_authenticated');
            return false;
          }
        } catch (statusError) {
          console.log("🔒 Auth status check failed:", statusError);
          
          // Verificar localmente se já estava autenticado
          if (isAuthenticatedLocally) {
            return true; // Manter autenticação local se não conseguir verificar com o servidor
          }
          return false;
        }
      } catch (error) {
        console.error("🔒 Error checking persistent session:", error);
        // Incrementar contador de tentativas para backoff exponencial
        this._checkAttempts++;
        this._lastError = error instanceof Error ? error : new Error(String(error));
        
        // Após muitas falhas seguidas, limpar status de autenticação para evitar loops
        if (this._checkAttempts >= 5) {
          console.warn(`🔒 Too many session check failures (${this._checkAttempts}), clearing authentication state`);
          localStorage.removeItem('is_authenticated');
        }
        
        return false;
      } finally {
        this._checkingSession = false;
      }
    })();
    
    const result = await this._checkPromise;
    this._checkPromise = null;
    return result;
  },
  
  // Clear session cache and state - used during logout
  clearSessionCache(): void {
    console.log("🗑️ Clearing session cache...");
    this._checkingSession = false;
    this._lastCheckTime = 0;
    this._checkPromise = null;
    this._checkAttempts = 0;
    this._lastError = null;
    
    // Limpar todos os dados de autenticação
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('session_established_at');
    sessionStorage.removeItem('oauth_login_in_progress');
    sessionStorage.removeItem('oauth_login_started_at');
    sessionStorage.removeItem('oauth_state');
  },
  
  // Initialize the session service
  async initialize(): Promise<void> {
    console.log("🚀 Initializing session service...");
    // Verificar se já estamos logados localmente
    if (localStorage.getItem('is_authenticated') === 'true') {
      console.log("🚀 Found local authentication marker, will check session in background");
      // Iniciar verificação em background, sem aguardar
      this.checkPersistentSession().catch(err => {
        console.error("🚀 Background session check failed:", err);
      });
      return;
    }
    
    // Se não temos marcador local, verificar sincronamente
    await this.checkPersistentSession();
  }
};
