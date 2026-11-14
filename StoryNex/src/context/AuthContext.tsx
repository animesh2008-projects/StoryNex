import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser } from '../types';
import { authService } from '../services/auth-service';

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<AppUser>;
  register: (email: string, pass: string, name?: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const u = authService.getCurrentUser();
    setCurrentUser(u);
  };

  useEffect(() => {
    const unsub = authService.onAuthChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const u = await authService.login(email, pass);
    setCurrentUser(u);
    return u;
  };

  const register = async (email: string, pass: string, name?: string) => {
    const u = await authService.register(email, pass, name);
    setCurrentUser(u);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
