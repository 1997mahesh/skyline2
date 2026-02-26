import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface SearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (slug: string) => {
    navigate(`/shop/${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute top-0 left-0 right-0 h-16 bg-bg-dark z-50 flex items-center px-4 md:px-8">
          <div ref={searchRef} className="max-w-3xl mx-auto w-full relative">
            <div className="relative flex items-center">
              <SearchIcon className="absolute left-4 w-5 h-5 text-stone-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products (e.g. LED bulb, Panel light)..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-12 py-3 text-sm outline-none focus:border-primary transition-all"
              />
              <button
                onClick={onClose}
                className="absolute right-4 text-stone-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
              {(results.length > 0 || isLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  {isLoading ? (
                    <div className="p-8 text-center text-stone-500">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                      Searching...
                    </div>
                  ) : (
                    <div className="py-2">
                      {results.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSelect(product.slug)}
                          className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                            <img
                              src={JSON.parse(product.images as string)[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-stone-500">₹{product.price}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-700 group-hover:text-primary transition-colors" />
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          navigate(`/shop?q=${encodeURIComponent(query)}`);
                          onClose();
                        }}
                        className="w-full py-3 px-4 text-xs font-bold text-primary hover:bg-white/5 transition-colors border-t border-white/5"
                      >
                        View all results for "{query}"
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Search;
