import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { apiClient } from '@/lib/api';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    hasCheckedAuth,
    setAuth, 
    logout, 
    setLoading,
    setHasCheckedAuth
  } = useAuthStore();
  
  // Referência para evitar chamadas simultâneas
  const isCheckingAuth = useRef(false);
  
  // Referência para armazenar a última vez que verificamos a autenticação
  const lastCheckTime = useRef(0);
  
  // Referência para uma promessa compartilhada (evita múltiplas chamadas simultâneas)
  const authCheckPromise = useRef<Promise<void> | null>(null);

  // Helper to debug cookie issues
  const logAuthCookies = () => {
    const cookies = document.cookie;
    if (!cookies) {
      console.log('🍪 useAuth - No cookies found');
      return;
    }
    
    const cookieList = cookies.split(';').map(c => c.trim());
    console.log(`🍪 useAuth - Total cookies: ${cookieList.length}`);
    
    // Look for session related cookies without logging values
    const sessionCookies = cookieList.filter(cookie => 
      cookie.toLowerCase().includes('session') || 
      cookie.toLowerCase().includes('jsessionid') ||
      cookie.toLowerCase().startsWith('remember-me=')
    );
    
    if (sessionCookies.length > 0) {
      console.log('🍪 useAuth - Session cookies found:');
      sessionCookies.forEach(cookie => {
        const [name] = cookie.split('=');
        console.log(`   → ${name}`);
      });
    } else {
      console.log('🍪 useAuth - No session cookies found');
    }
  };

  const checkAuthentication = async () => {
    // Check if we're on an OAuth2 callback page
    const isOAuth2Callback = window.location.pathname.includes('/oauth2/callback') || 
                            window.location.pathname.includes('/login/oauth2/code/');
    
    // Log cookies for debugging
    console.log('🔍 useAuth checkAuthentication - checking cookies:');
    logAuthCookies();
    
    // Prevenção contra chamadas simultâneas - allow for OAuth2 callbacks
    if (isCheckingAuth.current && !isOAuth2Callback) {
      console.log('🔄 Auth check already in progress, waiting for it to complete');
      
      if (authCheckPromise.current) {
        await authCheckPromise.current;
      }
      return;
    }
    
    // Verificar se já estamos autenticados no estado global (skip for OAuth2 callbacks)
    if (isAuthenticated && user && hasCheckedAuth && !isOAuth2Callback) {
      console.log('✅ Already authenticated in global state, skipping check');
      return;
    }
    
    // Limitação de taxa: no máximo uma chamada a cada 5 segundos (reduced for OAuth2 callbacks)
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    const rateLimitTime = isOAuth2Callback ? 500 : 5000; // 0.5s for OAuth2, 5s for normal
    
    if (timeSinceLastCheck < rateLimitTime && hasCheckedAuth && !isOAuth2Callback) {
      console.log(`⏱️ Rate limiting auth check (last check ${(timeSinceLastCheck/1000).toFixed(1)}s ago)`);
      return;
    }
    
    // Iniciar verificação
    try {
      isCheckingAuth.current = true;
      lastCheckTime.current = now;
      
      // Criar uma promessa compartilhada para esta verificação
      authCheckPromise.current = (async () => {
        try {
          setLoading(true);
          console.log(`🔍 Starting authentication check... ${isOAuth2Callback ? '(OAuth2 callback)' : ''}`);
          
          // Verificar o marcador local de autenticação
          const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';
          
          // Verificar o status de autenticação (com cache)
          const status = await apiClient.getAuthStatus();
          
          // Se autenticado pelo status
          if (status && status.authenticated === true) {
            console.log('✅ Status endpoint confirms authenticated');
            
            // Obter detalhes do usuário
            try {
              const user = await authService.getCurrentUser();
              setAuth(user);
              localStorage.setItem('is_authenticated', 'true');
              return;
            } catch (userError) {
              console.log('⚠️ Failed to get user details despite authenticated status');
              
              if (localAuthFlag && user) {
                // Se temos um usuário em cache, continuar usando
                console.log('✅ Using cached user data while authenticated');
                return;
              }
            }
          } else if (localAuthFlag && !isOAuth2Callback) {
            // Se temos marcador local mas status diz não autenticado, tentar refresh (skip during OAuth2)
            try {
              await apiClient.refreshToken();
              
              // Verificar status novamente após refresh
              const refreshedStatus = await apiClient.getAuthStatus();
              
              if (refreshedStatus && refreshedStatus.authenticated) {
                const user = await authService.getCurrentUser();
                setAuth(user);
                localStorage.setItem('is_authenticated', 'true');
                return;
              }
            } catch (refreshError) {
              // Falha no refresh, limpar autenticação
              localStorage.removeItem('is_authenticated');
              logout();
            }
          } else {
            // Não autenticado e sem marcador local
            console.log(`🔍 Not authenticated ${isOAuth2Callback ? '(waiting for OAuth2 to complete)' : ''}`);
            if (!isOAuth2Callback) {
              localStorage.removeItem('is_authenticated');
              logout();
            }
          }
        } finally {
          setLoading(false);
          setHasCheckedAuth(true);
        }
      })();
      
      // Aguardar a conclusão da promessa
      await authCheckPromise.current;
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      if (!isOAuth2Callback) {
        localStorage.removeItem('is_authenticated');
        logout();
      }
    } finally {
      isCheckingAuth.current = false;
      authCheckPromise.current = null;
    }
  };

  const handleLogout = async () => {
    try {
      // Limpar as informações locais de autenticação
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('session_established_at');
      
      // Tentar fazer logout no servidor
      await authService.logout();
      console.log('🔑 Server logout successful');
    } catch (error) {
      console.error('🔑 Server logout failed:', error);
    } finally {
      // Sempre limpar o estado local independentemente do sucesso no servidor
      logout();
      console.log('🔑 Local auth state cleared');
      
      // Redirecionar para a página inicial
      window.location.href = '/';
    }
  };

  const redirectToLogin = async (provider: string = 'google') => {
    try {
      await authService.redirectToLogin(provider);
    } catch (error) {
      console.error('🔑 Failed to redirect to login:', error);
    }
  };

  // Check authentication on mount - but only if we haven't checked yet
  useEffect(() => {
    console.log('🚀 useAuth mounted - hasCheckedAuth:', hasCheckedAuth, 'isAuthenticated:', isAuthenticated);
    
    if (!hasCheckedAuth && !isCheckingAuth.current) {
      checkAuthentication();
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuthentication,
    logout: handleLogout,
    redirectToLogin
  };
};