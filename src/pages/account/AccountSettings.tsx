import React from 'react';
import { Shield, Lock, Bell, Smartphone } from 'lucide-react';

const AccountSettings = () => {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Account Settings</h2>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Security and notification preferences</p>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-stone-500">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Change Password</h4>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Update your account password regularly</p>
            </div>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
            Update
          </button>
        </div>

        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-stone-500">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Notifications</h4>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Manage email and push notifications</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
             </div>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-stone-500">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight">Two-Factor Auth</h4>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Add an extra layer of security</p>
            </div>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
            Enable
          </button>
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 space-y-4">
        <h4 className="text-sm font-black uppercase tracking-tight text-red-400">Danger Zone</h4>
        <p className="text-xs text-stone-500 font-bold uppercase tracking-widest">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-6 py-3 rounded-xl border border-red-500/50 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
