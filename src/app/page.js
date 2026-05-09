import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Footer from '../components/layout/Footer';
import Link from 'next/link';

async function getLatestProducts() {
  try {
    const res = await fetch('http://localhost:4500/api/products?limit=4&sort=newest', {
      next: { revalidate: 30 }, // Revalidate every 30 seconds
      cache: 'no-store' // For development, always fetch fresh data
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch('http://localhost:4500/api/categories', {
      next: { revalidate: 30 }, // Revalidate every 30 seconds instead of 5 minutes
      cache: 'no-store' // For development, always fetch fresh data
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const json = await res.json();
    return (json.data || []).slice(0, 4); // show up to 4 on homepage
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getLatestProducts(),
    getCategories(),
  ]);

  // Filter out any items without valid _id
  const validCategories = categories.filter(cat => cat && cat._id);
  const validProducts = products.filter(product => product && product._id);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      {/* Featured Categories Section */}
      {validCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-black transition-colors">
              All categories &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {validCategories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Latest Arrivals</h2>
            <Link href="/shop" className="hidden sm:block text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Browse all products &rarr;
            </Link>
          </div>
          
          {validProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {validProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
              No products found. Make sure your backend server is running and returning data!
            </p>
          )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
