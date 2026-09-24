import React from 'react';
import { Flame } from 'lucide-react';

export const ComboMeter = ({ combo = 0 }) => {
  if (combo < 2) return null;

  const multiplier = combo >= 5 ? '3.0x' : combo >= 3 ? '2.0x' : '1.5x';

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-600/30 to-amber-500/30 border border-amber-400 rounded-full animate-bounce shadow-[0_0_15px_rgba(234,179,8,0.5)]">
      <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
      <span className="text-xs font-orbitron font-extrabold text-amber-300">
        {combo}x STREAK COMBO! ({multiplier} XP)
      </span>
    </div>
  );
};
