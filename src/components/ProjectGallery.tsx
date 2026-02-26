import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

const projects = [
  { title: 'Luxury Villa', location: 'Koregaon Park, Pune', image: 'https://picsum.photos/seed/p1/600/400' },
  { title: 'Corporate Office', location: 'Hinjewadi IT Park', image: 'https://picsum.photos/seed/p2/600/400' },
  { title: 'Boutique Hotel', location: 'Mahabaleshwar', image: 'https://picsum.photos/seed/p3/600/400' },
  { title: 'Modern Showroom', location: 'MG Road, Pune', image: 'https://picsum.photos/seed/p4/600/400' },
];

const ProjectGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {projects.map((project, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="glass-card group overflow-hidden aspect-[4/5] relative"
        >
          <img 
            src={project.image} 
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="font-bold text-lg">{project.title}</h4>
            <div className="flex items-center text-xs text-stone-400 mt-1">
              <MapPin className="w-3 h-3 mr-1 text-primary" />
              {project.location}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectGallery;
