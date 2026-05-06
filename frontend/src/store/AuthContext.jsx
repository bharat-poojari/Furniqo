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
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('furniqo_user');
          localStorage.removeItem('furniqo_token');
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      const response = await apiWrapper.login({ email, password });

      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        setUser(userData);
        setToken(authToken);
        setIsAuthenticated(true);

        if (rememberMe) {
          localStorage.setItem('furniqo_remembered_email', email);
        } else {
          localStorage.removeItem('furniqo_remembered_email');
        }

        toast.success(`Welcome back, ${userData.name || userData.email}!`);
        return { success: true };
      }

      return { success: false, error: response.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
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
        return { success: true };
      }

      return { success: false, error: response.data.message || 'Signup failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const socialLogin = useCallback(async (provider) => {
    try {
      // Mock social login - in production, integrate with actual OAuth
      const mockUser = {
        _id: 'social_user_' + Date.now(),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user_${Date.now()}@${provider}.com`,
        role: 'user',
        avatar: null,
        provider,
      };

      const mockToken = 'social_token_' + Date.now();

      localStorage.setItem('furniqo_token', mockToken);
      localStorage.setItem('furniqo_user', JSON.stringify(mockUser));

      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);

      toast.success(`Logged in with ${provider}!`);
      return { success: true };
    } catch (error) {
      toast.error(`${provider} login failed`);
      return { success: false, error: 'Social login failed' };
    }
  }, []);

  const sendOTP = useCallback(async (email) => {
    try {
      // Mock OTP - in production, call actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, simulate OTP
      const mockOTP = '123456';
      console.log('Mock OTP:', mockOTP); // Debug only

      toast.success(`OTP sent to ${email} (Demo: 123456)`);
      return { success: true };
    } catch (error) {
      toast.error('Failed to send OTP');
      return { success: false, error: 'OTP send failed' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('furniqo_token');
    localStorage.removeItem('furniqo_refresh_token');
    localStorage.removeItem('furniqo_user');
    localStorage.removeItem('furniqo_cart');
    localStorage.removeItem('furniqo_wishlist');
    toast.success('Logged out successfully');
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await apiWrapper.updateProfile(profileData);

      if (response?.data?.success) {
        setUser(response.data.data);
        localStorage.setItem('furniqo_user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
        return { success: true };
      }

      return { success: false, error: response?.data?.message || 'Update failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      // Mock - call actual API if available
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to send reset email');
      return { success: false, error: 'Failed to send reset email' };
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
    socialLogin,
    sendOTP,
    forgotPassword,
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