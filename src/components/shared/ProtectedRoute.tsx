import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthentication } = useAuth();
  const location = useLocation();

  // Effect to periodically refresh the token in the background
  useEffect(() => {
    // Check authentication on mount
    const initialCheck = async () => {
      try {
        await checkAuthentication();
      } catch (error) {
        console.error("Failed initial authentication check:", error);
      }
    };
    initialCheck();

    // Set up a refresh interval every 10 minutes (600000ms)
    const refreshInterval = setInterval(() => {
      console.log("🔄 Performing periodic token refresh check");
      checkAuthentication().catch(err => {
        console.error("Periodic token refresh failed:", err);
      });
    }, 600000);

    return () => clearInterval(refreshInterval);
  }, [checkAuthentication]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;