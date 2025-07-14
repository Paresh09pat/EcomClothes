import Hero from '../components/common/Hero';
import FeaturedCategories from '../components/common/FeaturedCategories';
import ProductGrid from '../components/products/ProductGrid';
import Testimonials from '../components/common/Testimonials';
import Newsletter from '../components/common/Newsletter';

// Sample data for featured products
const featuredProducts = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'men',
  },
  {
    id: 2,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'women',
  },
  {
    id: 3,
    name: 'Summer Dress',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'women',
  },
  {
    id: 4,
    name: 'Leather Sneakers',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'accessories',
  },
  {
    id: 5,
    name: 'Slim Fit Jeans',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'men',
  },
  {
    id: 6,
    name: 'Cotton Hoodie',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'men',
  },
  {
    id: 7,
    name: 'Floral Blouse',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'women',
  },
  {
    id: 8,
    name: 'Leather Belt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'accessories',
  }
];

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      <Testimonials />
      {/* <Newsletter /> */}
    </div>
  );
};

export default HomePage; 