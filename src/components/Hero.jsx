'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-white via-[#e8f1ff] to-[#155dfc]">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#155dfc] to-[#8b5cf6] opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#ec4899] to-[#155dfc] opacity-15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white to-[#155dfc] opacity-10 rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(21,93,252,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(21,93,252,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center lg:text-left">
              
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Discover Your
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#155dfc] via-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">
                  Daily Essentials
                </span>
              </h1>

              {/* Sub-heading */}
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
                From fashion to gaming, explore a curated collection designed for your lifestyle.
              </p>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start">
                <Link 
                  href="/shop" 
                  className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#155dfc] to-[#8b5cf6] text-white text-sm sm:text-base lg:text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#155dfc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#155dfc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#155dfc]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Easy Returns</span>
                </div>
              </div>

            </div>

            {/* Right: Product Image */}
            <div className="hidden lg:flex justify-center lg:justify-end items-center relative">
              <div className="relative w-full max-w-md xl:max-w-lg">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#155dfc]/30 via-[#8b5cf6]/20 to-[#ec4899]/30 blur-3xl rounded-full scale-75" />
                
                {/* Product Image */}
                <div className="relative z-10 animate-float">
                  <Image
                    src="https://res.cloudinary.com/dw6ukveh4/image/upload/v1778367384/4095e006-f14e-477d-a092-90516087da7f_doiatx.png"
                    alt="Amazain Products"
                    width={500}
                    height={600}
                    priority
                    className="w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
