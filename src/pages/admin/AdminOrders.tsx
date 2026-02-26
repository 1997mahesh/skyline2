import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Order } from '../../types';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Order status updated');
        fetchOrders();
        if (selectedOrder?.id === id) {
          handleViewDetails(id);
        }
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'accepted': return 'text-blue-400 bg-blue-400/10';
      case 'packed': return 'text-purple-400 bg-purple-400/10';
      case 'out for delivery': return 'text-orange-400 bg-orange-400/10';
      case 'delivered': return 'text-emerald-400 bg-emerald-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-stone-400 bg-stone-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'accepted': return <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />;
      case 'packed': return <Package className="w-3 h-3" />;
      case 'out for delivery': return <Truck className="w-3 h-3" />;
      case 'delivered': return <CheckCircle2 className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toString().includes(searchTerm) ||
    o.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Orders</h1>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Monitor and manage customer orders</p>
      </div>

      <div className="glass-card p-4 flex items-center space-x-4">
        <Search className="w-5 h-5 text-stone-500" />
        <input 
          type="text"
          placeholder="Search by Order ID, Customer Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Total</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold">#ORD-{order.id.toString().padStart(5, '0')}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">{order.user_name}</p>
                      <p className="text-[10px] text-stone-500">{order.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-400 font-bold">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black">₹{order.total_amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleViewDetails(order.id)}
                      className="p-2 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Customer Info</h4>
                    <div className="glass-card p-4 space-y-2">
                      <p className="text-sm font-bold uppercase">{selectedOrder.user_name}</p>
                      <p className="text-xs text-stone-400">{selectedOrder.user_email}</p>
                    </div>
                  </div>
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
                    <div className="space-y-4">
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none border border-white/10 appearance-none ${getStatusColor(selectedOrder.status)}`}
                      >
                        <option value="pending" className="bg-[#0f0f0f]">Pending</option>
                        <option value="accepted" className="bg-[#0f0f0f]">Accepted</option>
                        <option value="rejected" className="bg-[#0f0f0f]">Rejected</option>
                        <option value="packed" className="bg-[#0f0f0f]">Packed</option>
                        <option value="out for delivery" className="bg-[#0f0f0f]">Out for Delivery</option>
                        <option value="delivered" className="bg-[#0f0f0f]">Delivered</option>
                      </select>
                      <p className="text-[10px] text-stone-500 text-center italic">Updating status will notify the customer</p>
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
                          <td colSpan={3} className="px-6 py-4 text-xs font-black uppercase tracking-widest text-right">Total Amount</td>
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

export default AdminOrders;
