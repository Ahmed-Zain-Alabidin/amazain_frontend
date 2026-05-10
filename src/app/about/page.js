'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FCFDFF]">
      
      {/* Hero Section - The Vision */}
      <section className="relative py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Elevating Your Daily Essentials
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Amazain was built to provide a premium and seamless shopping experience for the Egyptian market. 
            We believe that every purchase should be effortless, every product should be exceptional, 
            and every customer should feel valued.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Image */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="Modern Shopping Experience"
                fill
                className="object-cover"
              />
            </div>

            {/* Right: Text */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900">
                The Amazain Journey
              </h2>
              <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                <p>
                  Born from a passion for quality and innovation, Amazain emerged as Egypt's answer 
                  to modern e-commerce. We saw a gap in the market—a need for a platform that doesn't 
                  just sell products, but curates experiences.
                </p>
                <p>
                  Every item in our catalog, from cutting-edge electronics to timeless fashion pieces 
                  and essential home goods, is carefully selected to meet our rigorous standards. 
                  We don't believe in compromise when it comes to quality.
                </p>
                <p>
                  Our mission is simple: to make premium shopping accessible, reliable, and delightful 
                  for every Egyptian household. We're not just building a store—we're building trust, 
                  one order at a time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Amazain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Value 1: Quality First */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#155dfc] to-[#8b5cf6] text-white mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Quality First
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We only curate products that meet our high standards. Every item is vetted 
                for authenticity, durability, and value before it reaches your cart.
              </p>
            </div>

            {/* Value 2: Customer Centric */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#155dfc] to-[#8b5cf6] text-white mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Customer Centric
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Your experience is our priority, from browsing to delivery. We're here to ensure 
                every interaction with Amazain exceeds your expectations.
              </p>
            </div>

            {/* Value 3: Innovation */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#155dfc] to-[#8b5cf6] text-white mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900">
                Innovation
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Using modern tech (MERN Stack) to ensure a fast and secure store. We leverage 
                cutting-edge technology to deliver a seamless shopping experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Meet the Founder Section */}
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 lg:p-16 border-l-4 border-[#155dfc]">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#155dfc] to-[#8b5cf6] flex items-center justify-center text-white text-2xl font-bold">
                  AZ
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Abu Zain</h3>
                  <p className="text-gray-600">Founder & Visionary</p>
                </div>
              </div>
              <blockquote className="text-xl sm:text-2xl font-serif text-gray-800 leading-relaxed italic border-l-4 border-gray-200 pl-6">
                "I built Amazain with one vision: to create a shopping destination where quality meets 
                convenience, and where every Egyptian can access world-class products without compromise. 
                This isn't just a business—it's a commitment to excellence."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-gray-700">
            Join thousands of satisfied customers who trust Amazain for their daily essentials.
          </p>
          <Link 
            href="/shop" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#155dfc] to-[#8b5cf6] text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      </section>

    </div>
  );
}
