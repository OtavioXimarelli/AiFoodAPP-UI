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

  const checkAuthentication = async () => {
    // Prevenção contra chamadas simultâneas
    if (isCheckingAuth.current) {
      console.log('🔄 Auth check already in progress, waiting for it to complete');
      
      if (authCheckPromise.current) {
        await authCheckPromise.current;
      }
      return;
    }
    
    // Verificar se já estamos autenticados no estado global
    if (isAuthenticated && user && hasCheckedAuth) {
      console.log('✅ Already authenticated in global state, skipping check');
      return;
    }
    
    // Limitação de taxa: no máximo uma chamada a cada 5 segundos
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime.current;
    
    if (timeSinceLastCheck < 5000 && hasCheckedAuth) {
      console.log(`� Rate limiting auth check (last check ${(timeSinceLastCheck/1000).toFixed(1)}s ago)`);
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
          console.log('🔍 Starting authentication check...');
          
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
          } else if (localAuthFlag) {
            // Se temos marcador local mas status diz não autenticado, tentar refresh
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
            localStorage.removeItem('is_authenticated');
            logout();
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
      localStorage.removeItem('is_authenticated');
      logout();
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