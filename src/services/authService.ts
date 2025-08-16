import { apiClient } from "@/lib/api";
import { User } from "@/lib/types";

export interface AuthResponse {
  user: User;
}

export const authService = {
  // Get current authenticated user
  async getCurrentUser(): Promise<User> {
    try {
      console.log("🔑 Fetching current user...");
      const user = await apiClient.getCurrentUser();
      console.log("🔑 Current user:", user);
      
      // Check if the response is HTML (login page) instead of JSON
      if (typeof user === 'string' && user.includes('<!DOCTYPE html>')) {
        console.log("🔑 Received HTML login page - user not authenticated");
        throw new Error('User not authenticated');
      }
      
      return user;
    } catch (error: any) {
      console.error("🔑 Failed to get current user:", error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log("🔑 Logging out user...");
      await apiClient.logout();
      console.log("🔑 User logged out successfully");
    } catch (error: any) {
      console.error("🔑 Failed to logout:", error);
      throw error;
    }
  },

  // Redirect to OAuth2 login - OAuth2 endpoints are at root level, not under /api
  redirectToLogin(provider: string = 'google'): void {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    // The Spring Boot OAuth2 endpoint is at the root of the server, not under /api.
    // We construct the URL from the base of the API URL to be safe.
    const url = new URL(apiBaseUrl);
    const oauthUrl = `${url.protocol}//${url.host}/oauth2/authorization/${provider}`;

    console.log("🔑 Redirecting to OAuth2 login:", oauthUrl);
    window.location.href = oauthUrl;
  },

  // Check if user is authenticated by trying to get current user
  async checkAuthentication(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      const user = await this.getCurrentUser();
      return { isAuthenticated: true, user };
    } catch (error) {
      return { isAuthenticated: false };
    }
  }
};