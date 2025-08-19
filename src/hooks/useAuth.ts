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
  
  const isCheckingAuth = useRef(false);

  const checkAuthentication = async () => {
    // Prevent multiple simultaneous authentication checks
    if (isCheckingAuth.current) {
      console.log('🔄 Authentication check skipped - check in progress');
      return;
    }

    try {
      isCheckingAuth.current = true;
      console.log('🔍 Checking authentication...');
      setLoading(true);
      
      // Check authentication status first
      try {
        const status = await apiClient.getAuthStatus();
        console.log('🔍 Auth status response:', status);
        
        if (status && status.authenticated) {
          // If authenticated via status endpoint, get the user details
          const user = await authService.getCurrentUser();
          console.log('✅ User is authenticated:', user);
          setAuth(user);
          return;
        } else {
          console.log('⚠️ Auth status indicates not authenticated');
        }
      } catch (statusError) {
        console.log('⚠️ Auth status check failed, falling back to regular check:', statusError);
      }
      
      // Fall back to the regular authentication check
      const result = await authService.checkAuthentication();
      
      if (result.isAuthenticated && result.user) {
        console.log('✅ User is authenticated:', result.user);
        setAuth(result.user);
      } else {
        // If not authenticated but we have a token, try to refresh
        try {
          console.log('⚠️ Session expired, attempting to refresh...');
          await authService.refreshToken();
          // Check authentication again after refresh
          const refreshResult = await authService.checkAuthentication();
          
          if (refreshResult.isAuthenticated && refreshResult.user) {
            console.log('✅ User is authenticated after token refresh:', refreshResult.user);
            setAuth(refreshResult.user);
          } else {
            console.log('❌ User is not authenticated even after refresh');
            logout();
          }
        } catch (refreshError) {
          console.log('❌ Failed to refresh token:', refreshError);
          logout();
        }
      }
    } catch (error) {
      console.error('❌ Authentication check failed:', error);
      logout();
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
      isCheckingAuth.current = false;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      logout();
      window.location.href = '/';
    }
  };

  const redirectToLogin = (provider: string = 'google') => {
    authService.redirectToLogin(provider);
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