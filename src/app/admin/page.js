'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import {
    DollarSign, ShoppingBag, Users, Store,
    Tag, ArrowRight, Package,
} from 'lucide-react';

const STATUS_COLORS = {
    pending:    'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped:    'bg-indigo-100 text-indigo-800',
    delivered:  'bg-green-100 text-green-800',
    cancelled:  'bg-red-100 text-red-800',
};

function StatCard({ label, value, sub, icon: Icon, color, isLoading }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {isLoading ? (
                <div className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />
            ) : (
                <div>
                    <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-1 font-medium">{sub}</p>}
                </div>
            )}
        </div>
    );
}

export default function AdminOverviewPage() {
    const { token } = useAuthStore();
    const [stats, setStats] = useState({
        revenue: 0, orders: 0, customers: 0, sellers: 0, products: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchStats = async () => {
            try {
                const [ordersRes, usersRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:4500/api/orders', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:4500/api/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:4500/api/products?limit=1'),
                ]);

                const orders = ordersRes.data.data || [];
                const users  = usersRes.data.data  || [];

                const revenue   = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
                const customers = users.filter(u => u.role === 'customer').length;
                const sellers   = users.filter(u => u.role === 'seller').length;
                const products  = productsRes.data.pagination?.total || productsRes.data.count || 0;

                setStats({ revenue, orders: orders.length, customers, sellers, products });
                setRecentOrders(orders.slice(0, 6));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    const statCards = [
        {
            label: 'Total Revenue',
            value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: 'All time',
            icon: DollarSign,
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Total Orders',
            value: stats.orders,
            sub: `${recentOrders.filter(o => o.status === 'pending').length} pending`,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Active Sellers',
            value: stats.sellers,
            sub: 'Registered sellers',
            icon: Store,
            color: 'bg-violet-50 text-violet-600',
        },
        {
            label: 'Customers',
            value: stats.customers,
            sub: 'Registered customers',
            icon: Users,
            color: 'bg-orange-50 text-orange-600',
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Overview</h1>
                <p className="text-gray-500 mt-1 text-sm">Welcome back — here's your store at a glance.</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {statCards.map(card => (
                    <StatCard key={card.label} {...card} isLoading={isLoading} />
                ))}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Manage Products',   href: '/admin/products',   icon: Package,  color: 'bg-blue-50 text-blue-600' },
                    { label: 'Edit Categories',   href: '/admin/categories', icon: Tag,       color: 'bg-violet-50 text-violet-600' },
                    { label: 'View Orders',       href: '/admin/orders',     icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Manage Users',      href: '/admin/users',      icon: Users,    color: 'bg-emerald-50 text-emerald-600' },
                ].map(({ label, href, icon: Icon, color }) => (
                    <Link key={href} href={href}
                        className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-gray-300 hover:shadow-sm transition-all group">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-gray-600 transition-colors" />
                    </Link>
                ))}
            </div>

            {/* Recent orders table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-gray-900">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${[60, 80, 40, 50, 60][j]}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : recentOrders.length > 0 ? recentOrders.map(order => (
                                <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-6 py-3.5 font-mono text-xs text-gray-400">
                                        #{order._id?.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <p className="font-semibold text-gray-900 text-sm">{order.user?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-3.5 font-bold text-gray-900">
                                        ${order.totalPrice?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center text-gray-400 font-medium text-sm">
                                        No orders yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
