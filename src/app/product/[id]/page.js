'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/Toast';
import ReviewsSection from '@/components/ReviewsSection';
import { Star, Minus, Plus, Heart, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '@/store/cartStore';

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlist, setIsWishlist] = useState(false);
    
    const addToCart = useCartStore(state => state.addToCart);
    const isCartLoading = useCartStore(state => state.isLoading);
    const [toast, setToast] = useState(null);

    // Function to fetch product details
    const fetchProduct = async () => {
        try {
            const productRes = await axios.get(`http://localhost:4500/api/products/${id}`);
            setProduct(productRes.data.data);
        } catch (error) {
            console.error("Error fetching product details", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product details and reviews simultaneously
                const [productRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:4500/api/products/${id}`),
                    axios.get(`http://localhost:4500/api/products/${id}/reviews`).catch(() => ({ data: { data: [] } }))
                ]);
                setProduct(productRes.data.data);
                if (reviewsRes.data.data) {
                    setReviews(reviewsRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching product details", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    // Callback to refresh product data when a review is added
    const handleReviewAdded = () => {
        fetchProduct();
    };

    const handleAddToCart = async () => {
        await addToCart(product, quantity);
        setToast({ message: `"${product.name}" added to cart!`, type: 'success' });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans">
                <Navbar />
                <div className="flex-1 flex flex-col justify-center items-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Product not found</h2>
                    <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
                    <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 transition-colors">
                        Back to Shop
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Default placeholder if no images exist
    const images = product.images && product.images.length > 0 
        ? product.images 
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* Image Gallery (Left) */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden mb-4 border border-gray-100 shadow-sm relative group">
                            <img 
                                src={images[selectedImage]} 
                                alt={product.name} 
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                                        selectedImage === idx ? 'border-black scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover object-center" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info (Right) */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8">
                        <p className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">
                            {product.category?.name || 'Category'}
                        </p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            {product.name}
                        </h1>
                        
                        {/* Ratings */}
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-5 h-5 ${i < Math.round(product.ratings?.average || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-500">
                                {product.ratings?.average || 0} ({product.ratings?.count || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="flex items-baseline gap-3">
                                <p className="text-3xl md:text-4xl font-extrabold text-gray-900">
                                    {product.currency === 'USD' ? '$' : 'EGP '}{product.price}
                                </p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <p className="text-xl font-semibold text-gray-400 line-through">
                                            {product.currency === 'USD' ? '$' : 'EGP '}{product.originalPrice}
                                        </p>
                                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                            Save {product.discountPercentage}%
                                        </span>
                                    </>
                                )}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    You save {product.currency === 'USD' ? '$' : 'EGP '}
                                    {(product.originalPrice - product.price).toFixed(2)}
                                </p>
                            )}
                        </div>
                        
                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-10">
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
                                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                                {product.stock > 0 && product.stock <= 5 && (
                                    <span className="text-sm font-semibold text-orange-500 ml-3">
                                        Only {product.stock} left!
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-100 pt-8 mt-auto">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-gray-200 bg-gray-50 rounded-full h-14 w-full sm:w-auto shadow-inner">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-5 text-gray-500 hover:text-black transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-12 text-center font-bold text-lg text-gray-900 select-none">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                    className="px-5 text-gray-500 hover:text-black transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || isCartLoading}
                                className="flex-1 h-14 bg-black text-white font-bold rounded-full flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-gray-300 w-full"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span>{isCartLoading ? 'Adding...' : 'Add to Cart'}</span>
                            </button>

                            {/* Wishlist Toggle */}
                            <button 
                                onClick={() => setIsWishlist(!isWishlist)}
                                className={`flex-shrink-0 h-14 w-14 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
                                    isWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
                                }`}
                            >
                                <Heart className={`w-6 h-6 ${isWishlist ? 'fill-red-500' : ''}`} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsSection 
                    productId={id} 
                    initialReviews={reviews} 
                    onReviewAdded={handleReviewAdded}
                />
            </main>

            <Footer />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
