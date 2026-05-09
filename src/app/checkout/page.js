'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import AddressCard from '@/components/AddressCard';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { MapPin, Truck, CreditCard, CheckCircle, Plus, X, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { token, isAuthenticated } = useAuthStore();
    const { items, clearCart } = useCartStore();
    
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({ alias: '', street: '', city: '', postalCode: '', phone: '' });

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout');
            return;
        }

        if (items.length === 0) {
            router.push('/cart');
            return;
        }

        fetchAddresses();
    }, [mounted, isAuthenticated, items]);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('http://localhost:4500/api/users/addresses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedAddresses = res.data.data || [];
            setAddresses(fetchedAddresses);
            if (fetchedAddresses.length > 0) {
                setSelectedAddress(fetchedAddresses[0]._id);
            }
        } catch (err) {
            console.error('Failed to fetch addresses', err);
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4500/api/users/addresses', newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedAddresses = res.data.data || [];
            setAddresses(updatedAddresses);
            
            // Auto-select the newly added address
            if (updatedAddresses.length > 0) {
                setSelectedAddress(updatedAddresses[updatedAddresses.length - 1]._id);
            }
            
            setIsModalOpen(false);
            setNewAddress({ alias: '', street: '', city: '', postalCode: '', phone: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add address');
        }
    };

    const subtotal = items.reduce((acc, item) => {
        const price = item.product?.price || item.price || 0;
        return acc + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            setError('Please select a shipping address before proceeding.');
            return;
        }

        setIsPlacingOrder(true);
        setError('');

        try {
            // Send order creation to backend
            await axios.post('http://localhost:4500/api/orders', {
                shippingAddress: selectedAddress
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // On success, clear the cart state and redirect
            clearCart();
            router.push('/checkout/success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please check your address and try again.');
            setIsPlacingOrder(false);
        }
    };

    if (!mounted || !isAuthenticated || items.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-3 text-sm font-medium text-gray-500 mb-8">
                    <span className="hover:text-black cursor-pointer" onClick={() => router.push('/cart')}>Cart</span>
                    <span>/</span>
                    <span className="text-black font-bold">Checkout</span>
                    <span>/</span>
                    <span className="opacity-50">Payment</span>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Secure Checkout</h1>
                    <div className="hidden sm:flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm font-bold">
                        <ShieldCheck className="w-4 h-4 mr-2" /> SSL Encrypted
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-bold flex items-center shadow-sm">
                        <X className="w-5 h-5 mr-3 text-red-500 flex-shrink-0" onClick={() => setError('')} />
                        {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Left Column - Forms */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        
                        {/* 1. Shipping Address */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                                    <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                                </div>
                            </div>
                            
                            {isLoadingAddresses ? (
                                <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
                            ) : addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {addresses.map(addr => (
                                        <AddressCard 
                                            key={addr._id} 
                                            address={addr} 
                                            isSelected={selectedAddress === addr._id}
                                            onSelect={setSelectedAddress}
                                        />
                                    ))}
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:text-black hover:border-black hover:bg-gray-50 flex flex-col items-center justify-center transition-all min-h-[140px]"
                                    >
                                        <Plus className="w-6 h-6 mb-2" />
                                        <span className="font-bold text-sm">Add New Address</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium mb-5">No saved addresses found.</p>
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-black text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-gray-800 transition-colors"
                                    >
                                        Add Delivery Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Shipping Method */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
                                <h2 className="text-xl font-bold text-gray-900">Shipping Method</h2>
                            </div>
                            <div className="p-5 rounded-2xl border-2 border-black bg-gray-50 flex justify-between items-center cursor-default shadow-sm">
                                <div className="flex items-center">
                                    <Truck className="w-6 h-6 text-gray-900 mr-4" />
                                    <div>
                                        <p className="font-extrabold text-gray-900">Standard Delivery</p>
                                        <p className="text-sm font-medium text-gray-500">Arrives in 3-5 Business Days</p>
                                    </div>
                                </div>
                                <span className="font-extrabold text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        {/* 3. Payment Method (Placeholder) */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 opacity-50 grayscale pointer-events-none">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold text-sm">3</div>
                                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                            </div>
                            <div className="flex items-center text-gray-500">
                                <CreditCard className="w-6 h-6 mr-3" />
                                <span className="font-medium">Secure payment gateway integration will be completed in Phase 2.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
                            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
                                {items.map((item, idx) => {
                                    const product = item.product || {};
                                    const image = product.images?.[0] || 'https://via.placeholder.com/150';
                                    const price = product.price || 0;
                                    return (
                                        <div key={idx} className="flex items-center space-x-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                <img src={image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                                <p className="text-xs font-semibold text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-extrabold text-gray-900 text-sm">
                                                ${(price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-4 mb-6 text-sm pt-6 border-t border-gray-100 font-medium text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-bold text-gray-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-5 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-3xl font-extrabold text-gray-900">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder || !selectedAddress}
                                className="w-full bg-black text-white font-extrabold py-4 rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? (
                                    <span className="animate-pulse">Processing Order...</span>
                                ) : (
                                    <>
                                        Confirm Order <CheckCircle className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Address Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Add New Address</h2>
                        
                        <form onSubmit={handleAddAddress} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Address Alias (e.g. Home, Work)</label>
                                <input 
                                    type="text" required placeholder="My Apartment"
                                    value={newAddress.alias} onChange={(e) => setNewAddress({...newAddress, alias: e.target.value})}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm font-medium transition-all placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Street Address</label>
                                <input 
                                    type="text" required placeholder="123 Main St"
                                    value={newAddress.street} onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm font-medium transition-all placeholder-gray-400"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">City</label>
                                    <input 
                                        type="text" required placeholder="New York"
                                        value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm font-medium transition-all placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">Postal Code</label>
                                    <input 
                                        type="text" required placeholder="10001"
                                        value={newAddress.postalCode} onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm font-medium transition-all placeholder-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                                <input 
                                    type="text" required placeholder="+1 (555) 000-0000"
                                    value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black text-sm font-medium transition-all placeholder-gray-400"
                                />
                            </div>
                            
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-black text-white font-extrabold py-4 rounded-full hover:bg-gray-800 shadow-md transition-all">
                                    Save & Use Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
