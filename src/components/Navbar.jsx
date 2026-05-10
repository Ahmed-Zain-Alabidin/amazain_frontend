'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, LogOut, X, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.items) || [];
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = useWishlistStore(state => state.getCount());
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900">
            Amazain<span className="text-blue-600">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors font-medium">Home</Link>
            <Link href="/shop" className="text-gray-600 hover:text-black transition-colors font-medium">Shop</Link>
            <Link href="/categories" className="text-gray-600 hover:text-black transition-colors font-medium">Categories</Link>
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors font-medium">About</Link>
            <Link href="/support" className="text-gray-600 hover:text-black transition-colors font-medium">Support</Link>
          </div>

          <div className="flex items-center space-x-5">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="w-4 h-4 text-gray-500 mr-2 ml-1" />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="bg-transparent border-none focus:outline-none text-sm w-32 lg:w-48 placeholder-gray-400"
              />
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative text-gray-600 hover:text-black transition-colors">
              <Heart className="w-6 h-6 text-[#155dfc]" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#155dfc] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative text-gray-600 hover:text-black transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Desktop Auth Area */}
            {mounted && (
              <div className="hidden md:flex items-center ml-2">
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition focus:outline-none py-2 px-3 rounded-xl hover:bg-gray-50">
                        <User className="w-5 h-5 mr-1" />
                        {user?.name?.split(' ')[0] || 'Profile'}
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                        <div className="py-3 border-b border-gray-50 px-5 bg-gray-50/50">
                          <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/profile" className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                              My Account
                          </Link>
                          <Link href="/profile/orders" className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                              My Orders
                          </Link>
                          {(user?.role === 'admin' || user?.role === 'seller') && (
                            <Link
                              href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                            >
                                Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="py-2 border-t border-gray-50 bg-gray-50/30">
                          <button onClick={logout} className="w-full text-left px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center transition-colors">
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                          </button>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login" className="text-sm font-semibold text-gray-800 bg-transparent border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-full transition-all flex items-center whitespace-nowrap">
                      Sign In
                    </Link>
                    <Link href="/register" className="text-sm font-semibold text-white bg-black hover:bg-gray-800 px-5 py-2 rounded-full transition-all shadow-md flex items-center whitespace-nowrap">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-600 hover:text-black p-1 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Expanded */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-inner">
          <Link href="/" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">Home</Link>
          <Link href="/shop" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">Shop</Link>
          <Link href="/categories" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">Categories</Link>
          <Link href="/about" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">About</Link>
          <Link href="/support" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">Support</Link>
          <Link href="/wishlist" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between">
            <span>Wishlist</span>
            {mounted && wishlistCount > 0 && (
              <span className="bg-[#155dfc] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>
          
          {mounted && !isAuthenticated && (
            <div className="pt-4 pb-2 space-y-3 px-2 border-t border-gray-100 mt-2">
              <Link href="/login" className="flex justify-center text-sm font-semibold text-gray-800 bg-transparent border border-gray-200 hover:bg-gray-50 py-3 rounded-full transition-all w-full">
                Sign In
              </Link>
              <Link href="/register" className="flex justify-center text-sm font-semibold text-white bg-black hover:bg-gray-800 py-3 rounded-full shadow-md transition-all w-full">
                Get Started
              </Link>
            </div>
          )}

          {mounted && isAuthenticated && (
            <div className="pt-2 pb-2 space-y-1 border-t border-gray-100 mt-2">
              <Link href="/profile" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">My Account</Link>
              <Link href="/profile/orders" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">My Orders</Link>
              {(user?.role === 'admin' || user?.role === 'seller') && (
                <Link
                  href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
