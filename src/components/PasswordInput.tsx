import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, error, className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-stone-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all pr-12 ${className} ${
            error ? 'border-red-500/50' : ''
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-primary transition-colors"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 font-bold uppercase tracking-widest">{error}</p>}
    </div>
  );
};

export default PasswordInput;
