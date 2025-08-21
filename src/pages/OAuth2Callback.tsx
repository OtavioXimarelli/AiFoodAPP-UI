import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { apiClient, api } from '@/lib/api';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { checkAuthentication } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Utility function to debug cookies
  const logCookieDebug = () => {
    const cookies = document.cookie;
    if (!cookies) {
      console.log('🍪 No cookies found in OAuth2Callback');
      return;
    }
    
    const cookieList = cookies.split(';').map(c => c.trim());
    console.log(`🍪 OAuth2Callback - Total cookies: ${cookieList.length}`);
    
    // Look for session related cookies
    const sessionCookies = cookieList.filter(cookie => 
      cookie.toLowerCase().includes('session') || 
      cookie.toLowerCase().includes('jsessionid') ||
      cookie.toLowerCase().startsWith('remember-me=')
    );
    
    if (sessionCookies.length > 0) {
      console.log('🍪 OAuth2Callback - Session cookies found:');
      sessionCookies.forEach(cookie => {
        const [name] = cookie.split('=');
        // Don't log values for security, just names
        console.log(`   → ${name}`);
      });
    } else {
      console.log('🍪 OAuth2Callback - No session cookies found');
    }
  };

  useEffect(() => {
    // Flag para evitar efeitos de corrida
    let mounted = true;
    
    // Debug cookies when component mounts
    console.log('🔄 OAuth2Callback mounted - checking cookies:');
    logCookieDebug();
    
    // Verificar se o processo de OAuth já está há muito tempo e limpar se necessário
    const oauthStartedAt = sessionStorage.getItem('oauth_login_started_at');
    if (oauthStartedAt) {
      const startTime = new Date(oauthStartedAt).getTime();
      const now = Date.now();
      const timePassed = now - startTime;
      
      // Se passou mais de 10 minutos, considerar que o processo falhou e limpar
      if (timePassed > 10 * 60 * 1000) {
        console.log('⚠️ OAuth login process timed out after', Math.round(timePassed/1000/60), 'minutes');
        sessionStorage.removeItem('oauth_login_in_progress');
        sessionStorage.removeItem('oauth_login_started_at');
      }
    }
    
    const handleCallback = async () => {
      // Evitar múltiplas chamadas/redirecionamentos por causa de efeitos de montagem/desmontagem
      if (!mounted) return;
      
      try {
        console.log('🔄 OAuth2Callback: Starting authentication check...');
        
        // Check for token parameter in the URL
        const params = new URLSearchParams(window.location.search);
        const hasToken = params.has('token') || params.has('code');
        const hasError = params.has('error');
        const hasCode = params.has('code');
        const hasState = params.has('state');
        
        // Verificar por erro no URL - o servidor pode retornar erro tanto pelo parâmetro error
        // quanto pelo código de status na própria URL (caso do erro 500)
        if (hasError) {
          const errorMsg = params.get('error') || 'Unknown error';
          console.error('❌ Error in OAuth callback URL:', errorMsg);
          throw new Error(`OAuth error: ${errorMsg}`);
        }
        
        // Special handling for OAuth2 redirect - check URL parameters
        // If we have OAuth2 parameters, we likely just came from a successful OAuth2 flow
        if (hasCode && hasState) {
          console.log('🔄 OAuth2 parameters detected - processing OAuth2 callback...');
          
          // For OAuth2 callbacks, we need special handling because the session cookie
          // might not be immediately available due to cross-origin redirect timing
          
          // Clear any old authentication state first
          localStorage.removeItem('is_authenticated');
          sessionStorage.removeItem('oauth_login_in_progress');
          sessionStorage.removeItem('oauth_login_started_at');
          
          // Try to use the credentials from the current page context
          // The browser should have received cookies from the OAuth2 redirect
          console.log('🔄 Attempting to use OAuth2 session...');
          
          // Wait a bit more for browser to process cookies from redirect
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check cookies after delay
          console.log('🔄 Cookies after delay:');
          logCookieDebug();
          
          // Now try to verify authentication with the session cookies that should be set
          try {
            console.log('🔄 Checking authentication after OAuth2 redirect...');
            const status = await apiClient.getAuthStatus();
            
            // Log response details for debugging
            console.log('🔄 Auth status response:', status);
            
            if (status && status.authenticated) {
              console.log('✅ OAuth2 authentication confirmed');
              localStorage.setItem('session_established_at', new Date().toISOString());
              localStorage.setItem('is_authenticated', 'true');
              
              // Force a brief delay to ensure session state is fully established
              await new Promise(resolve => setTimeout(resolve, 500));
              
              if (mounted) {
                console.log('🔄 Navigating to dashboard...');
                navigate('/dashboard', { replace: true });
                return;
              }
            } else {
              console.log('⚠️ OAuth2 session not yet available, will try polling approach...');
            }
          } catch (error) {
            console.log('⚠️ OAuth2 session check failed, will try polling approach:', error);
            console.error(error); // Log full error details
          }
        }
        
        // Verificar por padrão de erro 500 na URL (caso do Whitelabel Error)
        const currentUrl = window.location.href;
        if (currentUrl.includes('error') || 
            currentUrl.includes('status=500') || 
            currentUrl.includes('Internal+Server+Error')) {
          console.error('❌ Detected server error in URL:', currentUrl);
          throw new Error('Server error (500) - The authentication server encountered an error');
        }
        
        // Registrar que o callback foi iniciado (pode ajudar no debugging)
        console.log('🔄 OAuth2 callback processing with params:', 
          Object.fromEntries([...params.entries()]
            .filter(([key]) => !['token', 'code'].includes(key)))); // Não logar tokens por segurança
        
        // We're now using a proxy for better session handling
        // But still implement retry logic for reliability
        let attempts = 0;
        const maxAttempts = 6; // Increased attempts for session cookie issues
        let waitTime = 2000; // Start with 2 seconds
        
        // With proxy setup, check if we need to manually sync the session
        // This helps ensure cookies are properly shared
        console.log('🔄 Checking if session needs manual synchronization...');
        try {
          // Make a request to /api/auth/status to establish session
          const response = await api.get('/api/auth/status');
          console.log('🔄 Session check completed', response.status);
          
          // Check cookies after status check
          console.log('🔄 Cookies after status check:');
          logCookieDebug();
          
          // If status check already shows authenticated, we can proceed directly
          if (response.data && response.data.authenticated) {
            console.log('✅ Already authenticated according to status check!');
            localStorage.setItem('session_established_at', new Date().toISOString());
            localStorage.setItem('is_authenticated', 'true');
            
            if (mounted) {
              console.log('🔄 Navigating to dashboard directly...');
              navigate('/dashboard', { replace: true });
              return;
            }
          }
        } catch (e) {
          console.log('🔄 Initial session check failed, will retry');
          console.error(e); // Log full error for debugging
        }
        
        while (attempts < maxAttempts && mounted) {
          attempts++;
          console.log(`🔄 Authentication check attempt ${attempts}/${maxAttempts}...`);
          
          // Wait before checking (except first attempt)
          if (attempts > 1) {
            console.log(`🔄 Waiting ${waitTime/1000}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            // Increase wait time for subsequent attempts, but cap at 8 seconds
            waitTime = Math.min(waitTime * 1.2, 8000);
          }
          
          // Special handling for session cookie issues - reload page on later attempts
          if (attempts === 3) {
            console.log('🔄 Attempting to reload page to refresh session cookies...');
            // Force a page reload to ensure session cookies are properly set
            window.location.reload();
            return; // Exit after reload
          }
          
          // Check if still mounted after waiting
          if (!mounted) return;
          
          // Check cookies before status check
          console.log(`🔄 Cookies before attempt ${attempts}:`);
          logCookieDebug();
          
          try {
            // Try checking auth status
            console.log(`🔄 Checking authentication status (attempt ${attempts})...`);
            const status = await apiClient.getAuthStatus();
            
            // Log response for debugging
            console.log(`🔄 Auth status response (attempt ${attempts}):`, status);
            
            if (status && status.authenticated) {
              console.log('✅ User authenticated according to status endpoint');
              
              // Set session markers
              localStorage.setItem('session_established_at', new Date().toISOString());
              localStorage.setItem('is_authenticated', 'true');
              
              // Clear OAuth process markers
              sessionStorage.removeItem('oauth_login_in_progress');
              sessionStorage.removeItem('oauth_login_started_at');
              
              // Force a brief delay to ensure session is fully established
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Redirect to dashboard
              if (mounted) {
                console.log('🔄 Redirecting to dashboard...');
                navigate('/dashboard', { replace: true });
              }
              return;
            } else {
              console.log(`⚠️ Status endpoint reports not authenticated (attempt ${attempts})`);
              
              // On attempts 4-5, try to navigate directly to a backend endpoint to force session sync
              if (attempts >= 4 && attempts <= 5) {
                console.log(`🔄 Attempt ${attempts}: Trying to sync session with backend...`);
                try {
                  // Make a direct call to a protected endpoint to force session verification
                  const syncResponse = await apiClient.refreshToken();
                  console.log('🔄 Session sync successful', syncResponse);
                  
                  // Check cookies after sync
                  console.log('🔄 Cookies after session sync:');
                  logCookieDebug();
                  
                  continue; // Try auth check again
                } catch (syncError) {
                  console.log('🔄 Session sync failed, continuing with normal flow');
                  console.error(syncError); // Log full error for debugging
                }
              }
            }
          } catch (statusError) {
            console.log(`⚠️ Failed to check auth status (attempt ${attempts}):`, statusError);
          }
          
          // On last attempt, try a page reload to refresh session cookies
          if (attempts === maxAttempts) {
            console.log('🔄 Final attempt - trying page reload to refresh session cookies...');
            
            // Check if we've already tried reloading
            const hasReloaded = sessionStorage.getItem('oauth_reload_attempted');
            
            if (!hasReloaded) {
              sessionStorage.setItem('oauth_reload_attempted', 'true');
              
              // Remove the OAuth parameters from URL before reload to avoid loops
              const url = new URL(window.location.href);
              url.searchParams.delete('code');
              url.searchParams.delete('state');
              url.searchParams.delete('scope');
              url.searchParams.delete('authuser');
              url.searchParams.delete('prompt');
              
              console.log('🔄 Reloading page to refresh session cookies...');
              window.location.href = url.toString();
              return;
            } else {
              // We've already tried reloading, so this isn't working
              console.log('⚠️ Already attempted reload, falling back to regular auth check...');
              sessionStorage.removeItem('oauth_reload_attempted');
            }
            
            try {
              console.log('🔄 Final attempt with regular authentication check...');
              await checkAuthentication();
              
              // If we get here without errors, authentication was successful
              localStorage.setItem('session_established_at', new Date().toISOString());
              localStorage.setItem('is_authenticated', 'true');
              
              if (mounted) {
                console.log('🔄 Authentication successful, redirecting to dashboard...');
                navigate('/dashboard', { replace: true });
              }
              return;
            } catch (authError) {
              console.error('❌ Final authentication check failed:', authError);
              throw authError;
            }
          }
        }
      } catch (error) {
        if (!mounted) return;
        
        console.error('❌ OAuth2 callback error:', error instanceof Error ? error.message : error);
        
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        
        // Detectar tipos específicos de erro para mensagens mais amigáveis
        let userFriendlyMessage = 'Authentication failed. Please try again.';
        let errorDetails = '';
        
        if (errorMessage.includes('500') || errorMessage.includes('Server error')) {
          userFriendlyMessage = 'Authentication server error';
          errorDetails = 'The authentication server encountered an internal error. This is a backend issue that requires attention from the development team.';
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('timeout')) {
          userFriendlyMessage = 'Connection error';
          errorDetails = 'Could not connect to the authentication server. Please check your internet connection and try again.';
        } else if (errorMessage.includes('OAuth error')) {
          userFriendlyMessage = 'OAuth authentication error';
          errorDetails = errorMessage;
        }
        
        setError(userFriendlyMessage + (errorDetails ? `: ${errorDetails}` : ''));
        
        // Limpar marcadores de processo OAuth em caso de erro
        sessionStorage.removeItem('oauth_login_in_progress');
        sessionStorage.removeItem('oauth_login_started_at');
        sessionStorage.removeItem('oauth_reload_attempted');
        
        // Redirecionar após um tempo maior para erros do servidor (usuário pode precisar ler a mensagem)
        const redirectDelay = errorMessage.includes('500') ? 5000 : 3000;
        setTimeout(() => {
          if (mounted) {
            navigate('/login', { replace: true });
          }
        }, redirectDelay);
      }
    };

    handleCallback();
    
    // Função de limpeza para evitar atualizações em componentes desmontados
    return () => {
      mounted = false;
    };
  }, [checkAuthentication, navigate]);

  if (error) {
    // Determinar se é erro de servidor para estilo especial
    const isServerError = error.includes('server error') || error.includes('500');
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-100">
          <div className={`text-4xl mb-4 ${isServerError ? 'text-red-600' : 'text-amber-500'}`}>
            {isServerError ? '🛑' : '⚠️'}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {isServerError ? 'Server Error' : 'Authentication Error'}
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {error}
          </p>
          {isServerError && (
            <div className="bg-gray-50 p-3 rounded text-left text-sm mb-4 border border-gray-200">
              <p className="text-gray-700 font-medium mb-1">Troubleshooting:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Verifique se o servidor backend está funcionando corretamente</li>
                <li>Verifique os logs do servidor para mais detalhes sobre o erro</li>
                <li>O erro 500 indica um problema no lado do servidor e não no cliente</li>
              </ul>
            </div>
          )}
          <p className="text-sm text-gray-500">
            Redirecionando para a página de login em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing sign in...
        </h2>
        <p className="text-gray-600">
          Please wait while we finish setting up your account.
        </p>
      </div>
    </div>
  );
};

export default OAuth2Callback;