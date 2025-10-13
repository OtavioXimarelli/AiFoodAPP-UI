import { create } from 'zustand';
import { User } from '@/lib/types';
import { performanceUtils } from '@/config/performance';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedAuth: boolean; // Add flag to track if we've checked auth
  setAuth: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setHasCheckedAuth: (checked: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false, // Start with false
  setAuth: user => {
    performanceUtils.log('🔄 Setting auth state:', user);
    set({ user, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
  },
  logout: () => {
    performanceUtils.log('🔄 Clearing auth state');
    set({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: true });
  },
  setLoading: loading => {
    // Only log if state actually changes to reduce noise
    const currentLoading = get().isLoading;
    if (currentLoading !== loading) {
      performanceUtils.log('🔄 Setting loading state:', loading);
    }
    set({ isLoading: loading });
  },
  setHasCheckedAuth: checked => {
    // Only log once when first checked
    const current = get().hasCheckedAuth;
    if (!current && checked) {
      performanceUtils.log('🔄 Setting hasCheckedAuth:', checked);
    }
    set({ hasCheckedAuth: checked });
  },
}));
