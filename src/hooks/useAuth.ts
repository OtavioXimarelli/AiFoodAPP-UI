import { useRef, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { apiClient } from '@/lib/api';

// Performance optimization: reduce logging noise
const isDevelopment = import.meta.env.MODE === 'development';
const enableVerboseLogging = false; // Set to true only when debugging auth issues

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasCheckedAuth,
    setAuth,
    logout,
    setLoading,
    setHasCheckedAuth,
  } = useAuthStore();

  // Referência para evitar chamadas simultâneas
  const isCheckingAuth = useRef(false);

  // Referência para armazenar a última vez que verificamos a autenticação
  const lastCheckTime = useRef(0);

  // Referência para uma promessa compartilhada (evita múltiplas chamadas simultâneas)
  const authCheckPromise = useRef<Promise<void> | null>(null);

  // Helper to debug cookie issues (optimized)
  const logAuthCookies = () => {
    if (!enableVerboseLogging) return;
    
    const cookies = document.cookie;
    if (!cookies) {
      console.log('🍪 useAuth - No cookies found');
      return;
    }

    const cookieList = cookies.split(';').map(c => c.trim());
    console.log(`🍪 useAuth - Total cookies: ${cookieList.length}`);

    // Look for session related cookies without logging values
    const sessionCookies = cookieList.filter(
      cookie =>
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

  const checkAuthentication = useCallback(async () => {
    // Verificar e limpar marcadores de logout antigos/órfãos
    const logoutInProgress = sessionStorage.getItem('logout_in_progress') === 'true';
    const logoutTimestamp = sessionStorage.getItem('logout_timestamp');

    // Se há timestamp de logout, verificar se é muito antigo (>30 segundos) e limpar
    if (logoutTimestamp) {
      const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);

      if (timeSinceLogout > 30000) {
        // Logout muito antigo, limpar marcadores órfãos
        if (enableVerboseLogging) {
          console.log('🔑 Clearing old logout markers (>30s ago)');
        }
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('logout_timestamp');
      } else if (timeSinceLogout < 5000) {
        // Logout recente, ainda bloquear
        if (enableVerboseLogging) {
          console.log('🔑 Recent logout detected, preventing automatic reauthentication');
        }
        return;
      }
    }

    // Verificar logout em progresso apenas se não for órfão
    if (logoutInProgress && logoutTimestamp) {
      const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
      if (timeSinceLogout < 15000) {
        // Só bloquear por 15 segundos max (extended guard)
        if (enableVerboseLogging) {
          console.log('🔑 Logout in progress, skipping auth check');
        }
        return;
      } else {
        // Logout marker órfão, limpar
        if (enableVerboseLogging) {
          console.log('🔑 Clearing orphaned logout marker');
        }
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('logout_timestamp');
      }
    } else if (logoutInProgress && !logoutTimestamp) {
      // Logout marker sem timestamp = órfão, limpar
      if (enableVerboseLogging) {
        console.log('🔑 Clearing logout marker without timestamp');
      }
      sessionStorage.removeItem('logout_in_progress');
    }

    // Check if we're on an OAuth2 callback page
    const isOAuth2Callback =
      window.location.pathname.includes('/oauth2/callback') ||
      window.location.pathname.includes('/login/oauth2/code/');

    // Log cookies for debugging (reduced noise)
    if (enableVerboseLogging) {
      console.log('🔍 useAuth checkAuthentication - checking cookies:');
      logAuthCookies();
    }

    // Prevenção contra chamadas simultâneas - allow for OAuth2 callbacks
    if (isCheckingAuth.current && !isOAuth2Callback) {
      if (enableVerboseLogging) {
        console.log('🔄 Auth check already in progress, waiting for it to complete');
      }

      if (authCheckPromise.current) {
        await authCheckPromise.current;
      }
      return;
    }

    // Verificar se já estamos autenticados no estado global (skip for OAuth2 callbacks)
    if (isAuthenticated && user && hasCheckedAuth && !isOAuth2Callback) {
      if (enableVerboseLogging) {
        console.log('✅ Already authenticated in global state, skipping check');
      }
      return;
    }

    // Limitação de taxa: no máximo uma chamada a cada 5 segundos (reduced for OAuth2 callbacks)
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    const rateLimitTime = isOAuth2Callback ? 500 : 5000; // 0.5s for OAuth2, 5s for normal

    if (timeSinceLastCheck < rateLimitTime && hasCheckedAuth && !isOAuth2Callback) {
      if (enableVerboseLogging) {
        console.log(
          `⏱️ Rate limiting auth check (last check ${(timeSinceLastCheck / 1000).toFixed(1)}s ago)`
        );
      }
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
          if (enableVerboseLogging || isOAuth2Callback) {
            console.log(
              `🔍 Starting authentication check... ${isOAuth2Callback ? '(OAuth2 callback)' : ''}`
            );
          }

          // Verificar o marcador local de autenticação
          const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';

          // Verificar o status de autenticação (com cache)
          const status = await apiClient.getAuthStatus();

          // Se autenticado pelo status
          if (status && status.authenticated === true) {
            if (enableVerboseLogging) {
              console.log('✅ Status endpoint confirms authenticated');
            }

            // Obter detalhes do usuário
            try {
              const user = await authService.getCurrentUser();
              setAuth(user);
              localStorage.setItem('is_authenticated', 'true');
              return;
            } catch (userError) {
              if (enableVerboseLogging) {
                console.log('⚠️ Failed to get user details despite authenticated status');
              }

              if (localAuthFlag && user) {
                // Se temos um usuário em cache, continuar usando
                if (enableVerboseLogging) {
                  console.log('✅ Using cached user data while authenticated');
                }
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
            if (enableVerboseLogging || isOAuth2Callback) {
              console.log(
                `🔍 Not authenticated ${isOAuth2Callback ? '(waiting for OAuth2 to complete)' : ''}`
              );
            }
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
  }, [isAuthenticated, user, hasCheckedAuth, setAuth, setLoading, setHasCheckedAuth, logout]);

  const handleLogout = useCallback(async () => {
    try {
      console.log('🔑 Starting logout process...');

      // Primeiro: marcar que estamos fazendo logout para evitar reautenticação
      sessionStorage.setItem('logout_in_progress', 'true');
      sessionStorage.setItem('logout_timestamp', Date.now().toString());

      // Limpar TODOS os dados locais de autenticação
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('session_established_at');
      sessionStorage.removeItem('oauth_login_in_progress');
      sessionStorage.removeItem('oauth_login_started_at');
      sessionStorage.removeItem('oauth_state');

      // Limpar cache de autenticação no estado local primeiro
      logout();
      console.log('🔑 Local auth state cleared');

      // Tentar fazer logout no servidor
      await authService.logout();
      console.log('🔑 Server logout requested');

      // Poll status endpoint to ensure server-side session was cleared before redirecting
      try {
        const maxWaitMs = 5000; // wait up to 5s
        const pollInterval = 300;
        const start = Date.now();
        let confirmed = false;

        while (Date.now() - start < maxWaitMs) {
          try {
            const status = await apiClient.getAuthStatus();
            if (!status || status.authenticated !== true) {
              confirmed = true;
              break;
            }
          } catch (e) {
            // ignore transient errors and retry
          }
          // small delay before next poll
          // eslint-disable-next-line no-await-in-loop
          await new Promise(r => setTimeout(r, pollInterval));
        }

        if (confirmed) {
          console.log('🔑 Server logout confirmed by status endpoint');
        } else {
          console.warn(
            '🔑 Server logout not confirmed within timeout - continuing with client cleanup'
          );
        }
      } catch (e) {
        console.warn('🔑 Error while confirming server logout:', e);
      }
    } catch (error) {
      console.error('🔑 Server logout failed:', error);
      // Mesmo com erro no servidor, já limpamos tudo localmente
    } finally {
      // Forçar limpeza de cookies se possível
      try {
        // Tentar limpar cookies de domínio específicos
        document.cookie.split(';').forEach(function (c) {
          document.cookie = c
            .replace(/^ +/, '')
            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });

        // Limpar cookies específicos do OAuth2/Spring Security
        const cookiesToClear = [
          'JSESSIONID',
          'remember-me',
          'XSRF-TOKEN',
          'SESSION',
          'SPRING_SECURITY_REMEMBER_ME_COOKIE',
        ];

        cookiesToClear.forEach(cookieName => {
          // Para diferentes domínios e paths
          const domains = [
            window.location.hostname,
            `.${window.location.hostname}`,
            'localhost',
            '.localhost',
          ];
          const paths = ['/', '/api', '/oauth2'];

          domains.forEach(domain => {
            paths.forEach(path => {
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure; samesite=strict`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
              document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
            });
          });
        });
      } catch (e) {
        console.warn('🔑 Could not clear cookies:', e);
      }

      // Aguardar um pouco para garantir que o logout foi processado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remover o marcador de logout em progresso após um delay
      setTimeout(() => {
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('logout_timestamp');
      }, 2000);

      // Redirecionar para a página inicial e forçar reload completo
      console.log('🔑 Redirecting to home page...');

      // Usar replace para evitar que o usuário volte para a página autenticada
      window.location.replace('/');

      // Forçar reload da página após um delay para garantir limpeza completa
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [logout]);

  const redirectToLogin = useCallback(async (provider: string = 'google') => {
    try {
      await authService.redirectToLogin(provider);
    } catch (error) {
      console.error('🔑 Failed to redirect to login:', error);
    }
  }, []);

  // ⚠️ REMOVED: Auto check authentication on mount
  // Authentication is now handled centrally by App.tsx via sessionService
  // This prevents multiple components from triggering auth checks simultaneously

  // Return stable object with memoized functions
  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuthentication,
    logout: handleLogout,
    redirectToLogin,
  };
};
