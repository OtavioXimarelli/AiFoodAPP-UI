import { NutritionAnalysis } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'ai_food_app_nutrition_analysis';

export const useLocalNutritionAnalysis = () => {
  const {
    data: storedAnalyses,
    loading,
    error,
    saveData: saveAnalyses,
    updateItem: updateAnalysis,
    deleteItem: deleteAnalysis,
    clearAll: clearAllAnalyses,
    searchData: searchAnalyses,
    getSortedData,
    getStorageInfo,
    totalItems: totalAnalyses,
  } = useLocalStorage<NutritionAnalysis>(STORAGE_KEY, {
    maxItems: 30, // Keep last 30 analyses
    expiryDays: 60, // Analyses expire after 60 days
  });

  // Get analyses by period
  const getAnalysesByPeriod = (period: 'daily' | 'weekly' | 'monthly') => {
    return storedAnalyses.filter(analysis => analysis.period === period);
  };

  // Get recent analyses (last 30 days)
  const getRecentAnalyses = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return storedAnalyses.filter(
      analysis => analysis.createdAt && new Date(analysis.createdAt) > thirtyDaysAgo
    );
  };

  // Get analyses by date range
  const getAnalysesByDateRange = (startDate: Date, endDate: Date) => {
    return storedAnalyses.filter(analysis => {
      if (!analysis.createdAt) return false;
      const analysisDate = new Date(analysis.createdAt);
      return analysisDate >= startDate && analysisDate <= endDate;
    });
  };

  // Get nutrition trends (compare different analyses)
  const getNutritionTrends = () => {
    const sortedAnalyses = getSortedData('createdAt').slice(0, 10);

    if (sortedAnalyses.length < 2) return null;

    const trends = {
      calories: [],
      protein: [],
      carbohydrates: [],
      fat: [],
      fiber: [],
    } as Record<string, number[]>;

    sortedAnalyses.forEach(analysis => {
      trends.calories.push(analysis.analysis.calories);
      trends.protein.push(analysis.analysis.protein);
      trends.carbohydrates.push(analysis.analysis.carbohydrates);
      trends.fat.push(analysis.analysis.fat);
      trends.fiber.push(analysis.analysis.fiber);
    });

    return {
      trends,
      dates: sortedAnalyses.map(analysis => analysis.createdAt),
      averages: {
        calories: trends.calories.reduce((a, b) => a + b, 0) / trends.calories.length,
        protein: trends.protein.reduce((a, b) => a + b, 0) / trends.protein.length,
        carbohydrates:
          trends.carbohydrates.reduce((a, b) => a + b, 0) / trends.carbohydrates.length,
        fat: trends.fat.reduce((a, b) => a + b, 0) / trends.fat.length,
        fiber: trends.fiber.reduce((a, b) => a + b, 0) / trends.fiber.length,
      },
    };
  };

  // Get summary statistics
  const getSummaryStats = () => {
    if (storedAnalyses.length === 0) return null;

    const totalCalories = storedAnalyses.reduce(
      (sum, analysis) => sum + analysis.analysis.calories,
      0
    );
    const avgCalories = totalCalories / storedAnalyses.length;

    const totalProtein = storedAnalyses.reduce(
      (sum, analysis) => sum + analysis.analysis.protein,
      0
    );
    const avgProtein = totalProtein / storedAnalyses.length;

    return {
      totalAnalyses: storedAnalyses.length,
      averageCalories: Math.round(avgCalories),
      averageProtein: Math.round(avgProtein),
      mostCommonFoods: getMostCommonFoods(),
      lastAnalysisDate: storedAnalyses[0]?.createdAt,
    };
  };

  // Get most common foods across all analyses
  const getMostCommonFoods = () => {
    const foodCount: Record<string, number> = {};

    storedAnalyses.forEach(analysis => {
      analysis.foodItems.forEach(food => {
        foodCount[food] = (foodCount[food] || 0) + 1;
      });
    });

    return Object.entries(foodCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([food, count]) => ({ food, count }));
  };

  return {
    storedAnalyses,
    loading,
    error,
    saveAnalyses,
    updateAnalysis,
    deleteAnalysis,
    clearAllAnalyses,
    searchAnalyses,
    getAnalysesByPeriod,
    getRecentAnalyses,
    getAnalysesByDateRange,
    getNutritionTrends,
    getSummaryStats,
    getMostCommonFoods,
    getSortedData,
    getStorageInfo,
    totalAnalyses,
  };
};
