'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import {
    Plus, Pencil, Trash2, X, ImagePlus,
    Loader2, AlertTriangle, Tag,
} from 'lucide-react';
import Toast from '@/components/Toast';

const EMPTY_FORM = { name: '' };

export default function AdminCategoriesPage() {
    const { token } = useAuthStore();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState(null);

    // Form modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // null = add mode
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const fileInputRef = useRef(null);

    // Delete confirm modal
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4500/api/categories');
            setCategories(res.data.data || []);
        } catch {
            showToast('Failed to load categories.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const openAdd = () => {
        setEditTarget(null);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview('');
        setFormError('');
        setIsModalOpen(true);
    };

    const openEdit = (cat) => {
        setEditTarget(cat);
        setForm({ name: cat.name });
        setImageFile(null);
        setImagePreview(cat.image || '');
        setFormError('');
        setIsModalOpen(true);
    };

    const handleImageChange = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setFormError('Category name is required.'); return; }
        setIsSubmitting(true);
        setFormError('');

        try {
            const data = new FormData();
            data.append('name', form.name.trim());
            if (imageFile) data.append('image', imageFile);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (editTarget) {
                const res = await axios.put(`http://localhost:4500/api/categories/${editTarget._id}`, data, config);
                setCategories(prev => prev.map(c => c._id === editTarget._id ? res.data.data : c));
                showToast('Category updated successfully.');
            } else {
                const res = await axios.post('http://localhost:4500/api/categories', data, config);
                setCategories(prev => [...prev, res.data.data]);
                showToast('Category created successfully.');
            }
            setIsModalOpen(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:4500/api/categories/${deleteTarget._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(prev => prev.filter(c => c._id !== deleteTarget._id));
            showToast(`"${deleteTarget.name}" deleted.`);
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete category.', 'error');
        } finally {
            setIsDeleting(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {isLoading ? 'Loading...' : `${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Add Category
                </button>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-4">
                        <Tag className="w-6 h-6 text-gray-300" />
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900 mb-1">No categories yet</h3>
                    <p className="text-sm text-gray-400 mb-5">Add your first category to get started.</p>
                    <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                            {/* Image */}
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                    <Tag className="w-8 h-8 text-gray-300" />
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            {/* Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white font-bold text-sm leading-tight drop-shadow-sm truncate">{cat.name}</p>
                            </div>

                            {/* Action buttons — appear on hover */}
                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                                    title="Edit"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(cat)}
                                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-extrabold text-gray-900">
                                {editTarget ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {formError && (
                                <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{formError}</p>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text" required
                                    placeholder="e.g. Electronics"
                                    value={form.name}
                                    onChange={e => setForm({ name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400"
                                />
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Category Image</label>

                                {imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(''); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-2 right-2 text-xs font-bold bg-white text-gray-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
                                    >
                                        <ImagePlus className="w-7 h-7 text-gray-300 mb-2" />
                                        <p className="text-sm font-semibold text-gray-500">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file" accept="image/*" className="hidden"
                                    onChange={e => handleImageChange(e.target.files[0])}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white font-extrabold py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    editTarget ? 'Save Changes' : 'Create Category'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 text-center mb-2">Delete Category?</h3>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span> will be permanently removed.
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
                                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
