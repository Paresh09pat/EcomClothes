import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0,0,0,0.6)"
        }}
      />
      
      {/* Content */}
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Summer Collection 2025
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Discover the latest trends in fashion and explore our new collection.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/categories/women" 
              className="btn bg-indigo-600 hover:bg-indigo-700"
            >
              Shop Women
            </Link>
            <Link 
              to="/categories/men" 
              className="btn bg-transparent border-2 border-white hover:bg-white hover:text-gray-900"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 