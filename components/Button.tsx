import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40",
    secondary: "bg-zendo-card text-white hover:bg-slate-800 border border-slate-700",
    outline: "border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-950/30",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const loadingClass = isLoading ? "opacity-75 cursor-not-allowed" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${loadingClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};