import React from 'react';
import { useHero } from '../../context/HeroContext';
import { HolographicCard } from '../ui/HolographicCard';
import { Flame, ShieldAlert, Sparkles, Zap } from 'lucide-react';

export const StreakCard = () => {
  const { profile } = useHero();
  const streakDays = profile?.streakDays ?? 0;
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  return (
    <HolographicCard glowColor="red" className="p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Background Animated Flame Flare */}
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-gradient-to-tl from-red-600/30 via-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-orbitron font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            STREAK MULTIPLIER
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
            {streakDays > 0 ? '1.5x XP ACTIVE' : '1.0x XP BASE'}
          </span>
        </div>

        <div className="flex items-baseline gap-3 my-3">
          <div className="text-6xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-200">
            🔥 {streakDays}
          </div>
          <div>
            <div className="text-lg font-orbitron font-bold text-white uppercase leading-none">
              DAY STREAK
            </div>
            <div className="text-xs text-amber-300/80 font-rajdhani font-semibold mt-1">
              {streakDays === 0
                ? 'Begin your study streak today.'
                : streakDays === 1
                  ? 'Your knowledge journey has begun.'
                  : '"Your knowledge power is growing."'}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Streak Calendar Matrix */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <div className="text-[10px] font-rajdhani uppercase text-slate-400 mb-2">
          Recent Training Consistency
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const isToday = idx === todayIndex;
            const daysBehindToday = todayIndex - idx;
            const isDone =
              streakDays > 0 &&
              daysBehindToday >= 0 &&
              daysBehindToday < streakDays;

            return (
              <div
                key={idx}
                className={`py-1.5 rounded-lg text-center text-xs font-mono font-bold border transition ${
                  isDone
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_8px_rgba(234,179,8,0.3)]'
                    : isToday
                      ? 'bg-slate-900 border-amber-500/30 text-amber-200/60'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </HolographicCard>
  );
};
