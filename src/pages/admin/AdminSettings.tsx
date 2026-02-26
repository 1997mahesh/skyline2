import React, { useState, useEffect } from 'react';
import { Save, Store, Mail, Phone, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { StoreSettings } from '../../types';

const AdminSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: '',
    logo: '',
    contact_email: '',
    contact_phone: '',
    gst_number: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('Settings updated successfully');
      }
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Settings</h1>
        <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Configure your store identity and contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
                <Store className="w-3 h-3" />
                <span>Store Name</span>
              </label>
              <input 
                required
                value={settings.store_name}
                onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                placeholder="Skyline Lights"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
                <ImageIcon className="w-3 h-3" />
                <span>Logo URL</span>
              </label>
              <input 
                required
                value={settings.logo}
                onChange={(e) => setSettings({...settings, logo: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                placeholder="/logo.png"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
                <Mail className="w-3 h-3" />
                <span>Contact Email</span>
              </label>
              <input 
                required
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                placeholder="contact@skylinelights.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
                <Phone className="w-3 h-3" />
                <span>Contact Phone</span>
              </label>
              <input 
                required
                value={settings.contact_phone}
                onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                placeholder="+91 9226645159"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
                <FileText className="w-3 h-3" />
                <span>GST Number</span>
              </label>
              <input 
                required
                value={settings.gst_number}
                onChange={(e) => setSettings({...settings, gst_number: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                placeholder="27AAACG1234A1Z5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1 flex items-center space-x-2">
              <MapPin className="w-3 h-3" />
              <span>Store Address</span>
            </label>
            <textarea 
              required
              rows={3}
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors resize-none"
              placeholder="123, Light Street, Mumbai, Maharashtra"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="btn-primary px-12 py-4 flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
