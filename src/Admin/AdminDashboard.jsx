import { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Eye, Package, Truck, CheckCircle, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Filter orders based on search and status
    // useEffect(() => {
    //     let filtered = allOrders;

    //     if (searchTerm) {
    //         filtered = filtered.filter(order =>
    //             order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             order.items.some(item =>
    //                 item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    //             )
    //         );
    //     }

    //     if (statusFilter !== 'all') {
    //         filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
    //     }

    //     setOrders(filtered);
    //     setCurrentPage(1);
    // }, [searchTerm, statusFilter, allOrders]);

    // Pagination
    // const totalPages = Math.ceil(orders.length / ordersPerPage);
    // const startIndex = (currentPage - 1) * ordersPerPage;
    // const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

    const getStatusColor = (status) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'shipping': return 'bg-blue-100 text-blue-800';
            case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case 'pending': return <Clock size={16} />;
            case 'shipping': return <Package size={16} />;
            case 'out_for_delivery': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = allOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
        );
        setAllOrders(updatedOrders);
    };

    const deleteOrder = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            const updatedOrders = allOrders.filter(order => order._id !== orderId);
            setAllOrders(updatedOrders);
        }
    };

    const saveEditedOrder = (editedOrder) => {
        const updatedOrders = allOrders.map(order =>
            order._id === editedOrder._id ? { ...editedOrder } : order
        );
        setAllOrders(updatedOrders);
        setEditingOrder(null);
    };

    const getStatusCount = (status) => {
        return allOrders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length;
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
            console.log(response.data);
            setAllOrders(response.data.orders);
        } catch (error) {
            console.log(error);
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

    console.log(orders);
    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management Dashboard</h1>
                        <p className="text-gray-600">Manage and track all your e-commerce orders</p>
                    </div>
                    <Link to="/product-form" className='bg-blue-500 text-white px-4 py-2 rounded-md'>Add Product</Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{allOrders.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Shipping</p>
                                <p className="text-2xl font-bold text-blue-600">{getStatusCount('shipping')}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">{getStatusCount('delivered')}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search by Order ID, Customer Name, Email, or Product..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="text-gray-400 h-5 w-5" />
                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="shipping">Shipping</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                                                <div className="text-sm text-gray-500">{order.user.email}</div>
                                                <div className="text-sm text-gray-500">{order.user.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">
                                                {getOrderItemsSummary(order.items)}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{order.paymentMethod}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingOrder(order)}
                                                    className="text-green-600 hover:text-green-900 p-1 rounded"
                                                    title="Edit Order"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteOrder(order._id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded"
                                                    title="Delete Order"
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
                    {/* {totalPages > 1 && ( */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                // g352disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
                                // disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{1}</span> to{' '}
                                    <span className="font-medium">{Math.min(1 + 1, allOrders.length)}</span> of{' '}
                                    <span className="font-medium">{allOrders.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        // disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {Array.from({ length: 1 }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(Math.min(1, currentPage + 1))}
                                        // disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* )} */}
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
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

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.product.imageUrls[0]}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-gray-600">Category: {item.product.category}</p>
                                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">{formatCurrency(item.product.price)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-bold">Total: {formatCurrency(selectedOrder.totalAmount)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Pending', 'Shipping', 'Out for Delivery', 'Delivered'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    updateOrderStatus(selectedOrder._id, status);
                                                    setSelectedOrder({ ...selectedOrder, status });
                                                }}
                                                className={`px-3 py-1 rounded text-sm font-medium ${selectedOrder.status === status
                                                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
                                <button
                                    onClick={() => setEditingOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            value={editingOrder.user.name}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                user: { ...editingOrder.user, name: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={editingOrder.user.email}
                                            onChange={(e) => setEditingOrder({
                                                ...editingOrder,
                                                user: { ...editingOrder.user, email: e.target.value }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editingOrder.user.phone}
                                        onChange={(e) => setEditingOrder({
                                            ...editingOrder,
                                            user: { ...editingOrder.user, phone: e.target.value }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={editingOrder.status}
                                        onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipping">Shipping</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setEditingOrder(null)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => saveEditedOrder(editingOrder)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Save Changes
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