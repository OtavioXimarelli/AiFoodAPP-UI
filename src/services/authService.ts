import { apiClient } from '@/lib/api';
import { User } from '@/lib/types';

export interface AuthResponse {
  user: User;
}

export const authService = {
  // Get current authenticated user
  async getCurrentUser(): Promise<User> {
    try {
      console.log('🔑 Fetching current user...');
      const user = await apiClient.getCurrentUser();
      console.log('🔑 Current user:', user);

      // Check if the response is HTML (login page) instead of JSON
      if (typeof user === 'string' && user.includes('<!DOCTYPE html>')) {
        console.log('🔑 Received HTML login page - user not authenticated');
        throw new Error('User not authenticated');
      }

      return user;
    } catch (error: any) {
      console.error('🔑 Failed to get current user:', error);

      // Try to refresh the token if getting current user fails
      try {
        console.log('🔑 Attempting to refresh token...');
        await this.refreshToken();
        // Try to get user again after refresh
        return await apiClient.getCurrentUser();
      } catch (refreshError) {
        console.error('🔑 Token refresh failed:', refreshError);
        throw error; // Throw the original error if refresh fails
      }
    }
  },

  // Refresh the authentication token
  async refreshToken(): Promise<void> {
    try {
      console.log('🔄 Refreshing authentication token...');

      // Tentar refresh do token com retry
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          if (retryCount > 0) {
            console.log(`🔄 Retry attempt ${retryCount}/${maxRetries} for token refresh`);
            // Esperar um pouco antes de retry
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }

          await apiClient.refreshToken();
          console.log('🔄 Token refreshed successfully');
          return;
        } catch (retryError: any) {
          console.error(`🔄 Token refresh attempt ${retryCount + 1} failed:`, retryError);
          retryCount++;

          if (retryCount > maxRetries) {
            throw retryError;
          }
        }
      }
    } catch (error: any) {
      console.error('🔄 All token refresh attempts failed:', error);
      // Remover marcadores de autenticação local
      localStorage.removeItem('is_authenticated');
      localStorage.removeItem('session_established_at');
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('🔑 Logging out user...');
      await apiClient.logout();

      // Importar e limpar cache do sessionService
      const { sessionService } = await import('./sessionService');
      sessionService.clearSessionCache();

      console.log('🔑 User logged out successfully');
    } catch (error: any) {
      console.error('🔑 Failed to logout:', error);
      throw error;
    }
  },

  // Redirect to OAuth2 login
  async redirectToLogin(provider: string = 'google'): Promise<void> {
    try {
      console.log('🔑 Iniciando redirecionamento para o login OAuth2...');

      // A URL base da API deve vir das suas variáveis de ambiente
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.aifoodapp.site';

      // Monta a URL de autorização completa.
      // Nota: O caminho NÃO tem /api porque o security filter do Spring
      // intercepta /oauth2/authorization antes do context-path.
      const oauthUrl = `${apiBaseUrl}/oauth2/authorization/${provider}`;

      console.log('🔑 Redirecionando o navegador para:', oauthUrl);

      // Isto força o navegador a navegar para a página de login do Google
      window.location.href = oauthUrl;
    } catch (error) {
      console.error('🔑 Falha ao iniciar o login OAuth2:', error);
    }
  },

  // Get current authentication status
  async getAuthStatus(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      const status = await apiClient.getAuthStatus();
      return status;
    } catch (error) {
      console.error('Failed to get auth status:', error);
      return { authenticated: false };
    }
  },

  // Check if user is authenticated by trying to get current user
  async checkAuthentication(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      // First try with the status endpoint
      try {
        const status = await this.getAuthStatus();
        if (status.authenticated) {
          // If status shows authenticated, try to get user details
          const user = await this.getCurrentUser();
          return { isAuthenticated: true, user };
        }
      } catch (statusError) {
        console.log('Status check failed, falling back to user endpoint:', statusError);
      }

      // Fallback to legacy method
      const user = await this.getCurrentUser();
      return { isAuthenticated: true, user };
    } catch (error) {
      return { isAuthenticated: false };
    }
  },
};
