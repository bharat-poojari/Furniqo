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

  async getFeaturedProducts(limit = 8) {
    const getLocalFeatured = () => {
      const featured = localData.products
        .filter(p => p.featured)
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
      return await api.productAPI.getFeatured(limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalFeatured();
    }
  }

  async getTrendingProducts(limit = 8) {
    const getLocalTrending = () => {
      const trending = localData.products
        .filter(p => p.trending)
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
      return await api.productAPI.getTrending(limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalTrending();
    }
  }

  async getBestSellers(limit = 8) {
    const getLocalBestSellers = () => {
      const bestSellers = localData.products
        .filter(p => p.bestSeller)
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
      return await api.productAPI.getBestSellers(limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalBestSellers();
    }
  }

  async getNewArrivals(limit = 8) {
    const getLocalNewArrivals = () => {
      const newArrivals = localData.products
        .filter(p => p.newArrival)
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
      return await api.productAPI.getNewArrivals(limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalNewArrivals();
    }
  }

  async getOnSaleProducts(limit = 12) {
    const getLocalOnSale = () => {
      const onSale = localData.products
        .filter(p => p.onSale && p.originalPrice > p.price)
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
      return await api.productAPI.getOnSale(limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalOnSale();
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
      return await api.productAPI.getRelated(productId, limit);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return getLocalRelated();
    }
  }

  async searchProducts(query, params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return this.getProducts({ ...params, search: query });
    }

    try {
      return await api.productAPI.search(query, params);
    } catch (error) {
      console.warn('API call failed, using local fallback:', error);
      return this.getProducts({ ...params, search: query });
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
        
        localStorage.setItem('furniqo_token', mockToken);
        localStorage.setItem('furniqo_refresh_token', 'local_refresh_' + Date.now());
        localStorage.setItem('furniqo_user', JSON.stringify(mockUser));
        
        return {
          data: {
            success: true,
            data: {
              user: mockUser,
              token: mockToken,
              refreshToken: 'local_refresh_' + Date.now(),
            },
            message: 'Login successful (offline mode)',
          }
        };
      }
      throw new Error('Invalid credentials');
    }

    const response = await api.authAPI.login(credentials);
    if (response.data.success) {
      const { token, refreshToken, user } = response.data.data;
      localStorage.setItem('furniqo_token', token);
      localStorage.setItem('furniqo_refresh_token', refreshToken);
      localStorage.setItem('furniqo_user', JSON.stringify(user));
    }
    return response;
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
      
      localStorage.setItem('furniqo_token', mockToken);
      localStorage.setItem('furniqo_refresh_token', 'local_refresh_' + Date.now());
      localStorage.setItem('furniqo_user', JSON.stringify(mockUser));
      
      return {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: mockToken,
            refreshToken: 'local_refresh_' + Date.now(),
          },
          message: 'Account created (offline mode)',
        }
      };
    }

    const response = await api.authAPI.signup(userData);
    if (response.data.success) {
      const { token, refreshToken, user } = response.data.data;
      localStorage.setItem('furniqo_token', token);
      localStorage.setItem('furniqo_refresh_token', refreshToken);
      localStorage.setItem('furniqo_user', JSON.stringify(user));
    }
    return response;
  }

  async getProfile() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const user = JSON.parse(localStorage.getItem('furniqo_user') || 'null');
      return { data: { success: true, data: user } };
    }

    try {
      return await api.authAPI.getProfile();
    } catch (error) {
      const user = JSON.parse(localStorage.getItem('furniqo_user') || 'null');
      return { data: { success: true, data: user } };
    }
  }

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

  async getWishlistItems() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      try {
        return JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      } catch {
        return [];
      }
    }

    try {
      const response = await api.wishlistAPI.getWishlist();
      return response.data.data || [];
    } catch (error) {
      try {
        return JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      } catch {
        return [];
      }
    }
  }

  saveWishlistItems(items) {
    localStorage.setItem('furniqo_wishlist', JSON.stringify(items));
  }

  async validateCoupon(code, orderTotal) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const coupon = localData.coupons?.find(
        c => c.code === code.toUpperCase() && c.isActive
      );

      if (!coupon) {
        return { data: { success: false, message: 'Invalid coupon code' } };
      }

      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      if (now < validFrom || now > validUntil) {
        return { data: { success: false, message: 'Coupon has expired' } };
      }

      if (orderTotal < coupon.minPurchase) {
        return { 
          data: { 
            success: false, 
            message: `Minimum purchase of $${coupon.minPurchase} required` 
          } 
        };
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { data: { success: false, message: 'Coupon usage limit reached' } };
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (orderTotal * coupon.discount) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else if (coupon.type === 'fixed') {
        discount = coupon.discount;
      } else if (coupon.type === 'freeShipping') {
        discount = -1;
      }

      return {
        data: {
          success: true,
          data: {
            ...coupon,
            calculatedDiscount: discount,
          },
          message: 'Coupon applied successfully',
        }
      };
    }

    try {
      return await api.couponAPI.validateCoupon(code, orderTotal);
    } catch (error) {
      return { data: { success: false, message: 'Coupon validation failed' } };
    }
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
        data: {
          success: true,
          data: order,
          message: 'Order created successfully (offline mode)',
        }
      };
    }

    try {
      return await api.orderAPI.createOrder(orderData);
    } catch (error) {
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
        data: {
          success: true,
          data: order,
          message: 'Order created successfully (offline mode)',
        }
      };
    }
  }

  async getOrders() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { data: { success: true, data: orders } };
    }

    try {
      return await api.orderAPI.getOrders();
    } catch (error) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { data: { success: true, data: orders } };
    }
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `FNQ-${timestamp}-${random}`;
  }

  async getCategories() {
    const getLocalCategories = () => {
      return { data: { success: true, data: localData.categories || [] } };
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
      return response;
    } catch (error) {
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
      return { data: { success: true, data: posts } };
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
      return await api.contentAPI.getBlogPosts(params);
    } catch (error) {
      return getLocalBlogPosts();
    }
  }

  async getBlogPost(slug) {
    const getLocalBlogPost = () => {
      const post = (localData.blogPosts || []).find(p => p.slug === slug);
      return { data: { success: true, data: post || null } };
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
      return await api.contentAPI.getBlogPost(slug);
    } catch (error) {
      return getLocalBlogPost();
    }
  }

  async getFAQs() {
    const getLocalFAQs = () => {
      return { data: { success: true, data: localData.faqs || [] } };
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
      return await api.contentAPI.getFAQs();
    } catch (error) {
      return getLocalFAQs();
    }
  }

  async getPolicies() {
    const getLocalPolicies = () => {
      return { data: { success: true, data: localData.policies || [] } };
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
      return await api.contentAPI.getPolicies();
    } catch (error) {
      return getLocalPolicies();
    }
  }

  async getTestimonials() {
    const getLocalTestimonials = () => {
      return { data: { success: true, data: localData.testimonials || [] } };
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
      return await api.contentAPI.getTestimonials();
    } catch (error) {
      return getLocalTestimonials();
    }
  }

  async getRooms() {
    const getLocalRooms = () => {
      return { data: { success: true, data: localData.rooms || [] } };
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
      return await api.contentAPI.getRooms();
    } catch (error) {
      return getLocalRooms();
    }
  }

  async getHeroSlides() {
    return { data: { success: true, data: localData.heroSlides || [] } };
  }

  async trackEvent(eventData) {
    try {
      await this.ensureInitialized();
      if (!this.useLocalFallback) {
        return api.analyticsAPI.trackEvent(eventData);
      }
    } catch (error) {
      console.debug('Analytics tracking error:', error);
    }
    return { data: { success: true } };
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
    return { data: { success: true } };
  }
}

const apiWrapper = new APIWrapper();
apiWrapper.init().catch(console.error);
export default apiWrapper;