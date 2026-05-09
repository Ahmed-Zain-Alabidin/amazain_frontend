'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Toast from '@/components/Toast';

export default function ProductCard({ product, showRemove = false, onRemove }) {
    const [toast, setToast] = useState(null);
    // isNew is deferred to client-only to avoid Date.now() SSR/client mismatch
    const [isNew, setIsNew] = useState(false);
    const [mounted, setMounted] = useState(false);

    const addToCart = useCartStore(state => state.addToCart);
    const isCartLoading = useCartStore(state => state.isLoading);
    
    const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
    const isInWishlist = useWishlistStore(state => state.isInWishlist);
    const isWishlisted = mounted ? isInWishlist(product._id) : false;

    useEffect(() => {
        setMounted(true);
        if (product.createdAt) {
            setIsNew(Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000);
        }
    }, [product.createdAt]);

    const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';
    const categoryName = product.category?.name || '';
    const rating = product.ratingsAverage || 0;
    const reviewCount = product.ratingsQuantity || 0;
    const outOfStock = product.stock <= 0;
    const lowStock = product.stock > 0 && product.stock <= 5;
    const currency = product.currency || 'USD';
    const currencySymbol = currency === 'USD' ? '$' : 'EGP ';
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    const handleQuickAdd = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (outOfStock) return;
        await addToCart(product, 1);
        setToast({ message: `"${product.name}" added to cart!`, type: 'success' });
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleWishlist(product);
        if (added) {
            setToast({ message: `"${product.name}" added to wishlist!`, type: 'success' });
        } else {
            setToast({ message: `"${product.name}" removed from wishlist`, type: 'info' });
        }
        
        // If this is on the wishlist page and we're removing, call the onRemove callback
        if (!added && onRemove) {
            onRemove(product._id);
        }
    };

    return (
        <>
            <Link href={`/product/${product._id}`} className="group block">
                <div className="relative flex flex-col bg-gray-50 rounded-3xl overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] hover:-translate-y-1">

                    {/* Image container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-2xl m-2">

                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                            {isNew && !outOfStock && (
                                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                    New
                                </span>
                            )}
                            {outOfStock && (
                                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white bg-gray-500/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                    Sold Out
                                </span>
                            )}
                        </div>

                        {/* Wishlist */}
                        <button
                            onClick={handleWishlist}
                            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-all duration-200 ${isWishlisted ? 'bg-white text-red-500 scale-110 opacity-100' : 'bg-white/70 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:scale-110'} ${showRemove ? 'opacity-100' : ''}`}
                        >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                        </button>

                        {/* Quick Add */}
                        <div className="absolute inset-x-2.5 bottom-2.5 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <button
                                onClick={handleQuickAdd}
                                disabled={outOfStock || isCartLoading}
                                className="w-full bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-bold tracking-wide py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:bg-gray-900 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {outOfStock
                                    ? <><Eye className="w-3.5 h-3.5" /> View Details</>
                                    : <><ShoppingCart className="w-3.5 h-3.5" /> Quick Add</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="px-4 pt-3 pb-4 flex flex-col gap-1">
                        {categoryName && (
                            <p className="text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase">
                                {categoryName}
                            </p>
                        )}

                        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-1 group-hover:text-black transition-colors duration-200">
                            {product.name}
                        </h3>

                        {reviewCount > 0 && (
                            <div className="flex items-center gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                                ))}
                                <span className="text-[9px] text-gray-400 font-medium ml-0.5">({reviewCount})</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-baseline gap-2">
                                <p className="text-base font-extrabold text-black tracking-tight">
                                    {currencySymbol}{Number(product.price).toFixed(2)}
                                </p>
                                {hasDiscount && (
                                    <p className="text-xs font-semibold text-gray-400 line-through">
                                        {currencySymbol}{Number(product.originalPrice).toFixed(2)}
                                    </p>
                                )}
                            </div>
                            {hasDiscount && (
                                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    -{product.discountPercentage}%
                                </span>
                            )}
                            {!hasDiscount && lowStock && (
                                <span className="text-[9px] font-semibold text-orange-500 tracking-wide">
                                    Only {product.stock} left
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
}
