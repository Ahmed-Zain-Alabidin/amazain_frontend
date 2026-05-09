'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
    pending:    'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped:    'bg-indigo-100 text-indigo-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
};

export default function DashboardOrdersPage() {
    const { token, user, _hasHydrated } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        if (!_hasHydrated || !token) return;

        // Admins see all orders; sellers/customers see only their own
        const endpoint = user?.role === 'admin'
            ? 'http://localhost:4500/api/orders'
            : 'http://localhost:4500/api/orders/myorders';

        axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setOrders(res.data.data || []))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [_hasHydrated, token, user]);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
                <p className="text-gray-500 mt-1">
                    {isLoading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-20" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <p className="font-bold text-gray-500">No orders yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex flex-wrap gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                                        <p className="font-mono text-sm font-bold text-gray-900">#{order._id?.slice(-10).toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                                        <p className="text-sm font-extrabold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {order.status}
                                    </span>
                                    <button
                                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                                        className="flex items-center text-xs font-bold text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        {expanded === order._id ? <><ChevronUp className="w-4 h-4 mr-1" />Hide</> : <><ChevronDown className="w-4 h-4 mr-1" />Details</>}
                                    </button>
                                </div>
                            </div>
                            {expanded === order._id && (
                                <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</p>
                                    <div className="space-y-2">
                                        {(order.cartItems || order.orderItems || []).map((item, i) => {
                                            const product = item.product || item;
                                            return (
                                                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {product.images?.[0] && <img src={product.images[0]} alt="" className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name || 'Product'}</p>
                                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
