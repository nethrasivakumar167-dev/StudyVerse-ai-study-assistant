import React from 'react';
import { useSound } from '../../context/SoundContext';

export const EnergyButton = ({
  children,
  onClick,
  variant = 'primary', // 'primary' (red/gold) | 'secondary' (blue/cyan) | 'tactical' (dark) | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const { playSfx } = useSound();

  const handleClick = (e) => {
    if (disabled) return;
    playSfx('energy');
    if (onClick) onClick(e);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 cursor-pointer overflow-hidden rounded-xl font-rajdhani select-none disabled:opacity-50 disabled:cursor-not-allowed uppercase';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5 shadow-lg'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-red-600 via-red-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] border border-amber-300/30 active:scale-95',
    secondary: 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] border border-cyan-300/30 active:scale-95',
    tactical: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-500 shadow-md active:scale-95',
    outline: 'bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-red-500/50 hover:border-red-400 active:scale-95',
    danger: 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-lg active:scale-95'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {/* Laser Light Shimmer Effect */}
      <span className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-700 pointer-events-none" />
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{children}</span>
    </button>
  );
};
