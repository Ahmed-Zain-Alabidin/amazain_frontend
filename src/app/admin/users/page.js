'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { Search, BadgeCheck, Ban, Users, ChevronDown, Loader2 } from 'lucide-react';
import Toast from '@/components/Toast';

const ROLE_COLORS = {
    admin:    'bg-violet-100 text-violet-700',
    seller:   'bg-blue-100 text-blue-700',
    customer: 'bg-gray-100 text-gray-600',
};

export default function AdminUsersPage() {
    const { token } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [actionId, setActionId] = useState(null); // userId being updated
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    useEffect(() => {
        if (!token) return;
        axios.get('http://localhost:4500/api/users', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setUsers(res.data.data || []))
            .catch(() => showToast('Failed to load users.', 'error'))
            .finally(() => setIsLoading(false));
    }, [token]);

    const updateStatus = async (userId, updates, successMsg) => {
        setActionId(userId);
        try {
            const res = await axios.put(
                `http://localhost:4500/api/users/${userId}/status`,
                updates,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(prev => prev.map(u => u._id === userId ? res.data.data : u));
            showToast(successMsg);
        } catch (err) {
            showToast(err.response?.data?.message || 'Action failed.', 'error');
        } finally {
            setActionId(null);
        }
    };

    const filtered = users.filter(u => {
        const matchSearch =
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const counts = {
        all: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        seller: users.filter(u => u.role === 'seller').length,
        customer: users.filter(u => u.role === 'customer').length,
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Users</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    {isLoading ? 'Loading...' : `${users.length} registered user${users.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 shadow-sm"
                    />
                </div>

                {/* Role filter tabs */}
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                    {['all', 'admin', 'seller', 'customer'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                                roleFilter === role
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            {role} <span className="opacity-60">({counts[role]})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} className="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [...Array(7)].map((_, i) => (
                                    <tr key={i}>
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${[70, 30, 30, 40, 50][j]}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <Users className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                        <p className="text-gray-400 font-medium text-sm">No users found.</p>
                                    </td>
                                </tr>
                            ) : filtered.map(u => {
                                const isProcessing = actionId === u._id;
                                const initial = u.name?.charAt(0).toUpperCase() || '?';
                                const colors = ['bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];
                                const avatarColor = colors[initial.charCodeAt(0) % colors.length];

                                return (
                                    <tr key={u._id} className={`hover:bg-gray-50/60 transition-colors ${u.isSuspended ? 'opacity-60' : ''}`}>
                                        {/* User */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor}`}>
                                                    {initial}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {u.isSuspended ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Suspended</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Active</span>
                                                )}
                                                {u.role === 'seller' && (
                                                    u.isVerified
                                                        ? <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Verified</span>
                                                        : <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">Unverified</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {isProcessing ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                                ) : (
                                                    <>
                                                        {/* Verify / Unverify seller */}
                                                        {u.role === 'seller' && (
                                                            <button
                                                                onClick={() => updateStatus(
                                                                    u._id,
                                                                    { isVerified: !u.isVerified },
                                                                    u.isVerified ? 'Seller unverified.' : 'Seller verified.'
                                                                )}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                                    u.isVerified
                                                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                }`}
                                                            >
                                                                <BadgeCheck className="w-3.5 h-3.5" />
                                                                {u.isVerified ? 'Unverify' : 'Verify'}
                                                            </button>
                                                        )}

                                                        {/* Suspend / Unsuspend (not for admins) */}
                                                        {u.role !== 'admin' && (
                                                            <button
                                                                onClick={() => updateStatus(
                                                                    u._id,
                                                                    { isSuspended: !u.isSuspended },
                                                                    u.isSuspended ? 'User account restored.' : 'User suspended.'
                                                                )}
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                                                    u.isSuspended
                                                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                }`}
                                                            >
                                                                <Ban className="w-3.5 h-3.5" />
                                                                {u.isSuspended ? 'Restore' : 'Suspend'}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs font-semibold text-gray-400">
                        <span>Showing {filtered.length} of {users.length} users</span>
                        <span>
                            {users.filter(u => u.isSuspended).length} suspended ·{' '}
                            {users.filter(u => u.role === 'seller' && !u.isVerified).length} sellers pending verification
                        </span>
                    </div>
                )}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
