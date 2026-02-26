import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Order } from '../../types';

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to fetch order details');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-blue-400';
      case 'packed': return 'text-purple-400';
      case 'out for delivery': return 'text-orange-400';
      case 'delivered': return 'text-emerald-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-stone-400';
    }
  };

  if (loading) return <div className="text-center py-12">Loading your orders...</div>;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">My Orders</h2>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Track and manage your purchase history</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-card overflow-hidden hover:border-white/20 transition-colors group">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-stone-500 group-hover:text-primary transition-colors">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Order ID</p>
                    <p className="text-sm font-bold font-mono">#ORD-{order.id.toString().padStart(5, '0')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Date</p>
                    <p className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Total</p>
                    <p className="text-xs font-black">₹{order.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Status</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>{order.status}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleViewDetails(order.id)}
                  className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-stone-700">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight">No orders yet</h3>
            <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">Start shopping to see your orders here</p>
          </div>
          <button className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-widest">
            Go to Shop
          </button>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrder && (
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
              className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Order Details</h2>
                  <p className="text-[10px] text-stone-500 font-mono">#ORD-{selectedOrder.id.toString().padStart(5, '0')}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Shipping Address</h4>
                    <div className="glass-card p-4">
                      <p className="text-sm font-bold mb-1">{selectedOrder.address_name}</p>
                      <p className="text-xs text-stone-400 mb-2">{selectedOrder.address_phone}</p>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {selectedOrder.address_line1}, {selectedOrder.address_line2 && `${selectedOrder.address_line2}, `}
                        {selectedOrder.landmark && `${selectedOrder.landmark}, `}
                        {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Order Status</h4>
                    <div className="glass-card p-4 flex items-center justify-between">
                      <span className={`text-xs font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                      <Clock className="w-5 h-5 text-stone-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Order Items</h4>
                  <div className="glass-card overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                          <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Product</th>
                          <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Price</th>
                          <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Qty</th>
                          <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {selectedOrder.items?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-stone-900 overflow-hidden shrink-0">
                                  <img 
                                    src={JSON.parse(item.product_images)[0]} 
                                    alt={item.product_name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight">{item.product_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs font-bold">₹{item.price.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs font-bold">x{item.quantity}</td>
                            <td className="px-6 py-4 text-xs font-black text-right">₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-white/5">
                          <td colSpan={3} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Total Paid</td>
                          <td className="px-6 py-4 text-lg font-black text-primary text-right">₹{selectedOrder.total_amount.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;
