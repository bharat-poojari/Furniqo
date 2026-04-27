import * as localData from '../data/data';

class APIWrapper {
  constructor() {
    // START WITH LOCAL DATA IMMEDIATELY
    this.useLocalFallback = true;
    this.backendChecked = false;
    this.backendAvailable = false;
  }

  // Non-blocking background check
  async init() {
    // Don't wait - start check in background
    this.checkBackendInBackground();
  }

  async checkBackendInBackground() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      this.backendAvailable = response.ok;
      this.useLocalFallback = !response.ok;
    } catch (error) {
      this.backendAvailable = false;
      this.useLocalFallback = true;
    } finally {
      this.backendChecked = true;
    }
  }

  // ============================================
  // PRODUCTS - Always return local data instantly
  // ============================================
  
  getProducts(params = {}) {
    let filteredProducts = [...localData.products];

    if (params.category) {
      filteredProducts = filteredProducts.filter(
        p => p.category === params.category || p.subcategory === params.category
      );
    }
    if (params.material) {
      filteredProducts = filteredProducts.filter(p => 
        p.material?.toLowerCase().includes(params.material.toLowerCase())
      );
    }
    if (params.color) {
      filteredProducts = filteredProducts.filter(p => 
        p.color?.toLowerCase().includes(params.color.toLowerCase())
      );
    }
    if (params.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(params.maxPrice));
    }
    if (params.style) {
      filteredProducts = filteredProducts.filter(p => p.style === params.style);
    }
    if (params.inStock === 'true' || params.inStock === true) {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    if (params.search) {
      const query = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.includes(query))
      );
    }

    // Sort
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
          const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discB - discA;
        });
        break;
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Paginate
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const total = filteredProducts.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(start, start + limit);

    return Promise.resolve({
      data: {
        success: true,
        data: paginatedProducts,
        pagination: { page, limit, total, pages },
      }
    });
  }

  getProduct(slug) {
    const product = localData.products.find(p => p.slug === slug);
    return Promise.resolve({
      data: { success: !!product, data: product || null }
    });
  }

  getFeaturedProducts(limit = 8) {
    const featured = localData.products.filter(p => p.featured).slice(0, limit);
    return Promise.resolve({ data: { success: true, data: featured } });
  }

  getTrendingProducts(limit = 8) {
    const trending = localData.products.filter(p => p.trending).slice(0, limit);
    return Promise.resolve({ data: { success: true, data: trending } });
  }

  getBestSellers(limit = 8) {
    const sellers = localData.products.filter(p => p.bestSeller).slice(0, limit);
    return Promise.resolve({ data: { success: true, data: sellers } });
  }

  getNewArrivals(limit = 8) {
    const arrivals = localData.products.filter(p => p.newArrival).slice(0, limit);
    return Promise.resolve({ data: { success: true, data: arrivals } });
  }

  getOnSaleProducts(limit = 12) {
    const onSale = localData.products
      .filter(p => p.onSale && p.originalPrice > p.price)
      .slice(0, limit);
    return Promise.resolve({ data: { success: true, data: onSale } });
  }

  getRelatedProducts(productId, limit = 4) {
    const current = localData.products.find(p => p._id === productId);
    if (!current) return Promise.resolve({ data: { success: true, data: [] } });
    
    const related = localData.products
      .filter(p => p._id !== productId && (
        p.category === current.category || p.style === current.style
      ))
      .slice(0, limit);
    
    return Promise.resolve({ data: { success: true, data: related } });
  }

  searchProducts(query, params = {}) {
    return this.getProducts({ ...params, search: query });
  }

  // ============================================
  // AUTH
  // ============================================

  async login(credentials) {
    if (credentials.email && credentials.password) {
      const mockUser = {
        _id: 'local_user_' + Date.now(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: 'user',
        avatar: null,
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'local_jwt_' + Date.now();
      localStorage.setItem('furniqo_token', mockToken);
      localStorage.setItem('furniqo_refresh_token', 'local_refresh');
      localStorage.setItem('furniqo_user', JSON.stringify(mockUser));
      return {
        data: {
          success: true,
          data: { user: mockUser, token: mockToken, refreshToken: 'local_refresh' },
          message: 'Login successful',
        }
      };
    }
    return { data: { success: false, message: 'Invalid credentials' } };
  }

  async signup(userData) {
    const mockUser = {
      _id: 'local_user_' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    const mockToken = 'local_jwt_' + Date.now();
    localStorage.setItem('furniqo_token', mockToken);
    localStorage.setItem('furniqo_refresh_token', 'local_refresh');
    localStorage.setItem('furniqo_user', JSON.stringify(mockUser));
    return {
      data: {
        success: true,
        data: { user: mockUser, token: mockToken, refreshToken: 'local_refresh' },
        message: 'Account created successfully',
      }
    };
  }

  async getProfile() {
    const user = JSON.parse(localStorage.getItem('furniqo_user') || 'null');
    return { data: { success: true, data: user } };
  }

  async updateProfile(profileData) {
    const current = JSON.parse(localStorage.getItem('furniqo_user') || '{}');
    const updated = { ...current, ...profileData };
    localStorage.setItem('furniqo_user', JSON.stringify(updated));
    return { data: { success: true, data: updated } };
  }

  // ============================================
  // WISHLIST
  // ============================================

  async getWishlistItems() {
    try {
      return JSON.parse(localStorage.getItem('furniqo_wishlist') || '[]');
    } catch {
      return [];
    }
  }

  saveWishlistItems(items) {
    localStorage.setItem('furniqo_wishlist', JSON.stringify(items));
  }

  // ============================================
  // COUPONS
  // ============================================

  async validateCoupon(code, orderTotal) {
    const coupon = localData.coupons.find(c => c.code === code.toUpperCase() && c.isActive);
    
    if (!coupon) {
      return { data: { success: false, message: 'Invalid coupon code' } };
    }
    
    if (orderTotal < coupon.minPurchase) {
      return { data: { success: false, message: `Minimum purchase of $${coupon.minPurchase} required` } };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderTotal * coupon.discount) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === 'fixed') {
      discount = coupon.discount;
    }

    return {
      data: {
        success: true,
        data: { ...coupon, calculatedDiscount: discount },
        message: 'Coupon applied successfully',
      }
    };
  }

  // ============================================
  // ORDERS
  // ============================================

  async createOrder(orderData) {
    const order = {
      _id: 'local_order_' + Date.now(),
      orderNumber: 'FNQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('furniqo_orders', JSON.stringify(orders));
    localStorage.removeItem('furniqo_cart');

    return { data: { success: true, data: order, message: 'Order created' } };
  }

  async getOrders() {
    const orders = JSON.parse(localStorage.getItem('furniqo_orders') || '[]');
    return { data: { success: true, data: orders } };
  }

  // ============================================
  // CONTENT - All synchronous for instant load
  // ============================================

  getCategories() {
    return Promise.resolve({ data: { success: true, data: localData.categories } });
  }

  getBlogPosts(params = {}) {
    let posts = [...localData.blogPosts];
    if (params.featured) posts = posts.filter(p => p.featured);
    if (params.limit) posts = posts.slice(0, params.limit);
    return Promise.resolve({ data: { success: true, data: posts } });
  }

  getBlogPost(slug) {
    const post = localData.blogPosts.find(p => p.slug === slug);
    return Promise.resolve({ data: { success: !!post, data: post || null } });
  }

  getFAQs() {
    return Promise.resolve({ data: { success: true, data: localData.faqs } });
  }

  getPolicies() {
    return Promise.resolve({ data: { success: true, data: localData.policies } });
  }

  getTestimonials() {
    return Promise.resolve({ data: { success: true, data: localData.testimonials } });
  }

  getRooms() {
    return Promise.resolve({ data: { success: true, data: localData.rooms } });
  }

  getHeroSlides() {
    return Promise.resolve({ data: { success: true, data: localData.heroSlides } });
  }

  // ============================================
  // ANALYTICS - No-op
  // ============================================

  async trackEvent(eventData) {
    return { data: { success: true } };
  }

  async trackPageView(page) {
    return { data: { success: true } };
  }
}

const apiWrapper = new APIWrapper();
export default apiWrapper;