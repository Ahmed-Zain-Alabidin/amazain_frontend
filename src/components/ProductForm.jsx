'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Upload, X, ImagePlus, Loader2, ArrowLeft } from 'lucide-react';
import Toast from '@/components/Toast';

const EMPTY_FORM = { 
    name: '', 
    description: '', 
    price: '', 
    originalPrice: '', 
    currency: 'USD', 
    stock: '', 
    category: '' 
};

/**
 * Shared form for Add and Edit product.
 * @param {{ productId?: string }} props  — pass productId to enter edit mode
 */
export default function ProductForm({ productId }) {
    const router = useRouter();
    const { token, _hasHydrated } = useAuthStore();
    const isEdit = Boolean(productId);

    const [form, setForm] = useState(EMPTY_FORM);
    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);       // new files chosen by user
    const [existingImages, setExistingImages] = useState([]); // URLs already on the product
    const [previews, setPreviews] = useState([]);            // object URLs for new files
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(isEdit);     // loading product data in edit mode
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const fileInputRef = useRef(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    // Fetch categories
    useEffect(() => {
        axios.get('http://localhost:4500/api/categories')
            .then(res => setCategories(res.data.data || []))
            .catch(() => {});
    }, []);

    // Fetch product data in edit mode
    useEffect(() => {
        if (!isEdit || !_hasHydrated) return;
        axios.get(`http://localhost:4500/api/products/${productId}`)
            .then(res => {
                const p = res.data.data;
                setForm({
                    name: p.name || '',
                    description: p.description || '',
                    price: p.price ?? '',
                    originalPrice: p.originalPrice ?? '',
                    currency: p.currency || 'USD',
                    stock: p.stock ?? '',
                    category: p.category?._id || p.category || '',
                });
                setExistingImages(p.images || []);
            })
            .catch(() => setError('Failed to load product data.'))
            .finally(() => setIsLoading(false));
    }, [isEdit, productId, _hasHydrated]);

    // Build preview URLs whenever new files are selected
    useEffect(() => {
        const urls = imageFiles.map(f => URL.createObjectURL(f));
        setPreviews(urls);
        return () => urls.forEach(u => URL.revokeObjectURL(u));
    }, [imageFiles]);

    const addFiles = (files) => {
        const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
        setImageFiles(prev => [...prev, ...valid].slice(0, 5));
    };

    const removeNewFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation: originalPrice must be greater than price if provided
        if (form.originalPrice && parseFloat(form.originalPrice) <= parseFloat(form.price)) {
            setError('Original price must be greater than the current price.');
            return;
        }

        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('description', form.description);
            data.append('price', form.price);
            data.append('currency', form.currency);
            if (form.originalPrice) {
                data.append('originalPrice', form.originalPrice);
            }
            data.append('stock', form.stock);
            data.append('category', form.category);
            imageFiles.forEach(f => data.append('images', f));

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (isEdit) {
                await axios.put(`http://localhost:4500/api/products/${productId}`, data, config);
                showToast('Product updated successfully.');
            } else {
                await axios.post('http://localhost:4500/api/products', data, config);
                showToast('Product created successfully.');
                setForm(EMPTY_FORM);
                setImageFiles([]);
                setExistingImages([]);
            }

            // Redirect after a short delay so the toast is visible
            setTimeout(() => router.push('/dashboard/products'), 1200);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        );
    }

    const totalImages = existingImages.length + imageFiles.length;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back */}
            <button
                onClick={() => router.push('/dashboard/products')}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </button>

            {/* Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-gray-500 mt-1">
                    {isEdit ? 'Update the product details below.' : 'Fill in the details to publish a new product.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-start gap-2">
                        <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Card: Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Basic Information</h2>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Product Name <span className="text-red-500">*</span></label>
                        <input
                            type="text" required
                            placeholder="e.g. Premium Running Shoes"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Description <span className="text-red-500">*</span></label>
                        <textarea
                            required rows={4}
                            placeholder="Describe the product — materials, features, sizing..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Category <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-gray-700"
                        >
                            <option value="">Select a category</option>
                            {categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Card: Pricing & Stock */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pricing & Inventory</h2>

                    {/* Currency Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Currency <span className="text-red-500">*</span></label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, currency: 'USD' })}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                                    form.currency === 'USD'
                                        ? 'bg-black text-white shadow-md'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                $ USD
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, currency: 'EGP' })}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                                    form.currency === 'EGP'
                                        ? 'bg-black text-white shadow-md'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                EGP
                            </button>
                        </div>
                    </div>

                    {/* Pricing Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Original Price
                                <span className="text-xs font-normal text-gray-500 ml-1">(optional)</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                    {form.currency === 'USD' ? '$' : 'EGP'}
                                </span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.originalPrice}
                                    onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                                    className={`w-full ${form.currency === 'USD' ? 'pl-7' : 'pl-12'} pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400`}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Price before discount</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Current Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                    {form.currency === 'USD' ? '$' : 'EGP'}
                                </span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                    className={`w-full ${form.currency === 'USD' ? 'pl-7' : 'pl-12'} pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400`}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Selling price</p>
                        </div>
                    </div>

                    {/* Discount Preview */}
                    {form.originalPrice && form.price && parseFloat(form.originalPrice) > parseFloat(form.price) && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-green-800">Discount Applied</p>
                                    <p className="text-xs text-green-600 mt-0.5">
                                        Save {form.currency === 'USD' ? '$' : 'EGP '}
                                        {(parseFloat(form.originalPrice) - parseFloat(form.price)).toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-2xl font-extrabold text-green-700">
                                    {Math.round(((parseFloat(form.originalPrice) - parseFloat(form.price)) / parseFloat(form.originalPrice)) * 100)}%
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stock */}
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Stock Quantity <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            required
                            min="0"
                            placeholder="0"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Card: Images */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Product Images</h2>
                        <span className="text-xs text-gray-400 font-medium">{totalImages}/5 images</span>
                    </div>

                    {/* Drag & Drop Zone */}
                    {totalImages < 5 && (
                        <div
                            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex flex-col items-center justify-center w-full py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                                isDragging
                                    ? 'border-black bg-gray-50 scale-[1.01]'
                                    : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <ImagePlus className={`w-8 h-8 mb-3 transition-colors ${isDragging ? 'text-black' : 'text-gray-300'}`} />
                            <p className="text-sm font-semibold text-gray-600">
                                {isDragging ? 'Drop images here' : 'Drag & drop images, or click to browse'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — up to 5 images</p>
                            <input
                                ref={fileInputRef}
                                type="file" multiple accept="image/*"
                                className="hidden"
                                onChange={e => addFiles(e.target.files)}
                            />
                        </div>
                    )}

                    {/* Image Previews */}
                    {(existingImages.length > 0 || previews.length > 0) && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {/* Existing images (edit mode) */}
                            {existingImages.map((url, i) => (
                                <div key={`existing-${i}`} className="relative group aspect-square">
                                    <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    {i === 0 && (
                                        <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-md">Main</span>
                                    )}
                                </div>
                            ))}
                            {/* New file previews */}
                            {previews.map((url, i) => (
                                <div key={`new-${i}`} className="relative group aspect-square">
                                    <img src={url} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(i)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <span className="absolute bottom-1 left-1 text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-md">New</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isEdit && imageFiles.length === 0 && existingImages.length > 0 && (
                        <p className="text-xs text-gray-400">
                            Existing images will be kept. Upload new ones to replace them.
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white font-extrabold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isEdit ? 'Saving Changes...' : 'Creating Product...'}
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            {isEdit ? 'Save Changes' : 'Create Product'}
                        </>
                    )}
                </button>
            </form>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
