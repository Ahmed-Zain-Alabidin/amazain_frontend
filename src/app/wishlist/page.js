'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, ShoppingBag, Trash2, ShoppingCart } from 'lucide-react';
import Toast from '@/components/Toast';

export default function WishlistPage() {
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState(null);
    const [showClearModal, setShowClearModal] = useState(false);
    
    const items = useWishlistStore(state => state.items);
    const removeFromWishlist = useWishlistStore(state => state.removeFromWishlist);
    const clearWishlist = useWishlistStore(state => state.clearWishlist);
    const addToCart = useCartStore(state => state.addToCart);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
        setToast({ message: 'Item removed from wishlist', type: 'info' });
    };

    const handleAddToCart = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        await addToCart(product, 1);
        setToast({ message: `"${product.name}" added to cart!`, type: 'success' });
    };

    const handleClearAll = () => {
        setShowClearModal(true);
    };

    const confirmClearAll = () => {
        clearWishlist();
        setShowClearModal(false);
        setToast({ message: 'Wishlist cleared', type: 'info' });
    };

    const handleAddAllToCart = async () => {
        let successCount = 0;
        for (const item of items) {
            if (item.stock > 0) {
                await addToCart(item, 1);
                successCount++;
            }
        }
        setToast({ 
            message: `${successCount} item${successCount !== 1 ? 's' : ''} added to cart!`, 
            type: 'success' 
        });
    };

    if (!mounted) {
        return (
            <main className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <Heart className="w-6 h-6 text-[#155dfc] fill-[#155dfc]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {items.length} {items.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                    </div>

                    {items.length > 0 && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddAllToCart}
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-md"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add All to Cart
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Clear All</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 text-center max-w-md">
                            Save items you love by clicking the heart icon on any product
                        </p>
                        <Link
                            href="/shop"
                            className="flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-md"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile: Add All to Cart Button */}
                        <button
                            onClick={handleAddAllToCart}
                            className="sm:hidden w-full flex items-center justify-center gap-2 px-5 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-md mb-6"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add All to Cart
                        </button>

                        {/* Wishlist Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {items.map((product) => (
                                <div key={product._id} className="relative">
                                    <ProductCard 
                                        product={product} 
                                        showRemove={true}
                                        onRemove={handleRemove}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Clear Wishlist Confirmation Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                            Clear Wishlist?
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-500 text-center mb-8">
                            Are you sure you want to remove all {items.length} {items.length === 1 ? 'item' : 'items'} from your wishlist? This action cannot be undone.
                        </p>
                        
                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearAll}
                                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
