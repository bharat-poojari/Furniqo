import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import * as mock from '../data/data';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('furniqo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    // If transient network/server error, retry GETs a couple times before fallback
    const isNetworkError = !error.response;
    const status = error.response?.status;
    const isServerError = status >= 500;

    const method = (originalRequest.method || 'get').toLowerCase();

    // Retry idempotent GET requests up to 2 times with backoff
    if (method === 'get' && (isNetworkError || isServerError)) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      if (originalRequest._retryCount < 2) {
        originalRequest._retryCount += 1;
        const backoff = 150 * Math.pow(2, originalRequest._retryCount - 1);
        await new Promise((res) => setTimeout(res, backoff));
        return api(originalRequest);
      }
    }

    // If network error or server error (5xx), try to return mock data quickly
    if ((isNetworkError || isServerError) && !originalRequest?._mockFallback) {
      originalRequest._mockFallback = true;

      try {
        const url = originalRequest.url || '';
        const method = (originalRequest.method || 'get').toLowerCase();

        const getPath = (u) => {
          try {
            const parsed = new URL(u, API_BASE_URL || 'http://localhost');
            return parsed.pathname;
          } catch (e) {
            // fallback: treat as relative
            return u.split('?')[0];
          }
        };

        const path = getPath(url);

        const buildResponse = (data) => Promise.resolve({ data: { success: true, data }, status: 200 });

        // Basic routing for common GET endpoints
        if (method === 'get') {
          if (/^\/products(\/.*)?$/.test(path)) {
            if (path === '/products' || path === '/products/') return buildResponse({ products: mock.products });
            // /products/:identifier
            const id = path.replace('/products/', '');
            const found = mock.products.find(p => p._id === id || p.slug === id);
            return buildResponse({ product: found || null });
          }

          if (/^\/categories(\/.*)?$/.test(path)) {
            return buildResponse({ categories: mock.categories });
          }

          if (/^\/blog(\/.*)?$/.test(path)) {
            if (path === '/blog' || path === '/blog/') return buildResponse({ posts: mock.blogPosts || [] });
            const slug = path.replace('/blog/', '');
            const post = (mock.blogPosts || []).find(b => b._id === slug || b.slug === slug);
            return buildResponse({ post: post || null });
          }

          if (/^\/rooms(\/.*)?$/.test(path)) {
            return buildResponse({ rooms: mock.rooms || [] });
          }

          if (/^\/testimonials(\/.*)?$/.test(path)) {
            return buildResponse({ testimonials: mock.testimonials || [] });
          }

          if (/^\/coupons(\/.*)?$/.test(path)) {
            return buildResponse({ coupons: mock.coupons || [] });
          }

          if (/^\/faqs(\/.*)?$/.test(path)) {
            return buildResponse({ faqs: mock.faqs || [] });
          }

          if (/^\/policies(\/.*)?$/.test(path)) {
            return buildResponse({ policies: mock.policies || {} });
          }

          if (/^\/hero-slides(\/.*)?$/.test(path) || path === '/heroSlides') {
            return buildResponse({ heroSlides: mock.heroSlides || [] });
          }

          if (path === '/health') {
            return buildResponse({ ok: true });
          }
        }

        // Handle some common POST fallbacks
        if (method === 'post') {
          // coupons validate
          if (/^\/coupons\/validate/.test(path) || path === '/coupons/validate') {
            try {
              const body = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : originalRequest.data || {};
              const code = body.code || body.coupon || '';
              const found = (mock.coupons || []).find(c => c.code === code);
              if (found) return buildResponse({ valid: true, coupon: found });
              return buildResponse({ valid: false });
            } catch (e) {
              return buildResponse({ valid: false });
            }
          }

          // contact/submit -> echo success
          if (/^\/contact\/submit/.test(path) || path === '/contact/submit') {
            return buildResponse({ message: 'Message received', data: typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data || '{}') : originalRequest.data || {} });
          }

          // cart actions -> return mock cart (empty)
          if (/^\/cart(\/.*)?$/.test(path)) {
            return buildResponse({ cart: { items: [] } });
          }

          // wishlist actions -> empty
          if (/^\/wishlist(\/.*)?$/.test(path)) {
            return buildResponse({ wishlist: [] });
          }
        }

        // default: return an empty success envelope
        return buildResponse({});
      } catch (e) {
        // fall through to original error handling below
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('furniqo_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
            refreshToken,
          });
          
          const { accessToken } = response.data.data;
          localStorage.setItem('furniqo_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('furniqo_token');
        localStorage.removeItem('furniqo_refresh_token');
        localStorage.removeItem('furniqo_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============ USER MANAGEMENT API ============
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  refreshToken: (refreshToken) => api.post('/users/refresh-token', { refreshToken }),
  logout: (refreshToken) => api.post('/users/logout', refreshToken ? { refreshToken } : {}),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/users/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, roleData) => api.put(`/users/${id}/role`, roleData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ============ CART MANAGEMENT API ============
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity = 1, variantId = null) => api.post('/cart/add', { productId, quantity, variantId }),
  updateItem: (itemId, quantity) => api.put(`/cart/update/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
  syncCart: (items) => api.post('/cart/sync', { items }),
};

// ============ WISHLIST MANAGEMENT API ============
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist/add', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/remove/${productId}`),
  checkWishlist: (productId) => api.get(`/wishlist/check/${productId}`),
  moveToCart: (productIds) => api.post('/wishlist/move-to-cart', { productIds }),
};

