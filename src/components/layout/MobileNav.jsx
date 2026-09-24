import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, Swords, BookMarked, Shield } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { to: '/dashboard', label: 'HQ', icon: LayoutDashboard },
    { to: '/saturday', label: 'AI Core', icon: Bot, highlight: true },
    { to: '/battle-arena', label: 'Battle', icon: Swords },
    { to: '/vault', label: 'Vault', icon: BookMarked },
    { to: '/profile', label: 'Hero', icon: Shield }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c1a]/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                  isActive
                    ? item.highlight
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-red-400 bg-red-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className={`w-5 h-5 ${item.highlight ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-orbitron font-bold uppercase">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
