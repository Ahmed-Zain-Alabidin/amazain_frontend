'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 flex items-center justify-center p-4 py-16">
                <div className="bg-white rounded-[2rem] p-12 max-w-lg w-full text-center border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
                    
                    <p className="text-gray-500 mb-10 text-lg leading-relaxed">
                        Thank you for shopping with Amazain. Your order has been successfully placed. We'll send you an email confirmation with tracking details shortly.
                    </p>
                    
                    <div className="flex flex-col space-y-4">
                        <Link href="/orders" className="w-full bg-black text-white py-4 rounded-full font-extrabold hover:bg-gray-800 transition-all shadow-md flex items-center justify-center">
                            View Order Details <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        
                        <Link href="/shop" className="w-full bg-transparent text-gray-800 border-2 border-gray-200 py-3.5 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 mr-2" /> Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
