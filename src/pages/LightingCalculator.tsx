import React from 'react';
import { motion } from 'motion/react';
import { Calculator, Ruler, Lightbulb, CheckCircle } from 'lucide-react';

const LightingCalculator = () => {
  const [roomType, setRoomType] = React.useState('living');
  const [length, setLength] = React.useState(10);
  const [width, setWidth] = React.useState(10);
  const [result, setResult] = React.useState<any>(null);

  const calculate = () => {
    const area = length * width;
    // Basic lux requirements
    const luxMap: Record<string, number> = {
      living: 150,
      bedroom: 100,
      kitchen: 300,
      office: 500,
      bathroom: 150
    };
    
    const requiredLux = luxMap[roomType];
    const totalLumens = area * requiredLux;
    // Assuming 100 lumens per watt for LED
    const totalWatts = totalLumens / 100;
    
    setResult({
      area,
      lumens: Math.round(totalLumens),
      watts: Math.round(totalWatts),
      suggestions: [
        { type: 'Panel Light', count: Math.ceil(totalWatts / 12), watt: '12W' },
        { type: 'COB Light', count: Math.ceil(totalWatts / 7), watt: '7W' }
      ]
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Smart Lighting Calculator</h1>
        <p className="text-stone-400">Calculate the perfect wattage for your space in seconds.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-400">Room Type</label>
            <select 
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
            >
              <option value="living">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="office">Office Space</option>
              <option value="bathroom">Bathroom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-400">Length (ft)</label>
              <input 
                type="number" 
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-400">Width (ft)</label>
              <input 
                type="number" 
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
            </div>
          </div>

          <button 
            onClick={calculate}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Now</span>
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 border-primary/30 bg-primary/5"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                <CheckCircle className="text-primary w-6 h-6" />
                <span>Your Results</span>
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Total Area</p>
                  <p className="text-2xl font-black">{result.area} sq.ft</p>
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Required Watts</p>
                  <p className="text-2xl font-black text-primary">{result.watts}W</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-stone-300">Suggested Configuration:</p>
                {result.suggestions.map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                    <span className="text-stone-400">{s.type} ({s.watt})</span>
                    <span className="font-bold text-primary">x {s.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="glass-card p-8 h-full flex flex-col items-center justify-center text-center text-stone-500">
              <Lightbulb className="w-12 h-12 mb-4 opacity-20" />
              <p>Enter your room details to see <br />recommended lighting setup.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LightingCalculator;
