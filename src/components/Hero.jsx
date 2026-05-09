'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Amazain Premium Essentials"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient Overlay - Stronger on mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent sm:from-black/60 sm:via-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center">
          {/* Text Content */}
          <div className="max-w-xl lg:max-w-2xl space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
              Discover Your
              <span className="block mt-1 sm:mt-2">Daily Essentials</span>
            </h1>

            {/* Sub-heading */}
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-100 leading-relaxed max-w-lg">
              From fashion to gaming, explore a curated collection designed for your lifestyle.
            </p>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-4">
              <Link 
                href="/shop" 
                className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white text-sm sm:text-base lg:text-lg font-bold rounded-full border-2 border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-300 shadow-2xl"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Easy Returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
