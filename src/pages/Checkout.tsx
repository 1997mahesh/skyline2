import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Phone, User, Plus, Check, ArrowRight, ShoppingBag, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface Address {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  is_default: boolean;
}

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    state: '',
    city: '',
    address_line1: '',
    landmark: '',
    type: 'Home',
    is_default: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/shop');
      return;
    }
    fetchAddresses();
  }, [user, items]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        const defaultAddr = data.find((a: Address) => a.is_default);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (data.length > 0) setSelectedAddressId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch addresses');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      });
      if (res.ok) {
        const { id } = await res.json();
        toast.success('Address added successfully');
        setShowNewAddressForm(false);
        fetchAddresses();
        setSelectedAddressId(id);
      }
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          paymentMethod: 'COD'
        })
      });

      if (res.ok) {
        const { orderId } = await res.json();
        clearCart();
        navigate(`/order-success?id=${orderId}`);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error('Something went wrong');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Address Section */}
          <section className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Delivery Address</span>
              </h2>
              {!showNewAddressForm && (
                <button 
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-primary text-sm font-bold flex items-center space-x-1 hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showNewAddressForm ? (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleAddAddress}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                      value={newAddress.name}
                      onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Pincode"
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                      value={newAddress.pincode}
                      onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="City"
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                      value={newAddress.state}
                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Address (House No, Building, Street, Area)"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                    value={newAddress.address_line1}
                    onChange={e => setNewAddress({...newAddress, address_line1: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none"
                    value={newAddress.landmark}
                    onChange={e => setNewAddress({...newAddress, landmark: e.target.value})}
                  />
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-stone-500">Address Type:</span>
                    {['Home', 'Work'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewAddress({...newAddress, type: t})}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${newAddress.type === t ? 'bg-primary border-primary text-black' : 'border-white/10 text-stone-400 hover:border-white/20'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={newAddress.is_default}
                      onChange={e => setNewAddress({...newAddress, is_default: e.target.checked})}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                    />
                    <label htmlFor="is_default" className="text-sm text-stone-400">Set as default address</label>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-primary flex-1 py-3 uppercase tracking-widest font-black text-xs">Save Address</button>
                    <button type="button" onClick={() => setShowNewAddressForm(false)} className="btn-outline flex-1 py-3 uppercase tracking-widest font-black text-xs">Cancel</button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {addresses.map(addr => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/2 hover:border-white/10'}`}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-4 right-4 bg-primary text-black rounded-full p-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-stone-400">{addr.type}</span>
                        {addr.is_default && <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Default</span>}
                      </div>
                      <p className="font-bold mb-1">{addr.name}</p>
                      <p className="text-sm text-stone-400 mb-2">{addr.phone}</p>
                      <p className="text-sm text-stone-500 leading-relaxed">
                        {addr.address_line1}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="col-span-2 py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <MapPin className="w-12 h-12 text-stone-700 mx-auto mb-4" />
                      <p className="text-stone-500">No addresses found. Please add one.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Payment Section */}
          <section className="glass-card p-8">
            <h2 className="text-xl font-bold flex items-center space-x-2 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Payment Method</span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Cash on Delivery (COD)</p>
                    <p className="text-xs text-stone-500">Pay when you receive the order</p>
                  </div>
                </div>
                <div className="bg-primary text-black rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/5 bg-white/2 opacity-50 cursor-not-allowed">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-stone-500">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-400">Online Payment (UPI/Card)</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-32 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                    <img src={JSON.parse(item.images as string)[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.quantity} x ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <div className="flex justify-between text-stone-400 text-sm">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{total}</span>
              </div>
              <div className="flex justify-between text-stone-400 text-sm">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-stone-400 text-sm">
                <span>GST (Included)</span>
                <span className="text-white font-bold">18%</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-4">
              <span className="text-stone-400 font-bold">Total Amount</span>
              <span className="text-3xl font-black text-primary glow-text">₹{total}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId}
              className="btn-primary w-full py-4 uppercase tracking-widest font-black flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlacingOrder ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin rounded-full" />
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
