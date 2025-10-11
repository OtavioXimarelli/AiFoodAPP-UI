import { useState, useEffect, useCallback } from 'react';
import { CachedData } from '@/lib/types';

interface UseLocalStorageOptions {
  maxItems?: number;
  expiryDays?: number;
}

export const useLocalStorage = <T>(key: string, options: UseLocalStorageOptions = {}) => {
  const { maxItems = 100, expiryDays = 30 } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate expiry time in milliseconds
  const expiryTime = expiryDays * 24 * 60 * 60 * 1000;

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true);
      const stored = localStorage.getItem(key);
      if (stored) {
        const cachedData: CachedData<T[]> = JSON.parse(stored);

        // Check if data has expired
        if (cachedData.expiryTime && Date.now() > cachedData.expiryTime) {
          localStorage.removeItem(key);
          setData([]);
        } else {
          setData(cachedData.data || []);
        }
      }
    } catch (err) {
      console.error(`Erro ao carregar dados do localStorage (${key}):`, err);
      setError('Erro ao carregar dados salvos');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [key, expiryTime]);

  // Save data to localStorage
  const saveData = useCallback(
    (newItems: T | T[]) => {
      try {
        setError(null);
        const itemsArray = Array.isArray(newItems) ? newItems : [newItems];

        // Add timestamp and ID to each item if not exists
        const itemsWithMetadata = itemsArray.map(item => ({
          ...item,
          createdAt: (item as any).createdAt || new Date().toISOString(),
          id: (item as any).id || Date.now() + Math.random(),
        }));

        const updatedData = [...data, ...itemsWithMetadata];

        // Keep only the most recent items to avoid storage bloat
        const limitedData = updatedData.slice(-maxItems);

        const cachedData: CachedData<T[]> = {
          data: limitedData,
          timestamp: Date.now(),
          expiryTime: Date.now() + expiryTime,
        };

        localStorage.setItem(key, JSON.stringify(cachedData));
        setData(limitedData);

        return true;
      } catch (err) {
        console.error(`Erro ao salvar dados no localStorage (${key}):`, err);
        setError('Erro ao salvar dados');
        return false;
      }
    },
    [key, data, maxItems, expiryTime]
  );

  // Update specific item
  const updateItem = useCallback(
    (itemId: number | string, updatedItem: Partial<T>) => {
      try {
        setError(null);
        const updatedData = data.map(item =>
          (item as any).id === itemId
            ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
            : item
        );

        const cachedData: CachedData<T[]> = {
          data: updatedData,
          timestamp: Date.now(),
          expiryTime: Date.now() + expiryTime,
        };

        localStorage.setItem(key, JSON.stringify(cachedData));
        setData(updatedData);

        return true;
      } catch (err) {
        console.error(`Erro ao atualizar item no localStorage (${key}):`, err);
        setError('Erro ao atualizar item');
        return false;
      }
    },
    [key, data, expiryTime]
  );

  // Delete specific item
  const deleteItem = useCallback(
    (itemId: number | string) => {
      try {
        setError(null);
        const updatedData = data.filter(item => (item as any).id !== itemId);

        const cachedData: CachedData<T[]> = {
          data: updatedData,
          timestamp: Date.now(),
          expiryTime: Date.now() + expiryTime,
        };

        localStorage.setItem(key, JSON.stringify(cachedData));
        setData(updatedData);

        return true;
      } catch (err) {
        console.error(`Erro ao deletar item do localStorage (${key}):`, err);
        setError('Erro ao deletar item');
        return false;
      }
    },
    [key, data, expiryTime]
  );

  // Clear all data
  const clearAll = useCallback(() => {
    try {
      setError(null);
      localStorage.removeItem(key);
      setData([]);
      return true;
    } catch (err) {
      console.error(`Erro ao limpar dados do localStorage (${key}):`, err);
      setError('Erro ao limpar dados');
      return false;
    }
  }, [key]);

  // Get sorted data (newest first)
  const getSortedData = useCallback(
    (sortBy: 'createdAt' | 'updatedAt' = 'createdAt') => {
      return [...data].sort((a, b) => {
        const dateA = new Date((a as any)[sortBy] || 0).getTime();
        const dateB = new Date((b as any)[sortBy] || 0).getTime();
        return dateB - dateA;
      });
    },
    [data]
  );

  // Search data
  const searchData = useCallback(
    (searchTerm: string, searchFields: string[] = ['name', 'title']) => {
      if (!searchTerm.trim()) return data;

      const lowerSearchTerm = searchTerm.toLowerCase();
      return data.filter(item =>
        searchFields.some(field => (item as any)[field]?.toLowerCase().includes(lowerSearchTerm))
      );
    },
    [data]
  );

  // Get storage info
  const getStorageInfo = useCallback(() => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const cachedData: CachedData<T[]> = JSON.parse(stored);
      return {
        itemCount: cachedData.data.length,
        lastUpdated: new Date(cachedData.timestamp),
        expiresAt: cachedData.expiryTime ? new Date(cachedData.expiryTime) : null,
        sizeInBytes: new Blob([stored]).size,
      };
    } catch (err) {
      console.error(`Erro ao obter informações do storage (${key}):`, err);
      return null;
    }
  }, [key]);

  return {
    data: getSortedData(),
    loading,
    error,
    saveData,
    updateItem,
    deleteItem,
    clearAll,
    searchData,
    getSortedData,
    getStorageInfo,
    totalItems: data.length,
  };
};
