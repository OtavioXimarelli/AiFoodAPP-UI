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
      
      // Verificar se temos um marcador local de autenticação
      const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';
      if (localAuthFlag) {
        console.log('🔍 Local authentication flag found - user was previously authenticated');
      }
      
      // Primeiro tentar com o endpoint de status
      try {
        console.log('🔍 Checking auth status via dedicated endpoint...');
        const status = await apiClient.getAuthStatus();
        console.log('🔍 Auth status response:', status);
        
        if (status && status.authenticated === true) {
          console.log('✅ Status endpoint confirms user is authenticated');
          
          // Se autenticado via endpoint de status, obter os detalhes do usuário
          try {
            const user = await authService.getCurrentUser();
            console.log('✅ User details retrieved successfully:', user);
            setAuth(user);
            localStorage.setItem('is_authenticated', 'true');
            return;
          } catch (userError) {
            console.error('⚠️ Failed to get user details despite status showing authenticated:', userError);
            // Tentar refresh do token antes de desistir
          }
        } else {
          console.log('⚠️ Auth status explicitly indicates not authenticated');
          
          // Se temos marcador local mas servidor diz que não estamos autenticados,
          // tentar refresh do token
          if (localAuthFlag) {
            console.log('⚠️ Local auth flag contradicts server status - will try refresh');
          } else {
            // Se não temos marcador local e servidor confirma não autenticado, deslogar
            console.log('⚠️ No local auth flag and server confirms not authenticated');
            logout();
            return;
          }
        }
      } catch (statusError) {
        console.log('⚠️ Auth status check failed, trying to refresh token:', statusError);
      }
      
      // Tentar refresh do token
      try {
        console.log('🔄 Attempting token refresh...');
        await apiClient.refreshToken();
        console.log('🔄 Token refresh successful');
        
        // Verificar status novamente após refresh
        try {
          const refreshedStatus = await apiClient.getAuthStatus();
          console.log('🔍 Auth status after refresh:', refreshedStatus);
          
          if (refreshedStatus && refreshedStatus.authenticated === true) {
            // Se autenticado após refresh, obter detalhes do usuário
            const user = await authService.getCurrentUser();
            console.log('✅ User authenticated after token refresh:', user);
            setAuth(user);
            localStorage.setItem('is_authenticated', 'true');
            return;
          } else {
            console.log('❌ Still not authenticated even after token refresh');
            localStorage.removeItem('is_authenticated');
            logout();
            return;
          }
        } catch (error) {
          console.log('❌ Failed to check auth status after token refresh');
        }
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError);
        
        // Último recurso: tentar obter detalhes do usuário diretamente
        try {
          console.log('🔍 Last resort: trying to get user details directly...');
          const user = await authService.getCurrentUser();
          console.log('✅ Surprisingly got user details successfully:', user);
          setAuth(user);
          localStorage.setItem('is_authenticated', 'true');
          return;
        } catch (finalError) {
          console.log('❌ All authentication attempts failed');
          localStorage.removeItem('is_authenticated');
          logout();
        }
      }
    } catch (error) {
      console.error('❌ Authentication check failed with exception:', error);
      localStorage.removeItem('is_authenticated');
      logout();
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
      isCheckingAuth.current = false;
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