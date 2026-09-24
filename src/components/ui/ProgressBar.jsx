import React from 'react';

export const ProgressBar = ({
  current = 0,
  max = 100,
  label = '',
  color = 'red', // 'red' | 'blue' | 'gold' | 'cyan' | 'purple' | 'green'
  showNumbers = true,
  height = 'h-3',
  className = ''
}) => {
  const percentage = Math.min(Math.max(Math.round((current / max) * 100), 0), 100);

  const gradients = {
    red: 'from-red-600 via-amber-500 to-yellow-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    blue: 'from-blue-600 via-cyan-500 to-sky-300 shadow-[0_0_15px_rgba(37,99,235,0.5)]',
    gold: 'from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
    cyan: 'from-cyan-600 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
    purple: 'from-purple-600 via-pink-500 to-rose-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    green: 'from-emerald-600 via-green-400 to-teal-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showNumbers) && (
        <div className="flex justify-between items-center text-xs mb-1.5 font-rajdhani font-semibold tracking-wider">
          {label && <span className="text-slate-400 uppercase">{label}</span>}
          {showNumbers && (
            <span className="text-slate-200 font-mono">
              {current.toLocaleString()} / {max.toLocaleString()} XP ({percentage}%)
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div className={`w-full ${height} bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-800 relative`}>
        {/* Animated Fill Bar */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${
            gradients[color] || gradients.red
          } transition-all duration-700 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Glowing Pulse Edge */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-ping opacity-75" />
        </div>
      </div>
    </div>
  );
};
