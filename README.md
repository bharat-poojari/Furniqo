# 🛋️ Furniqo - Premium Furniture E-commerce

<div align="center">
  
   <img src="https://raw.githubusercontent.com/bharat-poojari/Furniqo/main/frontend/public/logo.svg" width="192" height="192" alt="Furniqo Logo">

  ### 🌟 Immersive 3D Shopping Experience

  [![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  
  <p align="center">
    <a href="#features"><strong>Features</strong></a> •
    <a href="#tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#getting-started"><strong>Getting Started</strong></a> •
    <a href="#project-structure"><strong>Structure</strong></a> •
    <a href="#development"><strong>Development</strong></a> •
    <a href="#deployment"><strong>Deployment</strong></a>
  </p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**Furniqo** is a premium furniture e-commerce platform that redefines online shopping through immersive 3D product visualization. Built with a modern React stack, it offers a seamless, responsive experience that bridges the gap between digital browsing and physical product evaluation.

### Key Benefits

- **Immersive 3D Views** - Examine furniture from every angle before purchase
- **Lightning Fast** - Vite-powered builds for near-instant page loads
- **Dark Mode Ready** - Eye-friendly interface for any lighting condition
- **Smooth Animations** - Framer Motion powers delightful micro-interactions
- **Production Optimized** - Code splitting, lazy loading, and efficient state management

---

## Features

### Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **🎨 3D Product Viewer** | Interactive 3D models with zoom, rotate, and pan controls | ✅ |
| **📱 Responsive Design** | Fully adaptive UI from mobile to 4K displays | ✅ |
| **🌙 Dark Mode** | System-aware and manual theme toggle | ✅ |
| **🛒 Cart Management** | Add/remove items, quantity updates, persistent storage | ✅ |
| **⭐ Wishlist** | Save favorite items for later purchase | ✅ |
| **🔍 Advanced Search** | Algolia-powered instant search with filters | ✅ |
| **💳 Payments** | Razorpay + Stripe integration for seamless checkout | ✅ |
| **📦 Order Tracking** | Real-time order status updates | ✅ |
| **⭐ Reviews & Ratings** | User-generated product feedback system | ✅ |

### Advanced Features

- **Smooth Page Transitions** - Animated route changes with Framer Motion
- **Toast Notifications** - Non-intrusive feedback system
- **Form Validation** - Robust client-side validation for all forms
- **Error Tracking** - Sentry integration for production error monitoring
- **Analytics** - Google Analytics for user behavior insights

### Technical Capabilities

| Operation | Description |
|-----------|-------------|
| **3D Rendering** | Optimized Three.js models with automatic LOD |
| **Code Splitting** | Route-based chunks for optimal loading |
| **State Persistence** | Zustand stores with localStorage sync |
| **API Caching** | Intelligent request deduplication |
| **Lazy Loading** | On-demand component loading for performance |

---

## Tech Stack

### Core Framework & Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0 | UI framework |
| **Vite** | 5.0 | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **React Router DOM** | 6.22 | Client-side routing |
| **Zustand** | 4.5 | State management |
| **Framer Motion** | 11.0 | Animations |

### 3D Graphics

| Library | Version | Purpose |
|---------|---------|---------|
| **Three.js** | r160 | 3D library core |
| **@react-three/fiber** | 8.15 | React renderer for Three.js |
| **@react-three/drei** | 9.92 | Useful Three.js helpers |

### Utilities & Services

| Library | Version | Purpose |
|---------|---------|---------|
| **Axios** | 1.6 | HTTP client |
| **React Hook Form** | 7.51 | Form handling |
| **React Hot Toast** | 2.4 | Toast notifications |
| **React Icons** | 5.0 | Icon library |
| **date-fns** | 3.3 | Date formatting |
| **clsx** | 2.1 | Conditional className utility |

### Analytics & Monitoring

| Service | Purpose |
|---------|---------|
| **Sentry** | Error tracking & performance monitoring |
| **Google Analytics** | User behavior analytics |
| **Algolia** | Instant search and filtering |

### Payments

| Service | Purpose |
|---------|---------|
| **Razorpay** | Indian payment gateway |
| **Stripe** | International payment processing |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/furniqo.git
cd furniqo/frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1

# Payment Gateways
VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyHere
VITE_STRIPE_PUBLIC_KEY=pk_test_YourStripePublicKey

# Search & Media
VITE_ALGOLIA_APP_ID=YourAlgoliaAppId
VITE_ALGOLIA_SEARCH_KEY=YourAlgoliaSearchKey
VITE_CLOUDINARY_CLOUD_NAME=YourCloudName

# Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# App Configuration
VITE_APP_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Available Scripts

| Command | Description | Port |
|---------|-------------|------|
| `npm run dev` | Start development server | http://localhost:3000 |
| `npm run build` | Create production build | `dist/` directory |
| `npm run preview` | Preview production build | http://localhost:4173 |
| `npm run lint` | Run ESLint for code quality | - |

### First Run

```bash
# Start the development server
npm run dev

# Open your browser to:
# http://localhost:3000
```

You should see the Furniqo homepage with the 3D hero section and product listings.

---

## Project Structure

```
frontend/
├── 📂 public/                      # Static assets
│   ├── 📂 models/                  # 3D model files (.glb, .gltf)
│   └── 📂 images/                  # Static images
│
├── 📂 src/
│   ├── 📂 components/              # Reusable UI components
│   │   ├── 📂 ui/                  # Basic UI primitives (Button, Card, Modal)
│   │   ├── 📂 layout/              # Layout components (Header, Footer, Sidebar)
│   │   ├── 📂 product/             # Product-specific components
│   │   └── 📂 3d/                  # Three.js components (ModelViewer, Scene)
│   │
│   ├── 📂 pages/                   # Page components (route-level)
│   │   ├── 📄 Home.jsx
│   │   ├── 📄 Shop.jsx
│   │   ├── 📄 ProductDetail.jsx
│   │   ├── 📄 Cart.jsx
│   │   ├── 📄 Checkout.jsx
│   │   ├── 📄 Wishlist.jsx
│   │   ├── 📄 Orders.jsx
│   │   └── 📄 Profile.jsx
│   │
│   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── 📄 useAuth.js
│   │   ├── 📄 useCart.js
│   │   ├── 📄 useWishlist.js
│   │   └── 📄 useDarkMode.js
│   │
│   ├── 📂 store/                   # Zustand state stores
│   │   ├── 📄 cartStore.js
│   │   ├── 📄 wishlistStore.js
│   │   ├── 📄 authStore.js
│   │   └── 📄 uiStore.js
│   │
│   ├── 📂 services/                # API service functions
│   │   ├── 📄 api.js               # Axios instance configuration
│   │   ├── 📄 productService.js
│   │   ├── 📄 orderService.js
│   │   └── 📄 authService.js
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   ├── 📄 formatters.js        # Price, date, etc. formatting
│   │   ├── 📄 validators.js        # Form validation rules
│   │   └── 📄 constants.js         # App-wide constants
│   │
│   ├── 📂 data/                    # Static/mock data (for development)
│   │   └── 📄 products.json
│   │
│   ├── 📂 styles/                  # Global styles
│   │   └── 📄 globals.css          # Tailwind imports + custom CSS
│   │
│   ├── 📄 App.jsx                  # Main app component with routing
│   ├── 📄 main.jsx                 # Entry point (ReactDOM render)
│   └── 📄 routes.jsx               # Route definitions
│
├── 📄 index.html                   # HTML template
├── 📄 package.json                 # Dependencies & scripts
├── 📄 vite.config.js               # Vite configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 .eslintrc.cjs                # ESLint configuration
├── 📄 .env.example                 # Environment variables template
├── 📄 vercel.json                  # Vercel deployment configuration
└── 📄 README.md                    # Documentation (this file)
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `main.jsx` | Entry point, wraps app with providers (Router, Theme, Toast) |
| `App.jsx` | Main component, defines layout structure and route mounting |
| `vite.config.js` | Vite configuration with aliases, plugins, and proxy settings |
| `tailwind.config.js` | Custom theme extensions (colors, fonts, animations) |
| `store/*.js` | Zustand stores with persistence and devtools middleware |

---

## Development Guidelines

### Code Style & Conventions

**1. Component Structure**

```jsx
import React from 'react';
import { motion } from 'framer-motion';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at the top
  const { state, action } = useStore();
  
  // Derived state
  const computedValue = useMemo(() => {}, []);
  
  // Event handlers
  const handleClick = () => {};
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Component content */}
    </motion.div>
  );
};

