import React from 'react';
import { useHero } from '../../context/HeroContext';
import { Zap, Sparkles } from 'lucide-react';

export const XpPopupContainer = () => {
  const { xpToasts } = useHero();

  if (!xpToasts || xpToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
      {xpToasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 bg-slate-900/95 border-2 border-amber-400 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.5)] backdrop-blur-md animate-bounce pointer-events-auto"
        >
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
            <Zap className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-sm font-orbitron font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>+{toast.amount} XP</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            </div>
            <div className="text-xs font-rajdhani text-slate-300 uppercase tracking-wide">
              {toast.reason}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
