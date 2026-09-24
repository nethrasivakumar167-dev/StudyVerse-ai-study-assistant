import React from 'react';

export const ArmoredHeroGraphic = ({ className = 'w-full max-w-[420px] h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Radial Energy Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-red-600/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-amber-500/20 blur-2xl animate-ping pointer-events-none opacity-50" />

      {/* Holographic Ring Background */}
      <svg className="absolute w-[120%] h-[120%] pointer-events-none animate-holo-spin opacity-40" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="8 12" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="16 20" />
      </svg>

      {/* Original Armored Tech Hero Vector */}
      <svg
        viewBox="0 0 320 400"
        className="relative z-10 w-full h-auto drop-shadow-[0_15px_35px_rgba(239,68,68,0.45)] animate-float"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="armorRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          <linearGradient id="armorGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          <linearGradient id="darkMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <radialGradient id="arcCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#67e8f9" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hover Energy Thruster Particles */}
        <ellipse cx="160" cy="385" rx="55" ry="10" fill="#f59e0b" opacity="0.3" filter="blur(6px)" />
        <ellipse cx="160" cy="380" rx="35" ry="6" fill="#ef4444" opacity="0.6" filter="blur(3px)" />

        {/* Hero Torso / Nano Armor Plates */}
        <path d="M120 150 L200 150 L225 240 L160 310 L95 240 Z" fill="url(#armorRedGrad)" stroke="#f87171" strokeWidth="2" />
        
        {/* Dark Metal Core Frame */}
        <path d="M135 165 L185 165 L200 230 L160 270 L120 230 Z" fill="url(#darkMetalGrad)" stroke="#eab308" strokeWidth="1.5" />

        {/* Gold Abdominal Armor Plates */}
        <path d="M140 250 L180 250 L170 280 L160 290 L150 280 Z" fill="url(#armorGoldGrad)" />
        <path d="M145 285 L175 285 L160 305 Z" fill="url(#armorGoldGrad)" />

        {/* Shoulder Pauldrons (Heavy Armor) */}
        {/* Left Pauldron */}
        <path d="M120 150 L80 160 L60 210 L105 200 L125 165 Z" fill="url(#armorRedGrad)" stroke="#f87171" strokeWidth="1.5" />
        <path d="M85 165 L65 200 L95 195 Z" fill="url(#armorGoldGrad)" />
        
        {/* Right Pauldron */}
        <path d="M200 150 L240 160 L260 210 L215 200 L195 165 Z" fill="url(#armorRedGrad)" stroke="#f87171" strokeWidth="1.5" />
        <path d="M235 165 L255 200 L225 195 Z" fill="url(#armorGoldGrad)" />

        {/* Forearms / Energy Repulsor Bracers */}
        <path d="M60 210 L45 270 L75 280 L95 215 Z" fill="url(#armorRedGrad)" />
        <circle cx="60" cy="275" r="7" fill="#38bdf8" filter="url(#coreGlow)" />
        
        <path d="M260 210 L275 270 L245 280 L225 215 Z" fill="url(#armorRedGrad)" />
        <circle cx="260" cy="275" r="7" fill="#38bdf8" filter="url(#coreGlow)" />

        {/* Neck Guard */}
        <path d="M140 145 L180 145 L170 120 L150 120 Z" fill="url(#darkMetalGrad)" stroke="#eab308" strokeWidth="1" />

        {/* Futuristic Helmet */}
        <path d="M130 65 L190 65 L205 105 L160 135 L115 105 Z" fill="url(#armorRedGrad)" stroke="#f87171" strokeWidth="2" />
        
        {/* Helmet Gold Brow & Faceplate */}
        <path d="M135 75 L185 75 L195 100 L160 125 L125 100 Z" fill="url(#armorGoldGrad)" stroke="#fef08a" strokeWidth="1.5" />

        {/* Glowing Tactical Cyber Visor */}
        <path d="M140 92 L180 92 L175 100 L160 104 L145 100 Z" fill="#67e8f9" filter="url(#coreGlow)" />
        <line x1="145" y1="96" x2="175" y2="96" stroke="#ffffff" strokeWidth="1.5" />

        {/* Glowing Arc Reactor Chest Energy Core */}
        <circle cx="160" cy="205" r="22" fill="#0f172a" stroke="#eab308" strokeWidth="2.5" />
        <polygon points="160,189 174,213 146,213" fill="none" stroke="#67e8f9" strokeWidth="1.5" />
        <circle cx="160" cy="205" r="14" fill="url(#arcCoreGrad)" filter="url(#coreGlow)" className="animate-arc-pulse" />
        <circle cx="160" cy="205" r="6" fill="#ffffff" />

        {/* Holographic Tactical Telemetry Panels */}
        <g opacity="0.85" className="animate-pulse">
          <rect x="235" y="90" width="70" height="40" rx="4" fill="rgba(15, 23, 42, 0.7)" stroke="#67e8f9" strokeWidth="1" />
          <text x="242" y="105" fill="#67e8f9" fontSize="8" fontFamily="monospace">POWER: 98%</text>
          <text x="242" y="117" fill="#eab308" fontSize="7" fontFamily="monospace">CORE: ONLINE</text>
          <line x1="230" y1="110" x2="205" y2="105" stroke="#67e8f9" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="230" cy="110" r="2" fill="#67e8f9" />
        </g>
      </svg>
    </div>
  );
};
