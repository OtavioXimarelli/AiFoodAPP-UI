import { useState, useEffect } from 'react';
import { foodService } from '@/services/foodService';
import { FoodItem, BasicFoodPayload, CreateFoodPayload, UpdateFoodPayload } from '@/lib/types';
import { useAuth } from './useAuth';

export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchFoodItems = async () => {
    if (!isAuthenticated) {
      console.log('🥗 Skipping food items fetch - user not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await foodService.getFoodItems();
      setFoodItems(items);
    } catch (error: any) {
      console.error('Failed to fetch food items:', error);
      setError(error.message || 'Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  // AI-enhanced food creation (minimal input)
  const createFoodItem = async (payload: BasicFoodPayload): Promise<FoodItem> => {
    try {
      setError(null);
      const newItem = await foodService.createFoodItem(payload);
      setFoodItems(prev => [...prev, newItem]);
      return newItem;
    } catch (error: any) {
      console.error('Failed to create food item:', error);
      setError(error.message || 'Failed to create food item');
      throw error;
    }
  };

  const createMultipleFoodItems = async (payloads: BasicFoodPayload[]): Promise<FoodItem[]> => {
    try {
      setError(null);
      const newItems = await Promise.all(
        payloads.map(payload => foodService.createFoodItem(payload))
      );
      setFoodItems(prev => [...prev, ...newItems]);
      return newItems;
    } catch (error: any) {
      console.error('Failed to create food items:', error);
      setError(error.message || 'Failed to create food items');
      throw error;
    }
  };

  const updateFoodItem = async (payload: UpdateFoodPayload): Promise<FoodItem> => {
    try {
      setError(null);
      const updatedItem = await foodService.updateFoodItem(payload);
      setFoodItems(prev => prev.map(item => (item.id === updatedItem.id ? updatedItem : item)));
      return updatedItem;
    } catch (error: any) {
      console.error('Failed to update food item:', error);
      setError(error.message || 'Failed to update food item');
      throw error;
    }
  };

  const deleteFoodItem = async (id: number): Promise<void> => {
    try {
      setError(null);
      await foodService.deleteFoodItem(id);
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Failed to delete food item:', error);
      setError(error.message || 'Failed to delete food item');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Only fetch food items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFoodItems();
    }
  }, [isAuthenticated]);

  return {
    foodItems,
    loading,
    error,
    fetchFoodItems,
    createFoodItem,
    createMultipleFoodItems,
    updateFoodItem,
    deleteFoodItem,
    clearError,
  };
};
