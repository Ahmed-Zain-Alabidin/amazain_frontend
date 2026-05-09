'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { User, ShoppingBag, MapPin, LogOut, ChevronRight } from 'lucide-react';

const navItems = [
    { href: '/profile', label: 'Profile Settings', icon: User },
    { href: '/profile/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/profile/addresses', label: 'Saved Addresses', icon: MapPin },
];

export default function ProfileLayout({ children }) {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) router.push('/login');
    }, [mounted, isAuthenticated]);

    if (!mounted || !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Account</h1>
                    <p className="text-gray-500 mt-1">Manage your profile, orders, and addresses.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* User Info */}
                            <div className="p-6 bg-gray-50 border-b border-gray-100">
                                <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl mb-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-extrabold text-gray-900 text-lg leading-tight">{user?.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>

                            {/* Nav Links */}
                            <nav className="p-3 space-y-1">
                                {navItems.map(({ href, label, icon: Icon }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link key={href} href={href}
                                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'}`} />
                                            {label}
                                            {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
                                        </Link>
                                    );
                                })}
                                <button
                                    onClick={() => { logout(); router.push('/'); }}
                                    className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Page Content */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
