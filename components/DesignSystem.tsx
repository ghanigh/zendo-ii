import React from 'react';

// --- Typography ---

interface TextProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const H1: React.FC<TextProps> = ({ children, className = '', align = 'left' }) => (
  <h1 className={`text-2xl font-bold tracking-tight text-white text-${align} ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<TextProps> = ({ children, className = '', align = 'left' }) => (
  <h2 className={`text-lg font-bold text-white text-${align} ${className}`}>
    {children}
  </h2>
);

export const Subtext: React.FC<TextProps> = ({ children, className = '', align = 'left' }) => (
  <p className={`text-sm text-zendo-text-secondary text-${align} ${className}`}>
    {children}
  </p>
);

// --- Cards ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false, glass = false, onClick }) => {
  const base = glass ? 'glass' : 'bg-zendo-card border border-white/5';
  const padding = noPadding ? '' : 'p-4';
  const interaction = onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : '';
  
  return (
    <div onClick={onClick} className={`rounded-2xl ${base} ${padding} ${interaction} ${className}`}>
      {children}
    </div>
  );
};

// --- Badges ---

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'elite' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', className = '' }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    elite: 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    neutral: 'bg-slate-700/30 text-slate-400 border-slate-600/30'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[variant]} ${className}`}>
      {label}
    </span>
  );
};

// --- Inputs ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="text-xs font-semibold text-zendo-text-secondary ml-1">{label}</label>}
    <div className="relative">
      <input 
        className="w-full bg-zendo-input text-white border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zendo-primary/50 transition-all placeholder:text-slate-600"
        {...props}
      />
      {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
    </div>
  </div>
);

// --- Divider ---

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-px w-full bg-white/5 my-4 ${className}`} />
);
