import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  // Array of background images for rotation with fixed height parameter
  const backgroundImages = [
    "/cloth1.png",
    "/bg1.jpg",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&h=800&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&h=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&h=800&q=80"
  ];

  // Array of featured product images for rotation with consistent height
  const productImages = [
    "/homeW1.JPG",
    "/homeW2.JPG",
    "https://cdn.shopify.com/s/files/1/1762/5129/files/lehenga-choli-for-women-in-purple.jpg?v=1654655251",
    "https://clothsvilla.com/cdn/shop/products/SensationalPeachColoredSoftNetBaseFestiveWearDesignerGown_1_500x500.jpg?v=1660657846",
    "https://pictures.kartmax.in/cover/live/600x800/quality=6/sites/9s145MyZrWdIAwpU0JYS/product-images/cream_tissue_silk_anarkali_suit_for_women_1746517693a1142_1(5700).jpg"
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Set up interval for image rotation every 4 seconds (increased for smoother experience)
    const interval = setInterval(() => {
      setIsTransitioning(true);

      // After transition starts, update the image
      setTimeout(() => {
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setCurrentProductIndex((prevIndex) => (prevIndex + 1) % productImages.length);

        // Reset transition state with longer duration for smoother transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 700);
      }, 700);
    }, 4000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className={`absolute inset-0 bg-cover bg-center h-full w-full transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-70 scale-105' : 'opacity-100 scale-100'}`}
        style={{
          backgroundImage: `url('${backgroundImages[currentBgIndex]}')`,
          filter: 'brightness(0.85)',
          height: '800px' // Fixed height for consistency
        }}
      ></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 bg-yellow-500 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 min-h-[650px] md:min-h-[700px] flex items-center py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white max-w-xl">
            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <p className="text-sm font-medium">New Collection 2025</p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Style</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-gray-100 max-w-lg">
              Explore our latest collection of trendy and comfortable clothing for every occasion. Up to 50% off on selected items.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/categories/Men"
                className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center group"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Shop Men
                <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/categories/Women"
                className="px-8 py-4 bg-transparent border-2 border-white font-medium rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center group"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Shop Women
                <ArrowRightIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80" alt="User" />
                <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80" alt="User" />
                <img className="h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80" alt="User" />
              </div>
              <p className="text-sm text-gray-200">Trusted by 2,000+ customers</p>
            </div>
          </div>

          {/* Right Column - Featured Product */}
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="bg-gradient-to-br from-indigo-600/80 to-purple-600/80 rounded-xl p-1">
                <img
                  src={productImages[currentProductIndex]}
                  alt="Featured Collection"
                  className={`w-full h-[400px] object-cover rounded-lg transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-80 scale-105' : 'opacity-100 scale-100'}`}
                  style={{ height: '400px' }} /* Fixed height for consistency */
                />
              </div>
              <div className="mt-4 text-white">
                <h3 className="text-xl font-bold">Summer Collection</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-200">Starting from ₹2,999</p>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">New Arrival</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-yellow-400 text-gray-900 rounded-full px-4 py-2 font-bold text-sm transform rotate-12">
              50% OFF
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-full w-16 h-16 flex items-center justify-center font-bold text-sm shadow-lg">
              NEW
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#f9fafb
" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;