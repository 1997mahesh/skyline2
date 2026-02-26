import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, Eye, X, Edit2, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { User, Order } from '../../types';

const AdminCustomers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (user: User) => {
    setSelectedUser(user);
    try {
      const res = await fetch('/api/orders');
      const allOrders = await res.json();
      const filteredOrders = allOrders.filter((o: Order) => o.user_id === user.id);
      setUserOrders(filteredOrders);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to fetch user orders');
    }
  };

  const handleEditClick = (user: User) => {
    setEditFormData(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      
      if (res.ok) {
        toast.success('User updated successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update user');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading customers...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Customers</h1>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Manage and view customer profiles</p>
      </div>

      <div className="glass-card p-4 flex items-center space-x-4">
        <Search className="w-5 h-5 text-stone-500" />
        <input 
          type="text"
          placeholder="Search by Name or Email..."
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-tight">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-xs text-stone-400">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-xs text-stone-400">
                          <Phone className="w-3 h-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : user.role === 'dealer' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-stone-400 font-bold">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleViewDetails(user)}
                        className="p-2 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-stone-400 hover:text-red-400 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h2 className="text-xl font-black uppercase tracking-tight">Edit Customer</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Role</label>
                    <select 
                      value={editFormData.role || 'customer'}
                      onChange={(e) => setEditFormData({...editFormData, role: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="customer" className="bg-[#0f0f0f]">Customer</option>
                      <option value="dealer" className="bg-[#0f0f0f]">Dealer</option>
                      <option value="admin" className="bg-[#0f0f0f]">Admin</option>
                    </select>
                  </div>
                </div>

                {editFormData.role === 'dealer' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">GST Number</label>
                    <input 
                      type="text"
                      value={editFormData.gst_number || ''}
                      onChange={(e) => setEditFormData({...editFormData, gst_number: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSaving ? 'Saving Changes...' : 'Update Customer'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
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
                <h2 className="text-xl font-black uppercase tracking-tight">Customer Profile</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center text-primary text-4xl font-black shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight">{selectedUser.name}</h3>
                      <p className="text-stone-500 text-xs uppercase tracking-widest font-bold">{selectedUser.role} Account</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Email Address</p>
                        <p className="text-sm font-bold">{selectedUser.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Phone Number</p>
                        <p className="text-sm font-bold">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Member Since</p>
                        <p className="text-sm font-bold">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      {selectedUser.gst_number && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">GST Number</p>
                          <p className="text-sm font-bold">{selectedUser.gst_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-500">Order History</h4>
                  {userOrders.length > 0 ? (
                    <div className="glass-card overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Order ID</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Date</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500">Total</th>
                            <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {userOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 font-mono text-xs font-bold">#ORD-{order.id.toString().padStart(5, '0')}</td>
                              <td className="px-6 py-4 text-xs text-stone-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-xs font-black">₹{order.total_amount.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={`text-[8px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="glass-card p-12 text-center space-y-4">
                      <ShoppingBag className="w-12 h-12 text-stone-700 mx-auto" />
                      <p className="text-stone-500 text-sm font-bold uppercase tracking-widest">No orders found for this customer</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;
