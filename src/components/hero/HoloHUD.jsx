import React from 'react';

export const HoloHUD = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none relative flex items-center justify-center ${className}`}>
      {/* Outer Telemetry Ring */}
      <svg className="w-full h-full animate-holo-spin opacity-20" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="140" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 14" />
        <circle cx="150" cy="150" r="125" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="30 40" />
      </svg>

      {/* Inner Reverse Ring */}
      <svg className="absolute w-[80%] h-[80%] animate-holo-spin-reverse opacity-30" viewBox="0 0 240 240">
        <circle cx="120" cy="120" r="105" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="12 18" />
        <line x1="20" y1="120" x2="40" y2="120" stroke="#06b6d4" strokeWidth="2" />
        <line x1="200" y1="120" x2="220" y2="120" stroke="#06b6d4" strokeWidth="2" />
        <line x1="120" y1="20" x2="120" y2="40" stroke="#06b6d4" strokeWidth="2" />
        <line x1="120" y1="200" x2="120" y2="220" stroke="#06b6d4" strokeWidth="2" />
      </svg>

      {/* Center Reticle */}
      <div className="absolute w-12 h-12 border border-amber-400/40 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
      </div>
    </div>
  );
};
