import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthentication } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Effect to check authentication on mount and periodically refresh the token
  useEffect(() => {
    // Check authentication on mount
    const initialCheck = async () => {
      try {
        console.log("🛡️ ProtectedRoute: Performing initial authentication check");
        
        // First check if the user is marked as authenticated locally
        const isAuthLocal = localStorage.getItem('is_authenticated') === 'true';
        console.log("🛡️ ProtectedRoute: Local auth status:", isAuthLocal ? "authenticated" : "not authenticated");
        
        // Always do a full auth check on mount
        await checkAuthentication();
        
        console.log("🛡️ ProtectedRoute: Authentication check completed, isAuthenticated:", isAuthenticated);
      } catch (error) {
        console.error("🛡️ Failed initial authentication check:", error);
        localStorage.removeItem('is_authenticated');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    initialCheck();

    // Set up a refresh interval every 5 minutes (300000ms) - more frequent than before
    const refreshInterval = setInterval(() => {
      console.log("🔄 Performing periodic token refresh check");
      checkAuthentication().catch(err => {
        console.error("Periodic token refresh failed:", err);
      });
    }, 300000);

    return () => clearInterval(refreshInterval);
  }, [checkAuthentication]);

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
    console.log("🛡️ ProtectedRoute: Not authenticated, redirecting to login");
    // Remover o marcador local de autenticação se o backend diz que não estamos autenticados
    localStorage.removeItem('is_authenticated');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log("🛡️ ProtectedRoute: Authentication confirmed, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;