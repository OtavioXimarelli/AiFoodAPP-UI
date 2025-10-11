import { apiClient } from '@/lib/api';
import { FoodGroup } from '@/lib/types';

export interface NutritionAnalysisResult {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  foodGroup: FoodGroup;
  tags: string;
}

export interface FoodAnalysisRequest {
  name: string;
  quantity?: number; // Para contexto adicional se necessário
}

export const nutritionAIService = {
  /**
   * Analisa um alimento usando IA para obter informações nutricionais
   */
  async analyzeFoodItem(request: FoodAnalysisRequest): Promise<NutritionAnalysisResult> {
    try {
      console.log('🤖 Analisando alimento com IA:', request.name);

      // Verificar se o usuário está autenticado
      const authStatus = await apiClient.getAuthStatus();
      if (!authStatus.authenticated) {
        throw new Error('User not authenticated');
      }

      // Chamar endpoint de análise nutricional da IA
      const response = await apiClient.analyzeFoodNutrition(request);

      console.log('🤖 Análise nutricional recebida:', response);

      // Validar e processar a resposta
      const result: NutritionAnalysisResult = {
        calories: Number(response.calories) || 0,
        protein: Number(response.protein) || 0,
        fat: Number(response.fat) || 0,
        carbohydrates: Number(response.carbohydrates) || 0,
        fiber: Number(response.fiber) || 0,
        sugar: Number(response.sugar) || 0,
        sodium: Number(response.sodium) || 0,
        foodGroup: response.foodGroup || FoodGroup.VEGETABLES,
        tags: response.tags || '',
      };

      return result;
    } catch (error: any) {
      console.error('🤖 Erro na análise nutricional:', error);

      // Em caso de erro da IA, retornar valores padrão para não bloquear o usuário
      console.log('🤖 Usando valores padrão devido ao erro');
      return this.getDefaultNutritionValues(request.name);
    }
  },

  /**
   * Retorna valores padrão baseados em heurísticas simples
   */
  getDefaultNutritionValues(foodName: string): NutritionAnalysisResult {
    const name = foodName.toLowerCase();

    // Heurísticas básicas baseadas no nome
    if (name.includes('frango') || name.includes('chicken') || name.includes('peito')) {
      return {
        calories: 165,
        protein: 31,
        fat: 3.6,
        carbohydrates: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0.074,
        foodGroup: FoodGroup.PROTEIN,
        tags: 'carne branca,magro,versatil',
      };
    }

    if (name.includes('maçã') || name.includes('apple') || name.includes('banana')) {
      return {
        calories: 52,
        protein: 0.3,
        fat: 0.2,
        carbohydrates: 14,
        fiber: 2.4,
        sugar: 10,
        sodium: 0.001,
        foodGroup: FoodGroup.FRUITS,
        tags: 'fruta,natural,vitaminas',
      };
    }

    if (name.includes('arroz') || name.includes('rice')) {
      return {
        calories: 130,
        protein: 2.7,
        fat: 0.3,
        carbohydrates: 28,
        fiber: 0.4,
        sugar: 0.1,
        sodium: 0.005,
        foodGroup: FoodGroup.GRAINS,
        tags: 'cereal,carboidrato,energia',
      };
    }

    if (name.includes('tomate') || name.includes('tomato')) {
      return {
        calories: 18,
        protein: 0.9,
        fat: 0.2,
        carbohydrates: 3.9,
        fiber: 1.2,
        sugar: 2.6,
        sodium: 0.005,
        foodGroup: FoodGroup.VEGETABLES,
        tags: 'vegetal,vitamina c,antioxidante',
      };
    }

    // Valores padrão genéricos
    return {
      calories: 50,
      protein: 1,
      fat: 0.5,
      carbohydrates: 10,
      fiber: 1,
      sugar: 2,
      sodium: 0.01,
      foodGroup: FoodGroup.VEGETABLES,
      tags: 'alimento,natural',
    };
  },

  /**
   * Valida se os valores nutricionais são consistentes
   */
  validateNutritionValues(nutrition: NutritionAnalysisResult): boolean {
    // Verificar se todos os valores são não negativos
    const values = [
      nutrition.calories,
      nutrition.protein,
      nutrition.fat,
      nutrition.carbohydrates,
      nutrition.fiber,
      nutrition.sugar,
      nutrition.sodium,
    ];

    if (values.some(value => value < 0 || isNaN(value))) {
      return false;
    }

    // Verificar se as calorias fazem sentido com os macronutrientes
    const calculatedCalories =
      nutrition.protein * 4 + nutrition.carbohydrates * 4 + nutrition.fat * 9;
    const caloriesDifference = Math.abs(nutrition.calories - calculatedCalories);

    // Permitir uma diferença de até 50% (valores aproximados)
    if (caloriesDifference > nutrition.calories * 0.5) {
      console.warn('🤖 Inconsistência nas calorias detectada, mas continuando...');
    }

    return true;
  },
};
