import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const categories = [
  {
    id: 'Men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Shop the latest trends in men\'s fashion.',
    itemCount: '1,200+ Items',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'Women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Discover our collection of women\'s clothing.',
    itemCount: '1,500+ Items',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'Kids',
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Comfortable and stylish clothes for children.',
    itemCount: '850+ Items',
    color: 'from-yellow-400 to-orange-500'
  },
  // {
  //   id: 'accessories',
  //   name: 'Accessories',
  //   image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  //   description: 'Complete your look with our accessories.',
  //   itemCount: '950+ Items',
  //   color: 'from-teal-400 to-emerald-500'
  // }
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by Category</h2>
            <p className="mt-2 text-gray-600 max-w-2xl">Explore our wide range of products across different categories</p>
          </div>
         
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg h-80 flex items-end"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
              </div>
              
              {/* Content */}
              <div className="relative w-full p-6 text-white z-10">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium inline-block mb-2">
                  {category.itemCount}
                </div>
                <h3 className="text-2xl font-bold mb-1 transform group-hover:translate-x-2 transition-transform duration-300">{category.name}</h3>
                <p className="text-white/90 text-sm mb-4 transform group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  {category.description}
                </p>
                <div className="flex items-center transform group-hover:translate-x-3 transition-transform duration-300 delay-100">
                  <span className="text-sm font-medium mr-1">Shop Now</span>
                  <ArrowRightIcon className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-white/20 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;