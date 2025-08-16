import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

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
    if (isCheckingAuth.current || hasCheckedAuth) {
      console.log('🔄 Authentication check skipped - already checked or in progress');
      return;
    }

    try {
      isCheckingAuth.current = true;
      console.log('🔍 Checking authentication...');
      setLoading(true);
      
      const result = await authService.checkAuthentication();
      
      if (result.isAuthenticated && result.user) {
        console.log('✅ User is authenticated:', result.user);
        setAuth(result.user);
      } else {
        console.log('❌ User is not authenticated');
        logout();
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