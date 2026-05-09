'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/products', label: 'Products', icon: Package },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
];

export default function DashboardLayout({ children }) {
    const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!_hasHydrated) return;
        if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'seller')) {
            router.push('/');
            return;
        }
        // Admins have their own dashboard at /admin — redirect them there
        if (user?.role === 'admin') {
            router.push('/admin');
        }
    }, [_hasHydrated, isAuthenticated, user]);

    if (!_hasHydrated || !isAuthenticated || user?.role === 'admin' || (user?.role !== 'seller')) {
        return null;
    }

    const roleBadge = user?.role === 'admin' ? 'ADMIN' : 'SELLER';

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-extrabold tracking-tighter text-gray-900">
                        Amazain<span className="text-blue-600">.</span>
                    </span>
                    <span className="text-xs font-bold bg-gray-900 text-white px-2 py-0.5 rounded-full">
                        {roleBadge}
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map(({ href, label, icon: Icon, exact }) => {
                    const isActive = exact ? pathname === href : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                                isActive
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-700'}`} />
                            {label}
                            {isActive && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="px-4 py-5 border-t border-gray-100">
                <div className="flex items-center px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => { logout(); router.push('/'); }}
                    className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-3" /> Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-40">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <span className="font-extrabold text-gray-900">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Mobile Top Bar */}
                <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-extrabold text-gray-900">Dashboard</span>
                    <div className="w-9" />
                </header>

                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
