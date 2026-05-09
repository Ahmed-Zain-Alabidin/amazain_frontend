'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { User, Mail, Phone, Pencil, Save, X } from 'lucide-react';

export default function ProfilePage() {
    const { user, token, login } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Sync form with user data after hydration
    useEffect(() => {
        if (user) setForm({ name: user.name || '', phone: user.phone || '' });
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await axios.put('http://localhost:4500/api/users/updateMe', form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(res.data.data, token);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-extrabold text-gray-900">Profile Information</h2>
                    {!isEditing ? (
                        <button onClick={() => { setIsEditing(true); setSuccess(''); setError(''); }}
                            className="flex items-center px-4 py-2 text-sm font-bold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                        </button>
                    ) : (
                        <button onClick={() => setIsEditing(false)}
                            className="flex items-center px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </button>
                    )}
                </div>

                {success && <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl">{success}</div>}
                {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">{error}</div>}

                {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Email Address</label>
                            <input type="email" value={user?.email} disabled
                                className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed" />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400" />
                        </div>
                        <button type="submit" disabled={isLoading}
                            className="flex items-center px-6 py-3 bg-black text-white text-sm font-extrabold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50">
                            <Save className="w-4 h-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-5">
                        {[
                            { icon: User, label: 'Full Name', value: user?.name },
                            { icon: Mail, label: 'Email Address', value: user?.email },
                            { icon: Phone, label: 'Phone Number', value: user?.phone || 'Not provided' },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 mr-4 flex-shrink-0">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Account Role Badge */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Account Type</h3>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-extrabold capitalize bg-gray-900 text-white">
                    {user?.role}
                </span>
            </div>
        </div>
    );
}
