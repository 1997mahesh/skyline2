import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Camera, MapPin } from 'lucide-react';

const Gallery = () => {
  const projects = [
    { title: "Luxury Villa", location: "Baner, Pune", image: "https://picsum.photos/seed/proj1/800/1000", category: "Residential" },
    { title: "Corporate Office", location: "Hinjewadi IT Park", image: "https://picsum.photos/seed/proj2/800/600", category: "Commercial" },
    { title: "Boutique Cafe", location: "Koregaon Park", image: "https://picsum.photos/seed/proj3/800/800", category: "Hospitality" },
    { title: "Modern Apartment", location: "Wakad, Pune", image: "https://picsum.photos/seed/proj4/800/1000", category: "Residential" },
    { title: "Retail Showroom", location: "MG Road, Pune", image: "https://picsum.photos/seed/proj5/800/600", category: "Commercial" },
    { title: "Industrial Warehouse", location: "Chakan MIDC", image: "https://picsum.photos/seed/proj6/800/800", category: "Industrial" },
    { title: "Penthouse Terrace", location: "Kalyani Nagar", image: "https://picsum.photos/seed/proj7/800/1000", category: "Residential" },
    { title: "Fine Dining", location: "Viman Nagar", image: "https://picsum.photos/seed/proj8/800/600", category: "Hospitality" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tight leading-none">Project Gallery</h1>
          <p className="text-stone-500 max-w-2xl">A showcase of our finest lighting installations across residential, commercial, and industrial sectors.</p>
        </div>
        <div className="flex space-x-4 bg-white/5 p-1 rounded-full border border-white/10">
          {['All', 'Residential', 'Commercial', 'Hospitality'].map((filter) => (
            <button
              key={filter}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-primary text-black' : 'text-stone-500 hover:text-white'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="break-inside-avoid glass-card group overflow-hidden relative"
          >
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
              <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{project.category}</span>
                <h3 className="text-2xl font-black uppercase tracking-tight">{project.title}</h3>
                <div className="flex items-center text-stone-400 text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-45 group-hover:rotate-0">
              <ExternalLink className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Instagram CTA */}
      <div className="mt-24 glass-card p-12 text-center space-y-6">
        <Camera className="w-12 h-12 text-primary mx-auto" />
        <h2 className="text-3xl font-black uppercase tracking-tight">Follow our journey on Instagram</h2>
        <p className="text-stone-500">Get daily inspiration and behind-the-scenes looks at our latest projects.</p>
        <a 
          href="https://instagram.com/skylinelights" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-outline inline-flex items-center space-x-3 py-4 px-10"
        >
          <span>@skylinelights</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default Gallery;
