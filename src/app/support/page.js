'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import { 
    Search, 
    Package, 
    RefreshCw, 
    CreditCard, 
    User, 
    Mail, 
    Clock, 
    MessageCircle,
    ChevronDown
} from 'lucide-react';

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission here
        alert('Thank you for contacting us! We will get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const supportCategories = [
        {
            icon: Package,
            title: 'Order Tracking',
            description: 'Where is my Amazain package?',
            link: '/tracking'
        },
        {
            icon: RefreshCw,
            title: 'Returns & Refunds',
            description: 'Our policy and how to start a return.',
            link: '/returns'
        },
        {
            icon: CreditCard,
            title: 'Payment & Pricing',
            description: 'Methods we accept and billing issues.',
            link: '/payment-info'
        },
        {
            icon: User,
            title: 'Account Help',
            description: 'Managing your profile and security.',
            link: '/account-help'
        }
    ];

    const faqs = [
        {
            question: 'How long does shipping take?',
            answer: 'Standard shipping typically takes 3-5 business days within Egypt. Express shipping is available for 1-2 business day delivery.'
        },
        {
            question: 'Can I change my order after placing it?',
            answer: 'You can modify or cancel your order within 1 hour of placement. After that, please contact our support team for assistance.'
        },
        {
            question: 'What is Amazain\'s return period?',
            answer: 'We offer a 30-day return period for most items. Products must be unused and in original packaging. Some items like personal care products are non-returnable.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept Visa, Mastercard, PayPal, and cash on delivery (COD) for orders within Egypt.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Currently, we only ship within Egypt. International shipping will be available soon.'
        }
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#155dfc] via-[#1e6bff] to-[#0d4fd9] py-20 md:py-28 overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Find answers, track orders, or get in touch with our support team
                    </p>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find articles, orders, or policies..."
                            className="w-full pl-14 pr-4 py-5 bg-white border-0 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* Support Categories Grid */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
                        Browse Help Topics
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {supportCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#155dfc] to-[#0d4fd9] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                                        <Icon className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {category.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Can't find what you're looking for? Our support team is here to help
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Side: Contact Details */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                    Contact Information
                                </h3>
                                
                                {/* Support Email */}
                                <div className="flex items-start gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#155dfc] to-[#0d4fd9] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                            Support Email
                                        </p>
                                        <a 
                                            href="mailto:support@amazain.com" 
                                            className="text-lg font-bold text-gray-900 hover:text-[#155dfc] transition-colors"
                                        >
                                            support@amazain.com
                                        </a>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex items-start gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#155dfc] to-[#0d4fd9] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                            Working Hours
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            Sunday - Thursday
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            9:00 AM - 6:00 PM (Cairo Time)
                                        </p>
                                    </div>
                                </div>

                                {/* WhatsApp */}
                                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#155dfc] to-[#0d4fd9] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                                        <MessageCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                            WhatsApp Support
                                        </p>
                                        <a
                                            href="https://wa.me/201234567890"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-full text-sm hover:bg-[#20BA5A] transition-colors shadow-lg shadow-green-500/30"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Chat on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Send us a Message
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all"
                                        placeholder="Your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155dfc] focus:border-transparent resize-none transition-all"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-[#155dfc] to-[#0d4fd9] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Quick answers to common questions about Amazain
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-base md:text-lg font-bold text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                        expandedFaq === index 
                                            ? 'bg-[#155dfc] rotate-180' 
                                            : 'bg-gray-100'
                                    }`}>
                                        <ChevronDown
                                            className={`w-5 h-5 transition-colors ${
                                                expandedFaq === index ? 'text-white' : 'text-gray-600'
                                            }`}
                                        />
                                    </div>
                                </button>
                                {expandedFaq === index && (
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Still have questions? */}
                    <div className="mt-12 text-center bg-white rounded-2xl p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Can't find the answer you're looking for? Please contact our support team.
                        </p>
                        <a
                            href="mailto:support@amazain.com"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#155dfc] to-[#0d4fd9] text-white font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            <Mail className="w-5 h-5" />
                            Contact Support
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
