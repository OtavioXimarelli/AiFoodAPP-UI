import axios from "axios";

// Garante que a URL não termine com /api para evitar duplicação
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// Não removemos mais o /api do baseURL, pois isso causaria problemas com o ensureApiPath
// Mantemos o URL original como está configurado no ambiente
const baseURL = rawBaseURL;

// Função utilitária para garantir que os caminhos de API não tenham duplicação do prefixo /api
const ensureApiPath = (path: string): string => {
  const originalPath = path;
  
  // Se o caminho não começa com /, adiciona-o
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // CORREÇÃO: Se o baseURL já inclui /api e o caminho também inclui /api, 
  // precisamos remover o /api do caminho para evitar duplicação
  if (rawBaseURL.includes('/api') && path.startsWith('/api/')) {
    path = path.substring(4); // Remove os primeiros 4 caracteres (/api)
    
    // Apenas para debugging não-frequente
    if (!originalPath.includes('/auth/status')) {
      console.log(`🔧 Path corrigido: ${originalPath} → ${path} (removido prefixo /api redundante)`);
    }
  } 
  // Se o baseURL não inclui /api e o caminho não começa com /api/, adicionar /api
  else if (!rawBaseURL.includes('/api') && !path.startsWith('/api/')) {
    const oldPath = path;
    path = '/api' + path;
    
    // Apenas para debugging não-frequente
    if (!originalPath.includes('/auth/status')) {
      console.log(`🔧 Path corrigido: ${oldPath} → ${path} (adicionado prefixo /api)`);
    }
  }
  
  return path;
};

console.log('🌐 Raw API Base URL:', rawBaseURL);
console.log('🌐 Final API Base URL:', baseURL);
console.log('🌐 Environment:', import.meta.env.MODE);

console.log('🌐 API Configuration Details:');
console.log('  → Using API prefix handling:', rawBaseURL.includes('/api') ? 'Yes' : 'No');
console.log('  → Base URL contains /api:', rawBaseURL.includes('/api') ? 'Yes' : 'No');

// Exemplos de como as URLs serão construídas (agora ensureApiPath já está disponível)
console.log('🌐 Example endpoint URLs:');
console.log('  → /auth endpoint:', ensureApiPath('/auth'));
console.log('  → /auth/status endpoint:', ensureApiPath('/auth/status'));
console.log('  → /api/auth endpoint:', ensureApiPath('/api/auth'));

// Mostrar como ficará a URL completa
try {
  console.log('🌐 Full example URL:', new URL(ensureApiPath('/auth'), baseURL).href);
} catch (e) {
  console.log('🌐 Could not construct full URL example');
}

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json"
  },
  // Enable credentials for OAuth2 session-based authentication
  withCredentials: true,
  // Additional settings for production
  validateStatus: function (status) {
    // Accept status codes 200-299 and 401 (to handle properly)
    return (status >= 200 && status < 300) || status === 401;
  }
});

