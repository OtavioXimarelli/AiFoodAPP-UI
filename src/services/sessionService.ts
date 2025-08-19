import { apiClient } from "@/lib/api";
import { authService } from "./authService";

/**
 * Session Service para gerenciar a sessão persistente do usuário
 * similar ao sistema do YouTube que mantém o usuário logado
 * mesmo quando fecha o navegador
 */
export const sessionService = {
  // Check if we have a persistent session
  async checkPersistentSession(): Promise<boolean> {
    try {
      console.log("🔒 Checking for persistent session...");
      
      // Verificar se marcamos o usuário como autenticado localmente
      const isAuthenticatedLocally = localStorage.getItem('is_authenticated') === 'true';
      if (isAuthenticatedLocally) {
        console.log("🔒 User is marked as authenticated locally");
      }
      
      // Try to get auth status first
      try {
        console.log("🔒 Checking authentication status via API...");
        const status = await apiClient.getAuthStatus();
        console.log("🔒 Auth status check:", status);
        
        if (status && status.authenticated) {
          console.log("🔒 User is already authenticated according to status endpoint");
          localStorage.setItem('is_authenticated', 'true');
          return true;
        } else {
          console.log("🔒 Auth status endpoint says user is NOT authenticated");
          
          if (isAuthenticatedLocally) {
            console.log("🔒 User was marked authenticated locally but server says no - will try refresh");
          }
        }
      } catch (statusError) {
        console.log("🔒 Auth status check failed, trying refresh:", statusError);
      }
      
      // If status check failed or user is not authenticated but was locally, try to refresh token
      try {
        console.log("🔒 Attempting to refresh token...");
        await apiClient.refreshToken();
        console.log("🔒 Successfully refreshed token");
        
        // After refresh, check status again
        try {
          const statusAfterRefresh = await apiClient.getAuthStatus();
          console.log("🔒 Auth status after refresh:", statusAfterRefresh);
          
          if (statusAfterRefresh && statusAfterRefresh.authenticated) {
            console.log("🔒 User authenticated after refresh");
            localStorage.setItem('is_authenticated', 'true');
            return true;
          } else {
            console.log("🔒 User still not authenticated even after refresh");
            localStorage.removeItem('is_authenticated');
          }
        } catch (error) {
          console.log("🔒 Auth status check failed after refresh");
          localStorage.removeItem('is_authenticated');
        }
      } catch (refreshError) {
        console.log("🔒 No session to refresh or refresh failed:", refreshError);
        localStorage.removeItem('is_authenticated');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error("🔒 Error checking persistent session:", error);
      localStorage.removeItem('is_authenticated');
      return false;
    }
  },
  
  // Initialize the session service
  async initialize(): Promise<void> {
    console.log("🚀 Initializing session service...");
    await this.checkPersistentSession();
  }
};
