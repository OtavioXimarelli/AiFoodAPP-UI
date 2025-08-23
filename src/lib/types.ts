// Data models matching the backend API

export enum FoodGroup {
  FRUITS = "FRUITS",
  VEGETABLES = "VEGETABLES", 
  GRAINS = "GRAINS",
  PROTEIN = "PROTEIN",
  DAIRY = "DAIRY",
  FATS_OILS = "FATS_OILS",
  BEVERAGES = "BEVERAGES",
  SWEETS_SNACKS = "SWEETS_SNACKS"
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
    errors
  };
};

// Food group display names
export const FOOD_GROUP_LABELS: Record<FoodGroup, string> = {
  [FoodGroup.FRUITS]: "Fruits",
  [FoodGroup.VEGETABLES]: "Vegetables",
  [FoodGroup.GRAINS]: "Grains",
  [FoodGroup.PROTEIN]: "Protein",
  [FoodGroup.DAIRY]: "Dairy",
  [FoodGroup.FATS_OILS]: "Fats & Oils",
  [FoodGroup.BEVERAGES]: "Beverages",
  [FoodGroup.SWEETS_SNACKS]: "Sweets & Snacks"
};