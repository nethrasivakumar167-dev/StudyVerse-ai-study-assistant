import React from 'react';
import { useHero } from '../../context/HeroContext';
import { HolographicCard } from '../ui/HolographicCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { Zap, ShieldCheck, Flame, Sparkles } from 'lucide-react';

export const PowerLevelCard = () => {
  const { profile, heroClass } = useHero();

  if (!profile) return null;

  return (
    <HolographicCard glowColor="gold" className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{heroClass?.badge || '⚡'}</span>
            <span className="text-xs font-orbitron font-bold text-amber-400 uppercase tracking-widest">
              SUPERHERO POWER LEVEL
            </span>
          </div>
          <h2 className="text-3xl font-orbitron font-extrabold text-white flex items-center gap-3">
            <span>LEVEL {profile.level}</span>
            <Badge variant="gold" size="sm">
              {profile.rank} RANK
            </Badge>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Energy Cores</div>
            <div className="text-lg font-orbitron font-bold text-cyan-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-cyan-400" />
              <span>{profile.energyCores}</span>
            </div>
          </div>

          <div className="px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Class Focus</div>
            <div className="text-sm font-rajdhani font-bold text-amber-300">
              {heroClass?.name || 'TECH TITAN'}
            </div>
          </div>
        </div>
      </div>

      <ProgressBar
        current={profile.xp}
        max={profile.nextLevelXp}
        label="Academic XP Progression"
        color="gold"
        height="h-3.5"
      />

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-rajdhani">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Active Buff: <strong className="text-slate-200">{heroClass?.statBuff}</strong></span>
        </span>
        <span className="font-mono text-amber-400 font-semibold">
          +{profile.nextLevelXp - profile.xp} XP to Level {profile.level + 1}
        </span>
      </div>
    </HolographicCard>
  );
};
