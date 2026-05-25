// apiWrapper.js - Complete with all methods

import * as api from './api';
import * as localData from '../data/data';

class APIWrapper {
  constructor() {
    this.useLocalFallback = false;
    this.backendChecked = false;
    this.initializationPromise = null;
    this.checkInProgress = false;
  }

  async init() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.backendChecked) {
      return Promise.resolve(!this.useLocalFallback);
    }

    if (this.checkInProgress) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.backendChecked) {
            clearInterval(checkInterval);
            resolve(!this.useLocalFallback);
          }
        }, 50);
      });
    }

    this.checkInProgress = true;
    this.initializationPromise = this.checkBackend();
    return this.initializationPromise;
  }

  async checkBackend() {
    try {
      const controller = new AbortController();
      let timeoutId;

      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Request timeout'));
        }, 1500);
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

      const response = await Promise.race([
        fetch(`${apiUrl}/health`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        }),
        timeoutPromise
      ]);

      clearTimeout(timeoutId);
      this.useLocalFallback = !response.ok;

      if (this.useLocalFallback) {
        console.debug('Backend health check failed, using local data fallback');
      }
    } catch (error) {
      console.debug('Backend unavailable, using local data fallback');
      this.useLocalFallback = true;
    } finally {
      this.backendChecked = true;
      this.checkInProgress = false;
    }

    return !this.useLocalFallback;
  }

  ensureInitialized() {
    if (!this.backendChecked) {
      return this.init();
    }
    return Promise.resolve(!this.useLocalFallback);
  }

  getLocalDataIfNeeded(fallbackFn) {
    if (this.useLocalFallback) {
      return Promise.resolve(fallbackFn());
    }
    if (!this.backendChecked) {
      return Promise.resolve(fallbackFn());
    }
    return null;
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('furniqo_token', token);
      if (api.default?.defaults?.headers) {
        api.default.defaults.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      localStorage.removeItem('furniqo_token');
      if (api.default?.defaults?.headers) {
        delete api.default.defaults.headers.Authorization;
      }
    }
  }

  // ============ USER MANAGEMENT ============
  async register(userData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const mockUser = {
        _id: 'local_user_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user',
        avatar: null,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'local_jwt_token_' + Date.now();
      const mockRefresh = 'local_refresh_' + Date.now();

      localStorage.setItem('furniqo_token', mockToken);
      localStorage.setItem('furniqo_refresh_token', mockRefresh);
      localStorage.setItem('furniqo_user', JSON.stringify(mockUser));

      return {
        success: true,
        data: { user: mockUser, accessToken: mockToken, refreshToken: mockRefresh },
        message: 'Account created (offline mode)',
      };
    }

    try {
      const response = await api.userAPI.register(userData);
      const result = response.data;
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        localStorage.setItem('furniqo_token', accessToken);
        localStorage.setItem('furniqo_refresh_token', refreshToken);
        localStorage.setItem('furniqo_user', JSON.stringify(user));
        this.setAuthToken(accessToken);
      }
      return result;
    } catch (error) {
      console.error('Register API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Registration failed' };
    }
  }

  async login(credentials) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      if (credentials.email && credentials.password) {
        const mockUser = {
          _id: 'local_user_' + Date.now(),
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: 'user',
          avatar: null,
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'local_jwt_token_' + Date.now();
        const mockRefresh = 'local_refresh_' + Date.now();

        localStorage.setItem('furniqo_token', mockToken);
        localStorage.setItem('furniqo_refresh_token', mockRefresh);
        localStorage.setItem('furniqo_user', JSON.stringify(mockUser));

        return {
          success: true,
          data: { user: mockUser, accessToken: mockToken, refreshToken: mockRefresh },
          message: 'Login successful (offline mode)',
        };
      }
      return { success: false, message: 'Invalid credentials' };
    }

    try {
      const response = await api.userAPI.login(credentials);
      const result = response.data;
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        localStorage.setItem('furniqo_token', accessToken);
        localStorage.setItem('furniqo_refresh_token', refreshToken);
        localStorage.setItem('furniqo_user', JSON.stringify(user));
        this.setAuthToken(accessToken);
      }
      return result;
    } catch (error) {
      console.error('Login API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Login failed' };
    }
  }

  async refreshToken(refreshToken) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const accessToken = localStorage.getItem('furniqo_token');
      return { success: true, data: { accessToken, refreshToken } };
    }

    try {
      const response = await api.userAPI.refreshToken(refreshToken);
      const result = response.data;
      if (result.success) {
        const { accessToken, refreshToken: newRefreshToken } = result.data;
        localStorage.setItem('furniqo_token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('furniqo_refresh_token', newRefreshToken);
        }
        this.setAuthToken(accessToken);
      }
      return result;
    } catch (error) {
      console.error('Refresh token API error:', error);
      const accessToken = localStorage.getItem('furniqo_token');
      if (accessToken) {
        return { success: true, data: { accessToken, refreshToken } };
      }
      return { success: false, message: error?.response?.data?.message || error.message || 'Refresh token failed' };
    }
  }

  async logout(refreshToken) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      localStorage.removeItem('furniqo_token');
      localStorage.removeItem('furniqo_refresh_token');
      localStorage.removeItem('furniqo_user');
      this.setAuthToken(null);
      return { success: true, message: 'Logged out (offline mode)' };
    }

    try {
      const response = await api.userAPI.logout(refreshToken);
      const result = response.data;
      if (result.success) {
        localStorage.removeItem('furniqo_token');
        localStorage.removeItem('furniqo_refresh_token');
        localStorage.removeItem('furniqo_user');
        this.setAuthToken(null);
      }
      return result;
    } catch (error) {
      console.error('Logout API error:', error);
      localStorage.removeItem('furniqo_token');
      localStorage.removeItem('furniqo_refresh_token');
      localStorage.removeItem('furniqo_user');
      this.setAuthToken(null);
      return { success: true, message: 'Logged out' };
    }
  }

  async getProfile() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const user = JSON.parse(localStorage.getItem('furniqo_user') || 'null');
      return { success: true, data: user };
    }

    try {
      const response = await api.userAPI.getProfile();
      return response.data;
    } catch (error) {
      console.error('Get profile API error:', error);
      const user = JSON.parse(localStorage.getItem('furniqo_user') || 'null');
      return { success: true, data: user };
    }
  }

  async updateProfile(profileData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const user = { ...JSON.parse(localStorage.getItem('furniqo_user') || '{}'), ...profileData };
      localStorage.setItem('furniqo_user', JSON.stringify(user));
      return { success: true, data: user, message: 'Profile updated locally' };
    }

    try {
      const response = await api.userAPI.updateProfile(profileData);
      const result = response.data;
      if (result.success && result.data) {
        localStorage.setItem('furniqo_user', JSON.stringify(result.data));
      }
      return result;
    } catch (error) {
      console.error('Update profile API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Update failed' };
    }
  }

  async changePassword(currentPassword, newPassword) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'Password changed locally' };
    }

    try {
      const response = await api.userAPI.changePassword({ currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change password API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Change password failed' };
    }
  }

  async forgotPassword(email) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'Password reset link sent (offline mode)', resetToken: 'mock_reset_token' };
    }

    try {
      const response = await api.userAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      console.error('Forgot password API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to send reset email' };
    }
  }

  async resetPassword(token, newPassword) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'Password reset successfully (offline mode)' };
    }

    try {
      const response = await api.userAPI.resetPassword(token, newPassword);
      return response.data;
    } catch (error) {
      console.error('Reset password API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to reset password' };
    }
  }

  async verifyEmail(token) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: false, message: 'Email verification unavailable offline' };
    }

    try {
      const response = await api.userAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      console.error('Verify email API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Verification failed' };
    }
  }

  async getUsers() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const users = JSON.parse(localStorage.getItem('furniqo_users') || '[]');
      return { success: true, data: users };
    }

    try {
      const response = await api.userAPI.getAllUsers();
      return response.data;
    } catch (error) {
      console.error('Get users API error:', error);
      const users = JSON.parse(localStorage.getItem('furniqo_users') || '[]');
      return { success: true, data: users };
    }
  }

  async getUserById(userId) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const users = JSON.parse(localStorage.getItem('furniqo_users') || '[]');
      const user = users.find(u => u._id === userId);
      return { success: true, data: user || null };
    }

    try {
      const response = await api.userAPI.getUserById(userId);
      return response.data;
    } catch (error) {
      console.error('Get user by ID API error:', error);
      return { success: false, message: error.message };
    }
  }

  async updateUserRole(userId, roleData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const users = JSON.parse(localStorage.getItem('furniqo_users') || '[]');
      const index = users.findIndex(u => u._id === userId);
      if (index !== -1) {
        users[index].role = roleData.role;
        localStorage.setItem('furniqo_users', JSON.stringify(users));
      }
      return { success: true, message: 'Role updated locally' };
    }

    try {
      const response = await api.userAPI.updateUserRole(userId, roleData);
      return response.data;
    } catch (error) {
      console.error('Update user role API error:', error);
      return { success: false, message: error.message };
    }
  }

  async deleteUser(userId) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const users = JSON.parse(localStorage.getItem('furniqo_users') || '[]');
      const filtered = users.filter(u => u._id !== userId);
      localStorage.setItem('furniqo_users', JSON.stringify(filtered));
      return { success: true, message: 'User deleted locally' };
    }

    try {
      const response = await api.userAPI.deleteUser(userId);
      return response.data;
    } catch (error) {
      console.error('Delete user API error:', error);
      return { success: false, message: error.message };
    }
  }

  // ============ TRENDING PRODUCTS ============
  async getTrendingProducts(limit = 8) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      let products = [...(localData.products || [])];
      products = products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return { 
        success: true, 
        data: products.slice(0, limit),
        message: 'Trending products loaded from local data'
      };
    }

    try {
      const response = await api.productAPI.getAllProducts({ 
        limit: limit,
        sort: 'popular'
      });
      return response.data;
    } catch (error) {
      console.warn('Get trending products API failed:', error);
      let products = [...(localData.products || [])];
      products = products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return { 
        success: true, 
        data: products.slice(0, limit),
        message: 'Trending products loaded from local data'
      };
    }
  }

  // ============ CART MANAGEMENT ============
  getCartItems() {
    try {
      return JSON.parse(localStorage.getItem('furniqo_cart') || '[]');
    } catch {
      return [];
    }
  }

  saveCartItems(items) {
    localStorage.setItem('furniqo_cart', JSON.stringify(items));
  }

  async getCart() {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = this.getCartItems();
      const subtotal = items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
      return { success: true, data: { items, subtotal, itemCount: items.length, totalQuantity: items.reduce((s, it) => s + (it.quantity || 1), 0) } };
    }

    try {
      const response = await api.cartAPI.getCart();
      return response.data;
    } catch (error) {
      console.error('Get cart API error:', error);
      const items = this.getCartItems();
      const subtotal = items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
      return { success: true, data: { items, subtotal, itemCount: items.length, totalQuantity: items.reduce((s, it) => s + (it.quantity || 1), 0) } };
    }
  }

  resolveVariantId(variant) {
    if (!variant) return null;
    if (typeof variant === 'string' || typeof variant === 'number') return variant;
    return variant._id || variant.id || variant.variantId || null;
  }

  async addToCart({ productId, quantity = 1, variantId = null }) {
    await this.ensureInitialized();
    const resolvedVariantId = this.resolveVariantId(variantId);

    if (this.useLocalFallback) {
      const items = this.getCartItems();
      const existing = items.find(i => i.productId === productId && i.variantId === resolvedVariantId);
      
      if (existing) {
        existing.quantity += quantity;
      } else {
        const product = localData.products.find(p => p._id === productId) || {};
        items.push({
          _id: 'local_cart_item_' + Date.now(),
          productId,
          quantity,
          variantId: resolvedVariantId,
          name: product.name || '',
          price: product.price || 0,
        });
      }
      this.saveCartItems(items);
      return { success: true };
    }

    try {
      const response = await api.cartAPI.addItem(productId, quantity, resolvedVariantId);
      return response.data;
    } catch (error) {
      console.error('Add to cart API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to add to cart' };
    }
  }

  async updateCartItem(itemId, quantity) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = this.getCartItems();
      const index = items.findIndex(i => i._id === itemId);
      if (index !== -1) {
        items[index].quantity = quantity;
        this.saveCartItems(items);
      }
      return { success: true };
    }

    try {
      const response = await api.cartAPI.updateItem(itemId, quantity);
      return response.data;
    } catch (error) {
      console.error('Update cart item API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update cart item' };
    }
  }

  async removeFromCart(itemId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = this.getCartItems().filter(i => i._id !== itemId);
      this.saveCartItems(items);
      return { success: true };
    }

    try {
      const response = await api.cartAPI.removeItem(itemId);
      return response.data;
    } catch (error) {
      console.error('Remove from cart API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to remove cart item' };
    }
  }

  async clearCart() {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      this.saveCartItems([]);
      return { success: true };
    }

    try {
      const response = await api.cartAPI.clearCart();
      return response.data;
    } catch (error) {
      console.error('Clear cart API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to clear cart' };
    }
  }

  async syncCart(items) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      this.saveCartItems(items || []);
      return { success: true };
    }

    const normalizedItems = Array.isArray(items)
      ? items.map((item) => ({
          ...item,
          variantId: this.resolveVariantId(item.variant || item.variantId),
        }))
      : [];

    try {
      const response = await api.cartAPI.syncCart(normalizedItems);
      return response.data;
    } catch (error) {
      console.error('Sync cart API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to sync cart' };
    }
  }

  // ============ WISHLIST MANAGEMENT ============
  saveWishlistItems(items) {
    localStorage.setItem('furniqo_wishlist', JSON.stringify(items));
  }

  async getWishlist() {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      return { success: true, data: items };
    }

    try {
      const response = await api.wishlistAPI.getWishlist();
      return response.data;
    } catch (error) {
      console.warn('Get wishlist API failed, using local fallback:', error);
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      return { success: true, data: items };
    }
  }

  async addToWishlist(productId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      if (!items.find(i => (i._id || i) === productId)) {
        items.push({ _id: productId, addedAt: new Date().toISOString() });
        this.saveWishlistItems(items);
      }
      return { success: true };
    }

    try {
      const response = await api.wishlistAPI.addItem(productId);
      return response.data;
    } catch (error) {
      console.warn('Add to wishlist API failed, using local fallback:', error);
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      if (!items.find(i => (i._id || i) === productId)) {
        items.push({ _id: productId, addedAt: new Date().toISOString() });
        this.saveWishlistItems(items);
      }
      return { success: true };
    }
  }

  async removeFromWishlist(productId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]').filter(i => (i._id || i) !== productId);
      this.saveWishlistItems(items);
      return { success: true };
    }

    try {
      const response = await api.wishlistAPI.removeItem(productId);
      return response.data;
    } catch (error) {
      console.warn('Remove from wishlist API failed, using local fallback:', error);
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]').filter(i => (i._id || i) !== productId);
      this.saveWishlistItems(items);
      return { success: true };
    }
  }

  async isWishlisted(productId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      const found = items.some(i => (i._id || i) === productId);
      return { success: true, data: { inWishlist: found } };
    }

    try {
      const response = await api.wishlistAPI.checkWishlist(productId);
      return response.data;
    } catch (error) {
      console.warn('Is wishlisted API failed, using local fallback:', error);
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      const found = items.some(i => (i._id || i) === productId);
      return { success: true, data: { inWishlist: found } };
    }
  }

  async moveWishlistToCart(productIds) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const wishlist = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      const toMove = wishlist.filter(i => productIds.includes((i._id || i)));
      const remaining = wishlist.filter(i => !productIds.includes((i._id || i)));
      this.saveWishlistItems(remaining);
      
      const cart = this.getCartItems();
      toMove.forEach(item => {
        const productId = item._id || item;
        const existing = cart.find(c => c.productId === productId);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ _id: 'local_cart_item_' + Date.now(), productId, quantity: 1 });
        }
      });
      this.saveCartItems(cart);
      return { success: true, message: 'Moved to cart locally' };
    }

    try {
      const response = await api.wishlistAPI.moveToCart(productIds);
      return response.data;
    } catch (error) {
      console.warn('Move wishlist to cart API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to move items' };
    }
  }

  // ============ ORDER MANAGEMENT ============
  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `FNQ-${timestamp}-${random}`;
  }

  async createOrder(orderData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const order = {
        _id: 'local_order_' + Date.now(),
        orderNumber: this.generateOrderNumber(),
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('furniqo_orders', JSON.stringify(orders));
      localStorage.removeItem('furniqo_cart');
      return { success: true, data: order, message: 'Order created successfully (offline mode)' };
    }

    try {
      const response = await api.orderAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.warn('Order creation API failed, using local fallback:', error);
      const order = {
        _id: 'local_order_' + Date.now(),
        orderNumber: this.generateOrderNumber(),
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('furniqo_orders', JSON.stringify(orders));
      localStorage.removeItem('furniqo_cart');
      return { success: true, data: order, message: 'Order created successfully (offline mode)' };
    }
  }

  async getOrders(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { success: true, data: orders };
    }

    try {
      const response = await api.orderAPI.getOrders(params);
      return response.data;
    } catch (error) {
      console.warn('Get orders API failed, using local fallback:', error);
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { success: true, data: orders };
    }
  }

  async getOrderById(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const order = orders.find(o => o._id === id || o.orderNumber === id);
      return { success: true, data: order };
    }

    try {
      const response = await api.orderAPI.getOrderById(id);
      return response.data;
    } catch (error) {
      console.warn('Get order API failed, using local fallback:', error);
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const order = orders.find(o => o._id === id || o.orderNumber === id);
      return { success: true, data: order };
    }
  }

  async cancelOrder(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const updated = orders.map(order => order._id === id ? { ...order, status: 'cancelled' } : order);
      localStorage.setItem('furniqo_orders', JSON.stringify(updated));
      return { success: true, message: 'Order cancelled locally' };
    }

    try {
      const response = await api.orderAPI.cancelOrder(id);
      return response.data;
    } catch (error) {
      console.warn('Cancel order API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to cancel order' };
    }
  }

  async updateOrderStatus(id, statusData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const updated = orders.map(order => order._id === id ? { ...order, ...statusData } : order);
      localStorage.setItem('furniqo_orders', JSON.stringify(updated));
      return { success: true };
    }

    try {
      const response = await api.orderAPI.updateOrderStatus(id, statusData);
      return response.data;
    } catch (error) {
      console.warn('Update order status API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update order status' };
    }
  }

  async getAllOrders(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { success: true, data: orders };
    }

    try {
      const response = await api.orderAPI.getAllOrders(params);
      return response.data;
    } catch (error) {
      console.warn('Get all orders API failed:', error);
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { success: true, data: orders };
    }
  }

  // ============ GIFT CARDS MANAGEMENT ============
  async createGiftCard(cardData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const card = {
        _id: 'local_gc_' + Date.now(),
        code: 'GC-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        amount: cardData.amount,
        balance: cardData.amount,
        recipient_name: cardData.recipientName,
        recipient_email: cardData.recipientEmail,
        sender_name: cardData.senderName,
        message: cardData.message,
        status: 'active',
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        expiresAt: cardData.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      cards.push(card);
      localStorage.setItem('furniqo_giftcards', JSON.stringify(cards));
      return { success: true, data: card, message: 'Gift card created successfully' };
    }

    try {
      const response = await api.giftCardAPI.createGiftCard(cardData);
      return response.data;
    } catch (error) {
      console.error('Create gift card API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create gift card' };
    }
  }

  async getMyGiftCards() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      return { success: true, data: cards };
    }

    try {
      const response = await api.giftCardAPI.getMyGiftCards();
      return response.data;
    } catch (error) {
      console.error('Get my gift cards API failed:', error);
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      return { success: true, data: cards };
    }
  }

  async getGiftCardByCode(code) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const card = cards.find(c => c.code === code);
      return { success: true, data: card || null };
    }

    try {
      const response = await api.giftCardAPI.getGiftCardByCode(code);
      return response.data;
    } catch (error) {
      console.error('Get gift card by code API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to get gift card' };
    }
  }

  async applyGiftCard(code, orderTotal) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const card = cards.find(c => c.code === code);
      if (!card) return { success: false, message: 'Gift card not found' };
      if (card.status !== 'active') return { success: false, message: 'Gift card is not active' };
      if (new Date(card.expiresAt) < new Date()) return { success: false, message: 'Gift card has expired' };
      const amountToApply = Math.min(card.balance, orderTotal);
      return { success: true, data: { code, balance: card.balance, amountToApply, remainingBalance: card.balance - amountToApply } };
    }

    try {
      const response = await api.giftCardAPI.applyGiftCard(code, orderTotal);
      return response.data;
    } catch (error) {
      console.error('Apply gift card API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to apply gift card' };
    }
  }

  async getAllGiftCards(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      let cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      let filtered = [...cards];
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(c => c.status === params.status);
      }
      if (params.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.code?.toLowerCase().includes(search) || 
          c.recipient_email?.toLowerCase().includes(search)
        );
      }
      const totalAmount = cards.reduce((sum, c) => sum + (c.amount || 0), 0);
      const totalBalance = cards.reduce((sum, c) => sum + (c.balance || c.amount || 0), 0);
      const activeCards = cards.filter(c => c.status === 'active').length;
      const redeemedCards = cards.filter(c => (c.amount || 0) > (c.balance || 0)).length;
      return { 
        success: true, 
        data: filtered,
        stats: {
          totalAmount,
          totalBalance,
          totalCards: cards.length,
          activeCards,
          redeemedCards
        }
      };
    }

    try {
      const response = await api.giftCardAPI.getAllGiftCards(params);
      return response.data;
    } catch (error) {
      console.error('Get all gift cards API failed:', error);
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      return { success: true, data: cards };
    }
  }

  async updateGiftCard(id, updateData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const index = cards.findIndex(c => c._id === id);
      if (index !== -1) {
        cards[index] = { ...cards[index], ...updateData, updatedAt: new Date().toISOString() };
        localStorage.setItem('furniqo_giftcards', JSON.stringify(cards));
        return { success: true, data: cards[index] };
      }
      return { success: false, message: 'Gift card not found' };
    }

    try {
      const response = await api.giftCardAPI.updateGiftCard(id, updateData);
      return response.data;
    } catch (error) {
      console.error('Update gift card API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update gift card' };
    }
  }

  async deleteGiftCard(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const filtered = cards.filter(c => c._id !== id && c.code !== id);
      localStorage.setItem('furniqo_giftcards', JSON.stringify(filtered));
      return { success: true, message: 'Gift card deleted successfully' };
    }

    try {
      const response = await api.giftCardAPI.deleteGiftCard(id);
      return response.data;
    } catch (error) {
      console.error('Delete gift card API failed:', error);
      // Still return success for UI update even if API fails
      const cards = JSON.parse(localStorage.getItem('furniqo_giftcards') || '[]');
      const filtered = cards.filter(c => c._id !== id && c.code !== id);
      localStorage.setItem('furniqo_giftcards', JSON.stringify(filtered));
      return { success: true, message: 'Gift card removed from view' };
    }
  }

  // ============ PRODUCT MANAGEMENT ============
  async getProducts(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      let products = [...localData.products];
      if (params.category) {
        products = products.filter(p => p.category === params.category);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(query));
      }
      return { success: true, data: products };
    }

    try {
      const response = await api.productAPI.getAllProducts(params);
      return response.data;
    } catch (error) {
      console.warn('Get products API failed:', error);
      return { success: true, data: localData.products };
    }
  }

  async getProduct(identifier) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const product = localData.products.find(p => p.slug === identifier || p._id === identifier);
      return { success: true, data: product || null };
    }

    try {
      const response = await api.productAPI.getProductByIdentifier(identifier);
      return response.data;
    } catch (error) {
      console.warn('Get product API failed:', error);
      const product = localData.products.find(p => p.slug === identifier);
      return { success: true, data: product || null };
    }
  }

  async createProduct(productData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newProduct = { _id: 'local_prod_' + Date.now(), ...productData, createdAt: new Date().toISOString() };
      localData.products.unshift(newProduct);
      return { success: true, data: newProduct };
    }

    try {
      const response = await api.productAPI.createProduct(productData);
      return response.data;
    } catch (error) {
      console.warn('Create product API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create product' };
    }
  }

  async updateProduct(id, productData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = localData.products.findIndex(p => p._id === id);
      if (index !== -1) {
        localData.products[index] = { ...localData.products[index], ...productData };
        return { success: true, data: localData.products[index] };
      }
      return { success: false, message: 'Product not found' };
    }

    try {
      const response = await api.productAPI.updateProduct(id, productData);
      return response.data;
    } catch (error) {
      console.warn('Update product API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update product' };
    }
  }

  async deleteProduct(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = localData.products.findIndex(p => p._id === id);
      if (index !== -1) {
        localData.products.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Product not found' };
    }

    try {
      const response = await api.productAPI.deleteProduct(id);
      return response.data;
    } catch (error) {
      console.warn('Delete product API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete product' };
    }
  }

  async addProductReview(id, reviewData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const product = localData.products.find(p => p._id === id);
      if (product) {
        if (!product.reviews) product.reviews = [];
        product.reviews.push({ _id: 'local_rev_' + Date.now(), ...reviewData, date: new Date().toISOString() });
        return { success: true };
      }
      return { success: false, message: 'Product not found' };
    }

    try {
      const response = await api.productAPI.addProductReview(id, reviewData);
      return response.data;
    } catch (error) {
      console.warn('Add product review API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to add review' };
    }
  }

  // ============ CATEGORY MANAGEMENT ============
  async getCategories() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.categories || [] };
    }

    try {
      const response = await api.categoryAPI.getCategories();
      return response.data;
    } catch (error) {
      console.warn('Get categories API failed:', error);
      return { success: true, data: localData.categories || [] };
    }
  }

  async getFeaturedCategories() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const featured = (localData.categories || []).filter(c => c.featured);
      return { success: true, data: featured };
    }

    try {
      const response = await api.categoryAPI.getFeaturedCategories();
      return response.data;
    } catch (error) {
      console.warn('Get featured categories API failed:', error);
      const featured = (localData.categories || []).filter(c => c.featured);
      return { success: true, data: featured };
    }
  }

  async getCategoryByIdentifier(identifier) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const category = (localData.categories || []).find(c => c._id === identifier || c.slug === identifier);
      return { success: true, data: category || null };
    }

    try {
      const response = await api.categoryAPI.getCategoryByIdentifier(identifier);
      return response.data;
    } catch (error) {
      console.warn('Get category API failed:', error);
      const category = (localData.categories || []).find(c => c._id === identifier || c.slug === identifier);
      return { success: true, data: category || null };
    }
  }

  async createCategory(categoryData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newCategory = { _id: 'local_cat_' + Date.now(), ...categoryData };
      if (!localData.categories) localData.categories = [];
      localData.categories.push(newCategory);
      return { success: true, data: newCategory };
    }

    try {
      const response = await api.categoryAPI.createCategory(categoryData);
      return response.data;
    } catch (error) {
      console.warn('Create category API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create category' };
    }
  }

  async updateCategory(id, categoryData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.categories || []).findIndex(c => c._id === id);
      if (index !== -1) {
        localData.categories[index] = { ...localData.categories[index], ...categoryData };
        return { success: true, data: localData.categories[index] };
      }
      return { success: false, message: 'Category not found' };
    }

    try {
      const response = await api.categoryAPI.updateCategory(id, categoryData);
      return response.data;
    } catch (error) {
      console.warn('Update category API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update category' };
    }
  }

  async deleteCategory(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.categories || []).findIndex(c => c._id === id);
      if (index !== -1) {
        localData.categories.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Category not found' };
    }

    try {
      const response = await api.categoryAPI.deleteCategory(id);
      return response.data;
    } catch (error) {
      console.warn('Delete category API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete category' };
    }
  }

  // ============ TESTIMONIAL MANAGEMENT ============
  async getTestimonials() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.testimonials || [] };
    }

    try {
      const response = await api.testimonialAPI.getTestimonials();
      return response.data;
    } catch (error) {
      console.warn('Get testimonials API failed:', error);
      return { success: true, data: localData.testimonials || [] };
    }
  }

  async createTestimonial(testimonialData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newTestimonial = { _id: 'local_test_' + Date.now(), ...testimonialData };
      if (!localData.testimonials) localData.testimonials = [];
      localData.testimonials.push(newTestimonial);
      return { success: true, data: newTestimonial };
    }

    try {
      const response = await api.testimonialAPI.createTestimonial(testimonialData);
      return response.data;
    } catch (error) {
      console.warn('Create testimonial API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create testimonial' };
    }
  }

  async updateTestimonial(id, testimonialData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.testimonials || []).findIndex(t => t._id === id);
      if (index !== -1) {
        localData.testimonials[index] = { ...localData.testimonials[index], ...testimonialData };
        return { success: true, data: localData.testimonials[index] };
      }
      return { success: false, message: 'Testimonial not found' };
    }

    try {
      const response = await api.testimonialAPI.updateTestimonial(id, testimonialData);
      return response.data;
    } catch (error) {
      console.warn('Update testimonial API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update testimonial' };
    }
  }

  async deleteTestimonial(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.testimonials || []).findIndex(t => t._id === id);
      if (index !== -1) {
        localData.testimonials.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Testimonial not found' };
    }

    try {
      const response = await api.testimonialAPI.deleteTestimonial(id);
      return response.data;
    } catch (error) {
      console.warn('Delete testimonial API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete testimonial' };
    }
  }

  // ============ BLOG MANAGEMENT ============
  async getBlogPosts(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      let posts = [...(localData.blogPosts || [])];
      if (params.featured) posts = posts.filter(p => p.featured);
      if (params.limit) posts = posts.slice(0, params.limit);
      return { success: true, data: { posts: posts, total: posts.length } };
    }

    try {
      const response = await api.blogAPI.getBlogPosts(params);
      if (response.data && response.data.success !== undefined) {
        return response.data;
      }
      if (response.data && response.data.data) {
        return { success: true, data: response.data.data };
      }
      if (response.data && Array.isArray(response.data)) {
        return { success: true, data: { posts: response.data, total: response.data.length } };
      }
      return response.data;
    } catch (error) {
      console.warn('Get blog posts API failed:', error);
      const posts = localData.blogPosts || [];
      return { success: true, data: { posts: posts, total: posts.length } };
    }
  }

  async getBlogPost(identifier) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const post = (localData.blogPosts || []).find(p => p.slug === identifier || p._id === identifier);
      return { success: true, data: post || null };
    }

    try {
      const response = await api.blogAPI.getBlogPostByIdentifier(identifier);
      return response.data;
    } catch (error) {
      console.warn('Get blog post API failed:', error);
      const post = (localData.blogPosts || []).find(p => p.slug === identifier);
      return { success: true, data: post || null };
    }
  }

  async createBlogPost(postData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newPost = { 
        _id: 'local_blog_' + Date.now(), 
        ...postData, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (!localData.blogPosts) localData.blogPosts = [];
      localData.blogPosts.unshift(newPost);
      return { success: true, data: newPost };
    }

    try {
      const response = await api.blogAPI.createBlogPost(postData);
      return response.data;
    } catch (error) {
      console.warn('Create blog post API failed:', error);
      const newPost = { 
        _id: 'local_blog_' + Date.now(), 
        ...postData, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (!localData.blogPosts) localData.blogPosts = [];
      localData.blogPosts.unshift(newPost);
      return { success: true, data: newPost, message: 'Created locally (offline mode)' };
    }
  }

  async updateBlogPost(id, postData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.blogPosts || []).findIndex(p => p._id === id);
      if (index !== -1) {
        localData.blogPosts[index] = { 
          ...localData.blogPosts[index], 
          ...postData, 
          updatedAt: new Date().toISOString() 
        };
        return { success: true, data: localData.blogPosts[index] };
      }
      return { success: false, message: 'Blog post not found' };
    }

    try {
      const response = await api.blogAPI.updateBlogPost(id, postData);
      return response.data;
    } catch (error) {
      console.warn('Update blog post API failed:', error);
      const index = (localData.blogPosts || []).findIndex(p => p._id === id);
      if (index !== -1) {
        localData.blogPosts[index] = { 
          ...localData.blogPosts[index], 
          ...postData, 
          updatedAt: new Date().toISOString() 
        };
        return { success: true, data: localData.blogPosts[index], message: 'Updated locally (offline mode)' };
      }
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update blog post' };
    }
  }

  async deleteBlogPost(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.blogPosts || []).findIndex(p => p._id === id);
      if (index !== -1) {
        localData.blogPosts.splice(index, 1);
        return { success: true, message: 'Blog post deleted locally' };
      }
      return { success: false, message: 'Blog post not found' };
    }

    try {
      const response = await api.blogAPI.deleteBlogPost(id);
      return response.data;
    } catch (error) {
      console.warn('Delete blog post API failed:', error);
      const index = (localData.blogPosts || []).findIndex(p => p._id === id);
      if (index !== -1) {
        localData.blogPosts.splice(index, 1);
        return { success: true, message: 'Deleted locally (offline mode)' };
      }
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete blog post' };
    }
  }
  
  // ============ ROOMS MANAGEMENT ============
  async getRooms() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.rooms || [] };
    }

    try {
      const response = await api.roomsAPI.getRooms();
      return response.data;
    } catch (error) {
      console.warn('Get rooms API failed:', error);
      return { success: true, data: localData.rooms || [] };
    }
  }

  async getRoomsByType(roomType) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const rooms = (localData.rooms || []).filter(r => r.roomType === roomType);
      return { success: true, data: rooms };
    }

    try {
      const response = await api.roomsAPI.getRoomsByType(roomType);
      return response.data;
    } catch (error) {
      console.warn('Get rooms by type API failed:', error);
      const rooms = (localData.rooms || []).filter(r => r.roomType === roomType);
      return { success: true, data: rooms };
    }
  }

  async createRoom(roomData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newRoom = { _id: 'local_room_' + Date.now(), ...roomData };
      if (!localData.rooms) localData.rooms = [];
      localData.rooms.push(newRoom);
      return { success: true, data: newRoom };
    }

    try {
      const response = await api.roomsAPI.createRoom(roomData);
      return response.data;
    } catch (error) {
      console.warn('Create room API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create room' };
    }
  }

  async updateRoom(id, roomData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.rooms || []).findIndex(r => r._id === id);
      if (index !== -1) {
        localData.rooms[index] = { ...localData.rooms[index], ...roomData };
        return { success: true, data: localData.rooms[index] };
      }
      return { success: false, message: 'Room not found' };
    }

    try {
      const response = await api.roomsAPI.updateRoom(id, roomData);
      return response.data;
    } catch (error) {
      console.warn('Update room API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update room' };
    }
  }

  async deleteRoom(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.rooms || []).findIndex(r => r._id === id);
      if (index !== -1) {
        localData.rooms.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Room not found' };
    }

    try {
      const response = await api.roomsAPI.deleteRoom(id);
      return response.data;
    } catch (error) {
      console.warn('Delete room API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete room' };
    }
  }

  // ============ COUPON MANAGEMENT ============
  async getActiveCoupons() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const coupons = (localData.coupons || []).filter(c => c.isActive);
      return { success: true, data: coupons };
    }

    try {
      const response = await api.couponAPI.getActiveCoupons();
      return response.data;
    } catch (error) {
      console.warn('Get active coupons API failed:', error);
      const coupons = (localData.coupons || []).filter(c => c.isActive);
      return { success: true, data: coupons };
    }
  }

  async validateCoupon(code, orderTotal) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const coupon = (localData.coupons || []).find(c => c.code === code.toUpperCase() && c.isActive);
      if (!coupon) return { success: false, message: 'Invalid coupon code' };
      const now = new Date();
      if (new Date(coupon.validUntil) < now) return { success: false, message: 'Coupon has expired' };
      if (orderTotal < coupon.minPurchase) return { success: false, message: `Minimum purchase of $${coupon.minPurchase} required` };
      let discount = coupon.type === 'percentage' ? (orderTotal * coupon.discount) / 100 : coupon.discount;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
      return { success: true, data: { ...coupon, calculatedDiscount: discount } };
    }

    try {
      const response = await api.couponAPI.validateCoupon(code, orderTotal);
      return response.data;
    } catch (error) {
      console.warn('Validate coupon API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to validate coupon' };
    }
  }

  async getAllCoupons() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.coupons || [] };
    }

    try {
      const response = await api.couponAPI.getAllCoupons();
      return response.data;
    } catch (error) {
      console.warn('Get all coupons API failed:', error);
      return { success: true, data: localData.coupons || [] };
    }
  }

  async createCoupon(couponData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newCoupon = { ...couponData, usedCount: 0 };
      if (!localData.coupons) localData.coupons = [];
      localData.coupons.push(newCoupon);
      return { success: true, data: newCoupon };
    }

    try {
      const response = await api.couponAPI.createCoupon(couponData);
      return response.data;
    } catch (error) {
      console.warn('Create coupon API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create coupon' };
    }
  }

  async updateCoupon(code, couponData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.coupons || []).findIndex(c => c.code === code);
      if (index !== -1) {
        localData.coupons[index] = { ...localData.coupons[index], ...couponData };
        return { success: true, data: localData.coupons[index] };
      }
      return { success: false, message: 'Coupon not found' };
    }

    try {
      const response = await api.couponAPI.updateCoupon(code, couponData);
      return response.data;
    } catch (error) {
      console.warn('Update coupon API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update coupon' };
    }
  }

  async deleteCoupon(code) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.coupons || []).findIndex(c => c.code === code);
      if (index !== -1) {
        localData.coupons.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Coupon not found' };
    }

    try {
      const response = await api.couponAPI.deleteCoupon(code);
      return response.data;
    } catch (error) {
      console.warn('Delete coupon API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete coupon' };
    }
  }

  // ============ FAQ MANAGEMENT ============
  async getFAQs() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.faqs || [] };
    }

    try {
      const response = await api.faqAPI.getFaqs();
      return response.data;
    } catch (error) {
      console.warn('Get FAQs API failed:', error);
      return { success: true, data: localData.faqs || [] };
    }
  }

  async getFaqCategories() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const categories = [...new Set((localData.faqs || []).map(f => f.category))];
      return { success: true, data: categories };
    }

    try {
      const response = await api.faqAPI.getFaqCategories();
      return response.data;
    } catch (error) {
      console.warn('Get FAQ categories API failed:', error);
      const categories = [...new Set((localData.faqs || []).map(f => f.category))];
      return { success: true, data: categories };
    }
  }

  async createFaq(faqData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newFaq = { id: Date.now(), ...faqData };
      if (!localData.faqs) localData.faqs = [];
      localData.faqs.push(newFaq);
      return { success: true, data: newFaq };
    }

    try {
      const response = await api.faqAPI.createFaq(faqData);
      return response.data;
    } catch (error) {
      console.warn('Create FAQ API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create FAQ' };
    }
  }

  async updateFaq(id, faqData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.faqs || []).findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        localData.faqs[index] = { ...localData.faqs[index], ...faqData };
        return { success: true, data: localData.faqs[index] };
      }
      return { success: false, message: 'FAQ not found' };
    }

    try {
      const response = await api.faqAPI.updateFaq(id, faqData);
      return response.data;
    } catch (error) {
      console.warn('Update FAQ API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update FAQ' };
    }
  }

  async deleteFaq(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.faqs || []).findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        localData.faqs.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'FAQ not found' };
    }

    try {
      const response = await api.faqAPI.deleteFaq(id);
      return response.data;
    } catch (error) {
      console.warn('Delete FAQ API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete FAQ' };
    }
  }

  // ============ UPLOAD MANAGEMENT ============
  normalizeUploadResponse(payload) {
    const data = payload?.data || payload || {};
    const url = data.url || payload?.url || payload?.imageUrl || data?.imageUrl;
    const urls = data.urls || payload?.urls || (data.data && data.data.urls) || [];
    const images = data.images || payload?.images || (data.data && data.data.images) || [];
    const uploads = data.uploads || payload?.uploads || (data.data && data.data.uploads) || [];
    const filename = data.filename || payload?.filename || (data.data && data.data.filename);
    const path = data.path || payload?.path || (data.data && data.data.path);

    return {
      success: payload?.success ?? true,
      message: payload?.message,
      url,
      urls,
      images,
      uploads,
      filename,
      path,
      data: {
        url,
        urls,
        images,
        uploads,
        filename,
        path,
      },
    };
  }

  async uploadImage(formData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const mockUrl = `https://placehold.co/600x400/eee/999?text=Uploaded+${Date.now()}`;
      return this.normalizeUploadResponse({ success: true, url: mockUrl, data: { url: mockUrl } });
    }

    try {
      const response = await api.uploadAPI.uploadImage(formData);
      return this.normalizeUploadResponse(response.data);
    } catch (error) {
      console.warn('Upload image API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to upload image' };
    }
  }

  async uploadImages(formData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const mockUrls = Array.from({ length: formData.getAll('images').length }, () => `https://placehold.co/600x400/eee/999?text=Uploaded+${Date.now()}`);
      return this.normalizeUploadResponse({ success: true, urls: mockUrls, data: { urls: mockUrls } });
    }

    try {
      const response = await api.uploadAPI.uploadImages(formData);
      return this.normalizeUploadResponse(response.data);
    } catch (error) {
      console.warn('Upload images API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to upload images' };
    }
  }

  async getUploadedImages() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return this.normalizeUploadResponse({ success: true, images: [], data: { images: [] }, uploads: [] });
    }

    try {
      const response = await api.uploadAPI.getUploadedImages();
      return this.normalizeUploadResponse(response.data);
    } catch (error) {
      console.warn('Get uploaded images API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to fetch uploaded images' };
    }
  }

  async deleteImage(filename) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'Image deleted locally' };
    }

    try {
      const response = await api.uploadAPI.deleteImage(filename);
      return response.data;
    } catch (error) {
      console.warn('Delete image API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete image' };
    }
  }

  // ============ CONTACT & NEWSLETTER ============
  async submitContact(formData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const contacts = JSON.parse(localStorage.getItem('furniqo_contacts') || '[]');
      contacts.push({ _id: 'local_cont_' + Date.now(), ...formData, status: 'unread', createdAt: new Date().toISOString() });
      localStorage.setItem('furniqo_contacts', JSON.stringify(contacts));
      return { success: true, message: 'Message sent successfully' };
    }

    try {
      const response = await api.contactAPI.submitContact(formData);
      return response.data;
    } catch (error) {
      console.warn('Submit contact API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to send message' };
    }
  }

  async getContactMessages(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const contacts = JSON.parse(localStorage.getItem('furniqo_contacts') || '[]');
      return { success: true, data: contacts };
    }

    try {
      const response = await api.contactAPI.getContactMessages(params);
      return response.data;
    } catch (error) {
      console.warn('Get contact messages API failed:', error);
      return { success: true, data: [] };
    }
  }

  async updateContactMessageStatus(id, status) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const contacts = JSON.parse(localStorage.getItem('furniqo_contacts') || '[]');
      const index = contacts.findIndex(c => c._id === id);
      if (index !== -1) {
        contacts[index].status = status;
        localStorage.setItem('furniqo_contacts', JSON.stringify(contacts));
      }
      return { success: true };
    }

    try {
      const response = await api.contactAPI.updateMessageStatus(id, status);
      return response.data;
    } catch (error) {
      console.warn('Update message status API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update status' };
    }
  }

  async subscribeNewsletter(email, name = '') {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const subscribers = JSON.parse(localStorage.getItem('furniqo_subscribers') || '[]');
      if (!subscribers.find(s => s.email === email)) {
        subscribers.push({ email, name, subscribedAt: new Date().toISOString(), isActive: true });
        localStorage.setItem('furniqo_subscribers', JSON.stringify(subscribers));
      }
      return { success: true, message: 'Subscribed successfully' };
    }

    try {
      const response = await api.contactAPI.subscribeNewsletter(email, name);
      return response.data;
    } catch (error) {
      console.warn('Subscribe newsletter API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to subscribe' };
    }
  }

  async unsubscribeNewsletter(email) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const subscribers = JSON.parse(localStorage.getItem('furniqo_subscribers') || '[]');
      const filtered = subscribers.filter(s => s.email !== email);
      localStorage.setItem('furniqo_subscribers', JSON.stringify(filtered));
      return { success: true, message: 'Unsubscribed successfully' };
    }

    try {
      const response = await api.contactAPI.unsubscribeNewsletter(email);
      return response.data;
    } catch (error) {
      console.warn('Unsubscribe newsletter API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to unsubscribe' };
    }
  }

  async getNewsletterSubscribers() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const subscribers = JSON.parse(localStorage.getItem('furniqo_subscribers') || '[]');
      return { success: true, data: subscribers };
    }

    try {
      const response = await api.contactAPI.getNewsletterSubscribers();
      return response.data;
    } catch (error) {
      console.warn('Get newsletter subscribers API failed:', error);
      return { success: true, data: [] };
    }
  }

  // ============ HERO SLIDES ============
  async getHeroSlides() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.heroSlides || [] };
    }

    try {
      const response = await api.heroSlidesAPI.getActiveSlides();
      return response.data;
    } catch (error) {
      console.warn('Get hero slides API failed:', error);
      return { success: true, data: localData.heroSlides || [] };
    }
  }

  async getAllHeroSlides() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.heroSlides || [] };
    }

    try {
      const response = await api.heroSlidesAPI.getAllSlides();
      return response.data;
    } catch (error) {
      console.warn('Get all hero slides API failed:', error);
      return { success: true, data: localData.heroSlides || [] };
    }
  }

  async createHeroSlide(slideData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newSlide = { id: Date.now(), ...slideData, created_at: new Date().toISOString() };
      if (!localData.heroSlides) localData.heroSlides = [];
      localData.heroSlides.push(newSlide);
      return { success: true, data: newSlide };
    }

    try {
      const response = await api.heroSlidesAPI.createSlide(slideData);
      return response.data;
    } catch (error) {
      console.warn('Create hero slide API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to create slide' };
    }
  }

  async updateHeroSlide(id, slideData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.heroSlides || []).findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        localData.heroSlides[index] = { ...localData.heroSlides[index], ...slideData };
        return { success: true, data: localData.heroSlides[index] };
      }
      return { success: false, message: 'Slide not found' };
    }

    try {
      const response = await api.heroSlidesAPI.updateSlide(id, slideData);
      return response.data;
    } catch (error) {
      console.warn('Update hero slide API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update slide' };
    }
  }

  async deleteHeroSlide(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.heroSlides || []).findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        localData.heroSlides.splice(index, 1);
        return { success: true };
      }
      return { success: false, message: 'Slide not found' };
    }

    try {
      const response = await api.heroSlidesAPI.deleteSlide(id);
      return response.data;
    } catch (error) {
      console.warn('Delete hero slide API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete slide' };
    }
  }

  async toggleHeroSlideStatus(id) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const index = (localData.heroSlides || []).findIndex(s => s.id === parseInt(id));
      if (index !== -1) {
        localData.heroSlides[index].is_active = localData.heroSlides[index].is_active ? 0 : 1;
        return { success: true };
      }
      return { success: false, message: 'Slide not found' };
    }

    try {
      const response = await api.heroSlidesAPI.toggleSlideStatus(id);
      return response.data;
    } catch (error) {
      console.warn('Toggle hero slide status API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to toggle slide status' };
    }
  }

  async reorderHeroSlides(orderData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'Reordered locally' };
    }

    try {
      const response = await api.heroSlidesAPI.reorderSlides(orderData);
      return response.data;
    } catch (error) {
      console.warn('Reorder hero slides API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to reorder slides' };
    }
  }

  // ============ POLICIES ============
  async getPolicies() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: localData.policies || {} };
    }

    try {
      const response = await api.policiesAPI.getAllPolicies();
      return response.data;
    } catch (error) {
      console.warn('Get policies API failed:', error);
      return { success: true, data: localData.policies || {} };
    }
  }

  async getPolicyByType(type) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const policy = (localData.policies || {})[type];
      return { success: true, data: policy || null };
    }

    try {
      const response = await api.policiesAPI.getPolicyByType(type);
      return response.data;
    } catch (error) {
      console.warn('Get policy by type API failed:', error);
      const policy = (localData.policies || {})[type];
      return { success: true, data: policy || null };
    }
  }

  async updatePolicy(type, policyData) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      if (!localData.policies) localData.policies = {};
      localData.policies[type] = policyData;
      return { success: true, message: 'Policy updated locally' };
    }

    try {
      const response = await api.policiesAPI.updatePolicy(type, policyData);
      return response.data;
    } catch (error) {
      console.warn('Update policy API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to update policy' };
    }
  }

  async deletePolicy(type) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      if (localData.policies) {
        delete localData.policies[type];
      }
      return { success: true, message: 'Policy deleted locally' };
    }

    try {
      const response = await api.policiesAPI.deletePolicy(type);
      return response.data;
    } catch (error) {
      console.warn('Delete policy API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to delete policy' };
    }
  }

  // ============ ADMIN DASHBOARD ============
  async getDashboardStats() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: { totalUsers: 0, totalOrders: 0, totalRevenue: 0 } };
    }

    try {
      const response = await api.adminDashboardAPI.getStats();
      return response.data;
    } catch (error) {
      console.warn('Get dashboard stats API failed:', error);
      return { success: true, data: {} };
    }
  }

  async getSystemHealth() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: { status: 'healthy', uptime: 0 } };
    }

    try {
      const response = await api.adminDashboardAPI.getHealth();
      return response.data;
    } catch (error) {
      console.warn('Get system health API failed:', error);
      return { success: true, data: { status: 'unknown' } };
    }
  }

  // ============ HEALTH CHECK ============
  async checkHealth() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, data: { status: 'ok', message: 'Local fallback mode' } };
    }

    try {
      const response = await api.healthAPI.checkHealth();
      return response.data;
    } catch (error) {
      console.warn('Health check API failed:', error);
      return { success: false, message: 'API unavailable' };
    }
  }

  // ============ ANALYTICS ============
  async trackEvent(eventData) {
    try {
      await this.ensureInitialized();
      if (!this.useLocalFallback) {
        const response = await api.analyticsAPI?.trackEvent?.(eventData);
        return response?.data;
      }
    } catch (error) {
      console.debug('Analytics tracking error:', error);
    }
    return { success: true };
  }

  async trackPageView(page, metadata = {}) {
    try {
      await this.ensureInitialized();
      if (!this.useLocalFallback) {
        const response = await api.analyticsAPI?.trackPageView?.(page, metadata);
        return response?.data;
      }
    } catch (error) {
      console.debug('Page view tracking error:', error);
    }
    return { success: true };
  }
}

const apiWrapper = new APIWrapper();
apiWrapper.init().catch(console.error);
export default apiWrapper;