import React from 'react';

export const Splash: React.FC = () => {
  return (
    <div className="h-screen bg-zendo-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">ZENDO</h1>
        <p className="text-sm text-cyan-400 font-medium tracking-widest uppercase">Premium Service</p>
      </div>

      <div className="absolute bottom-10">
        <div className="w-6 h-6 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};