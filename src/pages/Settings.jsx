import React, { useState } from 'react';
import { useHero } from '../context/HeroContext';
import { useSound } from '../context/SoundContext';
import { HERO_CLASSES } from '../data/heroClasses';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { Badge } from '../components/ui/Badge';
import { HeroAvatar } from '../components/hero/HeroAvatar';
import { AvatarPicker } from '../components/hero/AvatarPicker';
import {
  Settings as SettingsIcon,
  Sparkles,
  Volume2,
  VolumeX,
  Shield,
  Save,
  Server,
  UserCheck,
  CheckCircle2,
  Crown
} from 'lucide-react';

export const Settings = () => {
  const { profile, updateProfile, addXp } = useHero();
  const { soundEnabled, setSoundEnabled } = useSound();

  const [realName, setRealName] = useState(profile?.name || '');
  const [superheroName, setSuperheroName] = useState(profile?.superheroName || '');
  const [selectedClassId, setSelectedClassId] = useState(profile?.heroClassId || 'tech-titan');
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile?.avatarId || 'male-1');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAvatarSelect = (avatarId, avatarGender) => {
    setSelectedAvatarId(avatarId);
    setGender(avatarGender);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: realName,
      superheroName: superheroName,
      heroClassId: selectedClassId,
      avatarId: selectedAvatarId,
      gender
    });
    setSavedSuccess(true);
    addXp(25, 'Settings Overhauled');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-orbitron font-bold uppercase mb-2">
          <SettingsIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>SUPERHERO PROTOCOL PREFERENCES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white uppercase tracking-tight">
          HQ SETTINGS
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
          Customize your hero avatar, codename, specialization class, and system preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Customization Matrix */}
        <HolographicCard glowColor="purple" className="p-6">
          <h3 className="text-base font-orbitron font-bold text-white uppercase mb-4 flex items-center gap-2">
            <Crown className="w-4 h-4 text-purple-400" />
            <span>SUPERHERO AVATAR SPECIALIZATION</span>
          </h3>

          <AvatarPicker
            selectedAvatarId={selectedAvatarId}
            onSelect={handleAvatarSelect}
            compact={false}
          />
        </HolographicCard>

        {/* Persona Customization */}
        <HolographicCard glowColor="red" className="p-6">
          <h3 className="text-base font-orbitron font-bold text-white uppercase mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-red-500" />
            <span>HERO IDENTIFIER MATRIX</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Official Real Name
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 text-white font-outfit text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Primary Superhero Codename
              </label>
              <input
                type="text"
                value={superheroName}
                onChange={(e) => setSuperheroName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-amber-300 font-orbitron font-bold text-sm outline-none transition"
              />
            </div>
          </div>
        </HolographicCard>

        {/* Hero Class Switcher */}
        <HolographicCard glowColor="gold" className="p-6">
          <h3 className="text-base font-orbitron font-bold text-white uppercase mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>HERO CLASS SPECIALIZATION</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {HERO_CLASSES.map((hc) => {
              const isSelected = selectedClassId === hc.id;
              return (
                <div
                  key={hc.id}
                  onClick={() => setSelectedClassId(hc.id)}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-1">{hc.badge}</div>
                    <div className="text-xs font-orbitron font-bold text-white">
                      {hc.name}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-outfit mt-2">
                    {hc.focus}
                  </div>
                </div>
              );
            })}
          </div>
        </HolographicCard>

        {/* Audio Telemetry Preferences */}
        <HolographicCard glowColor="cyan" className="p-6">
          <h3 className="text-base font-orbitron font-bold text-white uppercase mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>AUDIO & COMBAT FEEDBACK</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
            <div>
              <div className="text-sm font-orbitron font-bold text-white">
                Tactical Web Audio SFX
              </div>
              <div className="text-xs text-slate-400 font-outfit">
                Synthesized sound cues on laser pings, streak combos, and level up milestones.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase transition cursor-pointer border ${
                soundEnabled
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </HolographicCard>

        {/* Backend Connectivity Status */}
        <HolographicCard glowColor="none" className="p-6 border-slate-800">
          <h3 className="text-base font-orbitron font-bold text-white uppercase mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <span>BACKEND INTEGRATION READINESS</span>
          </h3>
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-mono space-y-2 text-slate-400">
            <div className="flex items-center justify-between">
              <span>SERVICE ADAPTER:</span>
              <span className="text-emerald-400 font-bold">src/services/* [ACTIVE]</span>
            </div>
            <div className="flex items-center justify-between">
              <span>INTELLIGENCE CORE:</span>
              <span className="text-amber-400 font-bold">S.A.T.U.R.D.A.Y. Neural Engine</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AVATAR ENGINE:</span>
              <span className="text-purple-400 font-bold">10 Vector Cyberpunk Personas (5M / 5F)</span>
            </div>
          </div>
        </HolographicCard>

        {/* Save CTA */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-orbitron font-bold text-emerald-400 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>SUPERHERO DOSSIER & AVATAR UPDATED (+25 XP)</span>
            </span>
          )}

          <EnergyButton
            type="submit"
            variant="primary"
            size="lg"
            icon={Save}
          >
            Save Settings
          </EnergyButton>
        </div>
      </form>
    </div>
  );
};
