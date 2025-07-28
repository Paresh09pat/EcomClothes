import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, ShieldCheckIcon, TruckIcon, BanknotesIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const CheckoutForm = ({ onSubmit, loading, initialValues = {}, cart = [], total = 0 }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'cod', // Only COD available
    ...initialValues
  });

  const [errors, setErrors] = useState({});
  const [addressType, setAddressType] = useState('home');

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePinCode = (pinCode) => {
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(pinCode);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'PIN code is required';
    } else if (!validatePinCode(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({...formData, addressType});
    }
  };

  // Calculate totals from actual cart data
  const subtotal = total;
  const discount = 0; // No discount for now
  const shipping = 0;
  const finalTotal = subtotal + shipping - discount;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <span className="w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
          <h2 className="text-xl font-bold text-gray-900">SHIPPING DETAILS</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  className={`block w-full pl-10 border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your 10-digit mobile number"
                />
              </div>
              {errors.phone ? (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">We'll send order updates to this number</p>
              )}
            </div>
            
            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`block w-full pl-10 border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="House No., Building Name, Street, Area"
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
            
            {/* Address Type */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setAddressType('home')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${addressType === 'home' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setAddressType('work')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${addressType === 'work' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-700 border border-gray-200'}`}
                >
                  Work
                </button>
              </div>
            </div>
            
            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            
            {/* State */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State*
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your state"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
            
            {/* Zip Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                PIN Code*
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                maxLength="6"
                className={`mt-1 block w-full border rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.zipCode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="6-digit PIN code"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
          </div>
          
          <div className="mt-10">
            <div className="flex items-center mb-6">
              <span className="w-1.5 h-6 bg-blue-500 rounded-sm mr-2"></span>
              <h3 className="text-xl font-bold text-gray-900">PAYMENT METHOD</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white border border-blue-200 rounded-md p-4 border-blue-500 transition-colors">
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="paymentMethod"
                    type="radio"
                    value="cod"
                    checked={true}
                    readOnly
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 flex items-center">
                    <BanknotesIcon className="h-6 w-6 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                    <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Only Option Available</span>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-7">
                  Pay with cash upon delivery. Our delivery partner will collect the payment in Indian Rupees (₹).
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Discount:</span>
              <span className="text-sm font-medium text-green-600">-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Shipping:</span>
              <span className="text-sm font-medium text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
              <span className="text-base font-bold">Total:</span>
              <span className="text-base font-bold">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'PLACE ORDER'}
            </button>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">Safe and Secure Payments. 100% Authentic products.</p>
            </div>
            <div className="flex items-start">
              <TruckIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">Free delivery for orders above ₹499</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;