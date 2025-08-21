import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types';

const STORAGE_KEY = 'ai_food_app_recipes';

export const useLocalRecipes = () => {
  const [storedRecipes, setStoredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  // Load recipes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const recipes = JSON.parse(stored);
        setStoredRecipes(recipes);
      }
    } catch (error) {
      console.error('Erro ao carregar receitas do localStorage:', error);
    }
  }, []);

  // Save recipes to localStorage
  const saveRecipes = (recipes: Recipe[]) => {
    try {
      // Add timestamp to each recipe if not exists
      const recipesWithTimestamp = recipes.map(recipe => ({
        ...recipe,
        createdAt: recipe.createdAt || new Date().toISOString(),
        id: recipe.id || Date.now() + Math.random()
      }));

      const allRecipes = [...storedRecipes, ...recipesWithTimestamp];
      
      // Keep only the last 50 recipes to avoid storage bloat
      const limitedRecipes = allRecipes.slice(-50);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedRecipes));
      setStoredRecipes(limitedRecipes);
    } catch (error) {
      console.error('Erro ao salvar receitas no localStorage:', error);
    }
  };

  // Delete a specific recipe
  const deleteRecipe = (recipeId: number | string) => {
    try {
      const updatedRecipes = storedRecipes.filter(recipe => recipe.id !== recipeId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
      setStoredRecipes(updatedRecipes);
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
    }
  };

  // Clear all recipes
  const clearAllRecipes = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setStoredRecipes([]);
    } catch (error) {
      console.error('Erro ao limpar receitas:', error);
    }
  };

  // Get recipes sorted by creation date (newest first)
  const getSortedRecipes = () => {
    return storedRecipes.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  };

  return {
    storedRecipes: getSortedRecipes(),
    loading,
    saveRecipes,
    deleteRecipe,
    clearAllRecipes,
    totalRecipes: storedRecipes.length
  };
};
