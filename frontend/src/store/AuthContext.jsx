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
      const savedToken = localStorage.getItem('furniqo_token');
      const savedRefreshToken = localStorage.getItem('furniqo_refresh_token');
      const savedUser = localStorage.getItem('furniqo_user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        apiWrapper.setAuthToken(savedToken);
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Try to refresh token if needed
          if (savedRefreshToken) {
            try {
              const response = await apiWrapper.refreshToken(savedRefreshToken);
              if (response?.success && response?.data?.accessToken) {
                const newToken = response.data.accessToken;
                setToken(newToken);
                localStorage.setItem('furniqo_token', newToken);
                apiWrapper.setAuthToken(newToken);
              }
            } catch (refreshError) {
              console.debug('Token refresh skipped');
            }
          }
        } catch (e) {
          localStorage.removeItem('furniqo_user');
          localStorage.removeItem('furniqo_token');
          localStorage.removeItem('furniqo_refresh_token');
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

      if (response?.success && response?.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        setUser(userData);
        setToken(accessToken);
        setIsAuthenticated(true);
        
        apiWrapper.setAuthToken(accessToken);
        localStorage.setItem('furniqo_token', accessToken);
        localStorage.setItem('furniqo_refresh_token', refreshToken);
        localStorage.setItem('furniqo_user', JSON.stringify(userData));
        
        if (rememberMe) {
          localStorage.setItem('furniqo_remembered_email', email);
        } else {
          localStorage.removeItem('furniqo_remembered_email');
        }
        toast.success(`Welcome back, ${userData.name || userData.email}!`);

        // Sync guest cart and wishlist to backend so data persists to DB
        try {
          const guestCart = JSON.parse(localStorage.getItem('furniqo_cart') || '[]');
          if (Array.isArray(guestCart) && guestCart.length > 0) {
            const items = guestCart.map(i => ({
              productId: i.product?._id || i.productId || i.product,
              quantity: i.quantity || 1,
              variant: i.variant || null,
            }));
            await apiWrapper.syncCart(items);
            localStorage.removeItem('furniqo_cart');
          }

          const guestWishlist = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
          if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
            for (const w of guestWishlist) {
              const pid = (w && (w._id || w)) || w;
              if (pid) {
                try { await apiWrapper.addToWishlist(pid); } catch (e) { /* continue on error */ }
              }
            }
            localStorage.removeItem('furniqo_wishlist');
          }
        } catch (syncErr) {
          console.warn('Guest sync to backend failed:', syncErr);
        }
        return { success: true, data: response.data };
      }

      return { success: false, error: response?.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const response = await apiWrapper.register(userData);

      if (response?.success && response?.data) {
        const { user: newUser, accessToken, refreshToken } = response.data;
        
        setUser(newUser);
        setToken(accessToken);
        setIsAuthenticated(true);
        
        apiWrapper.setAuthToken(accessToken);
        localStorage.setItem('furniqo_token', accessToken);
        localStorage.setItem('furniqo_refresh_token', refreshToken);
        localStorage.setItem('furniqo_user', JSON.stringify(newUser));
        
        toast.success('Account created successfully!');
        // After signup, sync any guest data to the new account
        try {
          const guestCart = JSON.parse(localStorage.getItem('furniqo_cart') || '[]');
          if (Array.isArray(guestCart) && guestCart.length > 0) {
            const items = guestCart.map(i => ({
              productId: i.product?._id || i.productId || i.product,
              quantity: i.quantity || 1,
              variant: i.variant || null,
            }));
            await apiWrapper.syncCart(items);
            localStorage.removeItem('furniqo_cart');
          }

          const guestWishlist = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
          if (Array.isArray(guestWishlist) && guestWishlist.length > 0) {
            for (const w of guestWishlist) {
              const pid = (w && (w._id || w)) || w;
              if (pid) {
                try { await apiWrapper.addToWishlist(pid); } catch (e) { /* continue on error */ }
              }
            }
            localStorage.removeItem('furniqo_wishlist');
          }
        } catch (syncErr) {
          console.warn('Guest sync to backend failed after signup:', syncErr);
        }
        return { success: true, data: response.data };
      }

      return { success: false, error: response?.message || 'Signup failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const socialLogin = useCallback(async (provider) => {
    // In production, integrate with actual OAuth (Google, Facebook, etc.)
    // For now, redirect to backend OAuth endpoint
    try {
      window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/auth'}/${provider}`;
    } catch (error) {
      toast.error(`${provider} login failed`);
      return { success: false, error: 'Social login failed' };
    }
  }, []);

  const sendOTP = useCallback(async (email) => {
    try {
      const response = await apiWrapper.sendOTP(email);
      if (response?.success) {
        toast.success(`OTP sent to ${email}`);
        return { success: true };
      }
      toast.error(response?.message || 'Failed to send OTP');
      return { success: false };
    } catch (error) {
      toast.error('Failed to send OTP');
      return { success: false, error: 'OTP send failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('furniqo_refresh_token');
      if (refreshToken) {
        await apiWrapper.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      apiWrapper.setAuthToken(null);
      localStorage.removeItem('furniqo_token');
      localStorage.removeItem('furniqo_refresh_token');
      localStorage.removeItem('furniqo_user');
      toast.success('Logged out successfully');
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await apiWrapper.updateProfile(profileData);
      if (response?.success && response?.data) {
        setUser(response.data);
        localStorage.setItem('furniqo_user', JSON.stringify(response.data));
        toast.success('Profile updated successfully!');
        return { success: true };
      }
      return { success: false, error: response?.message || 'Update failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await apiWrapper.forgotPassword(email);
      if (response?.success) {
        toast.success('Password reset email sent!');
        return { success: true, resetToken: response.resetToken };
      }
      toast.error(response?.message || 'Failed to send reset email');
      return { success: false };
    } catch (error) {
      toast.error('Failed to send reset email');
      return { success: false, error: 'Failed to send reset email' };
    }
  }, []);

  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      const response = await apiWrapper.resetPassword(token, newPassword);
      if (response?.success) {
        toast.success('Password reset successfully! Please login.');
        return { success: true };
      }
      toast.error(response?.message || 'Failed to reset password');
      return { success: false };
    } catch (error) {
      toast.error('Failed to reset password');
      return { success: false };
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
    resetPassword,
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