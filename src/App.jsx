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

import AdminLogin from './Admin/AdminLogin';
import AdminProtect from './components/auth/AdminProtect';
import ProductForm from './Admin/ProductForm';

import ProtectedRoute from './components/auth/ProtectedRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/common/ScrollToTop';
import AdminDashboard from './Admin/AdminDashboard';
import ProductManagement from './Admin/ProductManagement';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
      <ScrollToTop />
        <ToastContainer />
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>

                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/product-management" element={<ProductManagement />} />


                {/* Admin Protected Route */}
                <Route
                  path="/product-form"
                  element={
                    <AdminProtect>
                      <ProductForm />
                    </AdminProtect>
                  }
                />

                
                <Route element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="products/:productId" element={<ProductDetailPage />} />
                  <Route path="categories/:categoryId" element={<CategoryPage />} />
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
                  <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
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
