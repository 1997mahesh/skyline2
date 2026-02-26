import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

const ProfileInfo = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Profile Information</h2>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Manage your account details and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-4 text-stone-500">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Full Name</span>
            </div>
            <p className="text-lg font-bold uppercase tracking-tight">{user.name}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-4 text-stone-500">
              <Mail className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Email Address</span>
            </div>
            <p className="text-lg font-bold">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-4 text-stone-500">
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Phone Number</span>
            </div>
            <p className="text-lg font-bold">{user.phone || 'Not provided'}</p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-4 text-stone-500">
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Member Since</span>
            </div>
            <p className="text-lg font-bold">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 bg-primary/5 border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-black uppercase tracking-tight">Account Security</h4>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Your account is protected with role-based access control</p>
          </div>
        </div>
        <button className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-widest">
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
