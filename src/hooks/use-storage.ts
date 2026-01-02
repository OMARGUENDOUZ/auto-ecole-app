'use client';

import { useCallback } from 'react';

/**
 * Hook sécurisé pour accéder à localStorage
 * Vérifie que window est défini avant d'accéder à localStorage (SSR-safe)
 */
export function useStorage() {
  const getItem = useCallback((key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }, []);

  const setItem = useCallback((key: string, value: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  }, []);

  const removeItem = useCallback((key: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }, []);

  return { getItem, setItem, removeItem };
}

/**
 * Fonction utilitaire pour accéder à localStorage de manière sécurisée
 * Peut être utilisée en dehors des composants React
 */
export function safeLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => false,
      removeItem: () => false,
    };
  }

  return {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}

