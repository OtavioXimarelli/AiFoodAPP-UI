import { Recipe } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'ai_food_app_recipes';

export const useLocalRecipes = () => {
  const {
    data: storedRecipes,
    loading,
    error,
    saveData: saveRecipes,
    updateItem: updateRecipe,
    deleteItem: deleteRecipe,
    clearAll: clearAllRecipes,
    searchData: searchRecipes,
    getSortedData,
    getStorageInfo,
    totalItems: totalRecipes
  } = useLocalStorage<Recipe>(STORAGE_KEY, {
    maxItems: 50, // Keep last 50 recipes
    expiryDays: 90 // Recipes expire after 90 days
  });

  // Get recipes by difficulty
  const getRecipesByDifficulty = (difficulty: 'Fácil' | 'Médio' | 'Difícil') => {
    return storedRecipes.filter(recipe => recipe.difficulty === difficulty);
  };

  // Get recipes by tags
  const getRecipesByTags = (tags: string[]) => {
    return storedRecipes.filter(recipe => 
      recipe.tags?.some(tag => tags.includes(tag))
    );
  };

  // Get recent recipes (last 7 days)
  const getRecentRecipes = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return storedRecipes.filter(recipe => 
      recipe.createdAt && new Date(recipe.createdAt) > sevenDaysAgo
    );
  };

  // Get favorite recipes (based on how often they're accessed - we could add a viewCount field)
  const getFavoriteRecipes = () => {
    // For now, return recipes sorted by creation date
    // In the future, we could add view count or rating functionality
    return getSortedData('createdAt').slice(0, 10);
  };

  return {
    storedRecipes,
    loading,
    error,
    saveRecipes,
    updateRecipe,
    deleteRecipe,
    clearAllRecipes,
    searchRecipes,
    getRecipesByDifficulty,
    getRecipesByTags,
    getRecentRecipes,
    getFavoriteRecipes,
    getSortedData,
    getStorageInfo,
    totalRecipes
  };
};
