import React from 'react';

export const Badge = ({
  children,
  variant = 'red', // 'red' | 'gold' | 'blue' | 'cyan' | 'purple' | 'emerald' | 'slate'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = ''
}) => {
  const variantStyles = {
    red: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-[0_0_10px_rgba(37,99,235,0.2)]',
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-rajdhani font-bold tracking-wider uppercase rounded-md border ${
        variantStyles[variant] || variantStyles.red
      } ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{children}</span>
    </span>
  );
};
