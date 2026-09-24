import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { HeroAvatar } from '../components/hero/HeroAvatar';
import { SkillTree } from '../components/profile/SkillTree';
import { TrophyCabinet } from '../components/profile/TrophyCabinet';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Shield,
  Sparkles,
  Zap,
  Flame,
  Target,
  Trophy,
  Settings as SettingsIcon,
  UserCheck
} from 'lucide-react';

export const HeroProfile = () => {
  const { profile, heroClass } = useHero();
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Hero Dossier Banner */}
      <HolographicCard glowColor="gold" className="p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <HeroAvatar
            avatarId={profile.avatarId}
            heroClassId={profile.heroClassId}
            size="2xl"
            className="shrink-0"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <Badge variant="gold" size="md">
                {heroClass?.badge} {heroClass?.name || 'TECH TITAN'}
              </Badge>
              <Badge variant="cyan" size="md">
                LEVEL {profile.level} • {profile.rank}
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200 uppercase tracking-tight">
              {profile.superheroName}
            </h1>

            <div className="text-xs text-slate-400 font-outfit mt-1 flex items-center justify-center sm:justify-start gap-2">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Identity: <strong className="text-slate-300">{profile.name}</strong></span>
              <span>•</span>
              <span>Enrolled: {profile.joinedDate}</span>
            </div>

            <p className="text-xs text-slate-300 font-outfit mt-3 max-w-xl leading-relaxed">
              {heroClass?.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <ProgressBar
                current={profile.xp}
                max={profile.nextLevelXp}
                label="Power Level Progression"
                color="gold"
                height="h-3"
              />
            </div>
          </div>

          <div className="shrink-0">
            <EnergyButton
              variant="tactical"
              size="sm"
              icon={SettingsIcon}
              onClick={() => navigate('/settings')}
            >
              Modify Persona
            </EnergyButton>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Streak Record</div>
            <div className="text-xl font-orbitron font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{profile.streakDays} DAYS</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Missions Cleared</div>
            <div className="text-xl font-orbitron font-black text-white mt-0.5">
              {profile.missionsCompleted}
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Combat Accuracy</div>
            <div className="text-xl font-orbitron font-black text-emerald-400 mt-0.5">
              {profile.quizAccuracy}%
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Energy Cores</div>
            <div className="text-xl font-orbitron font-black text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
              <Zap className="w-4 h-4 fill-cyan-400" />
              <span>{profile.energyCores}</span>
            </div>
          </div>
        </div>
      </HolographicCard>

      {/* Interactive RPG Skill Tree */}
      <SkillTree />

      {/* Superhero Trophy Cabinet */}
      <TrophyCabinet />
    </div>
  );
};
