import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/common/Pagination';
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
  let { categoryId } = useParams();
  
  // Pagination configuration
  const ITEMS_PER_PAGE = 20;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  if (categoryId === 'topSelling') {
    categoryId = 'Men';
  }

  const getProducts = async (page = currentPage, limit = ITEMS_PER_PAGE) => {
    try {
      setPaginationLoading(true);
      const response = await fetch(`${baseUrl}/v1/products/category/${categoryId}?page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products || []);
        setTotalProducts(data.totalProducts || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || page);
      } else {
        console.error('Error fetching products:', data.message);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
      
      setLoading(false);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      setLoading(false);
      return [];
    } finally {
      setPaginationLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !paginationLoading) {
      setCurrentPage(newPage);
      await getProducts(newPage, ITEMS_PER_PAGE);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    getProducts(1, ITEMS_PER_PAGE);
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
        
        {/* Results count */}
        {!loading && totalProducts > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {totalProducts} product{totalProducts !== 1 ? 's' : ''} in this category
          </div>
        )}
      </header>

      {loading ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p>Loading products...</p>
          </div>
        </div>
      ) : products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          
          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalProducts}
              itemsPerPage={ITEMS_PER_PAGE}
              loading={paginationLoading}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 