// ============ ORDER MANAGEMENT API ============
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  getAllOrders: (params = {}) => api.get('/orders/admin/all', { params }),
};

// ============ PRODUCT MANAGEMENT API ============
export const productAPI = {
  getAllProducts: (params = {}) => api.get('/products', { params }),
  getProductByIdentifier: (identifier) => api.get(`/products/${identifier}`),
  getRelatedProducts: (productId, limit = 10) => api.get(`/products/${productId}/related`, { params: { limit } }),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addProductReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
};

// ============ CATEGORY MANAGEMENT API ============
export const categoryAPI = {
  getCategories: () => api.get('/categories'),
  getFeaturedCategories: () => api.get('/categories/featured'),
  getCategoryByIdentifier: (identifier) => api.get(`/categories/${identifier}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// ============ TESTIMONIAL MANAGEMENT API ============
export const testimonialAPI = {
  getTestimonials: () => api.get('/testimonials'),
  getAdminTestimonials: () => api.get('/testimonials/admin/all'),
  getTestimonialById: (id) => api.get(`/testimonials/${id}`),
  createTestimonial: (testimonialData) => api.post('/testimonials', testimonialData),
  updateTestimonial: (id, testimonialData) => api.put(`/testimonials/${id}`, testimonialData),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
};

// ============ BLOG MANAGEMENT API ============
export const blogAPI = {
  getBlogPosts: (params = {}) => api.get('/blog', { params }),
  getFeaturedBlogPosts: () => api.get('/blog/featured'),
  getBlogPostByIdentifier: (identifier) => api.get(`/blog/${identifier}`),
  createBlogPost: (postData) => api.post('/blog', postData),
  updateBlogPost: (id, postData) => api.put(`/blog/${id}`, postData),
  deleteBlogPost: (id) => api.delete(`/blog/${id}`),
};

// ============ ROOMS MANAGEMENT API ============
export const roomsAPI = {
  getRooms: () => api.get('/rooms'),
  getRoomsByType: (roomType) => api.get(`/rooms/type/${roomType}`),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
};

// ============ COUPON MANAGEMENT API ============
export const couponAPI = {
  getActiveCoupons: () => api.get('/coupons'),
  validateCoupon: (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal }),
  getAllCoupons: () => api.get('/coupons/all'),
  createCoupon: (couponData) => api.post('/coupons', couponData),
  updateCoupon: (code, couponData) => api.put(`/coupons/${code}`, couponData),
  deleteCoupon: (code) => api.delete(`/coupons/${code}`),
};

// ============ FAQ MANAGEMENT API ============
export const faqAPI = {
  getFaqs: () => api.get('/faqs'),
  getFaqCategories: () => api.get('/faqs/categories'),
  getFaqById: (id) => api.get(`/faqs/${id}`),
  createFaq: (faqData) => api.post('/faqs', faqData),
  updateFaq: (id, faqData) => api.put(`/faqs/${id}`, faqData),
  deleteFaq: (id) => api.delete(`/faqs/${id}`),
};

// ============ UPLOAD API ============
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadImages: (formData) => api.post('/upload/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUploadedImages: () => api.get('/upload/images'),
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`),
};

