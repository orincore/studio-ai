import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { services, isAuthenticated, getAccessToken, removeTokens } from '../api';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("Checking auth status...");
      console.log("Is authenticated:", isAuthenticated());
      console.log("Access token:", getAccessToken());
      
      // Check for mock user in sessionStorage (for debugging only)
      const mockUserJson = sessionStorage.getItem('mock_user');
      if (mockUserJson) {
        console.log("Found mock user in sessionStorage");
        try {
          const mockUser = JSON.parse(mockUserJson);
          setUser(mockUser);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Error parsing mock user JSON:", e);
          sessionStorage.removeItem('mock_user');
        }
      }
      
      if (isAuthenticated() && getAccessToken()) {
        try {
          console.log("Fetching current user...");
          const currentUser = await services.userService.getCurrentUser();
          console.log("User data received:", currentUser);
          setUser(currentUser);
        } catch (err) {
          console.error("Error fetching user:", err);
          // If token is invalid, clear tokens
          removeTokens();
        }
      } else {
        console.log("Not authenticated or no access token");
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await services.authService.login({ email, password });
      
      if (response.user) {
        setUser(response.user);
        navigate('/profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (full_name: string, email: string, password: string, phone: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await services.authService.register({ full_name, email, password, phone });
      // Redirect to OTP verification
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await services.authService.logout();
      setUser(null);
      navigate('/login', { state: { logoutSuccess: true } });
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      // Even if the API call fails, we should still remove the tokens and user
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    resetError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 