import React from 'react';
import { ShieldCheck, Truck, BadgePercent, Award } from 'lucide-react';

const TrustBar = () => {
  const items = [
    { icon: <BadgePercent className="w-5 h-5" />, title: 'GST Billing Available', desc: 'Valid tax invoices' },
    { icon: <Award className="w-5 h-5" />, title: 'Wholesale Pricing', desc: 'Best rates in Pune' },
    { icon: <Truck className="w-5 h-5" />, title: 'Fast Delivery', desc: 'Across Maharashtra' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Premium Quality', desc: '2 Year Warranty' },
  ];

  return (
    <div className="bg-white/5 border-y border-white/5 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold">{item.title}</h4>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
