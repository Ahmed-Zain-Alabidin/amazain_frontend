import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Curated fallback images keyed by common category name keywords
const FALLBACK_IMAGES = {
    electronic: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop',
    phone:       'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    laptop:      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    fashion:     'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
    cloth:       'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
    shoe:        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    home:        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
    furniture:   'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    kitchen:     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop',
    sport:       'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    book:        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop',
    beauty:      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    toy:         'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=800&auto=format&fit=crop',
    food:        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    default:     'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
};

function getFallbackImage(name = '') {
    const lower = name.toLowerCase();
    for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
        if (key !== 'default' && lower.includes(key)) return url;
    }
    return FALLBACK_IMAGES.default;
}

export default function CategoryCard({ category }) {
    const imageUrl = category.image || getFallbackImage(category.name);
    // Link to shop with category filter using the category _id
    const href = `/shop?category=${category._id}`;

    return (
        <Link href={href} className="group block relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5]">
            {/* Background image */}
            <img
                src={imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Base gradient — always visible for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Hover overlay — darkens on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Category name — always visible */}
                <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-sm">
                    {category.name}
                </h3>

                {/* "Explore" button — slides up and fades in on hover */}
                <div className="translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <span className="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                        Explore
                        <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}
