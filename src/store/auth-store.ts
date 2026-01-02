'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/src/types/auth';
import { authService } from '@/src/lib/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      initialize: () => {
        // Initialiser depuis localStorage au démarrage
        const token = authService.getToken();
        const user = authService.getUser();
        
        if (token && user) {
          set({ user, token, isAuthenticated: true });
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Utiliser seulement les champs nécessaires pour le persist
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

