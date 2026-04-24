import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import apiWrapper from '../services/apiWrapper';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await apiWrapper.init();
      
      const savedToken = localStorage.getItem('furniqo_token');
      const savedUser = localStorage.getItem('furniqo_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);

        // Verify token with backend if available
        try {
          const response = await apiWrapper.getProfile();
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem('furniqo_user', JSON.stringify(response.data.data));
          }
        } catch (error) {
          // If backend check fails but we have local data, keep user logged in
          console.debug('Profile verification skipped (offline mode)');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const login = useCallback(async (email, password) => {
    try {
      const response = await apiWrapper.login({ email, password });
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${userData.name}!`);
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return false;
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await apiWrapper.signup(userData);
      
      if (response.data.success) {
        const { user: newUser, token: authToken } = response.data.data;
        setUser(newUser);
        setToken(authToken);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('furniqo_token');
    localStorage.removeItem('furniqo_refresh_token');
    localStorage.removeItem('furniqo_user');
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await apiWrapper.updateProfile(profileData);
      
      if (response?.data?.success) {
        setUser(response.data.data);
        localStorage.setItem('furniqo_user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
        return true;
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      toast.error(message);
      return false;
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isInitialized,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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