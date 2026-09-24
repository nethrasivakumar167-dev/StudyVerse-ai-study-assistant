import React from 'react';
import { useHero } from '../../context/HeroContext';
import { HolographicCard } from '../ui/HolographicCard';
import { Badge } from '../ui/Badge';
import { EnergyButton } from '../ui/EnergyButton';
import { BookOpen, Terminal, Puzzle, Layers, Lock, Unlock, Sparkles, CheckCircle2 } from 'lucide-react';

const SKILL_ICONS = {
  BookOpen,
  Terminal,
  Puzzle,
  Layers
};

export const SkillTree = () => {
  const { skillTree, upgradeSkill, profile } = useHero();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white flex items-center gap-2">
            <span>GENETIC SKILL MATRIX</span>
            <Badge variant="cyan" size="sm">RPG PROGRESSION</Badge>
          </h3>
          <p className="text-xs text-slate-400 font-outfit mt-0.5">
            Unlock and overclock your academic cognitive sub-routines as your power level ascends.
          </p>
        </div>
      </div>

      {skillTree.map((category, catIdx) => (
        <div key={catIdx} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.skills.map((skill) => {
              const Icon = SKILL_ICONS[skill.icon] || Sparkles;
              const isLocked = skill.status === 'LOCKED' && (!skill.requiredXp || profile.xp < skill.requiredXp);
              const isMaxed = skill.level >= skill.maxLevel;

              return (
                <HolographicCard
                  key={skill.id}
                  glowColor={isLocked ? 'none' : 'cyan'}
                  className={`p-5 flex flex-col justify-between ${
                    isLocked ? 'opacity-70 border-slate-800' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isLocked
                              ? 'bg-slate-900 border-slate-800 text-slate-600'
                              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-orbitron font-bold text-white">
                            {skill.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            TIER {skill.level} / {skill.maxLevel}
                          </div>
                        </div>
                      </div>

                      {isLocked ? (
                        <Badge variant="slate" size="sm" icon={Lock}>
                          LOCKED
                        </Badge>
                      ) : isMaxed ? (
                        <Badge variant="gold" size="sm" icon={CheckCircle2}>
                          MAXED
                        </Badge>
                      ) : (
                        <Badge variant="cyan" size="sm">
                          ACTIVE
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-outfit mb-4 leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>

                  {/* Level Progress Bars */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      {[...Array(skill.maxLevel)].map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-1.5 rounded-full transition ${
                            idx < skill.level
                              ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      {isLocked ? (
                        <span className="text-[10px] font-mono text-slate-500">
                          Requires {skill.requiredXp?.toLocaleString()} XP
                        </span>
                      ) : isMaxed ? (
                        <span className="text-[10px] font-mono text-amber-300">
                          Max Cognitive Overclock Achieved
                        </span>
                      ) : (
                        <button
                          onClick={() => upgradeSkill(skill.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-orbitron font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>UPGRADE (+100 XP)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </HolographicCard>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
