import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Address } from '../../types';

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      toast.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Address added successfully');
        setIsModalOpen(false);
        fetchAddresses();
        setFormData({
          name: '',
          phone: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          pincode: '',
          is_default: false
        });
      }
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  if (loading) return <div className="text-center py-12">Loading addresses...</div>;

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">My Addresses</h2>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Manage your shipping and billing locations</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-3 px-8 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className={`glass-card p-8 space-y-6 relative group transition-all ${address.is_default ? 'border-primary/30 bg-primary/5' : 'hover:border-white/20'}`}>
            {address.is_default && (
              <div className="absolute top-6 right-6 flex items-center space-x-2 text-primary">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Default</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-stone-500">
                <MapPin className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">Shipping Address</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black uppercase tracking-tight">{address.name}</p>
                <p className="text-xs text-stone-400 font-bold">{address.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-stone-300 leading-relaxed">
                  {address.address_line1}<br />
                  {address.address_line2 && <>{address.address_line2}<br /></>}
                  {address.city}, {address.state} - {address.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors">Edit</button>
              <button className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:opacity-80 transition-opacity">Remove</button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="md:col-span-2 glass-card p-16 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-stone-700">
              <MapPin className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight">No addresses saved</h3>
              <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Add an address to speed up your checkout process</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h2 className="text-xl font-black uppercase tracking-tight">Add New Address</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Phone Number</label>
                    <input 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Address Line 1</label>
                  <input 
                    required
                    value={formData.address_line1}
                    onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    placeholder="House No, Street, Area"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Address Line 2 (Optional)</label>
                  <input 
                    value={formData.address_line2}
                    onChange={(e) => setFormData({...formData, address_line2: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    placeholder="Landmark, Apartment Name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">City</label>
                    <input 
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">State</label>
                    <input 
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Pincode</label>
                    <input 
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <label className="flex items-center space-x-3 cursor-pointer group pt-4">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_default ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/20'}`}>
                    {formData.is_default && <X className="w-4 h-4 text-black rotate-45" />}
                  </div>
                  <input 
                    type="checkbox"
                    className="hidden"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Set as default address</span>
                </label>

                <div className="flex justify-end space-x-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 text-xs font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary px-12 py-4"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Addresses;
