import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { saturdayService } from '../services/saturdayService';
import { notesService } from '../services/notesService';
import { SAMPLE_TOPICS } from '../data/mockData';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { Badge } from '../components/ui/Badge';
import {
  FlaskConical,
  Sparkles,
  Swords,
  BookmarkPlus,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  RotateCcw
} from 'lucide-react';

export const KnowledgeLab = () => {
  const { addXp } = useHero();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('Process Scheduling');
  const [difficulty, setDifficulty] = useState('HERO');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const difficulties = [
    { id: 'RECRUIT', label: 'Beginner (Recruit)', desc: 'Foundational Basics', color: 'blue' },
    { id: 'HERO', label: 'Intermediate (Hero)', desc: 'Standard Academic Mastery', color: 'gold' },
    { id: 'SUPERHERO', label: 'Advanced (Superhero)', desc: 'Advanced Architectural Deep-Dive', color: 'red' },
    { id: 'LEGENDARY', label: 'Master (Legendary)', desc: 'Hardcore Exam & Edge-Case Traps', color: 'purple' }
  ];

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setSavedSuccess(false);

    try {
      const data = await saturdayService.explainTopic({
        topic: topic.trim(),
        difficulty
      });
      setResult(data);
      addXp(50, `Knowledge Lab: ${topic.trim()} Analyzed`);

      // Every successful synthesis is saved to the Knowledge Vault right away.
      const vaultBullets =
        Array.isArray(data.notes?.bulletPoints) && data.notes.bulletPoints.length
          ? data.notes.bulletPoints
          : (data.sections || []).map((s) => `${s.title}: ${s.content.slice(0, 100)}`).slice(0, 5);

      await notesService.saveNote({
        title: data.title || topic.trim(),
        topic: topic.trim().toUpperCase(),
        difficulty,
        summary: data.summary || data.overview || '',
        bulletPoints: vaultBullets,
        examAlert:
          data.notes?.examAlert ||
          data.examTips?.[0] ||
          data.sections?.[3]?.content ||
          'Review key definitions, edge cases, and worked examples.'
      });
      setSavedSuccess(true);
      addXp(30, 'Saved to Knowledge Vault');
    } catch (err) {
      console.error('[KnowledgeLab Generation Error]', err);
      let message =
        err.response?.data?.message ||
        err.message ||
        'Study note generation is temporarily unavailable. Please try again.';
      if (err.code === 'ECONNABORTED' || (typeof err.message === 'string' && err.message.toLowerCase().includes('timeout'))) {
        message = 'Study note synthesis timed out on public network. Please click Retry Synthesis to re-generate.';
      }
      setError(message);
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-orbitron font-bold uppercase mb-2">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>DEEP CONCEPT SYNTHESIZER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white uppercase tracking-tight">
          KNOWLEDGE LAB
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
          Enter any academic topic or concept below. S.A.T.U.R.D.A.Y. will synthesize a comprehensive superhero battle dossier.
        </p>
      </div>

      {/* Input Generator Form */}
      <HolographicCard glowColor="cyan" className="p-6 sm:p-8">
        <h3 className="text-lg font-orbitron font-bold text-slate-100 uppercase mb-4 flex items-center gap-2">
          <span>WHAT DO YOU WANT TO MASTER?</span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Topic Input (Single full-width topic input) */}
          <div>
            <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Enter Any Topic or Concept
            </label>
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Process Scheduling, Quantum Computing, French Revolution, React Hooks, Photosynthesis..."
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-outfit text-base outline-none transition shadow-inner"
                required
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-rajdhani font-semibold text-slate-400 uppercase mr-1">
                Suggestions:
              </span>
              {SAMPLE_TOPICS.slice(0, 5).map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTopic(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-400/40 text-[11px] font-outfit text-slate-300 hover:text-cyan-300 transition cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Tier Selector */}
          <div>
            <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
              Training Difficulty Tier
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.id;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-orbitron font-bold uppercase">{d.label}</div>
                    <div className="text-[10px] text-slate-400 font-outfit mt-0.5">{d.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <EnergyButton
              type="submit"
              variant="secondary"
              size="lg"
              icon={FlaskConical}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? 'Synthesizing...' : 'Begin Training (+50 XP)'}
            </EnergyButton>
          </div>
        </form>
      </HolographicCard>

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-12 animate-pulse">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <FlaskConical className="w-8 h-8 animate-spin" />
          </div>
          <div className="text-lg font-orbitron font-bold text-cyan-300 uppercase">
            S.A.T.U.R.D.A.Y. IS SYNTHESIZING KNOWLEDGE MATRIX...
          </div>
          <p className="text-xs text-slate-400 font-outfit mt-1">
            Analyzing academic domain, calculating core formulas, and assembling exam traps
          </p>
        </div>
      )}

      {/* Error State with Retry Button */}
      {error && !isGenerating && (
        <HolographicCard glowColor="red" className="p-6 sm:p-8 animate-fade-in border-red-500/40 bg-red-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-red-300 uppercase">
                  SYNTHESIS TEMPORARILY UNAVAILABLE
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-outfit mt-1 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <EnergyButton
              variant="primary"
              size="md"
              icon={RotateCcw}
              onClick={() => handleGenerate()}
            >
              Retry Synthesis
            </EnergyButton>
          </div>
        </HolographicCard>
      )}

      {/* Generated Explanation Dossier */}
      {result && !isGenerating && (
        <HolographicCard glowColor="cyan" className="p-6 sm:p-8 animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="cyan" size="sm">TOPIC DOSSIER</Badge>
                <Badge variant="gold" size="sm">{result.difficulty} TIER</Badge>
                {result.subject && <Badge variant="blue" size="sm">{result.subject.toUpperCase()}</Badge>}
              </div>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-white">
                {result.title || result.topic}
              </h2>
              {result.summary && (
                <p className="text-xs sm:text-sm text-slate-300 font-outfit mt-1.5 leading-relaxed">
                  {result.summary}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                +50 XP AWARDED
              </span>
            </div>
          </div>

          {/* Dossier Sections */}
          <div className="space-y-4">
            {result.sections.map((section, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <h4 className="text-sm font-orbitron font-bold text-cyan-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-cyan-400" />
                  <span>{section.title}</span>
                </h4>
                <p className="text-sm text-slate-300 font-outfit leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Examples (if present) */}
          {Array.isArray(result.examples) && result.examples.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-3">
              <h4 className="text-xs font-orbitron font-bold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>WORKED EXAMPLES & CASE STUDIES</span>
              </h4>
              <div className="space-y-2">
                {result.examples.map((ex, idx) => (
                  <div key={idx} className="text-xs text-slate-300 font-outfit leading-relaxed">
                    <span className="font-bold text-blue-300">{ex.title}: </span>
                    <span className="whitespace-pre-line">{ex.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes & Exam Tips */}
          {((Array.isArray(result.commonMistakes) && result.commonMistakes.length > 0) ||
            (Array.isArray(result.examTips) && result.examTips.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.commonMistakes?.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <h4 className="text-xs font-orbitron font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>COMMON TRAPS & MISCONCEPTIONS</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-outfit">
                    {result.commonMistakes.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.examTips?.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="text-xs font-orbitron font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>EXAM STRATEGY & HIGH-YIELD TIPS</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-outfit">
                    {result.examTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2.5">
              <EnergyButton
                variant="primary"
                size="md"
                icon={savedSuccess ? CheckCircle2 : BookmarkPlus}
                disabled={savedSuccess}
              >
                {savedSuccess ? 'Saved to Knowledge Vault' : 'Save to Knowledge Vault'}
              </EnergyButton>

              <EnergyButton
                variant="danger"
                size="md"
                icon={Swords}
                onClick={() => navigate('/battle-arena', { state: { topic: result.topic } })}
              >
                Generate Battle
              </EnergyButton>
            </div>

            <button
              onClick={() => navigate('/saturday', { state: { initialPrompt: `Explain more about ${result.topic}`, topic: result.topic, source: 'knowledge-lab' } })}
              className="inline-flex items-center gap-2 text-xs font-orbitron font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask S.A.T.U.R.D.A.Y. Follow-up</span>
            </button>
          </div>
        </HolographicCard>
      )}
    </div>
  );
};

