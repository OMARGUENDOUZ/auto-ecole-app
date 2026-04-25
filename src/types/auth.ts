export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'SECRETARY';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  // TODO: enable when backend implements refresh tokens
  refreshToken?: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
