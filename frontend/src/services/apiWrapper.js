import * as api from './api';
import * as localData from '../data/data';
import { toast } from 'react-hot-toast';

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

  // ============ PRODUCT METHODS ============

  async getProducts(params = {}) {
    const getLocalProducts = () => {
      let filteredProducts = [...localData.products];

      if (params.category) {
        filteredProducts = filteredProducts.filter(
          p => p.category === params.category || p.subcategory === params.category
        );
      }
      if (params.material) {
        filteredProducts = filteredProducts.filter(p => 
          p.material && p.material.toLowerCase().includes(params.material.toLowerCase())
        );
      }
      if (params.color) {
        filteredProducts = filteredProducts.filter(p => 
          p.color && p.color.toLowerCase().includes(params.color.toLowerCase())
        );
      }
      if (params.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice);
      }
      if (params.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice);
      }
      if (params.style) {
        filteredProducts = filteredProducts.filter(p => p.style === params.style);
      }
      if (params.inStock !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.inStock === params.inStock);
      }
      if (params.search) {
        const query = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.tags && p.tags.some(tag => tag && tag.includes(query)))
        );
      }
      if (params.trending === true || params.trending === 'true') {
        filteredProducts = filteredProducts.filter(p => p.trending === true || p.trending === 1);
      }
      if (params.featured === true || params.featured === 'true') {
        filteredProducts = filteredProducts.filter(p => p.featured === true || p.featured === 1);
      }
      if (params.bestSeller === true || params.bestSeller === 'true') {
        filteredProducts = filteredProducts.filter(p => p.bestSeller === true || p.bestSeller === 1);
      }
      if (params.newArrival === true || params.newArrival === 'true') {
        filteredProducts = filteredProducts.filter(p => p.newArrival === true || p.newArrival === 1);
      }
      if (params.onSale === true || params.onSale === 'true') {
        filteredProducts = filteredProducts.filter(p => p.onSale === true && p.originalPrice > p.price);
      }

      const sort = params.sort || 'newest';
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popular':
          filteredProducts.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
          break;
        case 'discount':
          filteredProducts.sort((a, b) => {
            const discA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
            const discB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
            return discB - discA;
          });
          break;
        case 'newest':
        default:
          filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
      }

      const page = params.page || 1;
      const limit = params.limit || 12;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProducts = filteredProducts.slice(start, end);

      return { 
        data: { 
          success: true, 
          data: paginatedProducts,
          pagination: {
            page,
            limit,
            total: filteredProducts.length,
            pages: Math.ceil(filteredProducts.length / limit),
          }
        } 
      };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalProducts);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalProducts();
    }

    try {
      return await api.productAPI.getAll(params);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalProducts();
    }
  }

  async getProduct(slug) {
    const getLocalProduct = () => {
      const product = localData.products.find(p => p.slug === slug);
      if (!product) {
        return { data: { success: false, message: 'Product not found' } };
      }
      return { data: { success: true, data: product } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalProduct);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalProduct();
    }

    try {
      return await api.productAPI.getOne(slug);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalProduct();
    }
  }

  async getRelatedProducts(productId, limit = 4) {
    const getLocalRelated = () => {
      const currentProduct = localData.products.find(p => p._id === productId);
      if (!currentProduct) {
        return { data: { success: true, data: [] } };
      }

      const related = localData.products
        .filter(p =>
          p._id !== productId &&
          (p.category === currentProduct.category ||
           p.style === currentProduct.style)
        )
        .slice(0, limit);

      return { data: { success: true, data: related } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalRelated);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalRelated();
    }

    try {
      const response = await api.productAPI.getRelated(productId, limit);
      return response;
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalRelated();
    }
  }

  async getFeaturedProducts(limit = 8) {
    const getLocalFeatured = () => {
      const featured = localData.products
        .filter(p => p.featured === true || p.featured === 1)
        .slice(0, limit);
      return { data: { success: true, data: featured } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalFeatured);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalFeatured();
    }

    try {
      const response = await api.productAPI.getFeatured(limit);
      if (response?.data && response.data.success) {
        const products = response.data.products || response.data.data || [];
        return { data: { success: true, data: products.slice(0, limit) } };
      }
      return { data: { success: true, data: [] } };
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalFeatured();
    }
  }

  async getTrendingProducts(limit = 8) {
    const getLocalTrending = () => {
      const trending = localData.products
        .filter(p => p.trending === true || p.trending === 1)
        .slice(0, limit);
      return { data: { success: true, data: trending } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalTrending);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalTrending();
    }

    try {
      const response = await api.productAPI.getTrending(limit);
      if (response?.data && response.data.success) {
        const products = response.data.products || response.data.data || [];
        return { data: { success: true, data: products.slice(0, limit) } };
      }
      return { data: { success: true, data: [] } };
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalTrending();
    }
  }

  async getBestSellers(limit = 8) {
    const getLocalBestSellers = () => {
      const bestSellers = localData.products
        .filter(p => p.bestSeller === true || p.bestSeller === 1)
        .slice(0, limit);
      return { data: { success: true, data: bestSellers } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalBestSellers);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalBestSellers();
    }

    try {
      const response = await api.productAPI.getBestSellers(limit);
      if (response?.data && response.data.success) {
        const products = response.data.products || response.data.data || [];
        return { data: { success: true, data: products.slice(0, limit) } };
      }
      return { data: { success: true, data: [] } };
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalBestSellers();
    }
  }

  async getNewArrivals(limit = 8) {
    const getLocalNewArrivals = () => {
      const newArrivals = localData.products
        .filter(p => p.newArrival === true || p.newArrival === 1)
        .slice(0, limit);
      return { data: { success: true, data: newArrivals } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalNewArrivals);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalNewArrivals();
    }

    try {
      const response = await api.productAPI.getNewArrivals(limit);
      if (response?.data && response.data.success) {
        const products = response.data.products || response.data.data || [];
        return { data: { success: true, data: products.slice(0, limit) } };
      }
      return { data: { success: true, data: [] } };
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalNewArrivals();
    }
  }

  async getOnSaleProducts(limit = 12) {
    const getLocalOnSale = () => {
      const onSale = localData.products
        .filter(p => (p.onSale === true || p.onSale === 1) && p.originalPrice > p.price)
        .slice(0, limit);
      return { data: { success: true, data: onSale } };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalOnSale);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalOnSale();
    }

    try {
      const response = await api.productAPI.getOnSale(limit);
      if (response?.data && response.data.success) {
        const products = response.data.products || response.data.data || [];
        return { data: { success: true, data: products.slice(0, limit) } };
      }
      return { data: { success: true, data: [] } };
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalOnSale();
    }
  }

  async searchProducts(query, params = {}) {
    const searchParams = { ...params, search: query };
    const immediateLocal = this.getLocalDataIfNeeded(() => this.getProducts(searchParams));
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return this.getProducts(searchParams);
    }

    try {
      return await api.productAPI.search(query, params);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return this.getProducts(searchParams);
    }
  }

  async getProductsByCategory(categoryId, limit = 10) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const filteredProducts = localData.products
        .filter(p => p.categoryId === categoryId || p.category?._id === categoryId)
        .slice(0, limit);
      return { data: { success: true, data: filteredProducts } };
    }

    try {
      return await api.productAPI.getByCategory(categoryId, { limit });
    } catch (error) {
      console.warn('Get products by category API failed, using local fallback:', error);
      const filteredProducts = localData.products
        .filter(p => p.categoryId === categoryId || p.category?._id === categoryId)
        .slice(0, limit);
      return { data: { success: true, data: filteredProducts } };
    }
  }

  async getProductsByCategoryName(categoryName, limit = 10) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const filteredProducts = localData.products
        .filter(p => p.category === categoryName || p.categoryName === categoryName)
        .slice(0, limit);
      return { data: { success: true, data: filteredProducts } };
    }

    try {
      const response = await api.productAPI.getByCategory(categoryName, { limit });
      return response;
    } catch (error) {
      console.warn('Get products by category name API failed, using local fallback:', error);
      const filteredProducts = localData.products
        .filter(p => p.category === categoryName || p.categoryName === categoryName)
        .slice(0, limit);
      return { data: { success: true, data: filteredProducts } };
    }
  }

  // ============ AUTH METHODS ============

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
          data: {
            user: mockUser,
            accessToken: mockToken,
            refreshToken: mockRefresh,
          },
          message: 'Login successful (offline mode)',
        };
      }

      return { success: false, message: 'Invalid credentials' };
    }

    try {
      const response = await api.authAPI.login(credentials);
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

  async signup(userData) {
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
        data: {
          user: mockUser,
          accessToken: mockToken,
          refreshToken: mockRefresh,
        },
        message: 'Account created (offline mode)',
      };
    }

    try {
      const response = await api.authAPI.signup(userData);
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
      console.error('Signup API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Signup failed' };
    }
  }

  async register(userData) {
    return this.signup(userData);
  }

  async refreshToken(refreshToken) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const accessToken = localStorage.getItem('furniqo_token');
      return {
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      };
    }

    try {
      const response = await api.authAPI.refreshToken(refreshToken);
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
      const response = await api.authAPI.logout(refreshToken);
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
      const response = await api.authAPI.getProfile();
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
      const response = await api.authAPI.updateProfile(profileData);
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
      const response = await api.authAPI.changePassword({ currentPassword, newPassword });
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
      const response = await api.authAPI.forgotPassword(email);
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
      const response = await api.authAPI.resetPassword(token, newPassword);
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
      const response = await api.authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      console.error('Verify email API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Verification failed' };
    }
  }

  async sendOTP(email) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { success: true, message: 'OTP sent (offline mode)', otp: '123456' };
    }

    try {
      const response = await api.authAPI.sendOTP(email);
      return response.data;
    } catch (error) {
      console.error('Send OTP API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to send OTP' };
    }
  }

  // ============ CART METHODS ============

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
      const subtotal = items.reduce((s, it) => s + ((it.price || it.unitPrice || 0) * (it.quantity || 1)), 0);
      const itemCount = items.length;
      const totalQuantity = items.reduce((s, it) => s + (it.quantity || 1), 0);
      return { success: true, data: { items, subtotal, itemCount, totalQuantity } };
    }

    try {
      const response = await api.cartAPI.getCart();
      return response.data;
    } catch (error) {
      console.error('Get cart API error:', error);
      const items = this.getCartItems();
      const subtotal = items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
      return { 
        success: true, 
        data: { items, subtotal, itemCount: items.length, totalQuantity: items.reduce((s, it) => s + (it.quantity || 1), 0) },
        message: 'Using local cart data'
      };
    }
  }

  async addToCart({ productId, quantity = 1, variantId = null }) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = this.getCartItems();
      const existing = items.find(i => i.productId === productId && i.variantId === variantId);
      
      if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
      } else {
        const product = localData.products.find(p => p._id === productId) || {};
        const newItem = {
          _id: 'local_cart_item_' + Date.now() + Math.floor(Math.random() * 1000),
          productId,
          quantity,
          variantId,
          name: product.name || '',
          price: product.price || 0,
          image: product.images?.[0] || '',
        };
        items.push(newItem);
      }
      this.saveCartItems(items);
      return { success: true, data: { items, itemCount: items.length } };
    }

    try {
      const response = await api.cartAPI.addItem(productId, quantity, variantId);
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
      const it = items.find(i => i._id === itemId);
      if (it) {
        it.quantity = quantity;
        this.saveCartItems(items);
        const subtotal = items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 1)), 0);
        return { success: true, data: { items, subtotal } };
      }
      return { success: false, message: 'Item not found' };
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
      return { success: true, message: 'Item removed from cart', data: { items } };
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
      return { success: true, message: 'Cart cleared locally' };
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
      return { success: true, message: 'Cart synced locally', data: { items: items || [] } };
    }

    try {
      const response = await api.cartAPI.syncCart(items);
      return response.data;
    } catch (error) {
      console.error('Sync cart API error:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to sync cart' };
    }
  }

  // ============ WISHLIST METHODS ============

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

  async getWishlistItems() {
    const result = await this.getWishlist();
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  }

  async addToWishlist(productId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      if (!items.find(i => (i._id || i) === productId)) {
        items.push({ _id: productId, addedAt: new Date().toISOString() });
        this.saveWishlistItems(items);
      }
      return { success: true, data: items };
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
      return { success: true, data: items };
    }
  }

  async removeFromWishlist(productId) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]').filter(i => (i._id || i) !== productId);
      this.saveWishlistItems(items);
      return { success: true, data: items };
    }

    try {
      const response = await api.wishlistAPI.removeItem(productId);
      return response.data;
    } catch (error) {
      console.warn('Remove from wishlist API failed, using local fallback:', error);
      const items = JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]').filter(i => (i._id || i) !== productId);
      this.saveWishlistItems(items);
      return { success: true, data: items };
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
      const response = await api.wishlistAPI.isWishlisted(productId);
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
          existing.quantity = (existing.quantity || 1) + 1;
        } else {
          const product = localData.products.find(p => p._id === productId) || {};
          cart.push({ 
            _id: 'local_cart_item_' + Date.now() + Math.floor(Math.random() * 1000), 
            productId, 
            quantity: 1, 
            name: product.name || '',
            price: product.price || 0 
          });
        }
      });
      this.saveCartItems(cart);
      return { success: true, message: 'Moved to cart locally', data: { moved: toMove.length } };
    }

    try {
      const response = await api.wishlistAPI.moveToCart(productIds);
      return response.data;
    } catch (error) {
      console.warn('Move wishlist to cart API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to move items' };
    }
  }

  // ============ ORDER METHODS ============

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
        updatedAt: new Date().toISOString(),
      };

      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('furniqo_orders', JSON.stringify(orders));
      localStorage.removeItem('furniqo_cart');

      return {
        success: true,
        data: order,
        message: 'Order created successfully (offline mode)',
      };
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
        updatedAt: new Date().toISOString(),
      };
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('furniqo_orders', JSON.stringify(orders));
      localStorage.removeItem('furniqo_cart');
      return {
        success: true,
        data: order,
        message: 'Order created successfully (offline mode)',
      };
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
      const order = orders.find(o => o._id === id || o.orderNumber === id) || null;
      return { success: true, data: order };
    }

    try {
      const response = await api.orderAPI.getOrder(id);
      return response.data;
    } catch (error) {
      console.warn('Get order API failed, using local fallback:', error);
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      const order = orders.find(o => o._id === id || o.orderNumber === id) || null;
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

  // ============ COUPON METHODS ============

  async validateCoupon(code, orderTotal) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const coupon = localData.coupons?.find(
        c => c.code === code.toUpperCase() && c.isActive
      );

      if (!coupon) {
        return { success: false, message: 'Invalid coupon code' };
      }

      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      if (now < validFrom || now > validUntil) {
        return { success: false, message: 'Coupon has expired' };
      }

      if (orderTotal < coupon.minPurchase) {
        return { 
          success: false, 
          message: `Minimum purchase of $${coupon.minPurchase} required` 
        };
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { success: false, message: 'Coupon usage limit reached' };
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (orderTotal * coupon.discount) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else if (coupon.type === 'fixed') {
        discount = coupon.discount;
      }

      return {
        success: true,
        data: {
          ...coupon,
          calculatedDiscount: discount,
        },
        message: 'Coupon applied successfully',
      };
    }

    try {
      const response = await api.couponAPI.validateCoupon(code, orderTotal);
      return response.data;
    } catch (error) {
      console.warn('Coupon validation API failed:', error);
      return { success: false, message: error?.response?.data?.message || error.message || 'Failed to validate coupon' };
    }
  }

  // ============ CONTENT METHODS ============

  async getCategories() {
    const getLocalCategories = () => {
      return { success: true, data: localData.categories || [] };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalCategories);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalCategories();
    }

    try {
      const response = await api.contentAPI.getCategories();
      return response.data;
    } catch (error) {
      console.warn('Get categories API failed, using local fallback:', error);
      return getLocalCategories();
    }
  }

  async getBlogPosts(params = {}) {
    const getLocalBlogPosts = () => {
      let posts = [...(localData.blogPosts || [])];
      if (params.featured) {
        posts = posts.filter(p => p.featured);
      }
      if (params.limit) {
        posts = posts.slice(0, params.limit);
      }
      return { success: true, data: posts };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalBlogPosts);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalBlogPosts();
    }

    try {
      const response = await api.contentAPI.getBlogPosts(params);
      return response.data;
    } catch (error) {
      console.warn('Get blog posts API failed, using local fallback:', error);
      return getLocalBlogPosts();
    }
  }

  async getBlogPost(slug) {
    const getLocalBlogPost = () => {
      const post = (localData.blogPosts || []).find(p => p.slug === slug);
      return { success: true, data: post || null };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalBlogPost);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalBlogPost();
    }

    try {
      const response = await api.contentAPI.getBlogPost(slug);
      return response.data;
    } catch (error) {
      console.warn('Get blog post API failed, using local fallback:', error);
      return getLocalBlogPost();
    }
  }

  async getFAQs() {
    const getLocalFAQs = () => {
      return { success: true, data: localData.faqs || [] };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalFAQs);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalFAQs();
    }

    try {
      const response = await api.contentAPI.getFAQs();
      return response.data;
    } catch (error) {
      console.warn('Get FAQs API failed, using local fallback:', error);
      return getLocalFAQs();
    }
  }

  async getPolicies() {
    const getLocalPolicies = () => {
      if (localData.policies && Object.keys(localData.policies).length > 0) {
        return { success: true, data: localData.policies };
      }
      return { success: true, data: {} };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalPolicies);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalPolicies();
    }

    try {
      const response = await api.contentAPI.getPolicies();
      return response.data;
    } catch (error) {
      console.warn('Get policies API failed, using local fallback:', error);
      return getLocalPolicies();
    }
  }

  async getTestimonials() {
    const getLocalTestimonials = () => {
      return { success: true, data: localData.testimonials || [] };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalTestimonials);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalTestimonials();
    }

    try {
      const response = await api.contentAPI.getTestimonials();
      return response.data;
    } catch (error) {
      console.warn('Get testimonials API failed, using local fallback:', error);
      return getLocalTestimonials();
    }
  }

  async getRooms() {
    const getLocalRooms = () => {
      return { success: true, data: localData.rooms || [] };
    };

    const immediateLocal = this.getLocalDataIfNeeded(getLocalRooms);
    if (immediateLocal) {
      return immediateLocal;
    }

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalRooms();
    }

    try {
      const response = await api.contentAPI.getRooms();
      return response.data;
    } catch (error) {
      console.warn('Get rooms API failed, using local fallback:', error);
      return getLocalRooms();
    }
  }

  async getHeroSlides() {
    const getLocalHeroSlides = () => {
      return { success: true, data: localData.heroSlides || [] };
    };

    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return getLocalHeroSlides();
    }

    try {
      const response = await api.contentAPI.getHeroSlides?.();
      if (response?.data?.success && response.data.data?.length > 0) {
        return response.data;
      }
      return getLocalHeroSlides();
    } catch (error) {
      console.warn('Get hero slides API failed, using local fallback:', error);
      return getLocalHeroSlides();
    }
  }

  // ============ ANALYTICS METHODS ============

  async trackEvent(eventData) {
    try {
      await this.ensureInitialized();
      if (!this.useLocalFallback) {
        return api.analyticsAPI.trackEvent(eventData);
      }
    } catch (error) {
      console.debug('Analytics tracking error:', error);
    }
    return { success: true };
  }

  async trackPageView(page) {
    try {
      await this.ensureInitialized();
      if (!this.useLocalFallback) {
        return api.analyticsAPI.trackPageView(page);
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