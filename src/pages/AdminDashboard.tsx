import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/admin/stats')
    .then(res => res.json())
    .then(data => setStats(data));
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Overview</h1>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Business Performance at a glance</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-8 border-l-4 border-emerald-500">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 className="text-3xl font-black">₹{stats?.revenue?.toLocaleString() || 0}</h3>
        </div>
        
        <div className="glass-card p-8 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
              <ShoppingBag className="w-8 h-8" />
            </div>
          </div>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Orders</p>
          <h3 className="text-3xl font-black">{stats?.orders || 0}</h3>
        </div>

        <div className="glass-card p-8 border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Customers</p>
          <h3 className="text-3xl font-black">{stats?.customers || 0}</h3>
        </div>

        <div className="glass-card p-8 border-l-4 border-red-500">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
          </div>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-1">Low Stock Items</p>
          <h3 className="text-3xl font-black text-red-400">{stats?.lowStock || 0}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8">Sales Performance</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#444" fontSize={12} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #222', borderRadius: '16px' }}
                  itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-black uppercase tracking-tight mb-8">Order Trends</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#444" fontSize={12} fontWeight="bold" />
                <YAxis stroke="#444" fontSize={12} fontWeight="bold" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #222', borderRadius: '16px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
