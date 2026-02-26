import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        if (result.user.role === 'admin') {
          toast.error('Admins must login through the admin portal.');
          return;
        }
        login(result.user);
        toast.success('Welcome back!');
        navigate('/my-account');
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-10">
        <div className="text-center">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-stone-400 mt-2">Login to your Skyline Lights account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input 
                {...register('email')}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 focus:border-primary outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input 
                type="password"
                {...register('password')}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message as string}</p>}
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-stone-500">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
          </p>
          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-white/5">
            <Link to="/dealer" className="text-xs text-stone-400 hover:text-white">Dealer Registration</Link>
            <span className="text-stone-700">|</span>
            <button className="text-xs text-stone-400 hover:text-white">Forgot Password?</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
