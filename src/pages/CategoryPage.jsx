import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { baseUrl } from '../utils/constant';



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