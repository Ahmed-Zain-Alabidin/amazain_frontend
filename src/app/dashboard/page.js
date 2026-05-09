'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Package, ShoppingBag, TrendingUp, Plus } from 'lucide-react';

export default function DashboardPage() {
    const { token, user, _hasHydrated } = useAuthStore();
    const [stats, setStats] = useState({ products: 0, orders: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!_hasHydrated || !token) return;
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:4500/api/products?limit=200', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const all = res.data.data || [];
                // Sellers only count their own products
                const count = user?.role === 'seller'
                    ? all.filter(p => p.seller?._id === user._id || p.seller === user._id).length
                    : res.data.pagination?.total || all.length;
                setStats({ products: count });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [_hasHydrated, token, user]);

    const cards = [
        { label: 'Total Products', value: stats.products, icon: Package, href: '/dashboard/products', color: 'bg-blue-50 text-blue-600' },
        { label: 'Manage Products', value: 'Add / Edit', icon: TrendingUp, href: '/dashboard/products/add', color: 'bg-green-50 text-green-600' },
        { label: 'Orders', value: 'View All', icon: ShoppingBag, href: '/dashboard/orders', color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-500 mt-1 capitalize">{user?.role} Dashboard</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                {cards.map(({ label, value, icon: Icon, href, color }) => (
                    <Link key={label} href={href}
                        className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-300 hover:shadow-md transition-all group">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-2xl font-extrabold text-gray-900">
                            {isLoading && label === 'Total Products' ? '—' : value}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Ready to add a new product?</h2>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details and upload images to publish instantly.</p>
                </div>
                <Link href="/dashboard/products/add"
                    className="flex items-center px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm whitespace-nowrap">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Link>
            </div>
        </div>
    );
}
