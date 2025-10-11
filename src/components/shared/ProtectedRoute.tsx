import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthentication } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Effect to check authentication on mount and periodically refresh the token
  useEffect(() => {
    // Variável para rastrear a última verificação
    let lastCheckTime = 0;

    // Check authentication on mount
    const initialCheck = async () => {
      try {
        console.log('🛡️ ProtectedRoute: Performing initial authentication check');

        // Verificar e limpar marcadores de logout órfãos
        const logoutInProgress = sessionStorage.getItem('logout_in_progress') === 'true';
        const logoutTimestamp = sessionStorage.getItem('logout_timestamp');

        if (logoutInProgress) {
          if (logoutTimestamp) {
            const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
            if (timeSinceLogout > 30000) {
              console.log('🛡️ ProtectedRoute: Clearing old logout markers');
              sessionStorage.removeItem('logout_in_progress');
              sessionStorage.removeItem('logout_timestamp');
            } else {
              console.log('🛡️ ProtectedRoute: Logout in progress, skipping auth check');
              setIsCheckingAuth(false);
              return;
            }
          } else {
            console.log('🛡️ ProtectedRoute: Clearing orphaned logout marker');
            sessionStorage.removeItem('logout_in_progress');
          }
        }

        // First check if the user is marked as authenticated locally
        const isAuthLocal = localStorage.getItem('is_authenticated') === 'true';
        console.log(
          '🛡️ ProtectedRoute: Local auth status:',
          isAuthLocal ? 'authenticated' : 'not authenticated'
        );

        // Se já estiver autenticado localmente, podemos ser mais rápidos
        if (isAuthLocal && isAuthenticated) {
          console.log('🛡️ ProtectedRoute: Already authenticated locally, skipping initial check');
          setIsCheckingAuth(false);
          return;
        }

        // Do a full auth check on mount
        await checkAuthentication();
        lastCheckTime = Date.now();

        console.log('🛡️ ProtectedRoute: Authentication check completed');
      } catch (error) {
        console.error('🛡️ Failed initial authentication check:', error);
        localStorage.removeItem('is_authenticated');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initialCheck();

    // NÃO configurar intervalos aqui - App.tsx já cuida disso
    // Este componente monta/desmonta várias vezes, criando múltiplos intervalos

    return () => {
      // Nenhum intervalo para limpar
    };
  }, [checkAuthentication, isAuthenticated]);

  // Show loading spinner while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Verificando autenticação...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Check if user might be coming from OAuth2 flow
    const recentOAuthActivity =
      sessionStorage.getItem('oauth_login_in_progress') ||
      localStorage.getItem('session_established_at');

    // If there's recent OAuth activity, give a bit more time before redirecting
    if (recentOAuthActivity && isCheckingAuth) {
      console.log(
        '🛡️ ProtectedRoute: Recent OAuth activity detected, waiting for authentication...'
      );
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Completando autenticação...</span>
        </div>
      );
    }

    console.log('🛡️ ProtectedRoute: Not authenticated, redirecting to login');
    // Remove local authentication marker if backend says we're not authenticated
    localStorage.removeItem('is_authenticated');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('🛡️ ProtectedRoute: Authentication confirmed, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;
