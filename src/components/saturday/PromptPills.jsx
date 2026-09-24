import React from 'react';
import { Zap, HelpCircle, BookOpen, Brain, Sparkles, AlertTriangle } from 'lucide-react';

export const PromptPills = ({ onSelectPrompt }) => {
  const prompts = [
    { label: 'Explain this simply', icon: HelpCircle, text: 'Can you explain Process Scheduling simply with an analogy?' },
    { label: 'Give me an example', icon: Sparkles, text: 'Give me a real-world engineering example of Round Robin vs Priority Scheduling.' },
    { label: 'Make revision notes', icon: BookOpen, text: 'Generate high-yield revision notes with exam warnings.' },
    { label: 'Quiz me', icon: Zap, text: 'Give me a challenging battle quiz question on this topic.' },
    { label: "Explain like I'm a beginner", icon: Brain, text: "Explain CPU scheduling algorithms like I'm a complete beginner." },
    { label: 'Give me an exam question', icon: AlertTriangle, text: 'Give me a frequently asked university exam question on Deadlocks.' },
    { label: 'Find my weak areas', icon: Zap, text: 'Based on my recent battle arena accuracy, what are my weakest operating system concepts?' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin">
      {prompts.map((p, idx) => {
        const Icon = p.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p.text)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-xs font-rajdhani font-semibold tracking-wide whitespace-nowrap transition cursor-pointer shrink-0 shadow-sm"
          >
            <Icon className="w-3 h-3 text-amber-400" />
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
};
