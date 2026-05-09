'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from 'lucide-react';
import Toast from '@/components/Toast';

export default function DashboardProductsPage() {
    const { token, user, _hasHydrated } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null); // product to confirm delete
    const [isDeleting, setIsDeleting] = useState(false);
    const [toast, setToast] = useState(null); // { message, type }

    const showToast = (message, type = 'success') => setToast({ message, type });

    const fetchProducts = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4500/api/products?limit=200', {
                headers: { Authorization: `Bearer ${token}` },
            });
            let data = res.data.data || [];
            // Sellers only see their own products
            if (user?.role === 'seller') {
                data = data.filter(p => p.seller?._id === user._id || p.seller === user._id);
            }
            setProducts(data);
        } catch (err) {
            showToast('Failed to load products.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        if (_hasHydrated) fetchProducts();
    }, [_hasHydrated, fetchProducts]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:4500/api/products/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(prev => prev.filter(p => p._id !== deleteTarget._id));
            showToast(`"${deleteTarget.name}" deleted successfully.`);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete product.', 'error');
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">
                        {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <Link href="/dashboard/products/add"
                    className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search products by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: j === 0 ? '60%' : '40%' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Package className="w-10 h-10" />
                                            <p className="font-semibold">
                                                {search ? 'No products match your search.' : 'No products yet.'}
                                            </p>
                                            {!search && (
                                                <Link href="/dashboard/products/add"
                                                    className="mt-2 inline-flex items-center px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors">
                                                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add your first product
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(p => (
                                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                                        {/* Product */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {p.images?.[0]
                                                        ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                        : <Package className="w-5 h-5 text-gray-300" />
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate max-w-[200px]">{p.name}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{p._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Category */}
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                                {p.category?.name || '—'}
                                            </span>
                                        </td>
                                        {/* Price */}
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {p.currency === 'USD' ? '$' : 'EGP '}{Number(p.price).toFixed(2)}
                                        </td>
                                        {/* Stock */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                p.stock > 10
                                                    ? 'bg-green-100 text-green-800'
                                                    : p.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/dashboard/products/edit/${p._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteTarget(p)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 text-center mb-2">Delete Product?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span> will be permanently removed. This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting
                                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
                                    : 'Delete'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
