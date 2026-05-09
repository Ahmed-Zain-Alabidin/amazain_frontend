import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Social */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-gray-900 mb-4 inline-block">
              Amazain<span className="text-blue-600">.</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Curating premium, high-quality essentials designed to elevate your modern lifestyle.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-200 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">All Products</Link></li>
              <li><Link href="/shop?filter=featured" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Featured</Link></li>
              <li><Link href="/shop?filter=new" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">New Arrivals</Link></li>
              <li><Link href="/shop?filter=discounts" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Discounts</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/tracking" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Order Tracking</Link></li>
              <li><Link href="/shipping" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Returns</Link></li>
              <li><Link href="/faqs" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="col-span-1">
            <h3 className="text-sm font-bold tracking-wider text-gray-900 uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm font-medium text-gray-500">
            &copy; {new Date().getFullYear()} Amazain. All rights reserved.
          </p>
          
          {/* Payment Methods Placeholder */}
          <div className="flex items-center space-x-3 text-gray-400">
             <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mr-2">Secure Checkout</span>
             <CreditCard className="w-5 h-5" />
             <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-extrabold text-gray-600 tracking-wider">VISA</div>
             <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-extrabold text-gray-600 tracking-wider">MC</div>
             <div className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-extrabold text-gray-600 tracking-wider">PAYPAL</div>
          </div>
        </div>

      </div>
    </footer>
  );
}
