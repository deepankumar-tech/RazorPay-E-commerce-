import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
  merchantId?: string | null;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; password?: string; avatarUrl?: string | null }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password: pass });
      const { user: userData, accessToken: token, refreshToken } = res.data;
      setUser(userData);
      setAccessToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      const { user: userData, accessToken: token, refreshToken } = res.data;
      setUser(userData);
      setAccessToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; email?: string; password?: string; avatarUrl?: string | null }) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const updatedUser = res.data?.user || res.data;
      if (data.avatarUrl !== undefined) {
        updatedUser.avatarUrl = data.avatarUrl;
      } else if (user?.avatarUrl) {
        updatedUser.avatarUrl = user.avatarUrl;
      }
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout request error:', e);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('commerceai_active_session_id');
      localStorage.removeItem('commerceai_active_session_id');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
