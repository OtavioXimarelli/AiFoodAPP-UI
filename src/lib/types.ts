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
  prepTime?: number;
  servings?: number;
  calories?: number;
  difficulty?: 'Fácil' | 'Médio' | 'Difícil';
  tags?: string[];
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