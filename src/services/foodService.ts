import { apiClient } from "@/lib/api";
import { FoodItem, CreateFoodPayload, UpdateFoodPayload, BasicFoodPayload } from "@/lib/types";
import { nutritionAIService } from "./nutritionAIService";

export const foodService = {
  // Get all food items for the current user
  async getFoodItems(): Promise<FoodItem[]> {
    try {
      console.log("🥗 Fetching food items...");
      const items = await apiClient.getFoodItems();
      console.log("🥗 Food items fetched:", items);
      
      // Check if the response is HTML (login page) instead of JSON
      if (typeof items === 'string' && items.includes('<!DOCTYPE html>')) {
        console.log("🥗 Received HTML login page - user not authenticated");
        throw new Error('User not authenticated');
      }
      
      // Ensure items is an array
      if (!Array.isArray(items)) {
        console.warn("🥗 Expected array but got:", typeof items);
        return [];
      }
      
      return items;
    } catch (error: any) {
      console.error("🥗 Failed to fetch food items:", error);
      throw error;
    }
  },

  // Get a single food item by ID
  async getFoodItem(id: number): Promise<FoodItem> {
    try {
      console.log("🥗 Fetching food item:", id);
      const item = await apiClient.getFoodItem(id);
      console.log("🥗 Food item fetched:", item);
      return item;
    } catch (error: any) {
      console.error("🥗 Failed to fetch food item:", error);
      throw error;
    }
  },

  // Create a new food item with AI enhancement (minimal input approach)
  async createFoodItem(payload: BasicFoodPayload): Promise<FoodItem> {
    try {
      console.log("🥗 Creating AI-enhanced food item:", payload);
      
      // Check authentication first
      const authStatus = await apiClient.getAuthStatus();
      if (!authStatus.authenticated) {
        console.error("🥗 User not authenticated, cannot create food item");
        throw new Error('User not authenticated');
      }
      
      const item = await apiClient.createFoodItem(payload);
      console.log("🥗 AI-enhanced food item created:", item);
      return item;
    } catch (error: any) {
      console.error("🥗 Failed to create food item:", error);
      throw error;
    }
  },

  // Update an existing food item
  async updateFoodItem(payload: UpdateFoodPayload): Promise<FoodItem> {
    try {
      console.log("🥗 Updating food item:", payload);
      
      // Verificar se o usuário está autenticado primeiro
      const authStatus = await apiClient.getAuthStatus();
      if (!authStatus.authenticated) {
        console.error("🥗 User not authenticated, cannot update food item");
        throw new Error('User not authenticated');
      }
      
      const item = await apiClient.updateFoodItem(payload);
      console.log("🥗 Food item updated:", item);
      return item;
    } catch (error: any) {
      console.error("🥗 Failed to update food item:", error);
      throw error;
    }
  },

  // Delete a food item
  async deleteFoodItem(id: number): Promise<void> {
    try {
      console.log("🥗 Deleting food item:", id);
      await apiClient.deleteFoodItem(id);
      console.log("🥗 Food item deleted:", id);
    } catch (error: any) {
      console.error("🥗 Failed to delete food item:", error);
      throw error;
    }
  }
};