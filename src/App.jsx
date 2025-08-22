import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import UPIPaymentPage from './pages/UPIPaymentPage';
import ContactPage from './pages/ContactPage';

import AdminLogin from './Admin/AdminLogin';
import AdminProtect from './components/auth/AdminProtect';
import ProductForm from './Admin/ProductForm';
import AdminLayout from './Admin/AdminLayout';
import AdminRedirect from './Admin/AdminRedirect';

import ProtectedRoute from './components/auth/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WhatsAppButton from './components/common/ScrollToTop';
import AdminDashboard from './Admin/AdminDashboard';
import ProductManagement from './Admin/ProductManagement';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <WhatsAppButton />
        <ToastContainer />
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
              


                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtect>
                      <AdminLayout />
                    </AdminProtect>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="product-form" element={<ProductForm />} />
                  <Route path="edit-product/:productId" element={<ProductForm />} />
                  <Route path="product-management" element={<ProductManagement />} />

                </Route>

                {/* Legacy admin routes for backward compatibility */}
                <Route path="/admin-dashboard" element={<AdminProtect><AdminRedirect to="/admin/dashboard" /></AdminProtect>} />
                <Route path="/product-form" element={<AdminProtect><AdminRedirect to="/admin/product-form" /></AdminProtect>} />
                <Route path="/edit-product/:productId" element={<AdminProtect><AdminRedirect to="/admin/edit-product/:productId" /></AdminProtect>} />
                <Route path="/product-management" element={<AdminProtect><AdminRedirect to="/admin/product-management" /></AdminProtect>} />


                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products/:productId" element={<ProductDetailPage />} />
                  <Route path="categories/:categoryId" element={<CategoryPage />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

                {/* Protected User Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="upi-payment" element={<UPIPaymentPage />} />
                  <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="contact" element={<ContactPage />} />
                </Route>

              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
