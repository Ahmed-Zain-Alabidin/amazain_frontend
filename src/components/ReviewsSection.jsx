'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Star, Pencil, X, Loader2, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ReviewCard from '@/components/ReviewCard';

// ── Interactive star picker ──────────────────────────────────────────────────
function StarPicker({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                    <Star
                        className={`w-7 h-7 transition-colors ${
                            star <= active
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200 fill-gray-200'
                        }`}
                    />
                </button>
            ))}
            {value > 0 && (
                <span className="ml-2 text-sm font-semibold text-gray-500">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
                </span>
            )}
        </div>
    );
}

// ── Rating breakdown bar ─────────────────────────────────────────────────────
function RatingBar({ star, count, total }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 w-8 text-right">{star}★</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-gray-400 w-8">{pct}%</span>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ReviewsSection({ productId, initialReviews = [], onReviewAdded }) {
    const { isAuthenticated, token, user } = useAuthStore();

    const [reviews, setReviews] = useState(initialReviews);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // ── Computed stats ──────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const total = reviews.length;
        if (total === 0) return { average: 0, total: 0, breakdown: {} };

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = (sum / total).toFixed(1);

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => { breakdown[r.rating] = (breakdown[r.rating] || 0) + 1; });

        return { average, total, breakdown };
    }, [reviews]);

    // Has the current user already reviewed this product?
    const hasReviewed = useMemo(
        () => reviews.some(r => r.user?._id === user?._id || r.user === user?._id),
        [reviews, user]
    );

    // ── Submit handler ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { setFormError('Please select a star rating.'); return; }
        if (!comment.trim()) { setFormError('Please write a comment.'); return; }

        setIsSubmitting(true);
        setFormError('');

        // Optimistic update
        const optimistic = {
            _id: `temp-${Date.now()}`,
            user: { _id: user?._id, name: user?.name },
            rating,
            comment,
            createdAt: new Date().toISOString(),
            _optimistic: true,
        };
        setReviews(prev => [optimistic, ...prev]);
        setIsModalOpen(false);

        try {
            const res = await axios.post(
                `http://localhost:4500/api/products/${productId}/reviews`,
                { product: productId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Replace optimistic entry with real data
            setReviews(prev =>
                prev.map(r => (r._id === optimistic._id ? res.data.data : r))
            );
            setRating(0);
            setComment('');
            
            // Notify parent component to refresh product data
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (err) {
            // Roll back optimistic update
            setReviews(prev => prev.filter(r => r._id !== optimistic._id));
            setFormError(err.response?.data?.message || 'Failed to submit review. Please try again.');
            setIsModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = () => {
        setFormError('');
        setRating(0);
        setComment('');
        setIsModalOpen(true);
    };

    return (
        <section className="mt-24 border-t border-gray-100 pt-16">

            {/* ── Section header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Customer Reviews</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {stats.total > 0 ? `${stats.total} review${stats.total !== 1 ? 's' : ''}` : 'No reviews yet'}
                    </p>
                </div>

                {isAuthenticated && !hasReviewed && (
                    <button
                        onClick={openModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Pencil className="w-4 h-4" />
                        Write a Review
                    </button>
                )}
                {isAuthenticated && hasReviewed && (
                    <span className="text-sm text-gray-400 font-medium">You've already reviewed this product.</span>
                )}
                {!isAuthenticated && (
                    <Link href="/login" className="text-sm font-semibold text-blue-600 hover:underline">
                        Sign in to write a review
                    </Link>
                )}
            </div>

            {stats.total > 0 ? (
                <>
                    {/* ── Rating summary ── */}
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-10 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                        {/* Big average */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <span className="text-6xl font-extrabold text-gray-900 leading-none">{stats.average}</span>
                            <div className="flex items-center gap-0.5 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(stats.average)
                                                ? 'text-amber-400 fill-amber-400'
                                                : 'text-gray-200 fill-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 mt-1.5 font-medium">out of 5</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-gray-200 self-stretch" />

                        {/* Breakdown bars */}
                        <div className="flex-1 w-full space-y-2.5">
                            {[5, 4, 3, 2, 1].map(star => (
                                <RatingBar
                                    key={star}
                                    star={star}
                                    count={stats.breakdown[star] || 0}
                                    total={stats.total}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── Review cards grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reviews.map(review => (
                            <div
                                key={review._id}
                                className={review._optimistic ? 'opacity-60 pointer-events-none' : ''}
                            >
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                /* ── Empty state ── */
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-16 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-5 shadow-sm">
                        <MessageSquare className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-sm text-gray-500 max-w-xs mb-6">
                        Be the first to share your thoughts and help others make a decision.
                    </p>
                    {isAuthenticated ? (
                        <button
                            onClick={openModal}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Pencil className="w-4 h-4" />
                            Write the First Review
                        </button>
                    ) : (
                        <Link href="/login" className="text-sm font-semibold text-blue-600 hover:underline">
                            Sign in to write a review
                        </Link>
                    )}
                </div>
            )}

            {/* ── Write Review Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-extrabold text-gray-900">Write a Review</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {formError && (
                                <p className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                                    {formError}
                                </p>
                            )}

                            {/* Star picker */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Your Rating <span className="text-red-500">*</span>
                                </label>
                                <StarPicker value={rating} onChange={setRating} />
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Your Review <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Share your experience with this product — quality, fit, value..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black focus:border-black transition-all placeholder-gray-400 resize-none"
                                />
                                <p className="text-xs text-gray-400 mt-1.5 text-right">{comment.length} / 500</p>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white font-extrabold py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