// Utility function to get CSRF token from cookies
export const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith('XSRF-TOKEN=')
  );
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }
  
  return null;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    // Garantir que o caminho da URL está normalizado
    if (config.url && !config.url.startsWith('http')) {
      const originalUrl = config.url;
      config.url = ensureApiPath(config.url);
      // Se a URL mudou e não é um endpoint comum, logar a mudança
      if (originalUrl !== config.url && !originalUrl.includes('/auth/status')) {
        console.log(`🔧 URL normalizada: ${originalUrl} → ${config.url}`);
      }
    }
    
    // Reduzir logs para apenas URLs não comuns (evita logar status checks repetitivos)
    const isCommonEndpoint = config.url?.includes('/auth/status');
    if (!isCommonEndpoint) {
      console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.url);
    }
    
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
      if (!isCommonEndpoint) {
        console.log('🔒 Added CSRF token to request');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // Reduzir logs para apenas URLs não comuns (evita logar status checks repetitivos)
    const isCommonEndpoint = response.config.url?.includes('/auth/status');
    if (!isCommonEndpoint) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    
    // O backend agora retorna respostas JSON adequadas para endpoints de API,
    // mas mantemos esta verificação como fallback para casos extremos
    const contentType = response.headers['content-type'];
    const isAuthEndpoint = response.config.url?.includes('/auth/');
    
    // Verificar se, por algum motivo, ainda estamos recebendo HTML em vez de JSON
    if (contentType && contentType.includes('text/html') && typeof response.data === 'string') {
      console.warn('⚠️ Received HTML response instead of JSON - this should not happen with updated backend');
      
      // Verificar se é uma página de erro do Whitelabel (Spring Boot)
      const htmlData = response.data as string;
      const isWhitelabelError = htmlData.includes('Whitelabel Error Page') || 
                                htmlData.includes('Internal Server Error') ||
                                htmlData.includes('status=500');
      
      if (isWhitelabelError) {
        console.error('🔥 Detected server error page in response');
        // Transformar em um erro para ser capturado pelos handlers apropriados
        throw new Error('Server error (500) - The authentication server encountered an error');
      }
      
      // Para endpoints de autenticação, interpretar como não autenticado
      if (isAuthEndpoint) {
        console.log('🔑 Auth endpoint returned HTML - interpreting as not authenticated');
        response.data = { 
          authenticated: false,
          status: 401,
          error: "Unauthorized",
          message: "Authentication required"
        };
      } else {
        // Para outros endpoints, considerar um erro de autenticação
        throw new Error('Authentication required - unexpected HTML response');
      }
    }
    
    // Para endpoints de autenticação que retornam status 401, ajustar o formato de resposta
    // para compatibilidade com o código existente
    if (isAuthEndpoint && response.status === 401 && response.data && response.data.status === 401) {
      const isAuthStatusEndpoint = response.config.url?.includes('/auth/status');
      
      if (isAuthStatusEndpoint) {
        // Para o endpoint de status, formatar a resposta como esperado pelo resto do código
        response.data = { 
          authenticated: false 
        };
        console.log('🔑 Auth status returned 401 - formatted as not authenticated');
      }
    }
    
    // Se a resposta contém redirectUrl, este pode ser um problema
    if (response.data && response.data.redirectUrl) {
      console.warn('⚠️ Response contains redirectUrl:', response.data.redirectUrl);
    }
    
    return response;
  },
  async (error) => {
    console.error('❌ Full error object:', error);
    
    // Check if this is a 401 error from an API call (not auth endpoints)
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    const needsRetry = error.response?.status === 401 && originalRequest && !isAuthEndpoint && !originalRequest._retry;
    
    // Handle token refresh if 401 error and not an auth endpoint
    if (needsRetry) {
      console.log('🔄 Token expired, attempting to refresh session...');
      originalRequest._retry = true;
      
      try {
        // Call the refresh token endpoint using the ApiClient para utilizar mecanismo de controle de taxa
        await apiClient.refreshToken();
        console.log('🔄 Session refreshed successfully, retrying request');
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error('🔄 Failed to refresh session:', refreshError);
        
        // Verificar tipo de erro para decidir se redirecionamos ou não
        const refreshErrorStr = refreshError instanceof Error ? refreshError.message : String(refreshError);
        
        // Só redirecionar se for realmente um problema de autenticação, não problema de rede
        if (refreshErrorStr.includes('401') || 
            refreshErrorStr.includes('403') || 
            refreshErrorStr.includes('Maximum refresh attempts exceeded') ||
            refreshErrorStr.includes('Authentication required')) {
          console.log('🔄 Authentication issue detected, redirecting to login');
          localStorage.removeItem('is_authenticated');
          window.location.href = '/login';
        } else {
          console.log('🔄 Network or server error during refresh, not redirecting');
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - backend may not be running');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network error - backend may not be running or CORS issue');
      console.error('❌ Check if CORS is properly configured on backend for domain:', window.location.origin);
    } else if (error.response) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}:`, error.response?.data);
      
      // Handle specific error cases with the new JSON error format
      if (error.response.status === 401) {
        // Novo formato de erro de autenticação
        const errorData = error.response.data;
        if (errorData && typeof errorData === 'object') {
          console.log('🔑 Unauthorized JSON response:', errorData.message || 'Authentication required');
        } else {
          console.log('🔑 Unauthorized - user needs to login');
        }
      } else if (error.response.status === 403) {
        console.log('🔑 Forbidden - user lacks permission');
      } else if (error.response.status >= 500) {
        console.log('🔧 Server error (500) - backend issue');
        
        // Para erros de servidor durante o processo de OAuth, considerar redirecionar
        const isOAuthRelated = error.config?.url?.includes('oauth2') || 
                              error.config?.url?.includes('auth/') ||
                              error.config?.url?.includes('login');
                              
        // Se está relacionado ao OAuth e estamos no callback do OAuth, registrar com mais detalhes
        if (isOAuthRelated && window.location.pathname.includes('oauth2')) {
          console.error('🔥 Server error during OAuth flow - this requires backend attention');
          
          // Limpar estado de autenticação para evitar loops
          localStorage.removeItem('is_authenticated');
          sessionStorage.removeItem('oauth_login_in_progress');
        }
      }
    } else {
      console.error('❌ Unknown error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Client class
export class ApiClient {
  // Authentication endpoints - these will be proxied through nginx
  async getCurrentUser() {
    const response = await api.get(ensureApiPath('/auth'));
    return response.data;
  }
  
  // Cache para evitar chamadas repetidas em um curto período de tempo
  #authStatusCache: {
    data: any;
    timestamp: number;
    pending: Promise<any> | null;
  } = {
    data: null,
    timestamp: 0,
    pending: null
  };
  
  async getAuthStatus() {
    // Verificar se a página é de login - não precisa verificar status em páginas de login
    if (window.location.pathname.includes('/login')) {
      return { authenticated: false };
    }
    
    // Se já temos uma chamada pendente, reuse a promessa para evitar chamadas paralelas
    if (this.#authStatusCache.pending) {
      return this.#authStatusCache.pending;
    }
    
    // Se temos um cache válido (menos de 10 segundos), retorne-o - aumentado o tempo
    const now = Date.now();
    if (this.#authStatusCache.data && now - this.#authStatusCache.timestamp < 10000) {
      console.log('🔍 Returning cached auth status');
      return this.#authStatusCache.data;
    }
    
    // Verificar se o marcador local diz que já estamos autenticados
    const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';
    
    try {
      // Criar uma nova promessa para esta chamada e armazenar como pendente
      this.#authStatusCache.pending = (async () => {
        console.log('🔍 Calling auth status endpoint...');
        
        try {
          // Com a nova implementação do backend, podemos esperar respostas JSON adequadas
          // O código 401 será capturado pelo interceptor e transformado em {authenticated: false}
          const response = await api.get(ensureApiPath('/auth/status'));
          
          // Garantir que temos um objeto válido
          const statusData = typeof response.data === 'object' ? response.data : { authenticated: false };
          
          // Verificar formato padrão da nova API (status 401 e message "Authentication required")
          // O interceptor já deve ter tratado isso, mas verificamos aqui para garantir
          if (statusData.status === 401 && statusData.error === "Unauthorized") {
            console.log('🔍 Received standard API unauthorized response');
            return { authenticated: false };
          }
          
          // Se não temos um campo de autenticação explícito, verificar por outras indicações
          if (statusData.authenticated === undefined) {
            // Se temos dados de usuário, provavelmente estamos autenticados
            statusData.authenticated = !!statusData.user || !!statusData.username || !!statusData.email;
          }
          
          // Atualizar o cache
          this.#authStatusCache.data = statusData;
          this.#authStatusCache.timestamp = Date.now();
          
          // Se autenticado, atualizar o marcador local
          if (statusData.authenticated) {
            localStorage.setItem('is_authenticated', 'true');
          }
          
          return statusData;
        } catch (error) {
          // Com a nova implementação do backend, erros de autenticação devem vir como respostas 401 JSON
          // e não como erros, mas mantemos este código para compatibilidade
          
          // Para erros específicos de autenticação, limpar cache
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorResponse = (error as any)?.response?.data;
          
          // Verificar se temos o novo formato de erro de API
          const isAuthError = 
            (errorResponse && errorResponse.status === 401) || 
            errorMessage.includes('Authentication required');
            
          if (isAuthError) {
            console.log('🔍 Received authentication error response:', errorResponse || errorMessage);
            this.#authStatusCache.data = { authenticated: false };
            this.#authStatusCache.timestamp = now;
            
            // Se tínhamos um marcador local mas agora não estamos autenticados,
            // pode ser que precisemos renovar a sessão
            if (localAuthFlag) {
              try {
                // Tentar refresh do token
                console.log('🔄 Tentando refresh do token após falha de status...');
                await this.refreshToken();
                
                // Verificar novamente após o refresh
                const refreshResponse = await api.get(ensureApiPath('/auth/status'));
                const refreshStatusData = typeof refreshResponse.data === 'object' 
                  ? refreshResponse.data 
                  : { authenticated: false };
                
                // Atualizar cache com resultado após refresh
                this.#authStatusCache.data = refreshStatusData;
                this.#authStatusCache.timestamp = Date.now();
                
                return refreshStatusData;
              } catch (refreshError) {
                // Se o refresh também falhar, não estamos autenticados
                localStorage.removeItem('is_authenticated');
                return { authenticated: false };
              }
            }
          }
          
          // Para outros erros, usar flag local se existir
          if (localAuthFlag) {
            console.log('🔍 Status check failed, using local auth flag');
            return { authenticated: true };
          }
          
          // Retornar não autenticado
          return { authenticated: false };
        }
      })();
      
      // Aguardar a resposta e limpar o status pendente
      const result = await this.#authStatusCache.pending;
      this.#authStatusCache.pending = null;
      return result;
    } catch (error) {
      console.error('🔍 Fatal error getting auth status:', error);
      this.#authStatusCache.pending = null;
      
      // Em caso de erro fatal, usar flag local ou retornar não autenticado
      return { authenticated: localAuthFlag };
    }
  }

  // Variável para rastrear tentativas de refresh para evitar loops
  #refreshAttempts = 0;
  #lastRefreshTime = 0;
  #refreshPromise: Promise<any> | null = null;

  async refreshToken() {
    const now = Date.now();
    
    // Limitar frequência de refresh (no máximo uma vez a cada 5 segundos)
    if (now - this.#lastRefreshTime < 5000) {
      console.log('🔄 Rate limiting token refresh');
      // Se tentamos muito recentemente, rejeitar sem tentar novamente
      return Promise.reject(new Error('Token refresh rate limited'));
    }
    
    // Prevenir chamadas paralelas
    if (this.#refreshPromise) {
      console.log('🔄 Reusing pending token refresh');
      return this.#refreshPromise;
    }
    
    // Reset contador de tentativas se passou muito tempo desde o último refresh
    if (now - this.#lastRefreshTime > 30000) {
      this.#refreshAttempts = 0;
    }
    
    // Limitar número máximo de tentativas para evitar loops
    if (this.#refreshAttempts >= 3) {
      console.error('🔄 Too many refresh attempts, giving up');
      localStorage.removeItem('is_authenticated');
      return Promise.reject(new Error('Maximum refresh attempts exceeded'));
    }
    
    // Registrar esta tentativa
    this.#refreshAttempts++;
    this.#lastRefreshTime = now;
    
    try {
      // Criar promessa compartilhada
      this.#refreshPromise = api.post(ensureApiPath('/auth/refresh'))
        .then(response => {
          console.log('🔄 Token refresh successful');
          
          // Se refresh funcionou, atualizar cache de status
          this.#authStatusCache.data = { authenticated: true };
          this.#authStatusCache.timestamp = Date.now();
          
          // Marcar como autenticado localmente
          localStorage.setItem('is_authenticated', 'true');
          
          return response.data;
        })
        .catch(error => {
          console.error('🔄 Token refresh failed:', error);
          
          // Com a nova implementação do backend, erros de autenticação devem vir como JSON
          const errorData = error.response?.data;
          const errorStatus = error.response?.status;
          
          // Log do novo formato de erro para debugging
          if (errorData && typeof errorData === 'object') {
            console.log('🔄 API error details:', errorData);
          }
          
          // Para alguns tipos de erro, remover marcador local de autenticação
          if (errorStatus === 401 || errorStatus === 403 || 
              (errorData?.status === 401) || (errorData?.error === 'Unauthorized')) {
            console.log('🔄 Unauthorized error detected, clearing authentication state');
            localStorage.removeItem('is_authenticated');
          }
          
          throw error;
        })
        .finally(() => {
          this.#refreshPromise = null;
        });
      
      return await this.#refreshPromise;
    } catch (error) {
      this.#refreshPromise = null;
      throw error;
    }
  }

  async logout() {
    await api.post(ensureApiPath('/auth/logout'));
  }

  // Food endpoints - these will be proxied through nginx
  async getFoodItems() {
    const response = await api.get(ensureApiPath('/foods'));
    return response.data;
  }

  async getFoodItem(id: number) {
    const response = await api.get(ensureApiPath(`/foods/${id}`));
    return response.data;
  }

  async createFoodItem(foodItem: any) {
    const response = await api.post(ensureApiPath('/foods/create'), foodItem);
    return response.data;
  }

  async updateFoodItem(foodItem: any) {
    const response = await api.put(ensureApiPath(`/foods/${foodItem.id}`), foodItem);
    return response.data;
  }

  async deleteFoodItem(id: number) {
    await api.delete(ensureApiPath(`/foods/${id}`));
  }

  // Recipe endpoints - these will be proxied through nginx
  async generateRecipes() {
    const response = await api.get(ensureApiPath('/recipes/gen'));
    return response.data;
  }

  async analyzeRecipe(id: number) {
    const response = await api.get(ensureApiPath(`/recipes/analyze/${id}`));
    return response.data;
  }
}

export const apiClient = new ApiClient();