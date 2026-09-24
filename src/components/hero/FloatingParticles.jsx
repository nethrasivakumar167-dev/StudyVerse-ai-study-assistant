import React from 'react';

export const FloatingParticles = () => {
  const particles = [
    { top: '10%', left: '15%', size: 'w-1.5 h-1.5', color: 'bg-red-500', delay: '0s', dur: '4s' },
    { top: '25%', left: '80%', size: 'w-2 h-2', color: 'bg-amber-400', delay: '1s', dur: '5s' },
    { top: '45%', left: '10%', size: 'w-1 h-1', color: 'bg-cyan-400', delay: '2s', dur: '6s' },
    { top: '65%', left: '85%', size: 'w-2 h-2', color: 'bg-purple-500', delay: '0.5s', dur: '4.5s' },
    { top: '80%', left: '30%', size: 'w-1.5 h-1.5', color: 'bg-rose-500', delay: '1.5s', dur: '5.5s' },
    { top: '15%', left: '50%', size: 'w-1 h-1', color: 'bg-yellow-300', delay: '2.5s', dur: '7s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, idx) => (
        <div
          key={idx}
          className={`absolute rounded-full opacity-60 ${p.size} ${p.color} animate-pulse`}
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.dur,
            boxShadow: '0 0 10px currentColor'
          }}
        />
      ))}
    </div>
  );
};
