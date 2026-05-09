'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, clearCart, isLoading } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const subtotal = items.reduce((acc, item) => {
        // item.price = server-stored price; fallback to product.price for guest cart
        const product = typeof item.product === 'object' ? item.product : {};
        const price = item.price || product.price || 0;
        return acc + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;
    
    // Determine currency - use first item's currency or default to USD
    const firstItem = items[0];
    const firstProduct = firstItem ? (typeof firstItem.product === 'object' ? firstItem.product : {}) : {};
    const displayCurrency = firstItem?.currency || firstProduct.currency || 'USD';
    const displayCurrencySymbol = displayCurrency === 'EGP' ? 'EGP' : '$';

    if (!mounted) return null; // Hydration fix

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-10">Shopping Cart</h1>

                {items.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center border border-gray-100 shadow-sm text-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 max-w-md mb-8">Looks like you haven't added anything to your cart yet. Let's find some premium essentials for you.</p>
                        <Link href="/shop" className="bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-all shadow-md flex items-center">
                            Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        {/* Cart Items List */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Table Header - Desktop Only */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100 bg-gray-50/50">
                                    <div className="col-span-6 text-sm font-bold text-gray-500 uppercase tracking-wider">Product</div>
                                    <div className="col-span-2 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Price</div>
                                    <div className="col-span-2 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">Quantity</div>
                                    <div className="col-span-2 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Total</div>
                                </div>

                                {/* Cart Items */}
                                <div className="divide-y divide-gray-100">
                                    {items.map((item, index) => {
                                        // Handle both populated product objects and string product IDs
                                        const product = typeof item.product === 'object' ? item.product : {};
                                        const productId = typeof item.product === 'string' ? item.product : product._id;
                                        
                                        // Always use a unique key combining productId and index to prevent duplicates
                                        const itemKey = productId ? `${productId}-${index}` : `cart-item-${index}`;
                                        
                                        const name = product.name || 'Unknown Product';
                                        // item.price = price locked at add-time (from server); fallback to product.price for guest cart
                                        const price = item.price || product.price || 0;
                                        const currency = item.currency || product.currency || 'USD';
                                        const currencySymbol = currency === 'EGP' ? 'EGP' : '$';
                                        
                                        // Get the first image from the product images array
                                        // Handle both array of strings and potential undefined/null
                                        let image = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop';
                                        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                                            image = product.images[0];
                                        }

                                        return (
                                            <div key={itemKey} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
                                                {/* Product Info */}
                                                <div className="col-span-1 md:col-span-6 flex items-start md:items-center space-x-3 md:space-x-4">
                                                    <Link href={`/product/${productId}`} className="flex-shrink-0">
                                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                            <img src={image} alt={name} className="w-full h-full object-cover object-center" />
                                                        </div>
                                                    </Link>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <Link href={`/product/${productId}`} className="font-bold text-base md:text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                                            {name}
                                                        </Link>
                                                        <p className="text-sm font-semibold text-gray-700 mt-1 md:hidden">{currencySymbol}{currencySymbol === 'EGP' ? ' ' : ''}{price.toFixed(2)}</p>
                                                        
                                                        {/* Mobile: Quantity and Total */}
                                                        <div className="flex items-center justify-between mt-3 md:hidden">
                                                            <div className="flex items-center border border-gray-200 rounded-full h-9 bg-gray-50">
                                                                <button 
                                                                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                                                                    className="px-2.5 text-gray-500 hover:text-black transition-colors"
                                                                    disabled={isLoading || item.quantity <= 1}
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-sm text-gray-900 select-none">
                                                                    {item.quantity}
                                                                </span>
                                                                <button 
                                                                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                                                                    className="px-2.5 text-gray-500 hover:text-black transition-colors"
                                                                    disabled={isLoading}
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <p className="font-extrabold text-gray-900">
                                                                {currencySymbol}{currencySymbol === 'EGP' ? ' ' : ''}{(price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => removeFromCart(productId)}
                                                            className="text-red-500 text-xs md:text-sm font-medium hover:text-red-600 transition-colors flex items-center mt-2 w-fit"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" /> Remove
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Price (Desktop) */}
                                                <div className="hidden md:block col-span-2 text-center font-bold text-gray-900">
                                                    {currencySymbol}{currencySymbol === 'EGP' ? ' ' : ''}{price.toFixed(2)}
                                                </div>

                                                {/* Quantity (Desktop) */}
                                                <div className="hidden md:flex col-span-2 justify-center">
                                                    <div className="flex items-center border border-gray-200 rounded-full h-10 bg-gray-50">
                                                        <button 
                                                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                                                            className="px-3 text-gray-500 hover:text-black transition-colors"
                                                            disabled={isLoading || item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-sm text-gray-900 select-none">
                                                            {item.quantity}
                                                        </span>
                                                        <button 
                                                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                                                            className="px-3 text-gray-500 hover:text-black transition-colors"
                                                            disabled={isLoading}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subtotal (Desktop) */}
                                                <div className="hidden md:block col-span-2 text-right font-extrabold text-gray-900">
                                                    {currencySymbol}{currencySymbol === 'EGP' ? ' ' : ''}{(price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Clear Cart */}
                                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                                    <Link href="/shop" className="text-sm font-bold text-gray-600 hover:text-black transition-colors">
                                        &larr; Continue Shopping
                                    </Link>
                                    <button 
                                        onClick={clearCart}
                                        className="text-sm font-bold text-gray-500 hover:text-red-600 transition-colors"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-2xl lg:rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 lg:sticky lg:top-24">
                                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-gray-900">{displayCurrencySymbol}{displayCurrencySymbol === 'EGP' ? ' ' : ''}{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping Estimate</span>
                                        <span className="font-bold text-gray-900">
                                            {shipping === 0 ? <span className="text-green-600">Free</span> : `${displayCurrencySymbol}${displayCurrencySymbol === 'EGP' ? ' ' : ''}${shipping.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span className="font-bold text-gray-900">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mb-8">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-extrabold text-gray-900">{displayCurrencySymbol}{displayCurrencySymbol === 'EGP' ? ' ' : ''}{total.toFixed(2)}</span>
                                    </div>
                                    {shipping > 0 && (
                                        <p className="text-xs text-gray-500 mt-2 text-right">
                                            Add {displayCurrencySymbol}{displayCurrencySymbol === 'EGP' ? ' ' : ''}{(100 - subtotal).toFixed(2)} more for free shipping!
                                        </p>
                                    )}
                                </div>

                                <Link href="/checkout" className="w-full bg-black text-white font-bold py-3.5 md:py-4 rounded-full hover:bg-gray-800 transition-all shadow-md flex justify-center items-center text-sm md:text-base">
                                    Proceed to Checkout <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                                </Link>
                                
                                <div className="mt-4 text-center">
                                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs mt-4">
                                        <span>Secure checkout via</span>
                                        <span className="font-bold border border-gray-200 px-2 py-0.5 rounded">STRIPE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
