'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Plus, Pencil, Trash2, X, Upload, Search } from 'lucide-react';

export default function AdminProductsPage() {
    const { token } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emptyForm = { name: '', description: '', price: '', category: '', stock: '', images: [] };
    const [form, setForm] = useState(emptyForm);
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4500/api/products?limit=100');
            setProducts(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost:4500/api/categories');
            setCategories(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const openAdd = () => { setEditProduct(null); setForm(emptyForm); setImageFiles([]); setError(''); setIsModalOpen(true); };
    const openEdit = (p) => {
        setEditProduct(p);
        setForm({ name: p.name, description: p.description, price: p.price, category: p.category?._id || p.category, stock: p.stock, images: p.images || [] });
        setImageFiles([]);
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('description', form.description);
            data.append('price', form.price);
            data.append('category', form.category);
            data.append('stock', form.stock);
            imageFiles.forEach(f => data.append('images', f));

            const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

            if (editProduct) {
                await axios.put(`http://localhost:4500/api/products/${editProduct._id}`, data, config);
            } else {
                await axios.post('http://localhost:4500/api/products', data, config);
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`http://localhost:4500/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (err) { alert('Failed to delete product.'); }
    };

    const filtered = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">{products.length} total products</p>
                </div>
                <button onClick={openAdd} className="flex items-center px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text" placeholder="Search products..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length > 0 ? filtered.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                                            </div>
                                            <span className="font-semibold text-gray-900 line-clamp-1">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{p.category?.name || '—'}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {p.currency === 'USD' ? '$' : 'EGP '}{p.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => openEdit(p)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-400 font-medium">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-extrabold text-gray-900">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</p>}
                            
                            {[
                                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Premium Sneakers' },
                                { label: 'Price ($)', key: 'price', type: 'number', placeholder: '0.00' },
                                { label: 'Stock Quantity', key: 'stock', type: 'number', placeholder: '0' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>
                                    <input type={type} required placeholder={placeholder}
                                        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-600">
                                    <option value="">Select a category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                                <textarea required rows={3} placeholder="Product description..."
                                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Product Images</label>
                                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
                                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-500">
                                        {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload images'}
                                    </span>
                                    <input type="file" multiple accept="image/*" className="hidden"
                                        onChange={e => setImageFiles(Array.from(e.target.files))} />
                                </label>
                                {editProduct && form.images.length > 0 && imageFiles.length === 0 && (
                                    <p className="text-xs text-gray-500 mt-2">Current images will be kept unless you upload new ones.</p>
                                )}
                            </div>

                            <button type="submit" disabled={isSubmitting}
                                className="w-full bg-black text-white font-extrabold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Saving...' : (editProduct ? 'Save Changes' : 'Create Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
