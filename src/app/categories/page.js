import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryCard from '@/components/CategoryCard';
import Link from 'next/link';
import { ArrowRight, LayoutGrid } from 'lucide-react';

async function getCategories() {
    try {
        const res = await fetch('http://localhost:4500/api/categories', {
            next: { revalidate: 30 }, // Revalidate every 30 seconds
            cache: 'no-store' // For development, always fetch fresh data
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const json = await res.json();
        return json.data || [];
    } catch (err) {
        console.error('Error fetching categories:', err);
        return [];
    }
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="aspect-[4/5] rounded-2xl bg-gray-100 animate-pulse" />
    );
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Navbar />

            {/* ── Page header ── */}
            <div className="border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                                Browse
                            </p>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                All Categories
                            </h1>
                            <p className="mt-3 text-gray-500 text-base max-w-md">
                                Explore our full range of collections — from everyday essentials to premium picks.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 border border-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all whitespace-nowrap"
                        >
                            Shop All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Main content ── */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">

                {categories.length === 0 ? (
                    /* ── Empty / error state ── */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-5">
                            <LayoutGrid className="w-7 h-7 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">No categories yet</h2>
                        <p className="text-gray-500 text-sm max-w-xs mb-6">
                            Categories will appear here once they've been added.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-black text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Browse All Products
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Count label */}
                        <p className="text-sm text-gray-400 font-medium mb-8">
                            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                        </p>

                        {/* ── Category grid ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {categories.map((category) => (
                                <CategoryCard key={category._id} category={category} />
                            ))}
                        </div>

                        {/* ── Bottom CTA ── */}
                        <div className="mt-20 bg-gray-50 rounded-3xl border border-gray-100 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                                    Can't find what you're looking for?
                                </h2>
                                <p className="text-gray-500 text-sm max-w-sm">
                                    Browse our full catalogue and use filters to narrow down exactly what you need.
                                </p>
                            </div>
                            <Link
                                href="/shop"
                                className="flex-shrink-0 inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-full hover:bg-gray-800 transition-colors shadow-md text-sm"
                            >
                                Shop Everything
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
