import React from 'react';
import { NavLink } from 'react-router-dom';
import { useHero } from '../../context/HeroContext';
import {
  LayoutDashboard,
  Bot,
  FileUp,
  FlaskConical,
  Swords,
  BookMarked,
  CalendarDays,
  Shield,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';

export const Sidebar = () => {
  const { profile, heroClass } = useHero();

  const navItems = [
    { to: '/dashboard', label: 'Mission Control', icon: LayoutDashboard, badge: 'Active' },
    { to: '/saturday', label: 'S.A.T.U.R.D.A.Y. AI', icon: Bot, highlight: true },
    { to: '/uploads', label: 'Document Intel', icon: FileUp, badge: 'PDF' },
    { to: '/knowledge-lab', label: 'Knowledge Lab', icon: FlaskConical },
    { to: '/battle-arena', label: 'Battle Arena', icon: Swords, badge: '+XP' },
    { to: '/vault', label: 'Knowledge Vault', icon: BookMarked },
    { to: '/planner', label: 'Mission Planner', icon: CalendarDays },
    { to: '/profile', label: 'Hero Profile & Skills', icon: Shield },
    { to: '/settings', label: 'HQ Settings', icon: Settings }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#080c1a]/95 border-r border-slate-800/80 p-4 min-h-[calc(100vh-61px)] justify-between">
      {/* Navigation List */}
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-orbitron font-bold tracking-widest text-slate-500 uppercase">
          Tactical Operations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-rajdhani font-bold text-sm tracking-wide transition-all ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-red-600/30 via-amber-500/20 to-transparent text-amber-300 border-l-4 border-amber-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'bg-slate-800/80 text-white border-l-4 border-red-500'
                    : item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-orbitron px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Hero Class Status Card at bottom */}
      {profile && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{heroClass?.badge || '⚡'}</span>
            <span className="text-xs font-orbitron font-bold text-slate-200 uppercase">
              {heroClass?.name || 'TECH TITAN'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-outfit">
            {heroClass?.statBuff || '+20% Speed on Code Mappings'}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>CORES: <strong className="text-cyan-400">{profile.energyCores}</strong></span>
            <span>MISSIONS: <strong className="text-amber-400">{profile.missionsCompleted}</strong></span>
          </div>
        </div>
      )}
    </aside>
  );
};
