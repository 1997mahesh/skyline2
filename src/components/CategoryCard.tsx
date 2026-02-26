import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  count?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, count = 12 }) => {
  return (
    <Link to={`/shop?category=${category.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass-card group overflow-hidden relative aspect-square"
      >
        <img 
          src={category.image} 
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
            {category.name.toUpperCase()}
          </h3>
          <p className="text-xs text-stone-400 font-medium">{count} Products</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
