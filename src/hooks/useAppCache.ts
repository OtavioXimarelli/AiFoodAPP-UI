import { useLocalRecipes } from './useLocalRecipes';
import { useLocalNutritionAnalysis } from './useLocalNutritionAnalysis';

export const useAppCache = () => {
  const recipes = useLocalRecipes();
  const nutritionAnalyses = useLocalNutritionAnalysis();

  // Get combined storage information
  const getStorageInfo = () => {
    const recipeInfo = recipes.getStorageInfo();
    const nutritionInfo = nutritionAnalyses.getStorageInfo();
    
    const totalSizeInBytes = (recipeInfo?.sizeInBytes || 0) + (nutritionInfo?.sizeInBytes || 0);
    const totalSizeInKB = Math.round(totalSizeInBytes / 1024 * 100) / 100;
    const totalSizeInMB = Math.round(totalSizeInKB / 1024 * 100) / 100;

    return {
      recipes: recipeInfo,
      nutritionAnalyses: nutritionInfo,
      totalItems: recipes.totalRecipes + nutritionAnalyses.totalAnalyses,
      totalSizeInBytes,
      totalSizeInKB,
      totalSizeInMB,
      storageUsagePercent: Math.round((totalSizeInBytes / (5 * 1024 * 1024)) * 100) // Assuming 5MB localStorage limit
    };
  };

  // Clear all cached data
  const clearAllCache = () => {
    const recipeResult = recipes.clearAllRecipes();
    const nutritionResult = nutritionAnalyses.clearAllAnalyses();
    
    return recipeResult && nutritionResult;
  };

  // Export all data for backup
  const exportAllData = () => {
    const timestamp = new Date().toISOString();
    return {
      exportedAt: timestamp,
      version: '1.0',
      data: {
        recipes: recipes.storedRecipes,
        nutritionAnalyses: nutritionAnalyses.storedAnalyses
      },
      metadata: getStorageInfo()
    };
  };

  // Import data from backup
  const importData = (backupData: any) => {
    try {
      if (!backupData.data) {
        throw new Error('Formato de backup inválido');
      }

      let importedRecipes = 0;
      let importedAnalyses = 0;

      // Import recipes
      if (backupData.data.recipes && Array.isArray(backupData.data.recipes)) {
        const success = recipes.saveRecipes(backupData.data.recipes);
        if (success) {
          importedRecipes = backupData.data.recipes.length;
        }
      }

      // Import nutrition analyses
      if (backupData.data.nutritionAnalyses && Array.isArray(backupData.data.nutritionAnalyses)) {
        const success = nutritionAnalyses.saveAnalyses(backupData.data.nutritionAnalyses);
        if (success) {
          importedAnalyses = backupData.data.nutritionAnalyses.length;
        }
      }

      return {
        success: true,
        importedRecipes,
        importedAnalyses,
        total: importedRecipes + importedAnalyses
      };
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  };

  // Check if storage is getting full
  const isStorageNearLimit = () => {
    const info = getStorageInfo();
    return info.storageUsagePercent > 80; // Warn when over 80% of assumed limit
  };

  // Get cache health status
  const getCacheHealth = () => {
    const info = getStorageInfo();
    const isNearLimit = isStorageNearLimit();
    
    const health = {
      status: 'healthy' as 'healthy' | 'warning' | 'critical',
      issues: [] as string[],
      recommendations: [] as string[]
    };

    if (isNearLimit) {
      health.status = 'warning';
      health.issues.push('Armazenamento próximo do limite');
      health.recommendations.push('Considere limpar dados antigos');
    }

    if (info.storageUsagePercent > 95) {
      health.status = 'critical';
      health.issues.push('Armazenamento quase cheio');
      health.recommendations.push('Limpe dados urgentemente ou exporte para backup');
    }

    if (recipes.error || nutritionAnalyses.error) {
      health.status = 'critical';
      health.issues.push('Erro no armazenamento local');
      health.recommendations.push('Recarregue a página ou limpe o cache');
    }

    return health;
  };

  return {
    recipes,
    nutritionAnalyses,
    getStorageInfo,
    clearAllCache,
    exportAllData,
    importData,
    isStorageNearLimit,
    getCacheHealth,
    loading: recipes.loading || nutritionAnalyses.loading,
    hasError: !!recipes.error || !!nutritionAnalyses.error
  };
};
