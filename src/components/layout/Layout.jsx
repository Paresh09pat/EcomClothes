import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { validateToken } = useAuth();

  useEffect(() => {
    validateToken();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;