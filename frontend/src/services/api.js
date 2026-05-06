import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
    
    // Add timestamp to prevent caching
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
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('furniqo_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token } = response.data.data;
          localStorage.setItem('furniqo_token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
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

// Product API
export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getOne: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/id/${id}`),
  getFeatured: (limit = 8) => api.get('/products/featured', { params: { limit } }),
  getTrending: (limit = 8) => api.get('/products/trending', { params: { limit } }),
  getBestSellers: (limit = 8) => api.get('/products/bestsellers', { params: { limit } }),
  getNewArrivals: (limit = 8) => api.get('/products/new-arrivals', { params: { limit } }),
  getOnSale: (limit = 12) => api.get('/products/on-sale', { params: { limit } }),
  getRelated: (productId, limit = 4) => api.get(`/products/${productId}/related`, { params: { limit } }),
  getRecommended: (limit = 6) => api.get('/products/recommended', { params: { limit } }),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
  getByCategory: (category, params = {}) => api.get(`/products/category/${category}`, { params }),
  uploadImage: (formData) => api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  googleLogin: (token) => api.post('/auth/google', { token }),
  facebookLogin: (token) => api.post('/auth/facebook', { token }),
  getAddresses: () => api.get('/auth/addresses'),
  addAddress: (address) => api.post('/auth/addresses', address),
  updateAddress: (id, address) => api.put(`/auth/addresses/${id}`, address),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity = 1, variant = null) => api.post('/cart/items', { productId, quantity, variant }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
  getShippingEstimate: (address) => api.post('/cart/shipping-estimate', address),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addItem: (productId) => api.post('/wishlist', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/${productId}`),
  isWishlisted: (productId) => api.get(`/wishlist/check/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/move-to-cart/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  returnOrder: (id, reason) => api.post(`/orders/${id}/return`, { reason }),
  trackOrder: (id) => api.get(`/orders/${id}/tracking`),
  getInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
};

// Review API
export const reviewAPI = {
  getProductReviews: (productId, params = {}) => api.get(`/reviews/product/${productId}`, { params }),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  reportReview: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
  getUserReviews: () => api.get('/reviews/user'),
};

// Coupon API
export const couponAPI = {
  validateCoupon: (code, orderTotal) => api.post('/coupons/validate', { code, orderTotal }),
  getActiveCoupons: () => api.get('/coupons/active'),
  getUserCoupons: () => api.get('/coupons/user'),
};

// Analytics API
export const analyticsAPI = {
  trackEvent: (eventData) => api.post('/analytics/event', eventData),
  trackPageView: (page, metadata = {}) => api.post('/analytics/pageview', { page, metadata }),
  trackProductView: (productId) => api.post('/analytics/product-view', { productId }),
  trackAddToCart: (productId, quantity) => api.post('/analytics/add-to-cart', { productId, quantity }),
  trackPurchase: (orderData) => api.post('/analytics/purchase', orderData),
};

// Search API
export const searchAPI = {
  search: (query, params = {}) => api.get('/search', { params: { q: query, ...params } }),
  getSuggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
  getPopularSearches: () => api.get('/search/popular'),
};

// Content API
export const contentAPI = {
  getCategories: () => api.get('/content/categories'),
  getBlogPosts: (params = {}) => api.get('/content/blog', { params }),
  getBlogPost: (slug) => api.get(`/content/blog/${slug}`),
  getFAQs: () => api.get('/content/faqs'),
  getPolicies: () => api.get('/content/policies'),
  getTestimonials: () => api.get('/content/testimonials'),
  getRooms: () => api.get('/content/rooms'),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (amount, currency = 'usd') => api.post('/payment/create-intent', { amount, currency }),
  confirmPayment: (paymentIntentId) => api.post('/payment/confirm', { paymentIntentId }),
  getPaymentMethods: () => api.get('/payment/methods'),
  addPaymentMethod: (paymentMethodData) => api.post('/payment/methods', paymentMethodData),
  removePaymentMethod: (id) => api.delete(`/payment/methods/${id}`),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params = {}) => api.get('/notifications', { params }),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Health Check
export const healthCheck = () => api.get('/health');

export default api;