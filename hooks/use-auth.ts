'use client';

import { useState } from 'react';

export function useAuth() {
  // Minimal stub hook for development - replace with real auth
  const [user] = useState<any>(null);

  const login = async (credentials: any) => {
    // placeholder
    return { success: true };
  };

  const logout = async () => {
    // placeholder
    return { success: true };
  };

  return { user, login, logout };
}
