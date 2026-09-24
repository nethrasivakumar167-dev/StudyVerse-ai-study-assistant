import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { HERO_CLASSES, getHeroClassById } from '../data/heroClasses';
import { getAvatarById } from '../data/avatars';
import { authService } from '../services/authService';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { HeroAvatar } from '../components/hero/HeroAvatar';
import { AvatarPicker } from '../components/hero/AvatarPicker';
import { Badge } from '../components/ui/Badge';
import { FloatingParticles } from '../components/hero/FloatingParticles';
import logoImg from '../assets/studyverse-logo.png';
import { Sparkles, User, Shield, Zap, ArrowRight, ArrowLeft, CheckCircle2, Crown } from 'lucide-react';

export const HeroSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applyProfile } = useHero();

  const [step, setStep] = useState(1);
  const [realName, setRealName] = useState('');
  const [superheroName, setSuperheroName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('male-1');
  const [gender, setGender] = useState('male');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(
    location.state?.preselectClass || 'tech-titan'
  );

  const selectedClass = getHeroClassById(selectedClassId);
  const selectedAvatar = getAvatarById(selectedAvatarId);

  const handleAvatarSelect = (avatarId, avatarGender) => {
    setSelectedAvatarId(avatarId);
    setGender(avatarGender);
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Finalize Hero Persona → register with the backend
    setIsRegistering(true);
    setError('');
    try {
      const registered = await authService.registerHero({
        name: realName.trim(),
        superheroName: superheroName.trim(),
        heroClassId: selectedClassId,
        avatarId: selectedAvatarId,
        gender,
        password
      });
      applyProfile(registered);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden cyber-grid">
      <FloatingParticles />
      <div className="absolute w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-amber-300/40 p-0.5 bg-slate-900">
            <img src={logoImg} alt="StudyVerse Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-orbitron font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDYVERSE ACADEMY ENROLLMENT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-orbitron font-black text-white uppercase tracking-tight">
            CREATE YOUR HERO IDENTITY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
            Step {step} of 4 • Establish your superhero persona for academic missions
          </p>

          {/* Step Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-4 max-w-xs mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? 'bg-gradient-to-r from-red-500 to-amber-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <HolographicCard glowColor="red" className="p-5 sm:p-8">
          {/* Step 1: Real Name */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white">
                    Step 1: What's your real name?
                  </h3>
                  <p className="text-xs text-slate-400 font-outfit">
                    Used for official academic reports and settings.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={realName}
                  onChange={(e) => setRealName(e.target.value)}
                  placeholder="e.g. Nethra Sivakumar"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white font-outfit text-base outline-none transition"
                  autoFocus
                />
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 font-outfit leading-relaxed">
                💡 <strong className="text-slate-200">Academy Protocol</strong>: Your real name remains private. In the next steps, you will select your superhero avatar and codename for battle leaderboards.
              </div>
            </div>
          )}

          {/* Step 2: Superhero Name & Security Passcode */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white">
                    Step 2: Choose your superhero moniker
                  </h3>
                  <p className="text-xs text-slate-400 font-outfit">
                    This is the identity you'll use throughout the Studyverse.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Superhero Codename
                </label>
                <input
                  type="text"
                  value={superheroName}
                  onChange={(e) => setSuperheroName(e.target.value)}
                  placeholder="e.g. CyberNova, QuantumRider, MindTitan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-amber-300 font-orbitron font-bold text-lg outline-none transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Security Passcode
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 text-white font-mono text-sm outline-none transition"
                />
                <p className="mt-1.5 text-[11px] text-slate-500 font-outfit">
                  Used with your codename to log back into your HQ account.
                </p>
              </div>

              {/* Live Greeting Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-[#10152e] border border-amber-400/30 text-center">
                <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold mb-1">
                  HUD Interface Preview
                </div>
                <div className="text-xl font-orbitron font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-200">
                  WELCOME BACK, {superheroName.toUpperCase() || 'HERO CANDIDATE'}
                </div>
                <div className="text-xs text-slate-400 font-outfit mt-1">
                  S.A.T.U.R.D.A.Y. is ready to configure your training missions.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Choose Superhero Avatar */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white">
                    Step 3: Select your Superhero Avatar
                  </h3>
                  <p className="text-xs text-slate-400 font-outfit">
                    Choose from 10 high-tech superhero avatars (5 Male, 5 Female).
                  </p>
                </div>
              </div>

              <AvatarPicker
                selectedAvatarId={selectedAvatarId}
                onSelect={handleAvatarSelect}
                compact={false}
              />
            </div>
          )}

          {/* Step 4: Choose Hero Class */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-bold text-white">
                    Step 4: Choose your hero class
                  </h3>
                  <p className="text-xs text-slate-400 font-outfit">
                    Defines your primary academic buffs, visual theme, and battle traits.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {HERO_CLASSES.map((hc) => {
                  const isSelected = selectedClassId === hc.id;
                  return (
                    <div
                      key={hc.id}
                      onClick={() => setSelectedClassId(hc.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{hc.badge}</span>
                          <div>
                            <div className="text-xs font-orbitron font-bold text-white">
                              {hc.name}
                            </div>
                            <div className="text-[10px] font-rajdhani font-semibold text-amber-400 uppercase">
                              {hc.focus}
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>

                      <div className="text-[11px] text-slate-300 font-outfit mt-1">
                        {hc.statBuff}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Persona Summary Dossier */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <HeroAvatar avatarId={selectedAvatarId} size="lg" />
                <div>
                  <div className="text-xs font-orbitron font-bold text-slate-100 flex items-center gap-2">
                    <span>{superheroName || 'Hero Candidate'}</span>
                    <span className="text-amber-400">•</span>
                    <span className="text-amber-300">{selectedAvatar.name}</span>
                    <span className="text-slate-500">({selectedClass.name})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-outfit mt-0.5">
                    {selectedAvatar.tagline}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Registration Error */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-outfit text-center">
              {error}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-rajdhani font-bold text-slate-400 hover:text-white uppercase transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            <EnergyButton
              variant="primary"
              size="lg"
              icon={step === 4 ? Sparkles : ArrowRight}
              onClick={handleNext}
              disabled={
                isRegistering ||
                (step === 1
                  ? !realName.trim()
                  : step === 2
                    ? !superheroName.trim() || password.length < 6
                    : false)
              }
            >
              {isRegistering
                ? 'Activating...'
                : step === 4
                  ? 'Activate Hero & Enter HQ'
                  : 'Continue'}
            </EnergyButton>
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
