import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useCallback, memo } from 'react';

const ProtectedRoute = memo(() => {
  const { isAuthenticated, isLoading, checkAuthentication } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  // Memoize check function
  const performAuthCheck = useCallback(async () => {
    if (hasChecked) {
      console.log('🛡️ ProtectedRoute: Auth already checked, skipping');
      return;
    }

    try {
      console.log('🛡️ ProtectedRoute: Performing authentication check');

      // Verificar logout em progresso
      const logoutInProgress = sessionStorage.getItem('logout_in_progress') === 'true';
      if (logoutInProgress) {
        const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
        if (logoutTimestamp) {
          const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
          if (timeSinceLogout < 30000) {
            console.log('🛡️ ProtectedRoute: Logout in progress, skipping');
            setIsCheckingAuth(false);
            return;
          }
        }
        // Limpar marcadores antigos
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('logout_timestamp');
      }

      // Verificar auth local primeiro
      const isAuthLocal = localStorage.getItem('is_authenticated') === 'true';
      if (isAuthLocal && isAuthenticated) {
        console.log('🛡️ ProtectedRoute: Already authenticated locally');
        setIsCheckingAuth(false);
        setHasChecked(true);
        return;
      }

      // Verificar autenticação via API
      await checkAuthentication();
      setHasChecked(true);
      console.log('🛡️ ProtectedRoute: Authentication check completed');
    } catch (error) {
      console.error('🛡️ Failed authentication check:', error);
      localStorage.removeItem('is_authenticated');
    } finally {
      setIsCheckingAuth(false);
    }
  }, [hasChecked, isAuthenticated, checkAuthentication]);

  // Effect to check authentication on mount ONLY
  useEffect(() => {
    performAuthCheck();
  }, [performAuthCheck]);

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
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
