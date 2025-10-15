// Data models matching the backend API

export enum FoodGroup {
  FRUITS = 'FRUITS',
  VEGETABLES = 'VEGETABLES',
  GRAINS = 'GRAINS',
  PROTEIN = 'PROTEIN',
  DAIRY = 'DAIRY',
  FATS_OILS = 'FATS_OILS',
  BEVERAGES = 'BEVERAGES',
  SWEETS_SNACKS = 'SWEETS_SNACKS',
}

export interface FoodItem {
  id?: number;
  name: string;
  quantity: number;
  expiration: string; // ISO date format: "2024-12-31"
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  foodGroup: FoodGroup;
  tags: string; // Comma-separated values
}

export interface CreateFoodPayload {
  name: string;
  quantity: number;
  expiration: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  foodGroup: FoodGroup;
  tags: string; // Comma-separated values
}

export interface BasicFoodPayload {
  name: string;
  quantity: number;
  expiration: string;
}

export interface UpdateFoodPayload {
  id: number;
  name: string;
  quantity: number;
  expiration: string;
}

export interface RecipeIngredient {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id?: number | string;
  name: string;
  description: string;
  nutritionalInfo: string[];
  instructions: string[];
  ingredientsList: RecipeIngredient[];
  createdAt?: string;
  prepTime?: number | string;
  servings?: number;
  calories?: number;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  tags?: string[];
}

export interface NutritionAnalysis {
  id?: number | string;
  title: string;
  foodItems: string[];
  analysis: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  recommendations: string[];
  insights: string[];
  createdAt?: string;
  period?: 'daily' | 'weekly' | 'monthly';
}

export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiryTime?: number; // Optional expiry time in milliseconds
}

export interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
}

// Validation utility
export const validateFoodItem = (item: Partial<CreateFoodPayload>) => {
  const errors: Record<string, string> = {};

  if (!item.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!item.quantity || item.quantity <= 0) {
    errors.quantity = 'Quantity must be positive';
  }

  if (!item.expiration) {
    errors.expiration = 'Expiration date is required';
  } else {
    const expirationDate = new Date(item.expiration);
    if (expirationDate < new Date()) {
      errors.expiration = 'Expiration date must be in the future';
    }
  }

  if (item.calories === undefined || item.calories < 0) {
    errors.calories = 'Calories must be zero or positive';
  }

  if (item.protein === undefined || item.protein < 0) {
    errors.protein = 'Protein must be zero or positive';
  }

  if (item.fat === undefined || item.fat < 0) {
    errors.fat = 'Fat must be zero or positive';
  }

  if (item.carbohydrates === undefined || item.carbohydrates < 0) {
    errors.carbohydrates = 'Carbohydrates must be zero or positive';
  }

  if (item.fiber === undefined || item.fiber < 0) {
    errors.fiber = 'Fiber must be zero or positive';
  }

  if (item.sugar === undefined || item.sugar < 0) {
    errors.sugar = 'Sugar must be zero or positive';
  }

  if (item.sodium === undefined || item.sodium < 0) {
    errors.sodium = 'Sodium must be zero or positive';
  }

  if (!item.foodGroup) {
    errors.foodGroup = 'Food group is required';
  }

  if (!item.tags?.trim()) {
    errors.tags = 'Tags are required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Food group display names
export const FOOD_GROUP_LABELS: Record<FoodGroup, string> = {
  [FoodGroup.FRUITS]: 'Frutas',
  [FoodGroup.VEGETABLES]: 'Vegetais',
  [FoodGroup.GRAINS]: 'Grãos',
  [FoodGroup.PROTEIN]: 'Proteínas',
  [FoodGroup.DAIRY]: 'Laticínios',
  [FoodGroup.FATS_OILS]: 'Gorduras e Óleos',
  [FoodGroup.BEVERAGES]: 'Bebidas',
  [FoodGroup.SWEETS_SNACKS]: 'Doces e Lanches',
};

// Tag translation dictionary (English to Portuguese)
export const TAG_TRANSLATIONS: Record<string, string> = {
  // Common food tags
  'organic': 'orgânico',
  'fresh': 'fresco',
  'frozen': 'congelado',
  'canned': 'enlatado',
  'dried': 'seco',
  'raw': 'cru',
  'cooked': 'cozido',
  'processed': 'processado',
  'natural': 'natural',
  'artificial': 'artificial',
  
  // Dietary tags
  'vegetarian': 'vegetariano',
  'vegan': 'vegano',
  'gluten-free': 'sem glúten',
  'lactose-free': 'sem lactose',
  'sugar-free': 'sem açúcar',
  'low-fat': 'baixo teor de gordura',
  'low-carb': 'low-carb',
  'high-protein': 'rico em proteína',
  'high-fiber': 'rico em fibras',
  'keto': 'cetogênico',
  
  // Nutritional characteristics
  'protein': 'proteína',
  'carbohydrate': 'carboidrato',
  'fiber': 'fibra',
  'vitamin': 'vitamina',
  'mineral': 'mineral',
  'antioxidant': 'antioxidante',
  'probiotic': 'probiótico',
  
  // Preparation methods
  'grilled': 'grelhado',
  'baked': 'assado',
  'fried': 'frito',
  'steamed': 'no vapor',
  'boiled': 'cozido',
  'roasted': 'torrado',
  
  // Categories
  'snack': 'lanche',
  'breakfast': 'café da manhã',
  'lunch': 'almoço',
  'dinner': 'jantar',
  'dessert': 'sobremesa',
  'beverage': 'bebida',
  'appetizer': 'aperitivo',
  
  // Texture/Type
  'crispy': 'crocante',
  'creamy': 'cremoso',
  'smooth': 'suave',
  'chunky': 'pedaços',
  'liquid': 'líquido',
  'solid': 'sólido',
  
  // Storage
  'refrigerated': 'refrigerado',
  'room-temperature': 'temperatura ambiente',
  
  // Origin
  'local': 'local',
  'imported': 'importado',
  'homemade': 'caseiro',
  
  // Chicken specific
  'chicken': 'frango',
  
  // Legumes
  'legume': 'legume',
  'vegetable': 'vegetal',
  'orange': 'laranja',
  
  // Snacks
  'highfiber': 'rico em fibra',
};
