import { useState } from 'react';
import { recipeService } from '@/services/recipeService';
import { Recipe } from '@/lib/types';
import { getErrorMessage } from '@/utils/errorUtils';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  const generateRecipe = async (): Promise<Recipe[]> => {
    try {
      setLoading(true);
      setError(null);
      const newRecipes = await recipeService.generateRecipes();
      setRecipes(newRecipes);
      return newRecipes;
    } catch (error) {
      console.error('Failed to generate recipes:', error);
      const message = getErrorMessage(error) || 'Failed to generate recipes';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const analyzeRecipe = async (id: number): Promise<string> => {
    try {
      setAnalyzingId(id);
      setError(null);
      const analysisResult = await recipeService.analyzeRecipe(id);
      setAnalysis(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Failed to analyze recipe:', error);
      const message = getErrorMessage(error) || 'Failed to analyze recipe';
      setError(message);
      throw error;
    } finally {
      setAnalyzingId(null);
    }
  };

  const clearRecipes = () => {
    setRecipes([]);
    setAnalysis(null);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    recipes,
    loading,
    error,
    analysis,
    analyzingId,
    generateRecipe,
    analyzeRecipe,
    clearRecipes,
    clearError,
  };
};
