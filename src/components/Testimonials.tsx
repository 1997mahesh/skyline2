import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  { name: 'Rahul Sharma', role: 'Architect', text: 'Best collection of COB and Panel lights in Pune. Their wholesale rates are unbeatable.', rating: 5 },
  { name: 'Priya Deshmukh', role: 'Interior Designer', text: 'Skyline Lights helped me with the entire lighting plan for my client villa. Highly professional.', rating: 5 },
  { name: 'Amit Patel', role: 'Contractor', text: 'Quality of drivers and LED chips is top-notch. Very low failure rate in 2 years.', rating: 4 },
];

const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -5 }}
          className="glass-card p-8 relative"
        >
          <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5" />
          <div className="flex space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-stone-700'}`} />
            ))}
          </div>
          <p className="text-stone-300 italic mb-6 leading-relaxed">"{review.text}"</p>
          <div>
            <h4 className="font-bold">{review.name}</h4>
            <p className="text-xs text-stone-500 uppercase tracking-widest">{review.role}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Testimonials;
