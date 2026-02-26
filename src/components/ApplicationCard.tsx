import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface ApplicationCardProps {
  name: string;
  icon: string;
  slug: string;
  image: string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ name, icon, slug, image }) => {
  return (
    <Link to={`/shop?application=${slug}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card group overflow-hidden relative h-48"
      >
        <img 
          src={image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-3xl mb-2">{icon}</span>
          <h3 className="text-lg font-bold tracking-tight">{name}</h3>
          <div className="w-8 h-0.5 bg-primary mt-2 scale-x-0 group-hover:scale-x-100 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
};

export default ApplicationCard;
