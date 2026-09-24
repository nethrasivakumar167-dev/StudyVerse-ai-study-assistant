import React from 'react';

/**
 * 10 Predefined Superhero Avatars (5 Male, 5 Female)
 * Custom vector artwork with cyberpunk/superhero glowing visors, armor details, and themes.
 */

export const AVATARS = [
  // ================= MALE AVATARS (5) =================
  {
    id: 'male-1',
    gender: 'male',
    name: 'Apex Titan',
    title: 'Kinetic Heavy Vanguard',
    tagline: 'Heavy kinetic battlesuit with reinforced titanium plating and an overloaded arc core.',
    borderGlow: 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    bgGradient: 'from-[#2b080c] via-[#1a0f1a] to-[#090d18]',
    accentColor: '#ef4444',
    secondaryColor: '#f59e0b',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m1-armor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <linearGradient id="m1-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="m1-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {/* Background Aura */}
        <circle cx="50" cy="50" r="44" fill="#ef4444" fillOpacity="0.12" />
        {/* Pauldrons */}
        <path d="M12 78 L26 54 L40 62 L32 90 Z" fill="url(#m1-armor)" stroke="#f87171" strokeWidth="1" />
        <path d="M88 78 L74 54 L60 62 L68 90 Z" fill="url(#m1-armor)" stroke="#f87171" strokeWidth="1" />
        <polygon points="20,56 34,58 28,78 16,74" fill="url(#m1-gold)" />
        <polygon points="80,56 66,58 72,78 84,74" fill="url(#m1-gold)" />
        {/* Neck / Collar */}
        <polygon points="38,58 62,58 58,74 42,74" fill="#1e293b" stroke="#475569" strokeWidth="1" />
        {/* Chest Plate */}
        <path d="M34 68 L66 68 L72 96 L28 96 Z" fill="url(#m1-armor)" stroke="#f87171" strokeWidth="1.2" />
        <circle cx="50" cy="82" r="7" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="50" cy="82" r="3.5" fill="#fef08a" className="animate-pulse" />
        {/* Helmet Outer */}
        <path d="M30 38 C30 18 70 18 70 38 L74 54 L50 68 L26 54 Z" fill="url(#m1-armor)" stroke="#ef4444" strokeWidth="1.5" />
        {/* Helmet Brow */}
        <polygon points="34,26 66,26 62,36 38,36" fill="url(#m1-gold)" />
        <polygon points="46,20 54,20 52,28 48,28" fill="#fef08a" />
        {/* Cyber Visor */}
        <polygon points="34,42 66,42 62,50 38,50" fill="url(#m1-glow)" />
        <line x1="36" y1="46" x2="64" y2="46" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.9" />
        {/* Chin Guard */}
        <polygon points="44,56 56,56 52,64 48,64" fill="url(#m1-gold)" />
      </svg>
    )
  },
  {
    id: 'male-2',
    gender: 'male',
    name: 'Shadow Specter',
    title: 'Stealth Infiltrator',
    tagline: 'Obsidian nanotech hood with violet ultraviolet night-vision HUD visor.',
    borderGlow: 'border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    bgGradient: 'from-[#1e082b] via-[#120a1f] to-[#080d1a]',
    accentColor: '#a855f7',
    secondaryColor: '#c084fc',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m2-hood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" />
            <stop offset="60%" stopColor="#0f0728" />
            <stop offset="100%" stopColor="#02010a" />
          </linearGradient>
          <linearGradient id="m2-visor" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#a855f7" fillOpacity="0.1" />
        {/* Shoulders Cloak */}
        <path d="M14 84 C18 64 36 58 50 64 C64 58 82 64 86 84 L80 96 L20 96 Z" fill="url(#m2-hood)" stroke="#7c3aed" strokeWidth="1" />
        {/* Cowl / Hood Outer */}
        <path d="M26 44 C24 16 76 16 74 44 C72 62 62 70 50 72 C38 70 28 62 26 44 Z" fill="url(#m2-hood)" stroke="#a855f7" strokeWidth="1.5" />
        {/* Inner Shadow Face Mask */}
        <path d="M34 40 C34 30 66 30 66 40 L64 56 L50 64 L36 56 Z" fill="#090514" stroke="#4c1d95" strokeWidth="1" />
        {/* Twin Cyber Visor Slits */}
        <path d="M36 44 L47 46 L46 50 L37 47 Z" fill="url(#m2-visor)" />
        <path d="M64 44 L53 46 L54 50 L63 47 Z" fill="url(#m2-visor)" />
        <circle cx="42" cy="46" r="1" fill="#ffffff" />
        <circle cx="58" cy="46" r="1" fill="#ffffff" />
        {/* Forehead Hologram Glyph */}
        <polygon points="50,26 53,32 50,38 47,32" fill="#c084fc" fillOpacity="0.8" />
        <line x1="50" y1="22" x2="50" y2="26" stroke="#c084fc" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'male-3',
    gender: 'male',
    name: 'Aegis Guardian',
    title: 'Kinetic Shieldmaster',
    tagline: 'Cobalt and silver nano-alloy armor with energy deflection crest.',
    borderGlow: 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]',
    bgGradient: 'from-[#08202b] via-[#091522] to-[#040914]',
    accentColor: '#06b6d4',
    secondaryColor: '#38bdf8',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m3-armor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="60%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id="m3-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#06b6d4" fillOpacity="0.1" />
        {/* Armored Collar / Shoulders */}
        <path d="M16 80 L30 56 L44 64 L36 94 Z" fill="url(#m3-armor)" stroke="#38bdf8" strokeWidth="1" />
        <path d="M84 80 L70 56 L56 64 L64 94 Z" fill="url(#m3-armor)" stroke="#38bdf8" strokeWidth="1" />
        <polygon points="34,70 66,70 70 96 30 96" fill="url(#m3-silver)" />
        {/* Helmet Main Structure */}
        <path d="M28 36 C28 16 72 16 72 36 L76 56 L50 70 L24 56 Z" fill="url(#m3-armor)" stroke="#0ea5e9" strokeWidth="1.5" />
        {/* Silver Wing Accents */}
        <polygon points="22,34 32,32 30,50 18,48" fill="url(#m3-silver)" />
        <polygon points="78,34 68,32 70,50 82,48" fill="url(#m3-silver)" />
        {/* T-Shaped Spartan Cyan Visor */}
        <polygon points="36,38 64,38 62,46 54,46 53,60 47,60 46,46 38,46" fill="#00f7ff" />
        <line x1="38" y1="42" x2="62" y2="42" stroke="#ffffff" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'male-4',
    gender: 'male',
    name: 'Solar Paladin',
    title: 'Radiant Vanguard',
    tagline: 'Solar-forged golden armor radiating plasma energy and motivational focus.',
    borderGlow: 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    bgGradient: 'from-[#2b1e08] via-[#1a1408] to-[#0d0a04]',
    accentColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m4-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#f59e0b" fillOpacity="0.12" />
        {/* Solar Halo Rays */}
        <path d="M50 10 L50 18 M32 16 L36 22 M68 16 L64 22 M18 30 L26 32 M82 30 L74 32" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        {/* Shoulders */}
        <path d="M14 82 L30 56 L46 66 L38 96 Z" fill="url(#m4-gold)" stroke="#fbbf24" strokeWidth="1" />
        <path d="M86 82 L70 56 L54 66 L62 96 Z" fill="url(#m4-gold)" stroke="#fbbf24" strokeWidth="1" />
        <polygon points="36,70 64,70 68,96 32,96" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.2" />
        {/* Head / Helmet */}
        <path d="M30 36 C30 18 70 18 70 36 L72 56 L50 68 L28 56 Z" fill="url(#m4-gold)" stroke="#fef08a" strokeWidth="1.5" />
        {/* Crown Crest */}
        <polygon points="40,20 50,14 60,20 56,28 44,28" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
        {/* Blazing Gold Visor */}
        <polygon points="34,40 66,40 60,50 40,50" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="38" y1="45" x2="62" y2="45" stroke="#f59e0b" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'male-5',
    gender: 'male',
    name: 'Quantum Sage',
    title: 'Neural Architect',
    tagline: 'Deep emerald bio-cybernetic headset with quantum calculation nodes.',
    borderGlow: 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    bgGradient: 'from-[#062418] via-[#071714] to-[#040e0c]',
    accentColor: '#10b981',
    secondaryColor: '#34d399',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m5-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#10b981" fillOpacity="0.1" />
        {/* Tech Shoulders */}
        <path d="M16 80 L32 58 L46 64 L38 96 Z" fill="url(#m5-green)" stroke="#34d399" strokeWidth="1" />
        <path d="M84 80 L68 58 L54 64 L62 96 Z" fill="url(#m5-green)" stroke="#34d399" strokeWidth="1" />
        {/* Helmet / Neural Mesh */}
        <path d="M30 36 C30 18 70 18 70 36 L74 56 L50 68 L26 56 Z" fill="url(#m5-green)" stroke="#10b981" strokeWidth="1.5" />
        {/* Cyber Ear Antennae */}
        <line x1="22" y1="28" x2="28" y2="40" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <line x1="78" y1="28" x2="72" y2="40" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        {/* Triple Optic Visor Array */}
        <circle cx="40" cy="44" r="4" fill="#6ee7b7" stroke="#065f46" strokeWidth="1" />
        <circle cx="50" cy="40" r="4.5" fill="#a7f3d0" stroke="#065f46" strokeWidth="1" />
        <circle cx="60" cy="44" r="4" fill="#6ee7b7" stroke="#065f46" strokeWidth="1" />
        <circle cx="50" cy="40" r="2" fill="#ffffff" />
        {/* Mouth Mesh Filter */}
        <line x1="44" y1="56" x2="56" y2="56" stroke="#34d399" strokeWidth="1.5" />
        <line x1="46" y1="60" x2="54" y2="60" stroke="#34d399" strokeWidth="1" />
      </svg>
    )
  },

  // ================= FEMALE AVATARS (5) =================
  {
    id: 'female-1',
    gender: 'female',
    name: 'Valkyrie Nova',
    title: 'Plasma Wing Commander',
    tagline: 'Sleek ruby flight armor with aerodynamic crest and high-velocity plasma thrusters.',
    borderGlow: 'border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    bgGradient: 'from-[#2b0816] via-[#1a0c18] to-[#0a0714]',
    accentColor: '#f43f5e',
    secondaryColor: '#fb7185',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="f1-armor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <linearGradient id="f1-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#f43f5e" fillOpacity="0.12" />
        {/* Winged Crest Pauldrons */}
        <path d="M12 76 L28 56 L42 62 L32 92 Z" fill="url(#f1-armor)" stroke="#fb7185" strokeWidth="1" />
        <path d="M88 76 L72 56 L58 62 L68 92 Z" fill="url(#f1-armor)" stroke="#fb7185" strokeWidth="1" />
        <polygon points="36,66 64,66 60,94 40,94" fill="#18181b" stroke="url(#f1-gold)" strokeWidth="1.2" />
        {/* Feminine Sleek Helmet */}
        <path d="M32 38 C32 18 68 18 68 38 L72 52 L50 68 L28 52 Z" fill="url(#f1-armor)" stroke="#fb7185" strokeWidth="1.5" />
        {/* Winged Flight Tiara */}
        <polygon points="20,28 32,32 28,46 16,38" fill="url(#f1-gold)" />
        <polygon points="80,28 68,32 72,46 84,38" fill="url(#f1-gold)" />
        <polygon points="46,18 54,18 52,28 48,28" fill="url(#f1-gold)" />
        {/* Sleek Ruby Visor */}
        <polygon points="36,42 64,42 58,49 42,49" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1" />
        <line x1="38" y1="45" x2="62" y2="45" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'female-2',
    gender: 'female',
    name: 'Cyber Huntress',
    title: 'Precision Shadow Striker',
    tagline: 'Amethyst stealth armor with night-hunter telemetry and reactive neural nodes.',
    borderGlow: 'border-fuchsia-500/60 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    bgGradient: 'from-[#280829] via-[#16091e] to-[#070512]',
    accentColor: '#d946ef',
    secondaryColor: '#e879f9',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="f2-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="50%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#d946ef" fillOpacity="0.1" />
        {/* Sleek Shoulder Guard */}
        <path d="M16 80 L30 60 L44 64 L36 94 Z" fill="url(#f2-purple)" stroke="#e879f9" strokeWidth="1" />
        <path d="M84 80 L70 60 L56 64 L64 94 Z" fill="url(#f2-purple)" stroke="#e879f9" strokeWidth="1" />
        {/* Angular Stealth Cowl */}
        <path d="M28 38 C28 18 72 18 72 38 L74 54 L50 68 L26 54 Z" fill="url(#f2-purple)" stroke="#c084fc" strokeWidth="1.5" />
        {/* Cat-Eye Shaped Neon Visor */}
        <path d="M34 42 Q42 38 48 44 Q42 48 34 46 Z" fill="#f5d0fe" />
        <path d="M66 42 Q58 38 52 44 Q58 48 66 46 Z" fill="#f5d0fe" />
        <circle cx="41" cy="43" r="1.5" fill="#a21caf" />
        <circle cx="59" cy="43" r="1.5" fill="#a21caf" />
        {/* Forehead Micro-Diadem */}
        <polygon points="46,24 54,24 50,30" fill="#fdf4ff" />
      </svg>
    )
  },
  {
    id: 'female-3',
    gender: 'female',
    name: 'Astra Empress',
    title: 'Celestial Strategist',
    tagline: 'Deep sapphire arc-suit with starlight crown and infinite calculation nexus.',
    borderGlow: 'border-sky-500/60 shadow-[0_0_20px_rgba(14,165,233,0.4)]',
    bgGradient: 'from-[#081e2b] via-[#091322] to-[#040814]',
    accentColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="f3-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#0ea5e9" fillOpacity="0.12" />
        {/* Starlight Starbursts */}
        <polygon points="50,6 52,14 50,16 48,14" fill="#e0f2fe" />
        <polygon points="30,12 33,18 30,20 27,18" fill="#bae6fd" />
        <polygon points="70,12 73,18 70,20 67,18" fill="#bae6fd" />
        {/* Shoulders */}
        <path d="M16 80 L32 58 L46 64 L38 94 Z" fill="url(#f3-blue)" stroke="#38bdf8" strokeWidth="1" />
        <path d="M84 80 L68 58 L54 64 L62 94 Z" fill="url(#f3-blue)" stroke="#38bdf8" strokeWidth="1" />
        {/* Head / Mask */}
        <path d="M30 38 C30 20 70 20 70 38 L72 54 L50 68 L28 54 Z" fill="url(#f3-blue)" stroke="#7dd3fc" strokeWidth="1.5" />
        {/* Crown Diadem */}
        <polygon points="34,26 50,18 66,26 60,34 40,34" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="1" />
        {/* Cyan Star Visor */}
        <polygon points="36,42 64,42 58,49 42,49" fill="#e0f2fe" />
        <line x1="38" y1="45" x2="62" y2="45" stroke="#0284c7" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: 'female-4',
    gender: 'female',
    name: 'Solaris Queen',
    title: 'Plasma Corona Sovereign',
    tagline: 'Blazing topaz armor harnessing concentrated thermal energy and swift problem solving.',
    borderGlow: 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    bgGradient: 'from-[#2b1608] via-[#1a0e06] to-[#0a0703]',
    accentColor: '#f97316',
    secondaryColor: '#fb923c',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="f4-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="60%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#f97316" fillOpacity="0.12" />
        {/* Corona Crown */}
        <polygon points="30,22 36,12 42,20 50,8 58,20 64,12 70,22 66,32 34,32" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
        {/* Shoulders */}
        <path d="M14 80 L30 58 L46 64 L38 94 Z" fill="url(#f4-orange)" stroke="#fdba74" strokeWidth="1" />
        <path d="M86 80 L70 58 L54 64 L62 94 Z" fill="url(#f4-orange)" stroke="#fdba74" strokeWidth="1" />
        {/* Mask */}
        <path d="M30 38 C30 22 70 22 70 38 L72 54 L50 68 L28 54 Z" fill="url(#f4-orange)" stroke="#fb923c" strokeWidth="1.5" />
        {/* Topaz Glow Visor */}
        <polygon points="36,42 64,42 58,49 42,49" fill="#ffedd5" stroke="#ea580c" strokeWidth="1" />
        <line x1="38" y1="45" x2="62" y2="45" stroke="#f97316" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'female-5',
    gender: 'female',
    name: 'Verdant Oracle',
    title: 'Quantum Bio-Sage',
    tagline: 'Jade and teal cerebral armor with quantum bio-matrix calculations.',
    borderGlow: 'border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.4)]',
    bgGradient: 'from-[#062420] via-[#061715] to-[#030d0b]',
    accentColor: '#14b8a6',
    secondaryColor: '#2dd4bf',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="f5-teal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="60%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#042f2e" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="#14b8a6" fillOpacity="0.1" />
        {/* Shoulders */}
        <path d="M16 80 L32 58 L46 64 L38 94 Z" fill="url(#f5-teal)" stroke="#5eead4" strokeWidth="1" />
        <path d="M84 80 L68 58 L54 64 L62 94 Z" fill="url(#f5-teal)" stroke="#5eead4" strokeWidth="1" />
        {/* Head / Tiara */}
        <path d="M30 38 C30 20 70 20 70 38 L72 54 L50 68 L28 54 Z" fill="url(#f5-teal)" stroke="#2dd4bf" strokeWidth="1.5" />
        {/* Emerald Crest */}
        <polygon points="42,22 50,14 58,22 54,30 46,30" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1" />
        {/* Bio-Visor */}
        <polygon points="36,42 64,42 58,49 42,49" fill="#f0fdfa" stroke="#0f766e" strokeWidth="1" />
        <line x1="38" y1="45" x2="62" y2="45" stroke="#14b8a6" strokeWidth="1.5" />
      </svg>
    )
  }
];

export const MALE_AVATARS = AVATARS.filter((a) => a.gender === 'male');
export const FEMALE_AVATARS = AVATARS.filter((a) => a.gender === 'female');

export const getAvatarById = (id) => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};
