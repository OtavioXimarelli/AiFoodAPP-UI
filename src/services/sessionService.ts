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
      
      // Try to refresh token first
      try {
        await apiClient.refreshToken();
        console.log("🔒 Successfully refreshed token on app start");
      } catch (refreshError) {
        console.log("🔒 No session to refresh or refresh failed:", refreshError);
        return false;
      }
      
      // If refresh succeeded, verify authentication
      try {
        const authResult = await authService.checkAuthentication();
        if (authResult.isAuthenticated) {
          console.log("🔒 Persistent session found and valid");
          return true;
        }
      } catch (authError) {
        console.log("🔒 Session invalid even after refresh:", authError);
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
