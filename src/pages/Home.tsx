import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Truck, Clock, Lightbulb, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrustBar from '../components/TrustBar';
import CategoryCard from '../components/CategoryCard';
import ApplicationCard from '../components/ApplicationCard';
import ProjectGallery from '../components/ProjectGallery';
import Testimonials from '../components/Testimonials';
import { Category, Product } from '../types';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products')
        ]);
        
        if (catsRes.ok) {
          const cats = await catsRes.json();
          setCategories(cats);
        }
        
        if (prodsRes.ok) {
          const prods = await prodsRes.json();
          setFeaturedProducts(prods.filter((p: Product) => p.is_featured || p.is_new));
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/lighting-luxury/1920/1080?blur=2" 
            className="w-full h-full object-cover opacity-30"
            alt="Hero Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-bg-dark to-bg-dark" />
          
          {/* Animated Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black tracking-[0.2em] uppercase">
              <Zap className="w-4 h-4" />
              <span>Pune's Premier Lighting Destination</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
              Light <br />
              <span className="text-primary glow-text">Beyond</span> <br />
              Limits
            </h1>
            
            <p className="text-xl text-stone-400 max-w-xl leading-relaxed">
              Wholesale & Retail experts in LED, Decorative, and Industrial lighting. Transforming spaces with premium illumination since 2010.
            </p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              <Link to="/shop" className="btn-primary py-4 px-10 text-sm uppercase tracking-widest font-black flex items-center space-x-3">
                <span>Explore Shop</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/calculator" className="btn-outline py-4 px-10 text-sm uppercase tracking-widest font-black flex items-center space-x-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <span>Smart Calculator</span>
              </Link>
            </div>
          </motion.div>
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
          {categories.slice(0, 10).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
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
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card group overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden bg-stone-900">
                <img 
                  src={JSON.parse(product.images as any)[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link to={`/product/${product.slug}`} className="btn-primary py-2 px-6 text-[10px] font-black uppercase tracking-widest">View Details</Link>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-primary">₹{product.price}</span>
                  <div className="flex items-center text-stone-500 text-xs">
                    <Star className="w-3 h-3 text-primary fill-primary mr-1" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            </motion.div>
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
