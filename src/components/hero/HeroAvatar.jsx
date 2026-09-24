import React from 'react';
import { getAvatarById } from '../../data/avatars';

export const HeroAvatar = ({
  avatarId,
  heroClassId,
  size = 'md',
  className = '',
  showStatus = true
}) => {
  // Always resolve to a valid vector superhero avatar (defaults to male-1 if not specified)
  const avatar = getAvatarById(avatarId || 'male-1');

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-2xl',
    '2xl': 'w-32 h-32 rounded-3xl'
  };

  const statusDotSizes = {
    sm: 'w-2 h-2 -top-0.5 -right-0.5',
    md: 'w-2.5 h-2.5 -top-1 -right-1',
    lg: 'w-3 h-3 -top-1 -right-1',
    xl: 'w-3.5 h-3.5 -top-1.5 -right-1.5',
    '2xl': 'w-4 h-4 -top-1.5 -right-1.5'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden border-2 bg-gradient-to-br transition-all duration-300 select-none ${avatar.borderGlow} ${avatar.bgGradient} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <div className="w-full h-full p-0.5 flex items-center justify-center">
        {avatar.svg}
      </div>

      {/* Holographic Sheen Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />

      {/* Online Status Glow Indicator */}
      {showStatus && (
        <div
          className={`absolute ${statusDotSizes[size] || statusDotSizes.md} bg-emerald-400 rounded-full border border-slate-950 shadow-sm shadow-emerald-400 animate-pulse`}
        />
      )}
    </div>
  );
};
