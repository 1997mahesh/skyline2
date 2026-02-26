import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Category, Product } from '../types';

const CategoryPage = () => {
  const { category: categorySlug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products?category=${categorySlug}`)
        ]);

        if (catsRes.ok) {
          const cats = await catsRes.json();
          const found = cats.find((c: Category) => c.slug === categorySlug);
          setCategory(found);
        }

        if (prodsRes.ok) {
          const data = await prodsRes.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch category data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="h-12 w-48 bg-white/5 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black uppercase">Category not found</h2>
        <Link to="/shop" className="btn-primary py-3 px-8">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-stone-500 mb-12">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{category.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tight leading-none">{category.name}</h1>
          <p className="text-stone-500 max-w-2xl">{category.description || `Explore our premium collection of ${category.name.toLowerCase()}.`}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-stone-500 text-sm font-bold">{products.length} Products</span>
          <button className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center space-y-4 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-stone-500">No products found in this category.</p>
          <Link to="/shop" className="text-primary font-bold hover:underline">Browse all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card group overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden bg-stone-900">
                <img 
                  src={JSON.parse(product.images as string)[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link to={`/shop/${product.slug}`} className="btn-primary py-2 px-6 text-[10px] font-black uppercase tracking-widest">View Details</Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">₹{product.price}</span>
                  <Link to={`/shop/${product.slug}`} className="text-stone-500 hover:text-primary transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
