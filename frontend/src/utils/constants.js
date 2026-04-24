export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const SITE_NAME = 'Furniqo';
export const SITE_DESCRIPTION = 'Premium furniture for modern living';
export const SITE_URL = 'https://furniqo.com';
export const SUPPORT_EMAIL = 'support@furniqo.com';
export const PHONE_NUMBER = '+1 (555) 987-6543';
export const ADDRESS = '123 Design District, New York, NY 10001';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'discount', label: 'Biggest Discount' },
];

export const FILTER_OPTIONS = {
  categories: [
    { value: 'Living Room', label: 'Living Room', icon: '🛋️' },
    { value: 'Bedroom', label: 'Bedroom', icon: '🛏️' },
    { value: 'Dining Room', label: 'Dining Room', icon: '🍽️' },
    { value: 'Office', label: 'Home Office', icon: '💼' },
    { value: 'Outdoor', label: 'Outdoor', icon: '🌿' },
    { value: 'Lighting', label: 'Lighting', icon: '💡' },
    { value: 'Decor', label: 'Decor', icon: '🎨' },
    { value: 'Storage', label: 'Storage', icon: '📦' },
  ],
  materials: [
    'Solid Wood',
    'Engineered Wood',
    'Metal',
    'Glass',
    'Marble',
    'Leather',
    'Fabric',
    'Velvet',
    'Rattan',
    'Bamboo',
  ],
  colors: [
    { value: 'Black', hex: '#000000' },
    { value: 'White', hex: '#FFFFFF' },
    { value: 'Brown', hex: '#8B4513' },
    { value: 'Gray', hex: '#808080' },
    { value: 'Blue', hex: '#0000FF' },
    { value: 'Green', hex: '#008000' },
    { value: 'Red', hex: '#FF0000' },
    { value: 'Beige', hex: '#F5F5DC' },
    { value: 'Natural Wood', hex: '#DEB887' },
  ],
  priceRanges: [
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: '$2,000 - $5,000', min: 2000, max: 5000 },
    { label: '$5,000+', min: 5000, max: Infinity },
  ],
  styles: [
    'Modern',
    'Contemporary',
    'Minimalist',
    'Industrial',
    'Scandinavian',
    'Mid-Century',
    'Traditional',
    'Bohemian',
  ],
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  returned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

export const SHIPPING_METHODS = [
  { 
    id: 'standard', 
    name: 'Standard Shipping', 
    price: 0, 
    days: '5-7 business days',
    description: 'Free on orders over $200',
  },
  { 
    id: 'express', 
    name: 'Express Shipping', 
    price: 29.99, 
    days: '2-3 business days',
    description: 'Priority handling and delivery',
  },
  { 
    id: 'overnight', 
    name: 'Overnight Shipping', 
    price: 49.99, 
    days: 'Next business day',
    description: 'Order by 2 PM for next day delivery',
  },
  {
    id: 'white-glove',
    name: 'White Glove Delivery',
    price: 99.99,
    days: '5-10 business days',
    description: 'Delivery + assembly + packaging removal',
  },
];

export const TAX_RATE = 0.0825;
export const FREE_SHIPPING_THRESHOLD = 200;

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/furniqo',
  instagram: 'https://instagram.com/furniqo',
  twitter: 'https://twitter.com/furniqo',
  pinterest: 'https://pinterest.com/furniqo',
  youtube: 'https://youtube.com/@furniqo',
};

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Shop' },
  { 
    label: 'Categories',
    children: FILTER_OPTIONS.categories.map(cat => ({
      path: `/products?category=${encodeURIComponent(cat.value)}`,
      label: `${cat.icon} ${cat.label}`,
    })),
  },
  { path: '/room-inspiration', label: 'Inspiration' },
  { path: '/offers', label: 'Sale' },
  { path: '/custom-furniture', label: 'Custom' },
  { path: '/blog', label: 'Blog' },
];