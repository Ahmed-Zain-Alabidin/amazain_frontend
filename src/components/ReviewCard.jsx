'use client';

import { Star, BadgeCheck } from 'lucide-react';

export default function ReviewCard({ review }) {
    const name = review.user?.name || 'Anonymous';
    const initial = name.charAt(0).toUpperCase();
    const date = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Generate a consistent soft color from the user's name initial
    const colors = [
        'bg-violet-100 text-violet-700',
        'bg-blue-100 text-blue-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
        'bg-cyan-100 text-cyan-700',
    ];
    const colorClass = colors[initial.charCodeAt(0) % colors.length];

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
            {/* Header: avatar + name + date */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorClass}`}>
                        {initial}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                    </div>
                </div>

                {/* Verified badge */}
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-200 fill-gray-200'
                        }`}
                    />
                ))}
                <span className="ml-2 text-xs font-semibold text-gray-500">{review.rating}.0</span>
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
        </div>
    );
}
