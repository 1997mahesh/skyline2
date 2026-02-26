import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tight leading-none">Get in Touch</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">Have a question about our products or need a wholesale quote? Our lighting experts are here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="glass-card p-8 space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tight">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Call Us</p>
                  <p className="font-bold text-lg">+91 9226645159</p>
                  <p className="text-xs text-stone-500">Mon-Sat, 10am-8pm</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Email Us</p>
                  <p className="font-bold text-lg">info@skylinelights.in</p>
                  <p className="text-xs text-stone-500">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Visit Us</p>
                  <p className="font-bold">460, Budhwar Peth Rd, Budhwar Peth,</p>
                  <p className="font-bold">Pune, Maharashtra – 411002</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-sm font-black uppercase tracking-widest mb-4">Store Hours</h3>
              <div className="space-y-2 text-sm text-stone-400">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>10:00 AM - 8:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-primary">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Send a Message</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Subject</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none">
                  <option className="bg-bg-dark">General Enquiry</option>
                  <option className="bg-bg-dark">Wholesale/B2B Quote</option>
                  <option className="bg-bg-dark">Order Support</option>
                  <option className="bg-bg-dark">Project Consultation</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Your Message</label>
                <textarea 
                  rows={6}
                  placeholder="How can we help you?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button className="btn-primary w-full py-4 uppercase tracking-widest font-black flex items-center justify-center space-x-3">
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mt-24 rounded-3xl overflow-hidden h-[400px] border border-white/10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m2!1m1!2zNDYwLCBCdWRod2FyIFBldGggUmQsIEJ1ZGh3YXIgUGV0aCwgUHVuZSwgTWFoYXJhc2h0cmEgNDExMDAy!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa5b442ff%3A0x596077d19562799!2sSkyline%20Lights!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
