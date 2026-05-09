'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Search, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
    const { token } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4500/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await axios.put(`http://localhost:4500/api/orders/${orderId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = orders.filter(o => {
        const matchesSearch = 
            o._id?.toLowerCase().includes(search.toLowerCase()) ||
            o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            o.user?.email?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
                <p className="text-gray-500 mt-1">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text" placeholder="Search by order ID or customer..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 shadow-sm"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl text-sm px-4 py-3 pr-10 focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-600 shadow-sm font-medium cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(7)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length > 0 ? filtered.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                                        #{order._id?.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">{order.user?.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-400">{order.user?.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                        {order.cartItems?.length || order.orderItems?.length || 0} item(s)
                                    </td>
                                    <td className="px-6 py-4 font-extrabold text-gray-900">
                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                            month: 'short', day: 'numeric', year: 'numeric' 
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order._id, e.target.value)}
                                                disabled={updatingId === order._id}
                                                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg text-xs px-3 py-2 pr-7 focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-700 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s} className="capitalize">
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                                            {updatingId === order._id && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                                                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-gray-400 font-medium">
                                        {search || filterStatus !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs font-semibold text-gray-500">
                        <span>Showing {filtered.length} of {orders.length} orders</span>
                        <span>{orders.filter(o => o.status === 'pending').length} pending · {orders.filter(o => o.status === 'delivered').length} delivered</span>
                    </div>
                )}
            </div>
        </div>
    );
}
