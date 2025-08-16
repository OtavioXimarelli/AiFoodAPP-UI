import { create } from "zustand";
import { User } from "@/lib/types";

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
  setAuth: (user) => {
    console.log('🔄 Setting auth state:', user);
    set({ user, isAuthenticated: true, isLoading: false, hasCheckedAuth: true });
  },
  logout: () => {
    console.log('🔄 Clearing auth state');
    set({ user: null, isAuthenticated: false, isLoading: false, hasCheckedAuth: true });
  },
  setLoading: (loading) => {
    console.log('🔄 Setting loading state:', loading);
    set({ isLoading: loading });
  },
  setHasCheckedAuth: (checked) => {
    console.log('🔄 Setting hasCheckedAuth:', checked);
    set({ hasCheckedAuth: checked });
  }
}));