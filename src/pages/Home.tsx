import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Truck, Clock, Lightbulb, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrustBar from '../components/TrustBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import ApplicationCard from '../components/ApplicationCard';
import ProjectGallery from '../components/ProjectGallery';
import Testimonials from '../components/Testimonials';
import { Category, Product } from '../types';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      title: "Grand Chandelier",
      subtitle: "Elegance that defines your space. Premium crystal designs.",
      image: "https://picsum.photos/seed/chandelier/800/800",
      slug: "chandeliers",
      color: "from-amber-500/20"
    },
    {
      title: "Modern Pendant",
      subtitle: "Minimalist aesthetics for contemporary living. Sleek & stylish.",
      image: "https://picsum.photos/seed/pendant/800/800",
      slug: "pendant-lights",
      color: "from-blue-500/20"
    },
    {
      title: "Designer Wall Lamp",
      subtitle: "Create the perfect ambiance with our curated wall collection.",
      image: "https://picsum.photos/seed/wall-lamp/800/800",
      slug: "wall-lights",
      color: "from-emerald-500/20"
    },
    {
      title: "Outdoor Step Light",
      subtitle: "Safety meets style. Durable outdoor lighting solutions.",
      image: "https://picsum.photos/seed/step-light/800/800",
      slug: "step-lights",
      color: "from-stone-500/20"
    },
    {
      title: "Pro Track Light",
      subtitle: "Focused illumination for galleries, shops, and modern homes.",
      image: "https://picsum.photos/seed/track-light/800/800",
      slug: "track-lights",
      color: "from-purple-500/20"
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const cats = await res.json();
          setCategories(cats);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        let url = '/api/products';
        if (activeTab === 'featured') url += '?featured=true';
        else if (activeTab === 'new') url += '?sort=new';
        else if (activeTab === 'top-rated') url += '?sort=top-rated';

        const res = await fetch(url);
        if (res.ok) {
          const prods = await res.json();
          setFeaturedProducts(prods);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [activeTab]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section - Auto Slider */}
      <section 
        className="relative h-[90vh] flex items-center overflow-hidden bg-bg-dark"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 via-bg-dark/80 to-bg-dark z-10" />
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <img 
              src={slides[currentSlide].image} 
              className="w-full h-full object-cover"
              alt="Hero Background"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Animated Glow Orbs */}
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full animate-pulse transition-colors duration-1000 bg-primary/20`} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black tracking-[0.2em] uppercase">
                <Zap className="w-4 h-4" />
                <span>Pune's Premier Lighting Destination</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
                {slides[currentSlide].title.split(' ')[0]} <br />
                <span className="text-primary glow-text">{slides[currentSlide].title.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              <p className="text-xl text-stone-400 max-w-xl leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <Link to={`/shop?category=${slides[currentSlide].slug}`} className="btn-primary py-4 px-10 text-sm uppercase tracking-widest font-black flex items-center space-x-3">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/calculator" className="btn-outline py-4 px-10 text-sm uppercase tracking-widest font-black flex items-center space-x-3">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span>Smart Calculator</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              key={`image-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <img 
                  src={slides[currentSlide].image} 
                  alt={slides[currentSlide].title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === idx ? 'w-12 bg-primary' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase">Shop by Category</h2>
            <p className="text-stone-500 mt-2">Explore our comprehensive range of lighting products</p>
          </div>
          <Link to="/categories" className="text-primary font-bold flex items-center space-x-2 hover:underline">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.slice(0, 10).map((cat: any) => (
            <CategoryCard key={cat.id} category={cat} count={cat.product_count} />
          ))}
        </div>
      </section>

      {/* Shop by Application */}
      <section className="bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Shop by Application</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Find the perfect lighting solution tailored for your specific environment and needs.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ApplicationCard name="Home Lighting" icon="🏠" slug="home" image="https://picsum.photos/seed/app-home/600/400" />
            <ApplicationCard name="Office Lighting" icon="🏢" slug="office" image="https://picsum.photos/seed/app-office/600/400" />
            <ApplicationCard name="Shop & Retail" icon="🛍️" slug="shop" image="https://picsum.photos/seed/app-shop/600/400" />
            <ApplicationCard name="Hotel & Cafe" icon="🏨" slug="hotel" image="https://picsum.photos/seed/app-hotel/600/400" />
            <ApplicationCard name="Outdoor" icon="🌳" slug="outdoor" image="https://picsum.photos/seed/app-outdoor/600/400" />
            <ApplicationCard name="Warehouse" icon="🏭" slug="warehouse" image="https://picsum.photos/seed/app-warehouse/600/400" />
            <ApplicationCard name="Decorative" icon="✨" slug="decorative" image="https://picsum.photos/seed/app-deco/600/400" />
            <ApplicationCard name="Industrial" icon="⚙️" slug="industrial" image="https://picsum.photos/seed/app-ind/600/400" />
          </div>
        </div>
      </section>

      {/* Featured Products Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-8">Featured Collection</h2>
          <div className="flex space-x-4 bg-white/5 p-1 rounded-full border border-white/10">
            {['featured', 'new', 'top-rated'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'text-stone-500 hover:text-white'}`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-primary/10 border-primary/20 overflow-hidden relative min-h-[400px] flex items-center">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <img 
              src="https://picsum.photos/seed/festival/800/600" 
              className="w-full h-full object-cover opacity-60"
              alt="Offer"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-transparent to-transparent" />
          </div>
          <div className="relative z-10 p-12 lg:w-1/2 space-y-6">
            <span className="text-primary font-black tracking-[0.3em] uppercase text-sm">Limited Time Offer</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              Festival <br />
              <span className="text-white">Lighting</span> <br />
              Sale
            </h2>
            <p className="text-stone-400 text-lg">Get up to 40% OFF on decorative hanging lights and chandeliers. Brighten your celebrations.</p>
            <Link to="/shop?category=hanging-lights" className="btn-primary inline-flex items-center space-x-2 py-4 px-10">
              <span>Shop Sale</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-4">Project Gallery</h2>
          <p className="text-stone-500">Real installations from Skyline Lights across Pune and Maharashtra.</p>
        </div>
        <ProjectGallery />
      </section>

      {/* Dealer CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-black max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">Become a <br />Skyline Dealer</h2>
            <p className="text-black/70 text-lg font-medium">Join our network of 200+ dealers. Get exclusive wholesale pricing, MOQ benefits, and priority support.</p>
          </div>
          <Link to="/dealer" className="bg-black text-white py-5 px-12 rounded-full font-black uppercase tracking-widest hover:bg-stone-900 transition-colors shadow-2xl">
            Apply for B2B Portal
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight uppercase mb-4">What Clients Say</h2>
          <p className="text-stone-500">Trusted by architects, designers, and homeowners.</p>
        </div>
        <Testimonials />
      </section>

      {/* Brands Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-y border-white/5">
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          {['Philips', 'Havells', 'Syska', 'Crompton', 'Wipro', 'Skyline'].map((brand) => (
            <span key={brand} className="text-2xl font-black tracking-tighter uppercase">{brand}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
