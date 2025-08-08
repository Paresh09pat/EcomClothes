import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

/**
 * ScrollToTop component that:
 * 1. Automatically scrolls to top when navigating between pages
 * 2. Shows a scroll-to-top button when user scrolls down
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Automatically scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;