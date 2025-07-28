import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, Upload, Package, DollarSign, TrendingUp, AlertCircle, X, Check, Camera, Star } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Premium Wireless Headphones",
            category: "Electronics",
            price: 24999,
            stock: 45,
            status: "active",
            image: "/api/placeholder/80/80",
            sku: "WH-001",
            rating: 4.5,
            sales: 127,
            description: "High-quality wireless headphones with noise cancellation"
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            category: "Wearables",
            price: 16999,
            stock: 23,
            status: "active",
            image: "/api/placeholder/80/80",
            sku: "SW-002",
            rating: 4.2,
            sales: 89,
            description: "Advanced fitness tracking with heart rate monitor"
        },
        {
            id: 3,
            name: "Organic Cotton T-Shirt",
            category: "Clothing",
            price: 2499,
            stock: 0,
            status: "out_of_stock",
            image: "/api/placeholder/80/80",
            sku: "CT-003",
            rating: 4.8,
            sales: 245,
            description: "Comfortable organic cotton t-shirt in various colors"
        },
        {
            id: 4,
            name: "Professional Camera Lens",
            category: "Photography",
            price: 74999,
            stock: 12,
            status: "active",
            image: "/api/placeholder/80/80",
            sku: "CL-004",
            rating: 4.9,
            sales: 34,
            description: "Professional 50mm f/1.4 lens for DSLR cameras"
        },
        {
            id: 5,
            name: "Gaming Mechanical Keyboard",
            category: "Electronics",
            price: 12499,
            stock: 67,
            status: "active",
            image: "/api/placeholder/80/80",
            sku: "KB-005",
            rating: 4.6,
            sales: 156,
            description: "RGB mechanical keyboard with blue switches"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [editingPrice, setEditingPrice] = useState(null);
    const [editingStock, setEditingStock] = useState(null);
    const [tempPrice, setTempPrice] = useState('');
    const [tempStock, setTempStock] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'active',
        sku: '',
        description: '',
        image: ''
    });

    const categories = ['Electronics', 'Clothing', 'Wearables', 'Photography', 'Home & Garden', 'Sports', 'Books'];
    const statuses = [
        { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
        { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
        { value: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-100 text-red-800' }
    ];

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // Statistics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.category && newProduct.price && newProduct.sku) {
            const product = {
                ...newProduct,
                id: Math.max(...products.map(p => p.id)) + 1,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock) || 0,
                rating: 0,
                sales: 0,
                image: "/api/placeholder/80/80"
            };
            setProducts([...products, product]);
            setNewProduct({
                name: '', category: '', price: '', stock: '', status: 'active', sku: '', description: '', image: ''
            });
            setShowAddModal(false);
        }
    };

    const handleEditProduct = () => {
        if (selectedProduct && selectedProduct.name && selectedProduct.category && selectedProduct.price && selectedProduct.sku) {
            setProducts(products.map(p =>
                p.id === selectedProduct.id
                    ? { ...selectedProduct, price: parseFloat(selectedProduct.price), stock: parseInt(selectedProduct.stock) || 0 }
                    : p
            ));
            setShowEditModal(false);
            setSelectedProduct(null);
        }
    };

    const handleDeleteProduct = () => {
        if (selectedProduct) {
            setProducts(products.filter(p => p.id !== selectedProduct.id));
            setShowDeleteModal(false);
            setSelectedProduct(null);
        }
    };

    const handleImageUpload = (e, setProduct, product) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProduct({ ...product, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInlineEdit = (productId, field, value) => {
        const updatedProducts = products.map(p =>
            p.id === productId
                ? { ...p, [field]: field === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0 }
                : p
        );
        setProducts(updatedProducts);
    };

    const getStatusColor = (status) => {
        const statusObj = statuses.find(s => s.value === status);
        return statusObj ? statusObj.color : 'bg-gray-100 text-gray-800';
    };

    const ProductModal = ({ isOpen, onClose, title, onSubmit, product, setProduct, isEdit = false }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Product Name and SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                <input
                                    type="text"
                                    value={product.sku}
                                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter SKU"
                                />
                            </div>
                        </div>

                        {/* Category and Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={product.status}
                                    onChange={(e) => setProduct({ ...product, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {statuses.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                                <input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt="Product" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, setProduct, product)}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {isEdit ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ViewProductModal = ({ isOpen, onClose, product, onEdit }) => {
        const [editableProduct, setEditableProduct] = useState(null);

        useEffect(() => {
            if (product) {
                setEditableProduct({ ...product });
            }
        }, [product]);

        if (!isOpen || !editableProduct) return null;

        const handleChange = (e) => {
            const { name, value } = e.target;
            setEditableProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Image */}
                            <div className="space-y-4">
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={editableProduct.image}
                                        alt={editableProduct.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{editableProduct.name}</h2>
                                    <p className="text-sm text-gray-500">SKU: {editableProduct.sku}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editableProduct.price}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Stock</p>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={editableProduct.stock}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                        <span className="inline-block mt-1 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                                            {editableProduct.category}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                        <span className="inline-block mt-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {editableProduct.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Rating</p>
                                        <div className="flex items-center mt-1">
                                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-lg font-semibold">{editableProduct.rating}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Sales</p>
                                        <p className="text-lg font-semibold text-gray-900">{editableProduct.sales}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                                    <p className="text-gray-700 leading-relaxed">
                                        {editableProduct.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            onClick={() => {
                                onClose();
                                if (onEdit) onEdit(editableProduct);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
                            <p className="text-gray-600">Manage your e-commerce product catalog</p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                            <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            <button className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Products</p>
                                <p className="text-2xl font-bold text-gray-900">{activeProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                {statuses.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="stock">Stock</option>
                                <option value="sales">Sales</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    <img className="h-12 w-12 rounded-lg object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingPrice === product.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={tempPrice}
                                                        onChange={(e) => setTempPrice(e.target.value)}
                                                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleInlineEdit(product.id, 'price', tempPrice);
                                                                setEditingPrice(null);
                                                                setTempPrice('');
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            handleInlineEdit(product.id, 'price', tempPrice);
                                                            setEditingPrice(null);
                                                            setTempPrice('');
                                                        }}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingPrice(null);
                                                            setTempPrice('');
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingPrice(product.id);
                                                        setTempPrice(product.price);
                                                    }}
                                                    className="text-left hover:bg-gray-50 px-2 py-1 rounded"
                                                >
                                                    ₹{product.price.toLocaleString()}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {editingStock === product.id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="number"
                                                        value={tempStock}
                                                        onChange={(e) => setTempStock(e.target.value)}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleInlineEdit(product.id, 'stock', tempStock);
                                                                setEditingStock(null);
                                                                setTempStock('');
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            handleInlineEdit(product.id, 'stock', tempStock);
                                                            setEditingStock(null);
                                                            setTempStock('');
                                                        }}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingStock(null);
                                                            setTempStock('');
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingStock(product.id);
                                                        setTempStock(product.stock);
                                                    }}
                                                    className={`text-left hover:bg-gray-50 px-2 py-1 rounded font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-yellow-600' : 'text-green-600'}`}
                                                >
                                                    {product.stock}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                                                {statuses.find(s => s.value === product.status)?.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="ml-1">{product.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.sales}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowEditModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-2 border rounded-md text-sm font-medium ${currentPage === page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* View Product Modal */}
                <ViewProductModal
                    isOpen={showViewModal}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedProduct(null);
                    }}
                    product={selectedProduct}
                />

                {/* Add Product Modal */}
                <ProductModal
                    isOpen={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setNewProduct({
                            name: '', category: '', price: '', stock: '', status: 'active', sku: '', description: '', image: ''
                        });
                    }}
                    title="Add New Product"
                    onSubmit={handleAddProduct}
                    product={newProduct}
                    setProduct={setNewProduct}
                />

                {/* Edit Product Modal */}
                <ProductModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedProduct(null);
                    }}
                    title="Edit Product"
                    onSubmit={handleEditProduct}
                    product={selectedProduct || {}}
                    setProduct={setSelectedProduct}
                    isEdit={true}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <Trash2 className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Product</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleDeleteProduct}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedProduct(null);
                                    }}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProductManagement;