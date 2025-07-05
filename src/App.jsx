import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Spinner for lazy loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastContainer />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* 🔓 Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<HomePage />} />
                    <Route path="products/:productId" element={<ProductDetailPage />} />
                    <Route path="categories/:categoryId" element={<CategoryPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
