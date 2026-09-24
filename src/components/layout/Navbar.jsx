import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHero } from '../../context/HeroContext';
import { useSound } from '../../context/SoundContext';
import { authService } from '../../services/authService';
import { HeroAvatar } from '../hero/HeroAvatar';
import logoImg from '../../assets/studyverse-logo.png';
import { Volume2, VolumeX, Flame, Zap, ShieldAlert, Sparkles, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { profile, heroClass } = useHero();
  const { soundEnabled, setSoundEnabled } = useSound();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logoutHero();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050711]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-amber-300/40 group-hover:scale-105 transition">
            <img src={logoImg} alt="StudyVerse" className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
          </div>
          <div>
            <div className="text-xl font-orbitron font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200">
              STUDYVERSE
            </div>
            <div className="text-[9px] font-rajdhani font-semibold tracking-widest text-slate-400 uppercase -mt-1 hidden sm:block">
              Superpower Training HQ
            </div>
          </div>
        </Link>

        {/* Tactical Status Telemetry */}
        {profile && (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-xs font-orbitron font-bold text-amber-300">{profile.streakDays}D</span>
              <span className="text-[10px] font-rajdhani text-slate-400 uppercase hidden md:inline">Streak</span>
            </div>

            {/* Quick XP Telemetry */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="p-1 bg-red-500/20 text-red-400 rounded-md">
                <Zap className="w-3.5 h-3.5 fill-red-400" />
              </div>
              <div>
                <div className="text-[10px] font-rajdhani text-slate-400 font-semibold uppercase leading-none">
                  LVL {profile.level} • {heroClass?.name || 'HERO'}
                </div>
                <div className="text-xs font-mono font-bold text-slate-200 leading-tight">
                  {profile.xp.toLocaleString()} <span className="text-slate-500">/ {profile.nextLevelXp.toLocaleString()} XP</span>
                </div>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute SFX' : 'Enable Tactical SFX'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Hero Profile Shortcut */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 transition group"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-orbitron font-bold text-slate-100 group-hover:text-amber-300 transition">
                  {profile.superheroName}
                </div>
                <div className="text-[9px] font-rajdhani font-semibold text-slate-400 uppercase">
                  {profile.rank} RANK
                </div>
              </div>
              <HeroAvatar
                avatarId={profile.avatarId}
                heroClassId={profile.heroClassId}
                size="sm"
              />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
