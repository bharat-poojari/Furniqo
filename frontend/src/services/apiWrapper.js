import * as api from './api';
import * as localData from '../data/data';
import { toast } from 'react-hot-toast';

class APIWrapper {
  constructor() {
    this.useLocalFallback = false;
    this.backendChecked = false;
    this.initializationPromise = null;
  }

  async init() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.checkBackend();
    return this.initializationPromise;
  }

  async checkBackend() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/health`,
        { 
          method: 'GET',
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      this.useLocalFallback = !response.ok;
    } catch (error) {
      console.info('Backend unavailable, using local data fallback');
      this.useLocalFallback = true;
    } finally {
      this.backendChecked = true;
    }

    if (this.useLocalFallback) {
      toast('Running in offline mode', { icon: '📦', duration: 3000 });
    }

    return !this.useLocalFallback;
  }

  ensureInitialized() {
    if (!this.backendChecked) {
      return this.init();
    }
    return Promise.resolve(!this.useLocalFallback);
  }

  // PRODUCTS
  async getProducts(params = {}) {
    await this.ensureInitialized();
    
    if (this.useLocalFallback) {
      let filteredProducts = [...localData.products];

      // Apply filters
      if (params.category) {
        filteredProducts = filteredProducts.filter(
          p => p.category === params.category || p.subcategory === params.category
        );
      }
      if (params.material) {
        filteredProducts = filteredProducts.filter(p => 
          p.material.toLowerCase().includes(params.material.toLowerCase())
        );
      }
      if (params.color) {
        filteredProducts = filteredProducts.filter(p => 
          p.color.toLowerCase().includes(params.color.toLowerCase())
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
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.includes(query))
        );
      }

      // Apply sorting
      const sort = params.sort || 'newest';
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
          filteredProducts.sort((a, b) => b.numReviews - a.numReviews);
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
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      // Apply pagination
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
    }

    return api.productAPI.getAll(params);
  }

  async getProduct(slug) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const product = localData.products.find(p => p.slug === slug);
      if (!product) {
        return { data: { success: false, message: 'Product not found' } };
      }
      return { data: { success: true, data: product } };
    }

    return api.productAPI.getOne(slug);
  }

  async getFeaturedProducts(limit = 8) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const featured = localData.products
        .filter(p => p.featured)
        .slice(0, limit);
      return { data: { success: true, data: featured } };
    }

    return api.productAPI.getFeatured(limit);
  }

  async getTrendingProducts(limit = 8) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const trending = localData.products
        .filter(p => p.trending)
        .slice(0, limit);
      return { data: { success: true, data: trending } };
    }

    return api.productAPI.getTrending(limit);
  }

  async getBestSellers(limit = 8) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const bestSellers = localData.products
        .filter(p => p.bestSeller)
        .slice(0, limit);
      return { data: { success: true, data: bestSellers } };
    }

    return api.productAPI.getBestSellers(limit);
  }

  async getNewArrivals(limit = 8) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const newArrivals = localData.products
        .filter(p => p.newArrival)
        .slice(0, limit);
      return { data: { success: true, data: newArrivals } };
    }

    return api.productAPI.getNewArrivals(limit);
  }

  async getOnSaleProducts(limit = 12) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const onSale = localData.products
        .filter(p => p.onSale && p.originalPrice > p.price)
        .slice(0, limit);
      return { data: { success: true, data: onSale } };
    }

    return api.productAPI.getOnSale(limit);
  }

  async getRelatedProducts(productId, limit = 4) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
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
    }

    return api.productAPI.getRelated(productId, limit);
  }

  async searchProducts(query, params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return this.getProducts({ ...params, search: query });
    }

    return api.productAPI.search(query, params);
  }

  // AUTH
  async login(credentials) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      // Simulate login with local storage
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

    return api.authAPI.getProfile();
  }

  // CART (Local)
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

  // WISHLIST (Local)
  async getWishlistItems() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      try {
        return JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
      } catch {
        return [];
      }
    }

    const response = await api.wishlistAPI.getWishlist();
    return response.data.data || [];
  }

  saveWishlistItems(items) {
    localStorage.setItem('furniqo_wishlist', JSON.stringify(items));
  }

  // COUPONS
  async validateCoupon(code, orderTotal) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const coupon = localData.coupons.find(
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
        discount = -1; // Flag for free shipping
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

    return api.couponAPI.validateCoupon(code, orderTotal);
  }

  // ORDERS
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

      // Save to local storage
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      orders.unshift(order);
      localStorage.setItem('furniqo_orders', JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem('furniqo_cart');

      return {
        data: {
          success: true,
          data: order,
          message: 'Order created successfully (offline mode)',
        }
      };
    }

    return api.orderAPI.createOrder(orderData);
  }

  async getOrders() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
      return { data: { success: true, data: orders } };
    }

    return api.orderAPI.getOrders();
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `FNQ-${timestamp}-${random}`;
  }

  // CONTENT
  async getCategories() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { data: { success: true, data: localData.categories } };
    }

    try {
      const response = await api.contentAPI.getFAQs();
      return response;
    } catch {
      return { data: { success: true, data: localData.categories } };
    }
  }

  async getBlogPosts(params = {}) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      let posts = [...localData.blogPosts];
      if (params.featured) {
        posts = posts.filter(p => p.featured);
      }
      if (params.limit) {
        posts = posts.slice(0, params.limit);
      }
      return { data: { success: true, data: posts } };
    }

    return api.contentAPI.getBlogPosts(params);
  }

  async getBlogPost(slug) {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      const post = localData.blogPosts.find(p => p.slug === slug);
      return { data: { success: true, data: post || null } };
    }

    return api.contentAPI.getBlogPost(slug);
  }

  async getFAQs() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { data: { success: true, data: localData.faqs } };
    }

    return api.contentAPI.getFAQs();
  }

  async getPolicies() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { data: { success: true, data: localData.policies } };
    }

    return api.contentAPI.getPolicies();
  }

  async getTestimonials() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { data: { success: true, data: localData.testimonials } };
    }

    return api.contentAPI.getTestimonials();
  }

  async getRooms() {
    await this.ensureInitialized();

    if (this.useLocalFallback) {
      return { data: { success: true, data: localData.rooms } };
    }

    return api.contentAPI.getRooms();
  }

  async getHeroSlides() {
    return { data: { success: true, data: localData.heroSlides } };
  }

  // ANALYTICS (Local tracking)
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
export default apiWrapper;