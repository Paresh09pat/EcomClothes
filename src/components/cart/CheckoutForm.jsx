import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinIcon, ShieldCheckIcon, TruckIcon, BanknotesIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const CheckoutForm = ({ onSubmit, loading, initialValues = {} }) => {
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

  const [addressType, setAddressType] = useState('home');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...formData, addressType});
  };

  // Calculate totals
  const subtotal = 2499.98; // Sample subtotal
  const discount = subtotal * 0.05; // 5% discount
  const shipping = 0;
  const total = subtotal + shipping - discount;

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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your first name"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your last name"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="example@email.com"
              />
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
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your 10-digit mobile number"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">We'll send order updates to this number</p>
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
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="House No., Building Name, Street, Area"
                />
              </div>
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your city"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your state"
              />
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
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="6-digit PIN code"
              />
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
              <span className="text-base font-bold">₹{total.toFixed(2)}</span>
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