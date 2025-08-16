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
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  foodGroup: FoodGroup;
  tags: string;
}

export interface UpdateFoodPayload extends CreateFoodPayload {
  id: number;
}

export interface RecipeIngredient {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id?: number;
  name: string;
  description: string;
  nutritionalInfo: string[];
  instructions: string[];
  ingredientsList: RecipeIngredient[];
}

export interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
}

// Validation utility
export const validateFoodItem = (item: Partial<FoodItem>) => {
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
  
  if (!item.foodGroup) {
    errors.foodGroup = 'Food group is required';
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