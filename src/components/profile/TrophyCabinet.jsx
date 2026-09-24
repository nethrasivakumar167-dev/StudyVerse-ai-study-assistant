import React from 'react';
import { useHero } from '../../context/HeroContext';
import { HolographicCard } from '../ui/HolographicCard';
import { Badge } from '../ui/Badge';
import { Trophy, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const TrophyCabinet = () => {
  const { achievements } = useHero();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>SUPERHERO TROPHY CABINET</span>
        </h3>
        <span className="text-xs font-mono text-slate-400">
          {achievements.filter((a) => a.unlocked).length} / {achievements.length} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {achievements.map((ach) => (
          <HolographicCard
            key={ach.id}
            glowColor={ach.unlocked ? 'gold' : 'none'}
            className={`p-4 flex items-start gap-3.5 ${
              !ach.unlocked ? 'opacity-60 border-slate-800/80' : 'bg-slate-900/90'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-400/40 text-amber-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-600'
              }`}
            >
              {ach.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="text-xs font-orbitron font-bold text-slate-100 truncate">
                  {ach.title}
                </div>
                {ach.unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
              </div>

              <p className="text-[11px] text-slate-400 font-outfit line-clamp-2 leading-relaxed">
                {ach.desc}
              </p>

              <div className="mt-2 text-[9px] font-mono text-slate-500">
                {ach.unlocked ? `Unlocked: ${ach.date}` : `Requirement: ${ach.progress || 'Locked'}`}
              </div>
            </div>
          </HolographicCard>
        ))}
      </div>
    </div>
  );
};
