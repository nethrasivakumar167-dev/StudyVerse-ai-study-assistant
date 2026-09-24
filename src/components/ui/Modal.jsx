import React from 'react';
import { X, Trophy, Sparkles, Award } from 'lucide-react';
import { EnergyButton } from './EnergyButton';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full ${maxWidth} bg-[#0b1021] border-2 border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden`}
      >
        {/* Top Cyber Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <h3 className="text-xl font-orbitron font-bold text-slate-100 flex items-center gap-2">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export const LevelUpModal = ({ levelUpData, onClose }) => {
  if (!levelUpData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#11182e] to-[#050711] border-2 border-amber-400 rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(234,179,8,0.4)] animate-bounce">
        {/* Glow Core */}
        <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.7)]">
          <Trophy className="w-12 h-12 text-yellow-100 animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-orbitron uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Superpower Upgrade</span>
        </div>

        <h2 className="text-3xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-red-400 mb-1">
          LEVEL UP!
        </h2>

        <div className="text-5xl font-orbitron font-black text-white mb-3">
          LEVEL {levelUpData.newLevel}
        </div>

        <div className="text-sm font-rajdhani font-semibold text-slate-300 uppercase tracking-wider mb-6">
          Rank Promoted to <span className="text-amber-400 font-bold">{levelUpData.rank}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 flex justify-around items-center">
          <div>
            <div className="text-xs text-slate-400 uppercase font-rajdhani">Energy Cores</div>
            <div className="text-lg font-bold text-cyan-400">+{levelUpData.bonusCores} Cores</div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400 uppercase font-rajdhani">Skill Tree</div>
            <div className="text-lg font-bold text-emerald-400">1 Slot Unlocked</div>
          </div>
        </div>

        <EnergyButton onClick={onClose} variant="primary" size="lg" className="w-full">
          Claim Power & Continue
        </EnergyButton>
      </div>
    </div>
  );
};
