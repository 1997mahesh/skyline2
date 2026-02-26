import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user.role !== 'admin') {
          toast.error('Access denied. Admin privileges required.');
          return;
        }
        login(data.user);
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black font-black text-3xl mx-auto shadow-[0_0_30px_rgba(255,255,0,0.2)]">
            S
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Skyline <span className="text-primary">Admin</span></h1>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Authorized Personnel Only</p>
        </div>

        <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary transition-colors text-white"
                  placeholder="admin@skylinelights.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-primary transition-colors text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center space-x-2 text-stone-600">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Admin Gateway</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-stone-600 hover:text-stone-400 text-xs font-bold uppercase tracking-widest transition-colors">
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
