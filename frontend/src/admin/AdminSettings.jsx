// AdminSettings.jsx - Complete settings using real API endpoints

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiSave,
  FiRefreshCw,
  FiGlobe,
  FiMail,
  FiLock,
  FiShield,
  FiBell,
  FiDatabase,
  FiImage,
  FiInfo,
  FiAlertCircle,
  FiSettings,
  FiToggleLeft,
  FiToggleRight,
  FiClock,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiPercent,
  FiTruck,
  FiStar,
  FiHeart,
  FiMenu,
  FiCode,
  FiKey
} from 'react-icons/fi';
import apiWrapper from '../services/apiWrapper';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [adminProfile, setAdminProfile] = useState(null);
  
  // Settings state (stored in localStorage or admin profile)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Furniqo',
    siteDescription: 'Premium Furniture Store',
    contactEmail: 'support@furniqo.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '123 Furniture St, Design District, NY 10001',
    
    // Store Settings
    storeSettings: {
      currency: 'USD',
      taxRate: 10,
      shippingCost: 19.99,
      freeShippingThreshold: 200,
      enableReviews: true,
      autoApproveReviews: false,
      itemsPerPage: 12,
      enableWishlist: true,
      enableCompare: true
    },
    
    // User Settings
    userSettings: {
      allowUserRegistration: true,
      defaultUserRole: 'user',
      requireEmailVerification: true,
      enableGuestCheckout: true
    },
    
    // Notification Settings
    notificationSettings: {
      adminEmails: ['admin@furniqo.com'],
      emailNotifications: {
        newOrder: true,
        newUser: true,
        lowStock: true,
        dailySummary: false
      }
    },
    
    // SEO Settings
    seoSettings: {
      metaTitle: 'Furniqo - Premium Furniture Store',
      metaDescription: 'Discover high-quality, stylish furniture for every room.',
      metaKeywords: 'furniture, home decor, modern furniture',
      enableSitemap: true
    },
    
    // API Settings
    apiSettings: {
      enableCache: true,
      cacheDuration: 3600,
      rateLimit: 100,
      debugMode: false
    }
  });

  useEffect(() => {
    fetchAdminProfile();
    loadLocalSettings();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await apiWrapper.getProfile();
      if (response?.data?.success && response.data.user) {
        setAdminProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const loadLocalSettings = () => {
    try {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('furniqo_admin_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLocalSettings = async () => {
    try {
      // Save settings to localStorage
      localStorage.setItem('furniqo_admin_settings', JSON.stringify(settings));
      
      // If we have admin profile, try to update preferences (if endpoint exists)
      if (adminProfile && apiWrapper.updateUserProfile) {
        await apiWrapper.updateUserProfile(adminProfile._id, {
          preferences: {
            settings: settings
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const success = await saveLocalSettings();
      if (success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSimpleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], value]
      }
    }));
  };

  const handleArrayRemove = (section, field, index) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'store', label: 'Store', icon: FiShoppingCart },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'seo', label: 'SEO', icon: FiInfo },
    { id: 'api', label: 'API', icon: FiCode }
  ];

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure your store settings and preferences</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <FiRefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <FiSave className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-neutral-200 dark:border-neutral-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleSimpleChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site Description</label>
                  <input
                    type="text"
                    value={settings.siteDescription}
                    onChange={(e) => handleSimpleChange('siteDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSimpleChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Phone</label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => handleSimpleChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Contact Address</label>
                  <textarea
                    rows="2"
                    value={settings.contactAddress}
                    onChange={(e) => handleSimpleChange('contactAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Store Settings */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Store Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={settings.storeSettings.currency}
                    onChange={(e) => handleInputChange('storeSettings', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.storeSettings.taxRate}
                    onChange={(e) => handleInputChange('storeSettings', 'taxRate', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shipping Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.storeSettings.shippingCost}
                    onChange={(e) => handleInputChange('storeSettings', 'shippingCost', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.storeSettings.freeShippingThreshold}
                    onChange={(e) => handleInputChange('storeSettings', 'freeShippingThreshold', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Items Per Page</label>
                  <select
                    value={settings.storeSettings.itemsPerPage}
                    onChange={(e) => handleInputChange('storeSettings', 'itemsPerPage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                    <option value={96}>96</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="font-medium">Feature Toggles</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Product Reviews</p>
                    <p className="text-sm text-neutral-500">Allow customers to leave reviews on products</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('storeSettings', 'enableReviews', !settings.storeSettings.enableReviews)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.storeSettings.enableReviews ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-Approve Reviews</p>
                    <p className="text-sm text-neutral-500">Automatically approve customer reviews without moderation</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('storeSettings', 'autoApproveReviews', !settings.storeSettings.autoApproveReviews)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.storeSettings.autoApproveReviews ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Wishlist</p>
                    <p className="text-sm text-neutral-500">Allow users to save products to wishlist</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('storeSettings', 'enableWishlist', !settings.storeSettings.enableWishlist)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.storeSettings.enableWishlist ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Compare Products</p>
                    <p className="text-sm text-neutral-500">Allow users to compare multiple products</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('storeSettings', 'enableCompare', !settings.storeSettings.enableCompare)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.storeSettings.enableCompare ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Settings */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">User Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow User Registration</p>
                    <p className="text-sm text-neutral-500">Allow new users to create accounts</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('userSettings', 'allowUserRegistration', !settings.userSettings.allowUserRegistration)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.userSettings.allowUserRegistration ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Email Verification</p>
                    <p className="text-sm text-neutral-500">Users must verify email before accessing account</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('userSettings', 'requireEmailVerification', !settings.userSettings.requireEmailVerification)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.userSettings.requireEmailVerification ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Guest Checkout</p>
                    <p className="text-sm text-neutral-500">Allow users to checkout without creating an account</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('userSettings', 'enableGuestCheckout', !settings.userSettings.enableGuestCheckout)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.userSettings.enableGuestCheckout ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Default User Role</label>
                  <select
                    value={settings.userSettings.defaultUserRole}
                    onChange={(e) => handleInputChange('userSettings', 'defaultUserRole', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Email Notifications</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Admin Email Addresses</label>
                <div className="space-y-2">
                  {settings.notificationSettings.adminEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...settings.notificationSettings.adminEmails];
                          newEmails[index] = e.target.value;
                          handleInputChange('notificationSettings', 'adminEmails', newEmails);
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800"
                      />
                      <button
                        onClick={() => handleArrayRemove('notificationSettings', 'adminEmails', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleArrayAdd('notificationSettings', 'adminEmails', '')}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Email
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="font-medium">Email Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Order Alert</p>
                    <p className="text-sm text-neutral-500">Send email when new order is placed</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('notificationSettings', 'emailNotifications', {
                      ...settings.notificationSettings.emailNotifications,
                      newOrder: !settings.notificationSettings.emailNotifications.newOrder
                    })}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.notificationSettings.emailNotifications.newOrder ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New User Alert</p>
                    <p className="text-sm text-neutral-500">Send email when new user registers</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('notificationSettings', 'emailNotifications', {
                      ...settings.notificationSettings.emailNotifications,
                      newUser: !settings.notificationSettings.emailNotifications.newUser
                    })}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.notificationSettings.emailNotifications.newUser ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alert</p>
                    <p className="text-sm text-neutral-500">Send alert when product stock is low</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('notificationSettings', 'emailNotifications', {
                      ...settings.notificationSettings.emailNotifications,
                      lowStock: !settings.notificationSettings.emailNotifications.lowStock
                    })}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.notificationSettings.emailNotifications.lowStock ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={settings.seoSettings.metaTitle}
                    onChange={(e) => handleInputChange('seoSettings', 'metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Recommended length: 50-60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Meta Description</label>
                  <textarea
                    rows="3"
                    value={settings.seoSettings.metaDescription}
                    onChange={(e) => handleInputChange('seoSettings', 'metaDescription', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Recommended length: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.seoSettings.metaKeywords}
                    onChange={(e) => handleInputChange('seoSettings', 'metaKeywords', e.target.value)}
                    placeholder="furniture, home decor, modern furniture"
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Separate keywords with commas</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="font-medium">Enable Sitemap</p>
                    <p className="text-sm text-neutral-500">Automatically generate XML sitemap</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('seoSettings', 'enableSitemap', !settings.seoSettings.enableSitemap)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.seoSettings.enableSitemap ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">API Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable API Cache</p>
                    <p className="text-sm text-neutral-500">Cache API responses for better performance</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('apiSettings', 'enableCache', !settings.apiSettings.enableCache)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.apiSettings.enableCache ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                {settings.apiSettings.enableCache && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Cache Duration (seconds)</label>
                    <input
                      type="number"
                      value={settings.apiSettings.cacheDuration}
                      onChange={(e) => handleInputChange('apiSettings', 'cacheDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Rate Limit (requests per 15 minutes)</label>
                  <input
                    type="number"
                    value={settings.apiSettings.rateLimit}
                    onChange={(e) => handleInputChange('apiSettings', 'rateLimit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div>
                    <p className="font-medium">Debug Mode</p>
                    <p className="text-sm text-neutral-500">Enable detailed error logging and debugging</p>
                  </div>
                  <button
                    onClick={() => handleInputChange('apiSettings', 'debugMode', !settings.apiSettings.debugMode)}
                    className="text-2xl focus:outline-none"
                  >
                    {settings.apiSettings.debugMode ? 
                      <FiToggleRight className="h-6 w-6 text-primary-600" /> : 
                      <FiToggleLeft className="h-6 w-6 text-neutral-400" />
                    }
                  </button>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">API Information</p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                        Base URL: {API_BASE_URL}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-mono">
                        Version: 1.0.0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex justify-between">
      <div>
        <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div className="h-4 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
    </div>
    <div className="bg-white dark:bg-neutral-900 rounded-xl border h-96"></div>
  </div>
);

export default AdminSettings;