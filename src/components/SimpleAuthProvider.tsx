import React, { createContext, useContext, useEffect, useState } from 'react';
import { simpleLogin, simpleGetProfile } from '@/services/simpleAuth';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  solvedProblems: number;
  completedTutorials: string[];
  createdAt: string;
}

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

export const SimpleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("=== SIMPLE AUTH PROVIDER INIT ===");
    const storedToken = localStorage.getItem("token");
    console.log("Stored token from localStorage:", storedToken?.substring(0, 20) + '...');
    
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user data
      simpleGetProfile()
        .then(userData => {
          console.log("User data fetched:", userData);
          setUser(userData);
        })
        .catch(error => {
          console.error('Invalid token:', error);
          localStorage.removeItem("token");
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

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await simpleLogin(email, password);
      setToken(response.token);
      
      // Get full user data
      const userData = await simpleGetProfile();
      setUser(userData);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleLogout = () => {
    console.log("=== SIMPLE LOGOUT ===");
    localStorage.removeItem("token");
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
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