export default ComponentName;
```

**2. Styling Rules**

- Use Tailwind CSS for all styling
- Extend theme in `tailwind.config.js` for custom values
- Avoid inline styles unless absolutely necessary
- Use `clsx` for conditional className joining

```jsx
import clsx from 'clsx';

<div className={clsx(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'opacity-50'
)}>
```

**3. State Management**

```jsx
// Zustand store example
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter(item => item.id !== id) 
      })),
    }),
    { name: 'cart-storage' }
  )
);
```

**4. API Calls**

```jsx
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**5. Performance Optimization**

- Lazy load routes using `React.lazy()`
- Use `React.memo()` for expensive components
- Implement `useCallback` and `useMemo` appropriately
- Use code splitting for large bundles

```jsx
// Lazy load route components
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));

// Memoize expensive components
export default React.memo(ExpensiveComponent);
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
feat: add 3D product viewer
fix: resolve cart persistence issue
docs: update README with deployment guide
style: format tailwind classes
refactor: extract product card component
perf: implement image lazy loading
test: add cart store unit tests
chore: update dependencies
```

---

## Deployment

### Vercel Deployment (Recommended)

The project includes a `vercel.json` configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

**Steps to deploy:**

1. Push to GitHub/GitLab/Bitbucket
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. Import project on [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Framework Preset: Vite
   - Add environment variables (from `.env`)
   - Click "Deploy"

3. Automatic Deployments
   - Every push to `main` branch triggers a deployment
   - Preview deployments for PRs

### Manual Build

```bash
# Create production build
npm run build

# Preview the build locally
npm run preview

# Or serve with any static file server
npx serve -s dist

# Using Python HTTP server
python -m http.server 3000 --directory dist
```

### Environment-Specific Configurations

| Environment | API_URL | Features Enabled |
|-------------|---------|------------------|
| Development | `http://localhost:5000/api/v1` | Full logging, hot reload |
| Staging | `https://staging-api.furniqo.com/api/v1` | Test payments, error tracking |
| Production | `https://api.furniqo.com/api/v1` | Live payments, full monitoring |

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] API endpoints pointing to production
- [ ] 3D models optimized and compressed
- [ ] Images optimized (use WebP format)
- [ ] Lighthouse score > 90
- [ ] Error boundaries tested
- [ ] Analytics events verified
- [ ] Payment gateways in production mode
- [ ] SSL certificate valid (automatic with Vercel)

