import { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Eye, Package, Truck, CheckCircle, Clock, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from 'lodash';

const AdminDashboard = () => {
    // Currency configuration - fixed to Indian Rupee only
    const currency = {
        symbol: '₹',
        code: 'INR',
        name: 'Indian Rupee'
    };

    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const ordersPerPage = 10;

    const { adminToken } = useAuth();

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
        
        // Store timeout ID for cleanup
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

    // Pagination logic
    const getPaginatedOrders = () => {
        const startIndex = (currentPage - 1) * ordersPerPage;
        return allOrders.slice(startIndex, startIndex + ordersPerPage);
    };

    // Update pagination info when orders change
    useEffect(() => {
        setTotalOrders(allOrders.length);
        setTotalPages(Math.ceil(allOrders.length / ordersPerPage));
        // Reset to page 1 if current page is beyond available pages
        if (currentPage > Math.ceil(allOrders.length / ordersPerPage) && allOrders.length > 0) {
            setCurrentPage(1);
        }
    }, [allOrders.length, currentPage]);

    const getStatusColor = (status) => {
        const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
        switch (normalizedStatus) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped':
            case 'shipping': return 'bg-indigo-100 text-indigo-800';
            case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
        switch (normalizedStatus) {
            case 'pending': return <Clock size={16} />;
            case 'processing': return <Package size={16} />;
            case 'shipped':
            case 'shipping': return <Package size={16} />;
            case 'out_for_delivery': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled': return <span className="w-4 h-4 text-center">×</span>;
            default: return <Clock size={16} />;
        }
    };



    const deleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                setLoading(true);
                const response = await axios.delete(`${baseUrl}/admin/delete-order/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${adminToken}`
                    }
                });
                
                if (response.data.success) {
            const updatedOrders = allOrders.filter(order => order._id !== orderId);
            setAllOrders(updatedOrders);
                    showNotification('Order deleted successfully!', 'success');
                } else {
                    showNotification(response.data.message || 'Failed to delete order', 'error');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                const errorMessage = error.response?.data?.message || 
                                    error.response?.data?.error || 
                                    error.message || 
                                    'Failed to delete order. Please try again.';
                showNotification(errorMessage, 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    const saveEditedOrder = async (editedOrder) => {
        try {
            setLoading(true);
            
            // Validate status is selected
            if (!editedOrder?.status?.trim()) {
                showNotification('Please select a status', 'error');
                return;
            }
            
            const response = await axios.put(`${baseUrl}/admin/update-order/${editedOrder._id}`, 
                {
                    status: editedOrder.status
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
                        if (response.data.success) {
                const updatedOrders = allOrders.map(order =>
                    order._id === editedOrder._id ? { ...order, status: editedOrder.status } : order
                );
                setAllOrders(updatedOrders);
                setEditingOrder(null);
                showNotification('Order status updated successfully!', 'success');
            } else {
                showNotification(response.data.message || 'Failed to update order', 'error');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                error.message || 
                                'Failed to update order. Please try again.';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status) => {
        return allOrders.filter(order => {
            const orderStatus = order.status.toLowerCase().replace(/\s+/g, '_');
            const targetStatus = status.toLowerCase().replace(/\s+/g, '_');
            return orderStatus === targetStatus;
        }).length;
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 500),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);         // update the UI immediately
        debouncedSearch(value);       // update searchTerm after 500ms
    };

    const getAllOrders = async () => {
        try {
            const response = await axios.get(`${baseUrl}/admin/get-all-orders`, {
                params: {
                    searchTerm,
                    filter: statusFilter
                },
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });
            setAllOrders(response.data.orders);
            setCurrentPage(1); // Reset to first page when fetching new data
        } catch (error) {
        }
    };

    useEffect(() => {
        getAllOrders();
    }, [searchTerm, statusFilter]);
    // Helper function to get order items summary
    const getOrderItemsSummary = (items) => {
        if (items.length === 1) {
            return items[0].product.name;
        }
        return `${items[0].product.name} +${items.length - 1} more`;
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notification Toast */}
            {notification.show && (
                <div className={`fixed top-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-xl border-l-4 max-w-xs sm:max-w-md transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-white text-green-800 border-l-green-500 shadow-green-100' 
                        : 'bg-white text-red-800 border-l-red-500 shadow-red-100'
                }`}>
                    <div className="flex items-start">
                        <div className={`flex-shrink-0 ${
                            notification.type === 'success' ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {notification.type === 'success' ? (
                                <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                            ) : (
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-current flex items-center justify-center">
                                    <span className="text-xs font-bold">!</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-2 sm:ml-3 flex-1">
                            <p className="text-xs sm:text-sm font-medium">{notification.message}</p>
                        </div>
                        <button 
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="ml-2 sm:ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <span className="text-base sm:text-lg">×</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mx-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                            <span className="text-sm sm:text-base">Processing...</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Management Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Manage and track all your e-commerce orders</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{allOrders.length}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{getStatusCount('Pending')}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Processing</p>
                                <p className="text-xl sm:text-2xl font-bold text-blue-600">{getStatusCount('Processing')}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Shipped</p>
                                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{getStatusCount('Shipped')}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-indigo-100 rounded-full">
                                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Delivered</p>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">{getStatusCount('Delivered')}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                            <select
                                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Address</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getPaginatedOrders().map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                                                <div className="text-sm text-gray-500">{order.user.email}</div>
                                                <div className="text-sm text-gray-500">{order.user.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                                            <div className="text-sm text-gray-900">
                                                {getOrderItemsSummary(order.items)}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="hidden sm:inline">{order.status}</span>
                                                <span className="sm:hidden">{order.status.split(' ')[0]}</span>
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                                            <div className="text-sm text-gray-900">
                                                {order.address ? (
                                                    <div>
                                                        {order.address.city && <div>{order.address.city}</div>}
                                                        {order.address.state && <div className="text-gray-500 text-xs">{order.address.state}</div>}
                                                        {order.address.pincode && <div className="text-gray-500 text-xs">{order.address.pincode}</div>}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No address</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                            <div className="text-sm text-gray-900 capitalize">{order.paymentMethod}</div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    disabled={loading}
                                                    className={`p-1 rounded ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'}`}
                                                    title="View Details"
                                                >
                                                    <Eye size={14} className="sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingOrder(order)}
                                                    disabled={loading}
                                                    className={`p-1 rounded ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:text-green-900'}`}
                                                    title="Edit Order"
                                                >
                                                    <Edit size={14} className="sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order._id)}
                                                    disabled={loading}
                                                    className={`p-1 rounded ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
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
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{((currentPage - 1) * ordersPerPage) + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(currentPage * ordersPerPage, totalOrders)}</span> of{' '}
                                        <span className="font-medium">{totalOrders}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = i + Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        currentPage === page
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Empty State */}
                    {allOrders.length === 0 && (
                        <div className="bg-white px-4 py-12 text-center border-t border-gray-200">
                            <div className="text-gray-500">
                                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                <p className="text-sm text-gray-500">No orders match your current filters.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                                        <p><strong>Order ID:</strong> #{selectedOrder._id.slice(-8)}</p>
                                        <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status}
                                            </span>
                                        </p>
                                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
                                        <p><strong>Name:</strong> {selectedOrder.user.name}</p>
                                        <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.user.phone}</p>
                                    </div>
                                </div>

                                {/* Address Information */}
                                {selectedOrder.address && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            {selectedOrder.address.line1 && (
                                                <p><strong>Address:</strong> {selectedOrder.address.line1}</p>
                                            )}
                                            {selectedOrder.address.city && (
                                                <p><strong>City:</strong> {selectedOrder.address.city}</p>
                                            )}
                                            {selectedOrder.address.state && (
                                                <p><strong>State:</strong> {selectedOrder.address.state}</p>
                                            )}
                                            {selectedOrder.address.pincode && (
                                                <p><strong>Pincode:</strong> {selectedOrder.address.pincode}</p>
                                            )}
                                            {selectedOrder.address.country && (
                                                <p><strong>Country:</strong> {selectedOrder.address.country}</p>
                                            )}
                                            {(!selectedOrder.address.line1 && !selectedOrder.address.city && !selectedOrder.address.state && !selectedOrder.address.pincode && !selectedOrder.address.country) && (
                                                <p className="text-gray-500 italic">No address information available</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <img
                                                        src={getProductImageUrl(item.product)}
                                                        alt={item.product.name}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.jpg';
                                                        }}
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-sm sm:text-base truncate">{item.product.name}</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Category: {item.product.category}</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                        <p className="text-xs sm:text-sm text-gray-600">Size: {selectedOrder.selectedSize || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-sm sm:text-base ml-2">{formatCurrency(item.product.price)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-bold">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex justify-between items-center mb-4 sm:mb-6">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Order Status</h2>
                                    <p className="text-sm text-gray-600 mt-1">Note: Only order status can be updated. Customer details are read-only.</p>
                                </div>
                                <button
                                    onClick={() => setEditingOrder(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-md mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Customer Information (Read-only)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                                            <input
                                                type="text"
                                                value={editingOrder.user.name}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={editingOrder.user.email}
                                                disabled
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={editingOrder.user.phone}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-3 sm:p-4 rounded-md border border-blue-200">
                                    <label className="block text-sm font-medium text-blue-900 mb-1">
                                        Update Order Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={editingOrder.status}
                                        onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                                        disabled={loading}
                                        className={`w-full px-3 py-2 text-sm sm:text-base border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <p className="text-sm text-blue-700 mt-1">Current status: <span className="font-medium">{editingOrder.status}</span></p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                                    <button
                                        onClick={() => setEditingOrder(null)}
                                        disabled={loading}
                                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => saveEditedOrder(editingOrder)}
                                        disabled={loading}
                                        className={`px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;