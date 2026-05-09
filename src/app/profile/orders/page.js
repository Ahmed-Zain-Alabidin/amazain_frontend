'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ShoppingBag, ChevronDown, ChevronUp, Package } from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function MyOrdersPage() {
    const { token, _hasHydrated } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!_hasHydrated) return;
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:4500/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [_hasHydrated]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
                        <div className="flex justify-between mb-4">
                            <div className="h-4 bg-gray-100 rounded w-32" />
                            <div className="h-4 bg-gray-100 rounded w-20" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded w-48" />
                    </div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-9 h-9 text-gray-300" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">No orders yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    You haven't placed any orders yet. Start shopping at Amazain!
                </p>
                <Link href="/shop" className="inline-flex items-center px-8 py-3.5 bg-black text-white font-extrabold rounded-full hover:bg-gray-800 transition-colors shadow-md">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-extrabold text-gray-900">My Orders</h2>
                <span className="text-sm font-semibold text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
            </div>

            {orders.map(order => (
                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                                <p className="font-mono text-sm font-bold text-gray-900">#{order._id?.slice(-10).toUpperCase()}</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-gray-100" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-gray-100" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                                <p className="text-sm font-extrabold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold capitalize whitespace-nowrap ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                {order.status}
                            </span>
                            <button
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-xl hover:bg-gray-50"
                            >
                                {expandedOrder === order._id
                                    ? <><ChevronUp className="w-4 h-4 mr-1" /> Hide</>
                                    : <><ChevronDown className="w-4 h-4 mr-1" /> Details</>
                                }
                            </button>
                        </div>
                    </div>

                    {expandedOrder === order._id && (
                        <div className="border-t border-gray-100 bg-gray-50 p-6">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Items Ordered</h4>
                            <div className="space-y-3">
                                {(order.cartItems || order.orderItems || []).map((item, i) => {
                                    const product = item.product || item;
                                    const image = product.images?.[0] || null;
                                    const name = product.name || 'Product';
                                    const price = item.price || product.price || 0;
                                    return (
                                        <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                                            <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-300" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-extrabold text-gray-900 text-sm whitespace-nowrap">
                                                ${(price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            {order.shippingAddress && (
                                <div className="mt-5 pt-5 border-t border-gray-200">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Shipped To</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
