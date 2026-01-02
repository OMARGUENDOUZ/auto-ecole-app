'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/src/store/auth-store';
import { authService } from '@/src/lib/auth';
import { LoginCredentials, AuthResponse } from '@/src/types/auth';

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth, initialize } = useAuthStore();

  // Initialiser l'auth au montage du composant
  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    setAuth(response.user, response.token);
    return response;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    clearAuth();
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };
}
