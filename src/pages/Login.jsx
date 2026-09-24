import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { authService } from '../services/authService';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { FloatingParticles } from '../components/hero/FloatingParticles';
import logoImg from '../assets/studyverse-logo.png';
import { Shield, Sparkles, KeyRound, UserCheck, ArrowRight, AlertTriangle } from 'lucide-react';

// Seeded demo accounts (backend/seed.js) — click to fill, passcode demo1234.
const DEMO_ACCOUNTS = [
  { name: 'NovaByte', level: 9 },
  { name: 'QuantumQuill', level: 6 },
  { name: 'CipherSage', level: 3 }
];

export const Login = () => {
  const navigate = useNavigate();
  const { applyProfile } = useHero();
  const [codename, setCodename] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const profile = await authService.loginHero({
        superheroName: codename.trim(),
        password: passcode
      });
      if (!profile) {
        setError('Invalid superhero name or passcode. Please try again.');
        return;
      }
      applyProfile(profile);
      navigate('/dashboard');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden cyber-grid">
      <FloatingParticles />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.5)] border border-amber-300/40 p-0.5 bg-slate-900">
            <img src={logoImg} alt="StudyVerse Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-orbitron font-black text-white uppercase tracking-tight">
            HQ ACCESS TERMINAL
          </h1>
          <p className="text-xs text-slate-400 font-outfit mt-1">
            Authenticate your superhero clearance to access S.A.T.U.R.D.A.Y.
          </p>
        </div>

        <HolographicCard glowColor="red" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Hero Codename
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codename}
                  onChange={(e) => setCodename(e.target.value)}
                  placeholder="e.g. CyberNova"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 text-white font-orbitron font-bold text-sm outline-none transition"
                  required
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 text-white font-mono text-sm outline-none transition"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div className="pt-2">
              {error && (
                <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-outfit flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <EnergyButton
                type="submit"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="w-full"
                disabled={isSubmitting || !codename.trim() || !passcode}
              >
                {isSubmitting ? 'Authenticating...' : 'Authenticate & Enter HQ'}
              </EnergyButton>
            </div>
          </form>

          {/* Demo accounts: click to fill credentials */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-[10px] font-rajdhani font-bold text-slate-400 uppercase tracking-widest mb-2.5 text-center">
              Demo Accounts · Passcode <span className="text-amber-400 font-mono">demo1234</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.name}
                  type="button"
                  onClick={() => {
                    setCodename(acc.name);
                    setPasscode('demo1234');
                    setError('');
                  }}
                  title={`Fill in ${acc.name} (passcode demo1234)`}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-xs font-mono text-slate-200 hover:text-white transition cursor-pointer"
                >
                  {acc.name} · Lv{acc.level}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-outfit">
            New hero candidate?{' '}
            <Link to="/hero-setup" className="text-amber-400 hover:text-amber-300 font-bold font-rajdhani uppercase">
              Enroll Hero Identity
            </Link>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
