// src/App.jsx
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './store/AppProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

// Simple loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full  mb-4" />
      <p className="text-neutral-500 animate-pulse">Loading Furniqo...</p>
    </div>
  </div>
);

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Policies = lazy(() => import('./pages/Policies'));
const RoomInspiration = lazy(() => import('./pages/RoomInspiration'));
const CustomFurniture = lazy(() => import('./pages/CustomFurniture'));
const Offers = lazy(() => import('./pages/Offers'));
const NotFound = lazy(() => import('./pages/NotFound'));
const GiftCards = lazy(() => import('./pages/GiftCards'));
const Press = lazy(() => import('./pages/Press'));
const Careers = lazy(() => import('./pages/Careers'));
const Affiliate = lazy(() => import('./pages/Affiliate'));
const Trade = lazy(() => import('./pages/Trade'));

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <ScrollToTop />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
              },
            }}
          />
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="gift-cards" element={<GiftCards />} />
                  <Route path="press" element={<Press />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="affiliate" element={<Affiliate />} />
                  <Route path="trade" element={<Trade />} />
                  <Route path="policies/:type" element={<Policies />} />
                  <Route path="room-inspiration" element={<RoomInspiration />} />
                  <Route path="custom-furniture" element={<CustomFurniture />} />
                  <Route path="offers" element={<Offers />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </AnimatePresence>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;