'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Store } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:4500/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, role })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Fetch full profile so phone is included in the stored user object
            const profileRes = await fetch('http://localhost:4500/api/users/me', {
                headers: { Authorization: `Bearer ${data.data.token}` }
            });
            const profileData = await profileRes.json();
            const fullUser = profileRes.ok ? profileData.data : data.data;

            login(fullUser, data.data.token);
            if (fullUser.role === 'seller' || fullUser.role === 'admin') {
                router.push('/dashboard');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/">
                  <h2 className="text-center text-4xl font-extrabold text-gray-900 tracking-tighter mb-8 cursor-pointer">
                    Amazain<span className="text-blue-600">.</span>
                  </h2>
                </Link>
                <h2 className="text-center text-2xl font-bold text-gray-900">Create an account</h2>
                <p className="mt-2 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-100 sm:rounded-3xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-sm placeholder-gray-500 text-gray-800"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-sm placeholder-gray-500 text-gray-800"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-sm placeholder-gray-500 text-gray-800"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-sm placeholder-gray-500 text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full pl-11 pr-4 py-3.5 border rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 transition-all text-sm placeholder-gray-500 text-gray-800 ${
                                        confirmPassword && password !== confirmPassword
                                            ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                                            : 'border-gray-200 focus:ring-black focus:border-black'
                                    }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {confirmPassword && password !== confirmPassword && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500">Passwords do not match.</p>
                            )}
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Store className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all text-sm appearance-none cursor-pointer text-gray-600"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
