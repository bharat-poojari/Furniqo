import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, FiPackage, FiHeart, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../store/AuthContext';
import { useWishlist } from '../store/WishlistContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { ProfileSkeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading, updateProfile, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      });
    }
  }, [user]);

  if (authLoading) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full px-[1%] sm:px-[1.5%] py-16 text-center">
        <FiUser className="h-20 w-20 text-neutral-300 dark:text-neutral-600  mb-6" />
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          Please Sign In
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          You need to be logged in to view your profile.
        </p>
        <Link to="/login">
          <Button variant="primary" size="lg">Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const success = await updateProfile(formData);
    setSaving(false);
    
    if (success) {
      toast.success('Profile updated successfully!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'orders', label: 'Orders', icon: FiPackage },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  ];

  return (
    <div className="w-full px-[1%] sm:px-[1.5%] py-8">
      <div className="max-w-5xl ">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full shadow-md flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
              <FiCamera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-neutral-500">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-900 text-primary-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-xs px-1.5 py-0.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-soft border border-neutral-100 dark:border-neutral-800 p-6 lg:p-8"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={FiUser}
              />
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                icon={FiMail}
                disabled
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={FiPhone}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={FiMapPin}
              />
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                type="submit"
                loading={saving}
                icon={FiSave}
                size="lg"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={logout}
                className="text-red-600"
                icon={FiLogOut}
              >
                Logout
              </Button>
            </div>
          </motion.form>
        )}

        {activeTab === 'wishlist' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <FiHeart className="h-12 w-12 text-neutral-300  mb-4" />
                <p className="text-neutral-500">Your wishlist is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <Link
                    key={item._id}
                    to={`/products/${item.slug}`}
                    className="bg-white dark:bg-neutral-900 rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow"
                  >
                    <img src={item.images[0]} alt={item.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center py-12">
              <Link to="/orders">
                <Button variant="primary" icon={FiPackage}>
                  View All Orders
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;