// ============ CONTACT & NEWSLETTER API ============
export const contactAPI = {
  submitContact: (formData) => api.post('/contact/submit', formData),
  getContactMessages: (params = {}) => api.get('/contact/all', { params }),
  updateMessageStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  subscribeNewsletter: (email, name) => api.post('/contact/newsletter/subscribe', { email, name }),
  unsubscribeNewsletter: (email) => api.post('/contact/newsletter/unsubscribe', { email }),
  getNewsletterSubscribers: () => api.get('/contact/newsletter/subscribers'),
};

// ============ HERO SLIDES API ============
export const heroSlidesAPI = {
  getActiveSlides: () => api.get('/hero-slides'),
  getSlideById: (id) => api.get(`/hero-slides/${id}`),
  getAllSlides: () => api.get('/hero-slides/all'),
  createSlide: (slideData) => api.post('/hero-slides', slideData),
  updateSlide: (id, slideData) => api.put(`/hero-slides/${id}`, slideData),
  deleteSlide: (id) => api.delete(`/hero-slides/${id}`),
  toggleSlideStatus: (id) => api.patch(`/hero-slides/${id}/toggle`),
  reorderSlides: (orderData) => api.post('/hero-slides/reorder', orderData),
};

// ============ POLICIES API ============
export const policiesAPI = {
  getAllPolicies: () => api.get('/policies'),
  getPolicyByType: (type) => api.get(`/policies/${type}`),
  updatePolicy: (type, policyData) => api.put(`/policies/${type}`, policyData),
  deletePolicy: (type) => api.delete(`/policies/${type}`),
};

// ============ ADMIN DASHBOARD API ============
export const adminDashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getHealth: () => api.get('/admin/health'),
};

// ============ HEALTH CHECK API ============
export const healthAPI = {
  checkHealth: () => api.get('/health'),
};

// ============ GIFT CARD MANAGEMENT API ============
export const giftCardAPI = {
  createGiftCard: (cardData) => api.post('/gift-cards', cardData),
  getMyGiftCards: () => api.get('/gift-cards'),
  getGiftCardByCode: (code) => api.get(`/gift-cards/code/${code}`),
  applyGiftCard: (code, orderTotal) => api.post('/gift-cards/apply', { code, orderTotal }),
  getAllGiftCards: (params) => api.get('/gift-cards/admin/all', { params }),
  getGiftCardByCodeAdmin: (code) => api.get(`/gift-cards/admin/${code}`),
  updateGiftCard: (code, updateData) => api.put(`/gift-cards/admin/${code}`, updateData),
  updateGiftCardStatus: (code, status) => api.put(`/gift-cards/admin/${code}/status`, { status }),
  deleteGiftCard: (code) => api.delete(`/gift-cards/admin/${code}`),
  getGiftCardStats: () => api.get('/gift-cards/admin/stats/summary'),
  bulkDeleteGiftCards: (codes) => api.delete('/gift-cards/admin/bulk', { data: { codes } })
};

// ============ ANALYTICS API ============
export const analyticsAPI = {
  trackEvent: (eventName, eventData = {}) => {
    return api.post('/analytics/track', { eventName, eventData, timestamp: new Date().toISOString() });
  },
  trackPageView: (pageName, pageData = {}) => {
    return api.post('/analytics/page-view', { pageName, pageData, timestamp: new Date().toISOString() });
  },
  getAnalytics: (params = {}) => {
    return api.get('/analytics', { params });
  },
  getUserAnalytics: (userId, params = {}) => {
    return api.get(`/analytics/user/${userId}`, { params });
  },
  getProductAnalytics: (productId, params = {}) => {
    return api.get(`/analytics/product/${productId}`, { params });
  },
  getSalesAnalytics: (params = {}) => {
    return api.get('/analytics/sales', { params });
  },
  getDashboardAnalytics: (params = {}) => {
    return api.get('/analytics/dashboard', { params });
  }
};

export default api;