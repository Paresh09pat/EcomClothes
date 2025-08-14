import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, Trash2, Eye, Filter, Package, Plus, X, Star, CheckCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from 'lodash';

const ProductManagement = () => {
    // Currency configuration
    const currency = {
        symbol: '₹',
        code: 'INR',
        name: 'Indian Rupee'
    };

    // Pagination configuration
    const ITEMS_PER_PAGE = 10;
    
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [lastRefresh, setLastRefresh] = useState(null);

    const { adminToken } = useAuth();


    const getPageInfo = (currentPage, totalItems, itemsPerPage = ITEMS_PER_PAGE) => {
        if (totalItems <= 0) return { startItem: 0, endItem: 0 };
        const startItem = ((currentPage - 1) * itemsPerPage) + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        return { startItem, endItem };
    };

    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !paginationLoading) {
            setPaginationLoading(true);
            try {
                setCurrentPage(newPage);
                // Fetch new data for the selected page
                await getAllProducts(false, newPage, ITEMS_PER_PAGE);
            } catch (error) {
                console.error('Error changing page:', error);
                showNotification('Failed to load page', 'error');
            } finally {
                setPaginationLoading(false);
            }
        }
    };

    // Format currency function
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return `${currency.symbol}0.00`;
        const number = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(number)) return `${currency.symbol}0.00`;

        return `${currency.symbol}${number.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Show notification function
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        const timeoutId = setTimeout(() => {
            setNotification({ show: false, message: '', type: '' });
        }, 5000);
        
        window.notificationTimeout = timeoutId;
    };

    // Cleanup notification timeout on unmount
    useEffect(() => {
        return () => {
            if (window.notificationTimeout) {
                clearTimeout(window.notificationTimeout);
            }
        };
    }, []);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce(async (value) => {
            setSearchTerm(value);
            setCurrentPage(1);
            setFilterLoading(true);
            try {
                await getAllProducts(false, 1, ITEMS_PER_PAGE);
            } finally {
                setFilterLoading(false);
            }
        }, 500),
        [searchTerm, categoryFilter]
    );

    // Handle search and category filter changes
    useEffect(() => {
        if (adminToken) {
            setFilterLoading(true);
            getAllProducts(false, 1, ITEMS_PER_PAGE)
                .finally(() => setFilterLoading(false));
        }
    }, [searchTerm, categoryFilter]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedSearch(value);
    };

        // Get all products
        const getAllProducts = async (forceRefresh = false, page = currentPage, limit = ITEMS_PER_PAGE) => {
            try {
            setLoading(true);
            
            if (forceRefresh) {
                // Clear cache when force refreshing
                window.allProductsCache = null;
            }
            
            // Build query parameters
            const params = {
                page: page,
                limit: limit
            };
            
            // Only add search parameter if it has a value
            if (searchTerm && searchTerm.trim()) {
                params.search = searchTerm.trim();
            }
            
            // Only add category parameter if it's not 'all'
            if (categoryFilter && categoryFilter !== 'all') {
                params.category = categoryFilter;
            }
            
            const response = await axios.get(`${baseUrl}/admin/get-all-products`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                },
                params: params
            });

            if (response.data.success) {
                // Set products from API response
                setProducts(response.data.products || []);
                setTotalProducts(response.data.totalProducts || 0);
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(response.data.currentPage || 1);
                
                setLastRefresh(new Date());
                
            } else {
                showNotification('Failed to fetch products', 'error');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch products';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Delete product
    const deleteProduct = async (productId) => {
        try {
            setLoading(true);
            const response = await axios.delete(`${baseUrl}/admin/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

            if (response.data.success) {
                // Refresh the current page to show updated data
                await getAllProducts(false, currentPage, ITEMS_PER_PAGE);
                setShowDeleteModal(false);
                setSelectedProduct(null);
                showNotification('Product deleted successfully!', 'success');
            } else {
                showNotification(response.data.message || 'Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Failed to delete product. Please try again.';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Parse sizes from JSON string or array of mixed strings/JSON strings
    const parseSizes = (sizeData) => {
        try {
            // If sizeData is already an array
            if (Array.isArray(sizeData)) {
                return sizeData.flatMap(item => {
                    try {
                        // Try to parse each item as JSON (in case it's a JSON string)
                        const parsed = JSON.parse(item);
                        return Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                        // If parsing fails, treat as regular string
                        return [item];
                    }
                });
            }
            // If sizeData is a JSON string
            const parsed = JSON.parse(sizeData);
            return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            // If all parsing fails, return empty array
            return [];
        }
    };

    // Get product image URL (handles both images and imageUrls arrays)
    const getProductImageUrl = (product) => {
        if (product.images && product.images.length > 0 && product.images[0].url) {
            return product.images[0].url;
        }
        if (product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0]) {
            return product.imageUrls[0];
        }
        return '/placeholder-image.jpg';
    };

    // Get all product images for gallery display
    const getAllProductImages = (product) => {
        let images = [];
        
        // Add Cloudinary images
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const cloudinaryImages = product.images.map(img => 
                typeof img === 'object' && img.url ? img.url : img
            );
            images = [...images, ...cloudinaryImages];
        }
        
        // Add imageUrls
        if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
            images = [...images, ...product.imageUrls];
        }
        
        // Filter out invalid URLs
        images = images.filter(img => img && typeof img === 'string' && img.trim() !== '');
        
        return images;
    };

    // Get unique categories
    const getCategories = () => {
        const categories = [...new Set(products.map(product => product.category))];
        return categories;
    };

    // Handle category filter change
    const handleCategoryFilter = async (category) => {
        setCategoryFilter(category);
        setCurrentPage(1);
        setFilterLoading(true);
        try {
            await getAllProducts(false, 1, ITEMS_PER_PAGE);
        } finally {
            setFilterLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (adminToken) {
            getAllProducts(false, 1, ITEMS_PER_PAGE);
        }
    }, [adminToken]);

    // Refresh data when page becomes visible (user returns from edit)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && adminToken) {
                getAllProducts(true, currentPage, ITEMS_PER_PAGE); // Force refresh when returning, maintain current page
            }
        };

        const handleFocus = () => {
            if (adminToken) {
                getAllProducts(true, currentPage, ITEMS_PER_PAGE); // Force refresh when window gets focus, maintain current page
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [adminToken, currentPage]);

    // Keyboard navigation for product preview
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showViewModal && selectedProduct) {
                const allImages = getAllProductImages(selectedProduct);
                if (allImages.length > 1) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        setSelectedImageIndex(prev => 
                            prev === 0 ? allImages.length - 1 : prev - 1
                        );
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        setSelectedImageIndex(prev => 
                            prev === allImages.length - 1 ? 0 : prev + 1
                        );
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showViewModal, selectedProduct]);


        return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl border-l-4 max-w-md transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-white text-green-800 border-l-green-500 shadow-green-100' 
                        : 'bg-white text-red-800 border-l-red-500 shadow-red-100'
                }`}>
                    <div className="flex items-start">
                        <div className={`flex-shrink-0 ${
                            notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {notification.type === 'success' ? (
                                <CheckCircle size={20} />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                                    <span className="text-xs font-bold">!</span>
                        </div>
                                    )}
                                </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                        <button
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-lg">×</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span>Loading...</span>
                                </div>
                            </div>
                        </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                        <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
                        <p className="text-gray-600">Manage your product catalog and inventory</p>
                        </div>
                    <div className="flex gap-3">
                        <Link 
                            to="/admin-dashboard" 
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                        <button
                            onClick={async () => {
                                setCurrentPage(1);
                                setLoading(true);
                                try {
                                    await getAllProducts(true, 1, ITEMS_PER_PAGE); // Force refresh and reset to page 1
                                    showNotification('Products refreshed!', 'success');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Refresh products from server"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                        <Link 
                            to="/admin/product-form" 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                                    Add Product
                                </Link>
                    </div>
                </div>

                {/* Last Refresh Info */}
                {lastRefresh && (
                    <div className="mb-4 text-center">
                        <p className="text-sm text-gray-500">
                            Last refreshed: {lastRefresh.toLocaleTimeString()} 
                            <span className="ml-2 text-green-600">
                                ({totalProducts} products loaded)
                            </span>
                        </p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{getCategories().length}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Filter className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Current Page</p>
                                <p className="text-2xl font-bold text-gray-900">{currentPage} of {totalPages}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Eye className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 relative">
                    {/* Filter Loading Indicator */}
                    {filterLoading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-600">Applying filters...</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search products by name, description, or category..."
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    disabled={filterLoading}
                                />
                                {filterLoading && (
                                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                                {inputValue && !filterLoading && (
                                    <button
                                        onClick={async () => {
                                            setInputValue('');
                                            setSearchTerm('');
                                            setCurrentPage(1);
                                            setFilterLoading(true);
                                            try {
                                                await getAllProducts(false, 1, ITEMS_PER_PAGE);
                                            } finally {
                                                setFilterLoading(false);
                                            }
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        title="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 h-5 w-5" />
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={categoryFilter}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                disabled={filterLoading}
                            >
                                <option value="all">All Categories</option>
                                {getCategories().map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {filterLoading && (
                                <div className="ml-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Search Results Indicator */}
                    {(searchTerm || categoryFilter !== 'all') && !filterLoading && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    <span>
                                        {searchTerm && `Searching for: "${searchTerm}"`}
                                        {searchTerm && categoryFilter !== 'all' && ' and '}
                                        {categoryFilter !== 'all' && `Category: ${categoryFilter}`}
                                    </span>
                                </div>
                                <span className="font-medium">
                                    Found {totalProducts} product{totalProducts !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-16 w-16">
                                                    <img
                                                        className="h-16 w-16 rounded-lg object-cover"
                                                        src={getProductImageUrl(product)}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4 bg">
                                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 line-clamp-2" style={{ maxWidth: '350px', wordBreak: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                                                        {product.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(product.price)}
                                                </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {parseSizes(product.size).map((size, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                    >
                                                        {size}
                                                    </span>
                                                ))}
                                                </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.isFeatured ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    Featured
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Regular
                                            </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setSelectedImageIndex(0); // Reset to first image
                                                    setShowViewModal(true);
                                                }}
                                                    disabled={loading}
                                                    className={`p-1 rounded ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'}`}
                                                    title="View Details"
                                            >
                                                    <Eye size={16} />
                                            </button>
                                                <Link
                                                    to={`/admin/edit-product/${product._id}`}
                                                    className={`p-1 rounded ${loading ? 'text-gray-400 cursor-not-allowed pointer-events-none' : 'text-green-600 hover:text-green-900'}`}
                                                    title="Edit Product"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowDeleteModal(true);
                                                }}
                                                    disabled={loading}
                                                    className={`p-1 cursor-pointer rounded ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                                    title="Delete Product"
                                            >
                                                    <Trash2 size={16} />
                                            </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 relative">
                            {/* Pagination Loading Indicator */}
                            {paginationLoading && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-sm text-gray-600">Loading...</span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1 || paginationLoading}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages || paginationLoading}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        {(() => {
                                            const { startItem, endItem } = getPageInfo(currentPage, totalProducts);
                                            return (
                                                <>
                                                    Showing <span className="font-medium">{startItem}</span> to{' '}
                                                    <span className="font-medium">{endItem}</span> of{' '}
                                                    <span className="font-medium">{totalProducts}</span> results
                                                </>
                                            );
                                        })()}
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1 || paginationLoading}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                disabled={paginationLoading}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === page
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${paginationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || paginationLoading}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* No products message */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || categoryFilter !== 'all' 
                                ? `No products found matching your search criteria. Try adjusting your search or filter.`
                                : 'Get started by adding your first product.'
                            }
                        </p>
                        {(searchTerm || categoryFilter !== 'all') && (
                            <div className="mt-4">
                                <button
                                    onClick={async () => {
                                        setInputValue('');
                                        setSearchTerm('');
                                        setCategoryFilter('all');
                                        setCurrentPage(1);
                                        setFilterLoading(true);
                                        try {
                                            await getAllProducts(false, 1, ITEMS_PER_PAGE);
                                        } finally {
                                            setFilterLoading(false);
                                        }
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <X className="-ml-1 mr-2 h-4 w-4" />
                                    Clear all filters
                                </button>
                            </div>
                        )}
                        {!searchTerm && categoryFilter === 'all' && (
                            <div className="mt-6">
                                <Link
                                    to="/admin/product-form"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                                    Add Product
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                </div>

                {/* View Product Modal */}
            {showViewModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                                <button
                                    onClick={() => {
                        setShowViewModal(false);
                        setSelectedProduct(null);
                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Product Image Gallery */}
                                <div className="flex justify-center">
                                    {(() => {
                                        const allImages = getAllProductImages(selectedProduct);
                                        if (allImages.length === 0) {
                                            return (
                                                <div className="w-64 h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                                                    <span className="text-gray-400">No Image Available</span>
                                                </div>
                                            );
                                        }
                                        
                                        if (allImages.length === 1) {
                                            return (
                                                <img
                                                    src={allImages[0]}
                                                    alt={selectedProduct.name}
                                                    className="w-64 h-64 object-cover rounded-lg shadow-md"
                                                    onError={(e) => {
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            );
                                        }
                                        
                                        // Multiple images - show gallery with navigation
                                        return (
                                            <div className="space-y-4">
                                                {/* Main Image */}
                                                <div className="relative">
                                                    <img
                                                        src={allImages[selectedImageIndex]}
                                                        alt={selectedProduct.name}
                                                        className="w-64 h-64 object-cover rounded-lg shadow-md"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">
                                                        {selectedImageIndex + 1} / {allImages.length}
                                                    </div>
                                                    
                                                    {/* Navigation Arrows */}
                                                    {allImages.length > 1 && (
                                                        <>
                                                            {/* Previous Button */}
                                                            <button
                                                                onClick={() => setSelectedImageIndex(prev => 
                                                                    prev === 0 ? allImages.length - 1 : prev - 1
                                                                )}
                                                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all shadow-lg"
                                                                aria-label="Previous image"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                </svg>
                                                            </button>
                                                            
                                                            {/* Next Button */}
                                                            <button
                                                                onClick={() => setSelectedImageIndex(prev => 
                                                                    prev === allImages.length - 1 ? 0 : prev + 1
                                                                )}
                                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all shadow-lg"
                                                                aria-label="Next image"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {/* Thumbnail Gallery */}
                                                <div className="flex gap-2 overflow-x-auto justify-center">
                                                    {allImages.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`${selectedProduct.name} - Image ${index + 1}`}
                                                            className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition-all ${
                                                                index === selectedImageIndex 
                                                                    ? 'border-blue-500 scale-110' 
                                                                    : 'border-gray-300 hover:border-blue-400'
                                                            }`}
                                                            onClick={() => setSelectedImageIndex(index)}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                
                                                {/* Image Info */}
                                                <div className="text-center text-sm text-gray-600">
                                                    Image {selectedImageIndex + 1} of {allImages.length}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Product Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                                        <div className="space-y-2">
                                            <p><strong>Name:</strong> {selectedProduct.name}</p>
                                            <p><strong>Category:</strong> {selectedProduct.category}</p>
                                            <p><strong>Price:</strong> {formatCurrency(selectedProduct.price)}</p>
                                            <p><strong>Featured:</strong> {selectedProduct.isFeatured ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
                                        <div className="space-y-2">
                                            <p><strong>Product ID:</strong> {selectedProduct._id}</p>
                                            <p><strong>Created:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                                            <p><strong>Updated:</strong> {new Date(selectedProduct.updatedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600">{selectedProduct.description}</p>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Available Sizes</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {parseSizes(selectedProduct.size).map((size, index) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

                {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="mx-auto cursor-pointer flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                            Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                onClick={() => deleteProduct(selectedProduct._id)}
                                disabled={loading}
                                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                {loading ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedProduct(null);
                                    }}
                                disabled={loading}
                                className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default ProductManagement;