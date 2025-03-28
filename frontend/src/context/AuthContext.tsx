import React, { createContext, useState, useEffect, useContext } from 'react';

// Define types
interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user?: User;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URLs
const API_URL = 'http://localhost:8000/api';
const LOGIN_URL = `${API_URL}/auth/login/`;
const REGISTER_URL = `${API_URL}/auth/register/`;
const REFRESH_URL = `${API_URL}/auth/token/refresh/`;
const PROFILE_URL = `${API_URL}/auth/profile/`;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to update tokens in localStorage
  const updateTokens = (tokens: { access: string; refresh: string }) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
  };

  // Helper function to refresh token
  const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await fetch(REFRESH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data: TokenResponse = await response.json();
      updateTokens(data);
      
      return data.access;
    } catch (err) {
      console.error('Token refresh failed:', err);
      // Clear tokens on failed refresh
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return null;
    }
  };

  // Fetch user profile with token refresh if needed
  const fetchUserProfile = async (token?: string): Promise<User | null> => {
    try {
      const accessToken = token || localStorage.getItem('accessToken');
      
      if (!accessToken) {
        return null;
      }
      
      const response = await fetch(PROFILE_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        // Try to refresh the token if unauthorized
        const newToken = await refreshToken();
        
        if (!newToken) {
          return null;
        }
        
        // Retry with new token
        return fetchUserProfile(newToken);
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData: User = await response.json();
      return userData;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        const userData = await fetchUserProfile();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        // Clear tokens on error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data: TokenResponse = await response.json();
      
      // Save tokens
      updateTokens(data);
      
      // Set user if it's in the response
      if (data.user) {
        setUser(data.user);
      } else {
        // Fetch user profile if not included in response
        const userData = await fetchUserProfile(data.access);
        if (userData) {
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setError(null);
    
    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).flat().join(' ');
        throw new Error(errorMessage || 'Registration failed');
      }
      
      const data: TokenResponse = await response.json();
      
      // Save tokens
      updateTokens(data);
      
      // Set user if it's in the response
      if (data.user) {
        setUser(data.user);
      } else {
        // Fetch user profile if not included in response
        const userProfile = await fetchUserProfile(data.access);
        if (userProfile) {
          setUser(userProfile);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // Create the context value object
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;