import React from 'react';

export const AgileHeroGraphic = ({ className = 'w-full max-w-[400px] h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient Radial Energy Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-rose-600/20 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-purple-600/20 blur-2xl animate-ping pointer-events-none opacity-40" />

      {/* Abstract Kinetic Web Energy Lines */}
      <svg className="absolute w-[130%] h-[130%] pointer-events-none opacity-45" viewBox="0 0 400 400">
        <path d="M50 80 Q 200 120 350 40" stroke="#f43f5e" strokeWidth="1.5" fill="none" strokeDasharray="6 8" className="animate-pulse" />
        <path d="M30 250 Q 180 200 370 280" stroke="#a855f7" strokeWidth="1" fill="none" strokeDasharray="4 6" />
        <path d="M120 20 L 280 380" stroke="#ffffff" strokeWidth="0.75" opacity="0.3" fill="none" />
        <circle cx="200" cy="120" r="3" fill="#f43f5e" />
        <circle cx="180" cy="200" r="3" fill="#a855f7" />
        <circle cx="280" cy="240" r="4" fill="#ffffff" />
      </svg>

      {/* Original Agile Web-Themed Hero Vector */}
      <svg
        viewBox="0 0 320 400"
        className="relative z-10 w-full h-auto drop-shadow-[0_15px_35px_rgba(244,63,94,0.45)] animate-float-reverse"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="suitCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          <linearGradient id="suitMidnight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="webVectorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <filter id="lensGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Shadow / Ground Matrix */}
        <ellipse cx="160" cy="380" rx="60" ry="8" fill="#f43f5e" opacity="0.3" filter="blur(5px)" />

        {/* Athletic Torso / Suit Plates */}
        <path d="M125 150 L195 150 L210 240 L160 295 L110 240 Z" fill="url(#suitCrimson)" stroke="#fb7185" strokeWidth="1.5" />
        
        {/* Dark Stealth Flank Patterns */}
        <path d="M125 150 L110 240 L135 230 L140 160 Z" fill="url(#suitMidnight)" />
        <path d="M195 150 L210 240 L185 230 L180 160 Z" fill="url(#suitMidnight)" />

        {/* Dynamic Chest Web Emblem (Original Geometric Cyber-Spider) */}
        <g stroke="url(#webVectorGlow)" strokeWidth="1.5" fill="none">
          <polygon points="160,185 175,200 160,225 145,200" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />
          {/* Web Legs */}
          <path d="M152 195 L125 180 L115 195" />
          <path d="M168 195 L195 180 L205 195" />
          <path d="M150 215 L120 230 L110 215" />
          <path d="M170 215 L200 230 L210 215" />
          <circle cx="160" cy="205" r="3" fill="#ffffff" />
        </g>

        {/* Dynamic Shoulders & Arms */}
        {/* Left Arm / Web Shooter Wrist */}
        <path d="M125 150 L75 175 L55 240 L85 225 L105 170 Z" fill="url(#suitCrimson)" stroke="#fb7185" strokeWidth="1" />
        <path d="M55 240 L45 285 L65 290 L75 250 Z" fill="url(#suitMidnight)" />
        {/* Web Shooter Nozzle */}
        <circle cx="50" cy="290" r="4" fill="#ffffff" filter="url(#lensGlow)" />
        <line x1="50" y1="290" x2="20" y2="350" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

        {/* Right Arm (Dynamic Flexed Stance) */}
        <path d="M195 150 L245 175 L265 230 L235 220 L215 170 Z" fill="url(#suitCrimson)" stroke="#fb7185" strokeWidth="1" />
        <path d="M265 230 L275 275 L255 285 L245 245 Z" fill="url(#suitMidnight)" />
        <circle cx="270" cy="280" r="4" fill="#ffffff" filter="url(#lensGlow)" />

        {/* Mask / Head */}
        <path d="M130 70 L190 70 L200 115 L160 145 L120 115 Z" fill="url(#suitCrimson)" stroke="#fb7185" strokeWidth="1.5" />
        
        {/* Mask Center Grid Lines */}
        <path d="M160 70 L160 145" stroke="#881337" strokeWidth="1" />
        <path d="M130 95 Q 160 110 190 95" stroke="#881337" strokeWidth="1" fill="none" />
        <path d="M135 120 Q 160 132 185 120" stroke="#881337" strokeWidth="1" fill="none" />

        {/* Expressive Glowing White Lenses with Bold Black Borders */}
        {/* Left Eye */}
        <path d="M135 92 Q 152 90 156 108 Q 148 116 132 104 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="3" filter="url(#lensGlow)" />
        {/* Right Eye */}
        <path d="M185 92 Q 168 90 164 108 Q 172 116 188 104 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="3" filter="url(#lensGlow)" />

        {/* Kinetic Speed Arc Flares */}
        <g opacity="0.75" className="animate-pulse">
          <path d="M225 60 Q 255 80 275 120" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M45 130 Q 30 170 35 210" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
