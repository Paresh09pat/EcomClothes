import ProductCard from './ProductCard';

const ProductGrid = ({ products, title }) => {
  return (
    <div>
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid; 