import React from 'react';
import { Bot, Sparkles, Zap, Cpu } from 'lucide-react';

export const SaturdayCore = ({ isThinking = false, statusText = 'ONLINE' }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#080d1f]/90 border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.15)]">
      {/* Ambient Radial Core Glow */}
      <div className={`absolute w-44 h-44 rounded-full bg-amber-500/20 blur-3xl pointer-events-none transition-all duration-700 ${isThinking ? 'scale-150 bg-red-500/30' : ''}`} />

      {/* Rotating Cyber Telemetry Rings */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-3">
        <svg className={`absolute inset-0 w-full h-full ${isThinking ? 'animate-spin' : 'animate-holo-spin'} opacity-60`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="12 16" />
        </svg>
        <svg className={`absolute inset-0 w-full h-full ${isThinking ? 'animate-spin-reverse' : 'animate-holo-spin-reverse'} opacity-40`} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 6" />
        </svg>

        {/* Central Core Sphere */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-red-500 to-yellow-300 flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.6)] ${isThinking ? 'animate-bounce' : 'animate-pulse'}`}>
          <Bot className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-1">
          <span className={`w-2 h-2 rounded-full ${isThinking ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
          <span>S.A.T.U.R.D.A.Y. {isThinking ? 'ANALYZING...' : statusText}</span>
        </div>
        <div className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest font-semibold">
          Student Assistant To Understand, Review, & Deliver Academic Yield
        </div>
      </div>
    </div>
  );
};
