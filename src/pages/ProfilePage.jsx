import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  MapPinIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, token, isAuthenticated, updateUserProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistItems: 0,
    memberSince: null
  });
  
  // Edit state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile with stats (single API call)
        const profileResponse = await axios.get(`${baseUrl}/v1/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { user: userData, wishlist, orders } = profileResponse.data;
        setProfileData(userData);
        setStats({
          totalOrders: orders || 0,
          wishlistItems: wishlist || 0,
          memberSince: userData?.createdAt || user?.createdAt || null
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, isAuthenticated]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle edit field
  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  // Handle save field
  const handleSaveField = async () => {
    if (!editValue.trim()) {
      toast.error('Field cannot be empty');
      return;
    }

    // Validate name format (at least 2 characters, letters and spaces only)
    if (editingField === 'name') {
      if (editValue.length < 2) {
        toast.error('Name must be at least 2 characters long');
        return;
      }
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(editValue)) {
        toast.error('Name can only contain letters and spaces');
        return;
      }
    }

    // Validate phone format (10 digits)
    if (editingField === 'phone') {
      if (editValue.length !== 10 || !/^\d+$/.test(editValue)) {
        toast.error('Phone number must be 10 digits');
        return;
      }
    }

    setUpdating(true);
    try {
      const updateData = { [editingField]: editValue };
      await updateUserProfile(updateData);
      
      // Update local profile data
      setProfileData(prev => ({
        ...prev,
        [editingField]: editValue
      }));
      
      setEditingField(null);
      setEditValue('');
      toast.success(`${editingField === 'name' ? 'Name' : 'Phone'} updated successfully!`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please log in to view your profile
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                   
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold">{profileData?.name || user?.name}</h2>
                    
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      {editingField === 'name' ? (
                        <div className="mt-1 flex items-center space-x-2">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your full name"
                          />
                          <button
                            onClick={handleSaveField}
                            disabled={updating}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            {updating ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={updating}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 flex items-center justify-between group">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {profileData?.name || user?.name || 'Not provided'}
                          </div>
                          <button
                            onClick={() => handleEditField('name', profileData?.name || user?.name)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:text-indigo-800 transition-opacity"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email Address</label>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {profileData?.email || user?.email || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                      {editingField === 'phone' ? (
                        <div className="mt-1 flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter phone number (10 digits)"
                            maxLength="10"
                          />
                          <button
                            onClick={handleSaveField}
                            disabled={updating}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                          >
                            {updating ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <CheckIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={updating}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-gray-900 flex items-center justify-between group">
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {profileData?.phone || user?.phone || 'Not provided'}
                          </div>
                          <button
                            onClick={() => handleEditField('phone', profileData?.phone || user?.phone)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-indigo-600 hover:text-indigo-800 transition-opacity"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                  
                  </div>
                </div>

                {/* Account Status */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Account Status</span>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Quick Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Overview</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Orders</p>
                      <p className="text-xs text-gray-500">All time</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{stats.totalOrders}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-pink-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Wishlist Items</p>
                      <p className="text-xs text-gray-500">Saved products</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-pink-600">{stats.wishlistItems}</span>
                </div>

              
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-3 text-indigo-600" />
                  <span className="font-medium">View Orders</span>
                </Link>
                
                <Link
                  to="/wishlist"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <HeartIcon className="h-5 w-5 mr-3 text-pink-600" />
                  <span className="font-medium">My Wishlist</span>
                </Link>
                
                <Link
                  to="/cart"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-3 text-green-600" />
                  <span className="font-medium">Shopping Cart</span>
                </Link>
              </div>
            </div>

            {/* Account Security */}
          
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Account Type</h4>
              <p className="text-sm text-gray-900">Regular Customer</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Last Login</h4>
              <p className="text-sm text-gray-900">{formatDate(new Date())}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Email Preferences</h4>
              <p className="text-sm text-gray-900">Order updates and promotions</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Privacy Settings</h4>
              <p className="text-sm text-gray-900">Standard privacy protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 