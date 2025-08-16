import { apiClient } from "@/lib/api";
import { Recipe } from "@/lib/types";

export const recipeService = {
  // Generate AI recipes based on user's food inventory
  async generateRecipes(): Promise<Recipe[]> {
    try {
      console.log("🤖 Generating AI recipes...");
      const recipes = await apiClient.generateRecipes();
      console.log("🤖 Recipes generated:", recipes);
      return recipes;
    } catch (error: any) {
      console.error("🤖 Failed to generate recipes:", error);
      throw error;
    }
  },

  // Analyze a recipe for nutritional information
  async analyzeRecipe(id: number): Promise<string> {
    try {
      console.log("🔬 Analyzing recipe:", id);
      const analysis = await apiClient.analyzeRecipe(id);
      console.log("🔬 Recipe analysis:", analysis);
      return analysis;
    } catch (error: any) {
      console.error("🔬 Failed to analyze recipe:", error);
      throw error;
    }
  }
};