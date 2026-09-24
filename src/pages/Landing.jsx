import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/studyverse-logo.png';

export const Landing = () => {
  const navigate = useNavigate();

  // State Management
  const [armorTheme, setArmorTheme] = useState('mark85'); // 'mark85' | 'nanotech' | 'stealth' | 'hulkbuster'
  const [isMuted, setIsMuted] = useState(true);
  const [saturdayOpen, setSaturdayOpen] = useState(false);
  const [focusTimerOpen, setFocusTimerOpen] = useState(false);
  const [holoScanActive, setHoloScanActive] = useState(false);
  const [saturdayInput, setSaturdayInput] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'saturday',
      text: 'Good day. I am S.A.T.U.R.D.A.Y. — Student Assistant To Understand, Review, & Deliver Academic Yield. All neural study cores are active. What academic concept or challenge are we conquering today?'
    }
  ]);

  // Focus Timer State
  const [timerRemaining, setTimerRemaining] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Parallax & Canvas Refs
  const canvasRef = useRef(null);
  const heroAvatarRef = useRef(null);
  const parallaxBgTextRef = useRef(null);
  const repulsorSparksRef = useRef(null);
  const chatStreamRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Web Audio Synthesizer
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTelemetryBeep = (freq = 587.33) => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio waiting for user gesture', e);
    }
  };

  const playRepulsorSFX = () => {
    if (isMuted) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      // Charging Whine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);

      // Beam discharge
      setTimeout(() => {
        if (!audioCtxRef.current) return;
        const beamOsc = ctx.createOscillator();
        const beamGain = ctx.createGain();
        beamOsc.connect(beamGain);
        beamGain.connect(ctx.destination);
        const t = ctx.currentTime;
        beamOsc.type = 'triangle';
        beamOsc.frequency.setValueAtTime(450, t);
        beamOsc.frequency.exponentialRampToValueAtTime(80, t + 0.25);
        beamGain.gain.setValueAtTime(0.3, t);
        beamGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        beamOsc.start(t);
        beamOsc.stop(t + 0.3);
      }, 360);
    } catch (e) {}
  };

  const toggleAudio = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (!nextState) {
      initAudio();
      playTelemetryBeep(660);
    }
  };

  // Armor Theme Switcher
  const handleThemeChange = (themeName) => {
    setArmorTheme(themeName);
    playTelemetryBeep(880);
  };

  // Repulsor Sparks & Pulse Animation
  const triggerRepulsorPulse = () => {
    playRepulsorSFX();
    if (heroAvatarRef.current) {
      heroAvatarRef.current.classList.add('scale-105');
      setTimeout(() => heroAvatarRef.current?.classList.remove('scale-105'), 220);
    }
    spawnRepulsorSparks();
  };

  const spawnRepulsorSparks = () => {
    const container = repulsorSparksRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const spark = document.createElement('div');
      const angle = Math.random() * Math.PI * 2;
      const dist = 70 + Math.random() * 90;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      spark.className = 'absolute w-1.5 h-1.5 rounded-full bg-white transition-all duration-600 ease-out pointer-events-none';
      spark.style.boxShadow = '0 0 12px #00f7ff, 0 0 4px #ffffff';
      container.appendChild(spark);

      requestAnimationFrame(() => {
        spark.style.transform = `translate(${x}px, ${y}px) scale(0)`;
        spark.style.opacity = '0';
      });
    }
  };

  // 3D Mouse Parallax Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = e.clientX / innerWidth - 0.5;
      const yNorm = e.clientY / innerHeight - 0.5;

      if (heroAvatarRef.current) {
        heroAvatarRef.current.style.transform = `perspective(1000px) rotateY(${xNorm * 22}deg) rotateX(${-yNorm * 18}deg) translateZ(25px)`;
      }
      if (parallaxBgTextRef.current) {
        parallaxBgTextRef.current.style.transform = `translate(${xNorm * -40}px, ${yNorm * -30}px) scale(1.03)`;
      }
    };

    const handleMouseLeave = () => {
      if (heroAvatarRef.current) {
        heroAvatarRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
      }
      if (parallaxBgTextRef.current) {
        parallaxBgTextRef.current.style.transform = 'translate(0, 0)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Ambient Canvas Particles (Embers & Arc Dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class EmberParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 40;
        this.size = Math.random() * 2.4 + 0.6;
        this.speedY = Math.random() * 1.3 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.color = Math.random() > 0.25 ? '230, 36, 41' : '0, 247, 255';
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= 0.0016;
        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push(new EmberParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let p of particles) {
        p.update();
        p.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Focus Timer Countdown
  useEffect(() => {
    let interval;
    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playTelemetryBeep(880);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemaining]);

  // S.A.T.U.R.D.A.Y. Prompt Transmission
  const handleSendSaturday = (queryText = saturdayInput) => {
    const text = queryText.trim();
    if (!text) return;

    playTelemetryBeep(740);
    const userMsg = { id: Date.now(), sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setSaturdayInput('');

    setTimeout(() => {
      chatStreamRef.current?.scrollTo({ top: chatStreamRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);

    setTimeout(() => {
      playTelemetryBeep(880);
      const q = text.toLowerCase();
      let response = '';

      if (q.includes('thermo') || q.includes('icing')) {
        response = `Thermodynamics Breakdown:\nThermal transfer follows Q = mcΔT where mass, specific heat capacity, and temperature variance dictate phase transitions. In extreme temperature differentials, active thermal dispersion prevents rapid condensation flash-freezing. Key exam takeaway: remember conduction vs convection rate equations and phase change latent heats.`;
      } else if (q.includes('calculus') || q.includes('chain')) {
        response = `Calculus Chain Rule Formulation:\nIf variable y depends on u (y = f(u)), and u depends on x (u = g(x)), then the composite derivative is:\n\ndy/dx = (dy/du) · (du/dx)\n\nMethod: Differentiate the outer function with respect to the inner expression, then multiply by the derivative of the inner function.`;
      } else if (q.includes('algorithm') || q.includes('data') || q.includes('crash')) {
        response = `30-Minute High-Yield Study Protocol:\n1. 00-10m: Master Hash Map lookups (constant O(1) average time complexity).\n2. 10-20m: Dynamic Programming memoization (storing overlapping subproblems to prevent recomputation).\n3. 20-30m: Binary Search partitions (divide-and-conquer on sorted datasets in O(log n)). Launch the Focus Timer now to start!`;
      } else if (q.includes('armor') || q.includes('mark 85') || q.includes('specs')) {
        response = `Knowledge Suit Diagnostics:\n- Mark 85: Titanium-gold alloy with high-capacity study endurance.\n- Mark L Nano-Tech: Liquid smart-matter designed for rapid concept synthesis.\n- Mark XLIV Heavy: Maximum focus resistance for extended deep work sessions.`;
      } else {
        response = `Query received: "${text}". I have indexed the academic syllabus. Deconstruct this concept into core definitions, practice active recall for 20 minutes, and test your understanding in the Battle Arena.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'saturday', text: response }
      ]);

      setTimeout(() => {
        chatStreamRef.current?.scrollTo({ top: chatStreamRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    }, 650);
  };

  const toggleFullscreenHUD = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    playTelemetryBeep(700);
  };

  const toggleHoloScan = () => {
    playTelemetryBeep(800);
    setHoloScanActive(!holoScanActive);
    triggerRepulsorPulse();
  };

  const formatTimer = () => {
    const mins = Math.floor(timerRemaining / 60).toString().padStart(2, '0');
    const secs = (timerRemaining % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Backdrop glow gradient class based on theme
  const backdropGlowClasses = {
    mark85: 'from-[#e62429] via-[#b81424] to-transparent opacity-40',
    nanotech: 'from-cyan-500 via-blue-600 to-transparent opacity-45',
    stealth: 'from-yellow-500 via-neutral-700 to-transparent opacity-35',
    hulkbuster: 'from-orange-600 via-red-800 to-transparent opacity-50'
  };

  return (
    <div className={`min-h-screen relative theme-${armorTheme} transition-colors duration-700 font-space selection:bg-red-600 selection:text-white ${holoScanActive ? 'invert-[0.08]' : ''}`}>
      {/* Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[1050px] h-[600px] sm:h-[850px] rounded-full blur-[150px] bg-gradient-to-tr transition-all duration-700 ${
            backdropGlowClasses[armorTheme] || backdropGlowClasses.mark85
          }`}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/15 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 blur-[150px]" />
      </div>

      {/* Canvas Particle Overlay */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className="fixed inset-0 saturday-grid pointer-events-none z-0 opacity-40" />
      <div className="fixed inset-0 holo-scanlines pointer-events-none z-0" />

      {/* Top Navbar */}
      <nav className="relative z-30 w-full px-4 sm:px-8 py-4 border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo with StudyVerse Crest */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(230,36,41,0.6)] border border-amber-300/40 group-hover:scale-105 transition-transform duration-300 bg-slate-900 p-0.5">
              <img src={logoImg} alt="StudyVerse Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-orbitron font-black text-xl tracking-wider text-white">
                  STUDY<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c542] to-[#e62429]">VERSE</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#00f7ff]/10 text-[#00f7ff] border border-[#00f7ff]/30">
                  MK-85
                </span>
              </div>
              <span className="text-[9px] font-rajdhani tracking-[0.25em] text-neutral-400 font-bold uppercase -mt-0.5">
                S.A.T.U.R.D.A.Y. ACADEMIC AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-7 font-rajdhani text-sm font-bold tracking-wider text-neutral-300">
            <button
              onClick={() => {
                setSaturdayOpen(true);
                handleSendSaturday("Display full specs for Mark 85, Nano-Tech, and Heavy Study armor configurations.");
              }}
              className="hover:text-[#f5c542] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-shield-cat text-xs text-[#f5c542]" /> ARMORY
            </button>
            <button
              onClick={() => {
                playTelemetryBeep(600);
                setFocusTimerOpen(true);
              }}
              className="hover:text-[#e62429] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-clock text-xs text-[#e62429]" /> FOCUS TIMER
            </button>
            <button
              onClick={() => {
                playTelemetryBeep(520);
                setSaturdayOpen(true);
              }}
              className="hover:text-[#00f7ff] transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f7ff] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f7ff]" />
              </span>
              <span>S.A.T.U.R.D.A.Y. AI</span>
            </button>
            <button
              onClick={() => {
                setSaturdayOpen(true);
                handleSendSaturday("Run diagnostic sweep: knowledge retention, neural telemetry, and study efficiency.");
              }}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-satellite-dish text-xs text-cyan-400" /> TELEMETRY
            </button>
          </div>

          {/* Suit Switcher & Audio Controls */}
          <div className="flex items-center gap-3">
            {/* Suit Selector Dropdown / Pills */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-rajdhani">
              <span className="text-neutral-400 mr-1 text-[11px] font-mono">MARK:</span>
              <button
                onClick={() => handleThemeChange('mark85')}
                title="Mark 85 (Hot Rod Red & Gold)"
                className={`w-4 h-4 rounded-full bg-[#e62429] hover:scale-125 transition-transform cursor-pointer ${armorTheme === 'mark85' ? 'ring-2 ring-white scale-110' : ''}`}
              />
              <button
                onClick={() => handleThemeChange('nanotech')}
                title="Mark L Nano-Tech (Crimson & Cyan Arc)"
                className={`w-4 h-4 rounded-full bg-[#00f7ff] hover:scale-125 transition-transform cursor-pointer ${armorTheme === 'nanotech' ? 'ring-2 ring-white scale-110' : ''}`}
              />
              <button
                onClick={() => handleThemeChange('stealth')}
                title="Stealth Armor (Matte Charcoal & Gold)"
                className={`w-4 h-4 rounded-full bg-yellow-400 hover:scale-125 transition-transform cursor-pointer ${armorTheme === 'stealth' ? 'ring-2 ring-white scale-110' : ''}`}
              />
              <button
                onClick={() => handleThemeChange('hulkbuster')}
                title="Mark XLIV Hulkbuster Heavy Mode"
                className={`w-4 h-4 rounded-full bg-orange-600 hover:scale-125 transition-transform cursor-pointer ${armorTheme === 'hulkbuster' ? 'ring-2 ring-white scale-110' : ''}`}
              />
            </div>

            {/* Audio Comm SFX Toggle */}
            <button
              onClick={toggleAudio}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-all text-xs cursor-pointer"
              title="Telemetry Audio FX"
            >
              <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high text-[#e62429]'}`} />
            </button>

            {/* Login for returning heroes & demo accounts */}
            <button
              onClick={() => {
                playTelemetryBeep(520);
                navigate('/login');
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-200 hover:text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-user text-xs text-[#00f7ff]" />
              <span>LOG IN</span>
            </button>

            {/* CTA Enroll Button */}
            <button
              onClick={() => {
                playRepulsorSFX();
                navigate('/hero-setup');
              }}
              className="relative group overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#e62429] via-[#b81424] to-[#f5c542] text-white font-rajdhani font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(230,36,41,0.6)] hover:shadow-[0_0_35px_rgba(245,197,66,0.8)] transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>SUIT UP</span>
              <i className="fa-solid fa-bolt text-xs group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Hero Showcase */}
      <main className="relative z-10 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] px-4 sm:px-8 py-5 max-w-7xl mx-auto overflow-hidden">
        {/* Top Lore Badge */}
        <div className="mt-1 mb-2 z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 border border-red-500/40 backdrop-blur-md shadow-[0_0_18px_rgba(230,36,41,0.3)]">
            <i className="fa-solid fa-bolt text-[#f5c542] text-xs animate-bounce" />
            <span className="font-rajdhani text-xs sm:text-sm font-bold tracking-[0.2em] text-red-200 uppercase">
              STUDYING IS YOUR SUPERPOWER
            </span>
          </div>
        </div>

        {/* Center Hero Showcase with Stencil Typography & Armored Avatar */}
        <div className="relative w-full flex flex-col items-center justify-center my-auto py-2">
          {/* Backdrop Stencil Typography */}
          <div
            ref={parallaxBgTextRef}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 transition-transform duration-150 ease-out opacity-25 sm:opacity-35"
          >
            <div className="brush-hero-text text-5xl sm:text-7xl md:text-9xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-transparent tracking-widest scale-y-110">
              HERO
            </div>
            <div className="brush-hero-text text-6xl sm:text-8xl md:text-[10.5rem] text-center text-transparent bg-clip-text bg-gradient-to-r from-[#f5c542] via-[#e62429] to-red-600 font-extrabold tracking-tight -mt-4 sm:-mt-10">
              COGNITION
            </div>
          </div>

          {/* Holographic Targeting Ring & Reticles */}
          <div className="absolute w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] rounded-full border border-[#00f7ff]/20 pointer-events-none flex items-center justify-center spin-cw">
            <div className="w-[90%] h-[90%] rounded-full border border-dashed border-[#f5c542]/25 spin-ccw" />
            <div className="absolute top-2 w-3 h-3 border-t-2 border-l-2 border-[#00f7ff]" />
            <div className="absolute bottom-2 w-3 h-3 border-b-2 border-r-2 border-[#00f7ff]" />
          </div>

          {/* Iron Man Bust & Helmet SVG Container */}
          <div
            ref={heroAvatarRef}
            onClick={triggerRepulsorPulse}
            className="relative z-10 w-72 sm:w-96 md:w-[460px] h-[330px] sm:h-[420px] flex items-center justify-center transition-transform duration-200 ease-out cursor-pointer group"
          >
            {/* Arc Reactor Pulsating Auras */}
            <div className="absolute inset-0 -top-4 rounded-full blur-3xl opacity-35 bg-gradient-to-b from-[#e62429] via-[#f5c542] to-[#00f7ff]" />

            {/* High-Precision SVG: Iron Man Mark 85 Bust & Helmet */}
            <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ironRed" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--suit-red)" />
                  <stop offset="60%" stopColor="var(--suit-red-dark)" />
                  <stop offset="100%" stopColor="#240407" />
                </linearGradient>

                <linearGradient id="ironGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff099" />
                  <stop offset="35%" stopColor="var(--suit-gold)" />
                  <stop offset="85%" stopColor="var(--suit-gold-dark)" />
                  <stop offset="100%" stopColor="#402f04" />
                </linearGradient>

                <linearGradient id="underArmor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a3040" />
                  <stop offset="60%" stopColor="#141824" />
                  <stop offset="100%" stopColor="#0a0c12" />
                </linearGradient>

                <radialGradient id="arcCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="var(--arc-glow)" />
                  <stop offset="80%" stopColor="#006b80" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                <filter id="arcLaserGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Pauldrons */}
              <g id="pauldrons">
                <path d="M 80 320 L 140 230 L 210 260 L 160 360 Z" fill="url(#ironRed)" stroke="#ff4d5a" strokeWidth="1.5" />
                <polygon points="120,240 180,250 150,330 100,310" fill="url(#ironGold)" />
                <path d="M 420 320 L 360 230 L 290 260 L 340 360 Z" fill="url(#ironRed)" stroke="#ff4d5a" strokeWidth="1.5" />
                <polygon points="380,240 320,250 350,330 400,310" fill="url(#ironGold)" />
              </g>

              {/* Collarbone and Neck Ribs */}
              <polygon points="210,215 290,215 275,260 225,260" fill="url(#underArmor)" stroke="rgba(255,255,255,0.2)" />
              <line x1="235" y1="220" x2="235" y2="255" stroke="var(--suit-gold)" strokeWidth="2" />
              <line x1="265" y1="220" x2="265" y2="255" stroke="var(--suit-gold)" strokeWidth="2" />

              {/* Main Chest Plate */}
              <path d="M 190 250 L 310 250 L 345 370 L 250 435 L 155 370 Z" fill="url(#ironRed)" stroke="var(--suit-gold)" strokeWidth="2" />
              <polygon points="195,260 235,260 240,320 185,340" fill="url(#ironGold)" />
              <polygon points="305,260 265,260 260,320 315,340" fill="url(#ironGold)" />
              <polygon points="220,350 280,350 250,405" fill="url(#underArmor)" stroke="var(--suit-gold)" strokeWidth="1.5" />

              {/* CENTER ARC REACTOR */}
              <g id="arcReactorCore" className="cursor-pointer">
                <circle cx="250" cy="315" r="32" fill="#060b14" stroke="var(--suit-gold)" strokeWidth="2" />
                <circle cx="250" cy="315" r="26" fill="none" stroke="var(--arc-glow)" strokeWidth="2" strokeDasharray="6,4" className="spin-cw" />
                <circle cx="250" cy="315" r="20" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8,6" className="spin-ccw" />
                <circle cx="250" cy="315" r="14" fill="url(#arcCoreGlow)" filter="url(#arcLaserGlow)" />
                <polygon points="250,305 259,322 241,322" fill="#ffffff" opacity="0.9" />
              </g>

              {/* IRON MAN HELMET */}
              <g id="ironHelmet">
                <path d="M 195 130 C 195 70, 305 70, 305 130 L 315 185 L 250 220 L 185 185 Z" fill="url(#ironRed)" stroke="#ff4d5a" strokeWidth="1.5" />
                <polygon points="185,140 205,140 200,195 180,185" fill="url(#underArmor)" />
                <polygon points="315,140 295,140 300,195 320,185" fill="url(#underArmor)" />

                <path d="M 215 105 L 285 105 L 295 135 L 280 185 L 250 215 L 220 185 L 205 135 Z" fill="url(#ironGold)" stroke="#d4a31e" strokeWidth="2" />
                <polygon points="230,105 270,105 260,122 240,122" fill="url(#ironRed)" />
                <polygon points="235,190 265,190 258,212 242,212" fill="url(#ironRed)" />

                {/* Glowing Slit Visor Eyes */}
                <g className="visor-glow">
                  <polygon points="216,145 244,148 242,156 220,154" fill="#ffffff" filter="url(#arcLaserGlow)" />
                  <polygon points="284,145 256,148 258,156 280,154" fill="#ffffff" filter="url(#arcLaserGlow)" />
                </g>
              </g>

              {/* Floating HUD Telemetry */}
              <text x="140" y="210" fill="var(--arc-glow)" fontFamily="'Orbitron', monospace" fontSize="8" fontWeight="700" opacity="0.8">
                S.A.T.U.R.D.A.Y.::OS
              </text>
              <text x="325" y="210" fill="var(--suit-gold)" fontFamily="'Orbitron', monospace" fontSize="8" fontWeight="700" opacity="0.8">
                OUTPUT::100%
              </text>
              <circle cx="130" cy="207" r="3" fill="var(--arc-glow)" className="animate-ping" />
            </svg>

            {/* Dynamic Repulsor Sparks container */}
            <div ref={repulsorSparksRef} className="absolute pointer-events-none inset-0 flex items-center justify-center" />
          </div>

          {/* Superhero Lore Typography & CTA Buttons */}
          <div className="relative z-20 text-center max-w-3xl mx-auto -mt-6 sm:-mt-8 px-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-orbitron font-black tracking-tight text-white uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              TRAIN YOUR MIND.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5c542] via-amber-300 to-[#e62429]">
                BECOME THE HERO.
              </span>
            </h1>

            <p className="mt-4 text-sm sm:text-base md:text-lg text-neutral-300 font-space max-w-xl mx-auto font-normal leading-relaxed drop-shadow">
              Turn your study sessions into high-yield missions and tactical victories with your personal S.A.T.U.R.D.A.Y. AI companion.
            </p>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              {/* Primary CTA */}
              <button
                onClick={() => {
                  playRepulsorSFX();
                  navigate('/hero-setup');
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#e62429] via-[#b81424] to-[#f5c542] hover:opacity-95 text-white font-rajdhani font-bold text-base tracking-wider shadow-[0_0_30px_rgba(230,36,41,0.6)] hover:shadow-[0_0_45px_rgba(245,197,66,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
              >
                <i className="fa-solid fa-bolt text-lg" />
                <span>BEGIN YOUR TRAINING</span>
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => {
                  playTelemetryBeep(520);
                  setSaturdayOpen(true);
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#0055ff] to-[#00f7ff] hover:opacity-95 text-white font-rajdhani font-bold text-base tracking-wider shadow-[0_0_30px_rgba(0,247,255,0.4)] hover:shadow-[0_0_45px_rgba(0,247,255,0.7)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
              >
                <i className="fa-solid fa-microchip text-lg" />
                <span>MEET S.A.T.U.R.D.A.Y.</span>
              </button>
            </div>

            {/* Returning hero login link */}
            <p className="mt-5 text-xs sm:text-sm font-rajdhani font-semibold uppercase tracking-wider text-neutral-400">
              Already enrolled?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#f5c542] hover:text-white font-bold underline decoration-dotted underline-offset-4 transition-colors cursor-pointer"
              >
                Log in to HQ
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Metrics HUD & Radar Controls */}
        <div className="relative z-20 w-full pt-8 pb-3 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 mt-6">
          {/* Metrics */}
          <div className="flex items-center gap-8 sm:gap-12 w-full md:w-auto justify-around md:justify-start">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-tight">500</span>
                <span className="text-[#e62429] font-bold text-xl font-orbitron">K+</span>
              </div>
              <span className="text-[11px] sm:text-xs font-rajdhani font-semibold tracking-widest text-neutral-400 uppercase">
                HEROES SUITED UP
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-tight">99.8</span>
                <span className="text-[#f5c542] font-bold text-xl font-orbitron">%</span>
              </div>
              <span className="text-[11px] sm:text-xs font-rajdhani font-semibold tracking-widest text-neutral-400 uppercase">
                EXAM VICTORY RATE
              </span>
            </div>

            <div className="hidden sm:flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-extrabold text-2xl sm:text-3xl text-white tracking-tight">3000</span>
                <span className="text-[#00f7ff] font-bold text-xl font-orbitron">+</span>
              </div>
              <span className="text-[11px] sm:text-xs font-rajdhani font-semibold tracking-widest text-neutral-400 uppercase">
                IQ MODULES ANALYZED
              </span>
            </div>
          </div>

          {/* Focus Timer Pill */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f7ff] animate-ping" />
            <span className="font-rajdhani text-xs font-semibold text-neutral-300 tracking-wider">
              FOCUS TIMER: {formatTimer()}
            </span>
            <button
              onClick={() => {
                playTelemetryBeep(600);
                setFocusTimerOpen(true);
              }}
              className="text-xs font-rajdhani font-bold text-[#f5c542] hover:text-white transition-colors underline decoration-dotted flex items-center gap-1 cursor-pointer"
            >
              <span>OPEN FOCUS TIMER</span>
              <i className="fa-solid fa-clock text-[10px]" />
            </button>
          </div>

          {/* Bottom Right Radar Badges */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleHoloScan}
              title="Toggle Holographic HUD Matrix"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#00f7ff]/20 border border-white/10 hover:border-[#00f7ff] text-neutral-300 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-lg cursor-pointer"
            >
              <i className="fa-solid fa-crosshairs text-base text-[#00f7ff]" />
            </button>

            <button
              onClick={toggleFullscreenHUD}
              title="Toggle Holographic Fullscreen Mode"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-neutral-300 hover:text-white transition-all duration-300 flex items-center justify-center hover:scale-110 shadow-lg cursor-pointer"
            >
              <i className="fa-solid fa-expand text-sm" />
            </button>
          </div>
        </div>
      </main>

      {/* S.A.T.U.R.D.A.Y. Interactive Modal */}
      {saturdayOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#090d14] border border-cyan-400/50 rounded-2xl shadow-[0_0_60px_rgba(0,247,255,0.3)] overflow-hidden flex flex-col max-h-[85vh]">
            {/* Terminal Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#06080e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                  <i className="fa-solid fa-brain text-[#00f7ff] text-base animate-pulse" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-white text-base flex items-center gap-2">
                    S.A.T.U.R.D.A.Y. <span className="text-[10px] font-rajdhani px-2 py-0.5 rounded bg-cyan-500/20 text-[#00f7ff] border border-cyan-400/40">ACADEMIC AI</span>
                  </h2>
                  <p className="text-xs font-rajdhani text-neutral-400">Student Assistant To Understand, Review, & Deliver Academic Yield</p>
                </div>
              </div>
              <button
                onClick={() => setSaturdayOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-neutral-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Tactical Preset Chips */}
            <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs font-rajdhani">
              <span className="text-neutral-500 uppercase text-[10px] whitespace-nowrap">TACTICAL DRILLS:</span>
              <button
                onClick={() => handleSendSaturday('Explain Thermodynamics and heat transfer equations with real-world examples.')}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 text-neutral-300 hover:text-cyan-300 whitespace-nowrap transition-all cursor-pointer"
              >
                ❄️ Thermodynamics & Heat
              </button>
              <button
                onClick={() => handleSendSaturday('Break down Calculus Chain Rule with step-by-step differentiation examples.')}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-400 text-neutral-300 hover:text-yellow-300 whitespace-nowrap transition-all cursor-pointer"
              >
                📐 Calculus Chain Rule
              </button>
              <button
                onClick={() => handleSendSaturday('Give me a 30-minute high-yield crash course plan for Data Structures.')}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400 text-neutral-300 hover:text-red-300 whitespace-nowrap transition-all cursor-pointer"
              >
                💻 Data Structures
              </button>
            </div>

            {/* Dialogue Stream */}
            <div ref={chatStreamRef} className="p-6 space-y-4 overflow-y-auto flex-1 font-space text-sm max-h-[380px]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'saturday' && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex-shrink-0 flex items-center justify-center text-[#00f7ff] text-xs">
                      <i className="fa-solid fa-robot" />
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl text-neutral-200 leading-relaxed max-w-[85%] ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#e62429] to-[#f5c542] text-white rounded-tr-none shadow-lg'
                      : 'bg-white/5 border border-cyan-400/30 rounded-tl-none shadow-[0_0_20px_rgba(0,247,255,0.15)]'
                  }`}>
                    <p className={`font-rajdhani font-bold text-xs uppercase tracking-wider mb-1 ${msg.sender === 'user' ? 'text-white/90' : 'text-[#00f7ff]'}`}>
                      {msg.sender === 'user' ? 'STUDENT INPUT' : 'S.A.T.U.R.D.A.Y. ANALYSIS COMPLETE'}
                    </p>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendSaturday();
              }}
              className="p-4 border-t border-white/10 bg-[#06080e] flex gap-2"
            >
              <input
                type="text"
                value={saturdayInput}
                onChange={(e) => setSaturdayInput(e.target.value)}
                placeholder="Inquire with S.A.T.U.R.D.A.Y. (e.g. 'Explain Quantum Tunneling' or 'Summarize Process Scheduling')..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 font-space"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#00f7ff] to-blue-600 rounded-xl text-black font-extrabold font-rajdhani text-sm tracking-wider uppercase hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,247,255,0.4)] cursor-pointer"
              >
                <span>TRANSMIT</span>
                <i className="fa-solid fa-paper-plane text-xs" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Focus Timer Modal */}
      {focusTimerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0a0c13] border border-cyan-400/50 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center relative shadow-[0_0_50px_rgba(0,247,255,0.25)]">
            <button
              onClick={() => setFocusTimerOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>

            {/* Timer Icon */}
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-cyan-500/20 border-2 border-[#00f7ff] flex items-center justify-center text-[#00f7ff] text-2xl shadow-[0_0_20px_#00f7ff]">
              <i className="fa-solid fa-clock" />
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white">FOCUS TIMER</h3>
            <p className="font-rajdhani text-xs text-slate-400 uppercase tracking-widest mt-1">
              Pomodoro Concentration Protocol
            </p>

            {/* Duration Selector */}
            <div className="flex justify-center gap-2 mt-4 mb-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setSelectedDuration(mins);
                    setTimerRemaining(mins * 60);
                    setIsTimerRunning(false);
                    playTelemetryBeep(520);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-rajdhani font-bold transition cursor-pointer ${
                    selectedDuration === mins
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            <div className="my-5">
              <span className="font-orbitron text-5xl font-black text-white tracking-widest drop-shadow-[0_0_15px_#00f7ff]">
                {formatTimer()}
              </span>
            </div>

            <div className="flex justify-center gap-3">
              {!isTimerRunning ? (
                <button
                  onClick={() => {
                    setIsTimerRunning(true);
                    playTelemetryBeep(660);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-rajdhani font-bold text-slate-950 uppercase text-sm tracking-wider hover:opacity-90 transition cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-play text-xs" />
                  <span>START</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    playTelemetryBeep(440);
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-rajdhani font-bold text-white uppercase text-sm tracking-wider hover:opacity-90 transition cursor-pointer flex items-center gap-2"
                >
                  <i className="fa-solid fa-pause text-xs" />
                  <span>PAUSE</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerRemaining(selectedDuration * 60);
                  playTelemetryBeep(520);
                }}
                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg font-rajdhani font-bold text-neutral-300 uppercase text-sm cursor-pointer flex items-center gap-2"
              >
                <i className="fa-solid fa-rotate-left text-xs" />
                <span>RESET</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
