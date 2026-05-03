import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/shared/api/token';

import { AuthContext, type AuthTokens } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());
  const [refreshToken, setRefreshTokenState] = useState(() => getRefreshToken());

  const login = useCallback((tokens: AuthTokens) => {
    setTokens(tokens);
    setAccessTokenState(tokens.accessToken);
    setRefreshTokenState(tokens.refreshToken);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(accessToken), accessToken, refreshToken, login, logout }),
    [accessToken, login, logout, refreshToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
