# 🛋️ Furniqo - Premium Furniture E-commerce

<div align="center">
  
  ![Furniqo Logo](https://via.placeholder.com/128x128?text=Furniqo)

  ### 🌟 Immersive 3D Shopping Experience

  [![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-r160-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  
  <p align="center">
    <a href="#-features"><strong>Features</strong></a> •
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#-getting-started"><strong>Getting Started</strong></a> •
    <a href="#-project-structure"><strong>Structure</strong></a> •
    <a href="#-development"><strong>Development</strong></a> •
    <a href="#-deployment"><strong>Deployment</strong></a>
  </p>
</div>

## 📋 Table of Contents

- [🛋️ Overview](#️-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎨 Development Guidelines](#-development-guidelines)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Contact](#-contact)

## 🛋️ Overview

**Furniqo** is a premium furniture e-commerce platform that redefines online shopping through immersive 3D product visualization. Built with a modern React stack, it offers a seamless, responsive experience that bridges the gap between digital browsing and physical product evaluation.

### 🎯 Key Benefits
- **Immersive 3D Views** - Examine furniture from every angle before purchase
- **Lightning Fast** - Vite-powered builds for near-instant page loads
- **Dark Mode Ready** - Eye-friendly interface for any lighting condition
- **Smooth Animations** - Framer Motion powers delightful micro-interactions
- **Production Optimized** - Code splitting, lazy loading, and efficient state management

## ✨ Features

### 🚀 **Core Capabilities**

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

### 🎨 **Advanced Features**
- **Smooth Page Transitions** - Animated route changes with Framer Motion
- **Toast Notifications** - Non-intrusive feedback system
- **Form Validation** - Robust client-side validation for all forms
- **Error Tracking** - Sentry integration for production error monitoring
- **Analytics** - Google Analytics for user behavior insights

### 🔧 **Technical Capabilities**

| Operation | Description |
|-----------|-------------|
| **3D Rendering** | Optimized Three.js models with automatic LOD |
| **Code Splitting** | Route-based chunks for optimal loading |
| **State Persistence** | Zustand stores with localStorage sync |
| **API Caching** | Intelligent request deduplication |
| **Lazy Loading** | On-demand component loading for performance |

## 🛠️ Tech Stack

### 📊 **Core Framework & Libraries**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0 | UI framework |
| **Vite** | 5.0 | Build tool & dev server |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **React Router DOM** | 6.22 | Client-side routing |
| **Zustand** | 4.5 | State management |
| **Framer Motion** | 11.0 | Animations |

### 🎨 **3D Graphics**

| Library | Version | Purpose |
|---------|---------|---------|
| **Three.js** | r160 | 3D library core |
| **@react-three/fiber** | 8.15 | React renderer for Three.js |
| **@react-three/drei** | 9.92 | Useful Three.js helpers |

### 🔧 **Utilities & Services**

| Library | Version | Purpose |
|---------|---------|---------|
| **Axios** | 1.6 | HTTP client |
| **React Hook Form** | 7.51 | Form handling |
| **React Hot Toast** | 2.4 | Toast notifications |
| **React Icons** | 5.0 | Icon library |
| **date-fns** | 3.3 | Date formatting |
| **clsx** | 2.1 | Conditional className utility |

### 📈 **Analytics & Monitoring**

| Service | Purpose |
|---------|---------|
| **Sentry** | Error tracking & performance monitoring |
| **Google Analytics** | User behavior analytics |
| **Algolia** | Instant search and filtering |

### 💳 **Payments**

| Service | Purpose |
|---------|---------|
| **Razorpay** | Indian payment gateway |
| **Stripe** | International payment processing |

## 🚀 Getting Started

### ✅ **Prerequisites**

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**

### 📦 **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/your-org/furniqo.git
cd furniqo/frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
🔐 Environment Variables
Create a .env file in the frontend directory:

env
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
⚡ Available Scripts
Command	Description	Port
npm run dev	Start development server	http://localhost:3000
npm run build	Create production build	dist/ directory
npm run preview	Preview production build	http://localhost:4173
npm run lint	Run ESLint for code quality	-
🎯 First Run
bash
# Start the development server
npm run dev

# Open your browser to:
# http://localhost:3000
📁 Project Structure
text
frontend/
├── 📂 public/                      # Static assets
│   ├── 📂 models/                  # 3D model files (.glb, .gltf)
│   └── 📂 images/                  # Static images
│
├── 📂 src/
│   ├── 📂 components/              # Reusable UI components
│   │   ├── 📂 ui/                  # Basic UI primitives
│   │   ├── 📂 layout/              # Layout components
│   │   ├── 📂 product/             # Product-specific components
│   │   └── 📂 3d/                  # Three.js components
│   │
│   ├── 📂 pages/                   # Page components
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
│   │   ├── 📄 api.js
│   │   ├── 📄 productService.js
│   │   ├── 📄 orderService.js
│   │   └── 📄 authService.js
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   ├── 📄 formatters.js
│   │   ├── 📄 validators.js
│   │   └── 📄 constants.js
│   │
│   ├── 📂 data/                    # Static/mock data
│   │   └── 📄 products.json
│   │
│   ├── 📂 styles/                  # Global styles
│   │   └── 📄 globals.css
│   │
│   ├── 📄 App.jsx                  # Main app component
│   ├── 📄 main.jsx                 # Entry point
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
└── 📄 README.md                    # Documentation
🎨 Development Guidelines
📝 Code Style & Conventions
Component Structure

jsx
import React from 'react';
import { motion } from 'framer-motion';

const ComponentName = ({ prop1, prop2 }) => {
  const { state, action } = useStore();
  const handleClick = () => {};
  
  return <div>...</div>;
};

export default ComponentName;
Styling Rules

Use Tailwind CSS for all styling

Extend theme in tailwind.config.js for custom values

Use clsx for conditional className joining

State Management

Zustand for global state (auth, cart, wishlist, UI)

Local state with useState for component-specific data

API Calls

All API calls go through services/*.js

Use the configured Axios instance with interceptors

Performance

Lazy load routes using React.lazy()

Use React.memo() for expensive components

📝 Commit Messages
Follow the Conventional Commits format:

text
feat: add 3D product viewer
fix: resolve cart persistence issue
docs: update README with deployment guide
style: format tailwind classes
refactor: extract product card component
perf: implement image lazy loading
test: add cart store unit tests
chore: update dependencies
🚢 Deployment
🌐 Vercel Deployment (Recommended)
The project includes a vercel.json configuration:

json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
Steps to deploy:

Push to GitHub/GitLab/Bitbucket

Import project on Vercel

Framework Preset: Vite

Add environment variables (from .env)

Click "Deploy"

🔧 Manual Build
bash
# Create production build
npm run build

# Preview the build
npm run preview

# Or serve with any static file server
npx serve -s dist
✅ Pre-Deployment Checklist
All environment variables configured

API endpoints pointing to production

3D models optimized and compressed

Images optimized (use WebP format)

Lighthouse score > 90

Error boundaries tested

Analytics events verified

Payment gateways in production mode

🤝 Contributing
📋 Contribution Guidelines
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'feat: add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

🐛 Reporting Issues
Use the GitHub Issues page

Include browser and OS details

Provide steps to reproduce

Attach screenshots when possible

📄 License
This project is private and proprietary software.

text
PROPRIETARY SOFTWARE

Copyright (c) 2026 Furniqo

Unauthorized copying, distribution, modification, or use of this software,
via any medium, is strictly prohibited without explicit written permission
from the copyright holder.
👤 Contact
<div align="center">
Furniqo Development Team
https://img.shields.io/badge/Website-furniqo.com-blue?style=for-the-badge&logo=vercel
https://img.shields.io/badge/Email-support%2540furniqo.com-red?style=for-the-badge&logo=gmail
https://img.shields.io/badge/Twitter-@furniqo-1DA1F2?style=for-the-badge&logo=twitter
https://img.shields.io/badge/LinkedIn-Furniqo-0077B5?style=for-the-badge&logo=linkedin

</div>
📞 Support
Documentation: docs.furniqo.com

Issues: GitHub Issues

Email: support@furniqo.com

🌟 Browser Support
Browser	Minimum Version
Chrome	Latest 2 versions
Firefox	Latest 2 versions
Safari	Latest 2 versions
Edge	Latest 2 versions
3D features require WebGL support

<div align="center">
🛋️ Transform Your Space. Digitally.
https://img.shields.io/badge/Made%2520with-React-61DAFB?style=for-the-badge&logo=react
https://img.shields.io/badge/3D-Powered-000000?style=for-the-badge&logo=three.js
https://img.shields.io/badge/Built%2520with-Vite-646CFF?style=for-the-badge&logo=vite

© 2026 Furniqo. All rights reserved.

Experience furniture like never before — in stunning 3D.

</div>
