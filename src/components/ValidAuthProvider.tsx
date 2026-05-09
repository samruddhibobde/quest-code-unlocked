import React, { createContext, useContext, useEffect, useState } from 'react';
import { validLogin } from '@/services/validAuth';
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

export const ValidAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const verifyToken = async () => {
      console.log("=== VALID AUTH PROVIDER INIT ===");
      const storedToken = localStorage.getItem("token");
      console.log("Stored token from localStorage:", storedToken?.substring(0, 20) + '...');
      
      if (storedToken) {
        setToken(storedToken);
        // Verify token and get user data
        const profileRes = await fetch(`http://localhost:5000/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${storedToken}`,
          },
        });

        if (profileRes.ok) {
          const userData = await profileRes.json();
          console.log("User data fetched:", userData);
          setUser(userData);
        } else {
          console.error('Invalid token:', profileRes.status);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await validLogin(email, password);
      setToken(response.token);
      setUser(response.user);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${response.user.name}!`,
      });
      
      // Redirect to tutorials page
      window.location.href = "/learner/tutorials";
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already handled in validLogin with alert
    }
  };

  const handleLogout = () => {
    console.log("=== VALID LOGOUT ===");
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
