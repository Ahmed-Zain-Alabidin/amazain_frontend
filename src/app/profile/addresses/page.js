'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Plus, Trash2, X, Home } from 'lucide-react';

export default function AddressesPage() {
    const { token, _hasHydrated } = useAuthStore();
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newAddress, setNewAddress] = useState({ alias: '', street: '', city: '', state: '', postalCode: '', phone: '' });

    useEffect(() => {
        if (_hasHydrated) fetchAddresses();
    }, [_hasHydrated]);

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4500/api/users/addresses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch addresses', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:4500/api/users/addresses', newAddress, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data.data || []);
            setIsModalOpen(false);
            setNewAddress({ alias: '', street: '', city: '', state: '', postalCode: '', phone: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add address.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (!confirm('Delete this address?')) return;
        setIsDeleting(addressId);
        try {
            const res = await axios.delete(`http://localhost:4500/api/users/addresses/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAddresses(res.data.data || []);
        } catch (err) {
            alert('Failed to delete address.');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Saved Addresses</h2>
                <button onClick={() => { setIsModalOpen(true); setError(''); }}
                    className="flex items-center px-4 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Address
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-40" />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <MapPin className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2">No saved addresses</h3>
                    <p className="text-gray-500 text-sm mb-6">Add your first delivery address to speed up checkout.</p>
                    <button onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center px-6 py-2.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm text-sm">
                        <Plus className="w-4 h-4 mr-2" /> Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative group hover:border-gray-300 transition-colors">
                            <button
                                onClick={() => handleDelete(addr._id)}
                                disabled={isDeleting === addr._id}
                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            >
                                {isDeleting === addr._id
                                    ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    : <Trash2 className="w-4 h-4" />
                                }
                            </button>

                            <div className="flex items-start space-x-3 mb-4">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Home className="w-4 h-4 text-gray-500" />
                                </div>
                                <span className="font-extrabold text-gray-900 uppercase tracking-wide text-sm pt-1.5">
                                    {addr.alias || 'Address'}
                                </span>
                            </div>
                            <div className="space-y-1.5 ml-12">
                                <p className="text-sm font-semibold text-gray-800">{addr.street}</p>
                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                                <p className="text-sm text-gray-500 flex items-center pt-1">
                                    <span className="text-gray-400 text-xs mr-1.5">Phone:</span>
                                    <span className="font-semibold text-gray-700">{addr.phone}</span>
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <button onClick={() => { setIsModalOpen(true); setError(''); }}
                        className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black hover:bg-gray-50 transition-all min-h-[160px] group">
                        <Plus className="w-7 h-7 mb-2 transition-transform group-hover:scale-110" />
                        <span className="text-sm font-bold">Add New Address</span>
                    </button>
                </div>
            )}

            {/* Add Address Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">Add New Address</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 space-y-4">
                            {error && <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">{error}</p>}
                            
                            {[
                                { label: 'Alias (e.g. Home, Work)', key: 'alias', placeholder: 'My Apartment' },
                                { label: 'Street Address', key: 'street', placeholder: '123 Main Street' },
                            ].map(({ label, key, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">{label}</label>
                                    <input type="text" required placeholder={placeholder}
                                        value={newAddress[key]} onChange={e => setNewAddress({ ...newAddress, [key]: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">City</label>
                                    <input type="text" required placeholder="Cairo"
                                        value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-1.5">State</label>
                                    <input type="text" required placeholder="Cairo"
                                        value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Postal Code</label>
                                <input type="text" required placeholder="10001"
                                    value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-1.5">Phone Number</label>
                                <input type="text" required placeholder="+20 (555) 000-0000"
                                    value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                            </div>

                            <button type="submit" disabled={isSubmitting}
                                className="w-full bg-black text-white font-extrabold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 mt-2">
                                {isSubmitting ? 'Saving...' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
