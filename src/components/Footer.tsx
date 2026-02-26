import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card-dark border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <Zap className="w-8 h-8 text-primary fill-primary/20 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black tracking-tighter">SKYLINE</span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-stone-500">LIGHTS</span>
              </div>
            </Link>
            <p className="text-stone-500 max-w-sm leading-relaxed">
              Pune's leading wholesaler and retailer of premium LED lighting solutions. We provide high-quality, energy-efficient lighting for homes, offices, and industries.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' }
              ].map((social) => (
                <a key={social.label} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all group">
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/dealer" className="hover:text-primary transition-colors">Dealer Portal</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">Customer Care</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li><Link to="/account" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm text-stone-500">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>460, Budhwar Peth Rd, Budhwar Peth, Pune, Maharashtra – 411002</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+919226645159" className="hover:text-primary">+91 9226645159</a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                <a href="https://wa.me/919226645159" className="hover:text-primary">WhatsApp Us</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:info@skylinelights.com" className="hover:text-primary">info@skylinelights.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-600">
          <p>© 2026 Skyline Lights. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-stone-400">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-400">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-stone-400">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
