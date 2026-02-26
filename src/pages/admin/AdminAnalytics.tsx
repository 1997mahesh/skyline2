import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, ShoppingBag, AlertTriangle, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const AdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
  ];

  const categoryData = [
    { name: 'LED Bulbs', value: 400 },
    { name: 'Panel Lights', value: 300 },
    { name: 'COB Lights', value: 200 },
    { name: 'Wall Lights', value: 150 },
    { name: 'Street Lights', value: 100 },
  ];

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Analytics</h1>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Total Revenue</p>
            <h3 className="text-2xl font-black">₹{stats?.revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Total Orders</p>
            <h3 className="text-2xl font-black">{stats?.orders}</h3>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Total Customers</p>
            <h3 className="text-2xl font-black">{stats?.customers}</h3>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Low Stock Items</p>
            <h3 className="text-2xl font-black">{stats?.lowStock}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Revenue Trend</h4>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  fontWeight="bold" 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  fontWeight="bold" 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 space-y-8">
          <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">Sales by Category</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  fontWeight="bold" 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  stroke="#ffffff40" 
                  fontSize={10} 
                  fontWeight="bold" 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#primary', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" fill="#FFD700" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
