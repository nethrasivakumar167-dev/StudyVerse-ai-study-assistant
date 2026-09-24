import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { XpPopupContainer } from '../ui/XpPopup';
import { LevelUpModal } from '../ui/Modal';
import { FloatingParticles } from '../hero/FloatingParticles';
import { useHero } from '../../context/HeroContext';

export const AppLayout = () => {
  const { levelUpModal, closeLevelUpModal } = useHero();

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col relative selection:bg-red-600 selection:text-white cyber-grid">
      {/* Ambient Particle Matrix */}
      <FloatingParticles />

      {/* Primary HUD Navigation */}
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-full overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom HUD Nav */}
      <MobileNav />

      {/* Floating Gamified XP Toasts */}
      <XpPopupContainer />

      {/* Level Up Celebration Modal */}
      <LevelUpModal levelUpData={levelUpModal} onClose={closeLevelUpModal} />
    </div>
  );
};
