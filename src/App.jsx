import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HeroProvider } from './context/HeroContext';
import { SoundProvider } from './context/SoundContext';

import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { HeroSetup } from './pages/HeroSetup';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Saturday } from './pages/Saturday';
import { KnowledgeLab } from './pages/KnowledgeLab';
import { BattleArena } from './pages/BattleArena';
import { KnowledgeVault } from './pages/KnowledgeVault';
import { MissionPlanner } from './pages/MissionPlanner';
import { HeroProfile } from './pages/HeroProfile';
import { Settings } from './pages/Settings';

function RequireAuth({ children }) {
  const token = localStorage.getItem('studyverse_auth_token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <HeroProvider>
      <SoundProvider>
        <Routes>
          {/* Public Landing & Onboarding Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/hero-setup" element={<HeroSetup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Superhero Command HQ Layout & Main Routes (auth required) */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saturday" element={<Saturday />} />
            <Route path="/knowledge-lab" element={<KnowledgeLab />} />
            <Route path="/battle-arena" element={<BattleArena />} />
            <Route path="/vault" element={<KnowledgeVault />} />
            <Route path="/planner" element={<MissionPlanner />} />
            <Route path="/profile" element={<HeroProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SoundProvider>
    </HeroProvider>
  );
}

export default App;
