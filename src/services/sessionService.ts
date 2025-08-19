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
      
      // Try to get auth status first
      try {
        const status = await apiClient.getAuthStatus();
        console.log("🔒 Auth status check:", status);
        if (status && status.authenticated) {
          console.log("🔒 User is already authenticated according to status endpoint");
          return true;
        }
      } catch (statusError) {
        console.log("🔒 Auth status check failed, trying refresh:", statusError);
      }
      
      // If status check failed, try to refresh token
      try {
        await apiClient.refreshToken();
        console.log("🔒 Successfully refreshed token on app start");
        
        // After refresh, check status again
        try {
          const statusAfterRefresh = await apiClient.getAuthStatus();
          if (statusAfterRefresh && statusAfterRefresh.authenticated) {
            console.log("🔒 User authenticated after refresh");
            return true;
          }
        } catch (error) {
          console.log("🔒 Auth status check failed after refresh");
        }
      } catch (refreshError) {
        console.log("🔒 No session to refresh or refresh failed:", refreshError);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error("🔒 Error checking persistent session:", error);
      return false;
    }
  },
  
  // Initialize the session service
  async initialize(): Promise<void> {
    console.log("🚀 Initializing session service...");
    await this.checkPersistentSession();
  }
};
