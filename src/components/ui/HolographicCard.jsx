import React from 'react';

export const HolographicCard = ({
  children,
  className = '',
  glowColor = 'red', // 'red' | 'blue' | 'gold' | 'cyan' | 'purple' | 'none'
  hoverEffect = true,
  onClick
}) => {
  const glowClasses = {
    red: 'border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
    blue: 'border-blue-500/30 hover:border-blue-500/60 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]',
    gold: 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]',
    cyan: 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    purple: 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    none: 'border-slate-800'
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-[#0b1021]/80 backdrop-blur-md rounded-2xl border ${
        glowClasses[glowColor] || glowClasses.red
      } ${
        hoverEffect ? 'transition-all duration-300 hover:-translate-y-1' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Corner Cyber Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500 rounded-tl pointer-events-none opacity-80" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-400 rounded-br pointer-events-none opacity-80" />

      {children}
    </div>
  );
};
