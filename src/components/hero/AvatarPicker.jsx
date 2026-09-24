import React, { useState } from 'react';
import { AVATARS, MALE_AVATARS, FEMALE_AVATARS, getAvatarById } from '../../data/avatars';
import { HeroAvatar } from './HeroAvatar';
import { CheckCircle2, Sparkles, Shield, User, Zap } from 'lucide-react';

export const AvatarPicker = ({ selectedAvatarId = 'male-1', onSelect, compact = false }) => {
  const currentAvatar = getAvatarById(selectedAvatarId);
  const [filterGender, setFilterGender] = useState(currentAvatar?.gender || 'male');

  const displayedAvatars =
    filterGender === 'all'
      ? AVATARS
      : filterGender === 'female'
        ? FEMALE_AVATARS
        : MALE_AVATARS;

  return (
    <div className="space-y-4">
      {/* Filter Tabs Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setFilterGender('male')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold uppercase transition cursor-pointer ${
              filterGender === 'male'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>MALE CORPS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-amber-300">5</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterGender('female')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold uppercase transition cursor-pointer ${
              filterGender === 'female'
                ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>FEMALE CORPS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-rose-300">5</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterGender('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold uppercase transition cursor-pointer ${
              filterGender === 'all'
                ? 'bg-slate-800 text-amber-300 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>ALL</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300">10</span>
          </button>
        </div>

        {/* Currently Selected Avatar Mini Dossier */}
        {currentAvatar && (
          <div className="flex items-center gap-2.5 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-rajdhani uppercase font-semibold text-slate-400">EQUIPPED:</span>
            <HeroAvatar avatarId={currentAvatar.id} size="sm" showStatus={false} />
            <span className="font-orbitron font-bold text-amber-300">{currentAvatar.name}</span>
          </div>
        )}
      </div>

      {/* Avatars Grid */}
      <div
        className={`grid gap-3 ${
          compact
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {displayedAvatars.map((avatar) => {
          const isSelected = selectedAvatarId === avatar.id;

          return (
            <div
              key={avatar.id}
              onClick={() => onSelect(avatar.id, avatar.gender)}
              className={`relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {/* Active Selection Glow Strip */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300" />
              )}

              <div className="flex items-start gap-3">
                <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <HeroAvatar avatarId={avatar.id} size="lg" showStatus={false} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-orbitron font-extrabold text-white truncate group-hover:text-amber-300 transition">
                      {avatar.name}
                    </h4>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    )}
                  </div>

                  <div className="text-[10px] font-rajdhani font-bold uppercase tracking-wider text-amber-400/90 mt-0.5">
                    {avatar.title}
                  </div>

                  <div className="inline-block mt-1 text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {avatar.gender} HERO
                  </div>
                </div>
              </div>

              {!compact && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 font-outfit line-clamp-2 leading-snug">
                  {avatar.tagline}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
