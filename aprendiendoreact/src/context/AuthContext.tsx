import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, LoginCredentials, UserDto } from '../types';
import { authApi, decodeJWT } from '../services/api';

const STORAGE_USER = 'user';
const STORAGE_TOKEN = 'token';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: UserDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildUserFromToken(token: string, fallback?: User | null): User | null {
  const decoded = decodeJWT(token);
  if (!decoded) return fallback ?? null;
  return {
    id: Number(decoded.id) || Number(decoded.sub) || 0,
    name: decoded.name || (fallback?.name ?? ''),
    email: decoded.email || (fallback?.email ?? ''),
    rol: (decoded.rol || (fallback?.rol ?? 'user')).toString() === 'admin' ? 'admin' : 'user',
    password: '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_USER);
    const storedToken = localStorage.getItem(STORAGE_TOKEN);
    const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;

    if (storedToken) {
      const reconstructed = buildUserFromToken(storedToken, parsedStoredUser);
      if (reconstructed) {
        setUser(reconstructed);
        localStorage.setItem(STORAGE_USER, JSON.stringify(reconstructed));
      } else if (parsedStoredUser) {
        setUser(parsedStoredUser);
      }
    } else if (parsedStoredUser) {
      setUser(parsedStoredUser);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token, user } = await authApi.login(credentials);
    localStorage.setItem(STORAGE_TOKEN, token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    setUser(user);
  }, []);

  const register = useCallback(async (userData: UserDto) => {
    await authApi.register(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}