import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HolographicCard } from '../ui/HolographicCard';
import { EnergyButton } from '../ui/EnergyButton';
import { Bot, Sparkles, BookOpen, Swords, Calendar, MessageSquare } from 'lucide-react';

export const SaturdayQuickCard = () => {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'ASK S.A.T.U.R.D.A.Y.', icon: MessageSquare, path: '/saturday', query: 'What knowledge challenge are we tackling today?' },
    { label: 'EXPLAIN A TOPIC', icon: BookOpen, path: '/knowledge-lab' },
    { label: 'GENERATE NOTES', icon: Sparkles, path: '/saturday', query: 'Generate synthesis notes for Operating Systems' },
    { label: 'QUIZ ME', icon: Swords, path: '/battle-arena' },
    { label: 'BUILD MY STUDY PLAN', icon: Calendar, path: '/planner' }
  ];

  return (
    <HolographicCard glowColor="gold" className="p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-400/40 text-amber-300 rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Bot className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-orbitron font-bold text-amber-400 tracking-widest uppercase">
              AI Study Companion
            </div>
            <h3 className="text-2xl font-orbitron font-black text-white">
              S.A.T.U.R.D.A.Y.
            </h3>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          CORE ONLINE
        </span>
      </div>

      <p className="text-sm text-slate-300 font-outfit italic mb-5 border-l-2 border-amber-400/60 pl-3">
        "Student Assistant To Understand, Review, & Deliver Academic Yield. Your academic mission control is ready."
      </p>

      {/* Quick Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(action.path, { state: { initialPrompt: action.query } })}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/80 text-slate-200 hover:text-amber-300 transition duration-200 text-left cursor-pointer group shadow-sm"
            >
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-rajdhani font-bold tracking-wider uppercase">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </HolographicCard>
  );
};
