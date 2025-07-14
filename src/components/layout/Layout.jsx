import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { baseUrl } from '../../utils/constant';

const Layout = () => {
  const location = useLocation();
  const { setUser } = useAuth();

  const getProfile = async () => {
    const res = await axios.get(`${baseUrl}/v1/user/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_token_ecommerce')}`
      }
      

    });
    setUser(res?.data?.user);
  }
  
  // Scroll to top when navigating to a new page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    getProfile();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;