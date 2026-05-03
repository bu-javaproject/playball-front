import { createContext, useContext } from 'react';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (tokens: AuthTokens) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
