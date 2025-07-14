import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { baseUrl } from '../utils/constant';

// Sample products data
const allProducts = [
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
  },
  {
    id: 9,
    name: 'Kids T-Shirt',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'kids',
  },
  {
    id: 10,
    name: 'Kids Jeans',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'kids',
  }
];

// Category titles and descriptions
const categoryInfo = {
  men: {
    title: "Men's Collection",
    description: "Discover our range of stylish and comfortable men's clothing for every occasion."
  },
  women: {
    title: "Women's Collection",
    description: "Explore our latest women's fashion with styles for every season and occasion."
  },
  kids: {
    title: "Kids' Collection",
    description: "Comfortable and durable clothing for children of all ages."
  },
  accessories: {
    title: "Accessories",
    description: "Complete your look with our range of stylish accessories."
  }
};



const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {

    try {
      const response = await fetch(`${baseUrl}/v1/products/category/${categoryId}`);
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  


  useEffect(() => {
    getProducts();
  }, [categoryId]);

  const category = categoryInfo[categoryId] || {
    title: 'Products',
    description: 'Browse our collection of products.'
  };

  return (
    <div className="container py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
      </header>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 