### Post-Deployment Monitoring

- **Sentry** - Track and resolve runtime errors
- **Google Analytics** - Monitor user behavior
- **Vercel Analytics** - Core Web Vitals monitoring

---

## Contributing

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes
```bash
git commit -m 'feat: add amazing feature'
```

4. Push to the branch
```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

### Reporting Issues

- Use the [GitHub Issues](https://github.com/your-org/furniqo/issues) page
- Include browser and OS details
- Provide steps to reproduce
- Attach screenshots or recordings when possible

### Feature Requests

- Check existing issues first
- Clearly describe the feature and use case
- Consider implementation approach

---

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |

*3D features require WebGL support*

---

## License

This project is **private and proprietary** software.

```
PROPRIETARY SOFTWARE

Copyright (c) 2026 Furniqo

Unauthorized copying, distribution, modification, or use of this software,
via any medium, is strictly prohibited without explicit written permission
from the copyright holder.
```

For licensing inquiries, please contact the development team.

---

## Contact

<div align="center">

### Furniqo Development Team

[![Website](https://img.shields.io/badge/Website-furniqo.com-blue?style=for-the-badge&logo=vercel)](https://furniqo.com)
[![Email](https://img.shields.io/badge/Email-support%40furniqo.com-red?style=for-the-badge&logo=gmail)](mailto:support@furniqo.com)
[![Twitter](https://img.shields.io/badge/Twitter-@furniqo-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/furniqo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Furniqo-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/company/furniqo)

</div>

### Support

- **Documentation**: [docs.furniqo.com](https://docs.furniqo.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/furniqo/issues)
- **Email**: support@furniqo.com
- **Status Page**: [status.furniqo.com](https://status.furniqo.com)

---

<div align="center">

### 🛋️ Transform Your Space. Digitally.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![3D Powered](https://img.shields.io/badge/3D-Powered-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

**© 2026 Furniqo. All rights reserved.**

*Experience furniture like never before — in stunning 3D.*

</div>
