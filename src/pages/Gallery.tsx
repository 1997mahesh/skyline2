import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Camera, MapPin, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  created_at: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (err) {
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tight leading-none">Project Gallery</h1>
          <p className="text-stone-500 max-w-2xl">A showcase of our finest lighting installations across residential, commercial, and industrial sectors.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-stone-500 uppercase tracking-widest font-bold text-xs">Loading Gallery...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
          <ImageIcon className="w-16 h-16 text-stone-700 mx-auto mb-4" />
          <p className="text-stone-500 font-bold uppercase tracking-widest">No images in gallery yet</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid glass-card group overflow-hidden relative"
            >
              <img 
                src={image.image_url} 
                alt={image.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {image.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{image.title}</h3>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

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
