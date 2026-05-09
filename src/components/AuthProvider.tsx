import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI, User } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("token");
    console.log("=== AUTH PROVIDER INIT DEBUG ===");
    console.log("Stored token from localStorage:", storedToken);
    
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user data
      userAPI.getProfile()
        .then(userData => {
          console.log("User data fetched:", userData);
          setUser(userData);
        })
        .catch(error => {
          console.error('Invalid token:', error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          authAPI.logout();
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("No token found on mount");
      setLoading(false);
    }
  }, []);

  const logout = () => {
    console.log("=== LOGOUT DEBUG ===");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    authAPI.logout();
    setUser(null);
    setToken(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login: () => Promise.reject(new Error('Login function removed - use LoginForm')),
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
