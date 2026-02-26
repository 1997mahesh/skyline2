import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Award, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/about-lighting/1920/1080?blur=5" 
            className="w-full h-full object-cover opacity-30"
            alt="About Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-bg-dark to-bg-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
              Illuminating <br />
              <span className="text-primary glow-text">Pune</span> Since 2010
            </h1>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Skyline Lights is a leading wholesaler and retailer of premium LED and decorative lighting solutions in Maharashtra.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase tracking-tight">Our Legacy of Light</h2>
            <div className="space-y-4 text-stone-400 leading-relaxed">
              <p>
                Founded in the heart of Pune's electrical market, Budhwar Peth, Skyline Lights began with a simple mission: to provide high-quality, energy-efficient lighting solutions that are accessible to everyone.
              </p>
              <p>
                Over the last decade, we have grown from a small retail outlet to a major wholesale hub, serving thousands of homeowners, architects, and industrial clients across India.
              </p>
              <p>
                We specialize in the latest LED technology, ensuring that our products not only look beautiful but also contribute to a sustainable future through low energy consumption and long-lasting durability.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-primary">15k+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Happy Clients</p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">200+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-500">B2B Partners</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-card p-2">
              <img 
                src="https://picsum.photos/seed/store/800/1000" 
                className="w-full h-full object-cover rounded-2xl"
                alt="Skyline Store"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary p-8 rounded-3xl shadow-2xl hidden md:block">
              <Zap className="w-12 h-12 text-black" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Our Core Values</h2>
            <p className="text-stone-500">The principles that guide every interaction and product we offer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield />, title: "Quality First", desc: "We only stock products that meet rigorous durability and performance standards." },
              { icon: <Users />, title: "Customer Centric", desc: "Our experts provide personalized lighting consultations for every project." },
              { icon: <Award />, title: "Innovation", desc: "Constantly updating our catalog with the latest in smart and efficient lighting tech." }
            ].map((val, i) => (
              <div key={i} className="glass-card p-10 space-y-6 hover:border-primary/50 transition-colors group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{val.title}</h3>
                <p className="text-stone-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card bg-primary p-12 md:p-20 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black leading-none">
            Ready to brighten <br /> your space?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/shop" className="bg-black text-white py-4 px-10 rounded-full font-black uppercase tracking-widest hover:bg-stone-900 transition-colors flex items-center space-x-3">
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/contact" className="border-2 border-black text-black py-4 px-10 rounded-full font-black uppercase tracking-widest hover:bg-black/5 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
