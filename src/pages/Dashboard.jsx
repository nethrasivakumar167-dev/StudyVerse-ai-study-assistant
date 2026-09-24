import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { quizService } from '../services/quizService';
import { notesService } from '../services/notesService';
import { timeAgo } from '../utils/time';
import { PowerLevelCard } from '../components/dashboard/PowerLevelCard';
import { DailyMissionCard } from '../components/dashboard/DailyMissionCard';
import { StreakCard } from '../components/dashboard/StreakCard';
import { SaturdayQuickCard } from '../components/dashboard/SaturdayQuickCard';
import { HolographicCard } from '../components/ui/HolographicCard';
import { Badge } from '../components/ui/Badge';
import { EnergyButton } from '../components/ui/EnergyButton';
import {
  Sparkles,
  Bot,
  Swords,
  ShieldCheck,
  Target,
  Flame,
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';

const READINESS_COLORS = ['bg-cyan-400', 'bg-amber-400', 'bg-red-500', 'bg-purple-400'];

export const Dashboard = () => {
  const { profile, heroClass } = useHero();
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [readiness, setReadiness] = useState([]);

  // Real, per-user stats: submitted quizzes + saved notes (empty for a new user).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [history, notes] = await Promise.all([quizService.getHistory(), notesService.getNotes()]);
      if (cancelled) return;

      const quizLogs = (history || []).map((h) => ({
        kind: 'quiz',
        title: `${h.topic} Battle Completed`,
        topic: h.topic,
        time: timeAgo(h.createdAt),
        sortAt: h.createdAt ? new Date(h.createdAt).getTime() : 0,
        score: `${h.score}/${h.totalQuestions} (${h.accuracy}%)`
      }));
      const noteLogs = (notes || []).map((n) => ({
        kind: 'note',
        title: `${n.title || n.topic} Note Synthesized`,
        topic: n.topic,
        time: n.createdDate || (n.createdAt ? timeAgo(n.createdAt) : 'Recently'),
        sortAt: n.createdAt ? new Date(n.createdAt).getTime() : 0,
        score: 'Synthesis'
      }));
      setRecent(
        [...quizLogs, ...noteLogs]
          .sort((a, b) => b.sortAt - a.sortAt)
          .slice(0, 4)
      );

      // Average accuracy per topic from this user's own quiz history.
      const byTopic = {};
      (history || []).forEach((h) => {
        if (!byTopic[h.topic]) byTopic[h.topic] = [];
        byTopic[h.topic].push(h.accuracy);
      });
      setReadiness(
        Object.entries(byTopic)
          .map(([topic, accs], i) => {
            const pct = Math.round(accs.reduce((a, b) => a + b, 0) / accs.length);
            return {
              topic,
              pct,
              level: `${pct}% Combat Ready`,
              color: READINESS_COLORS[i % READINESS_COLORS.length]
            };
          })
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 4)
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const superheroName = profile?.superheroName || 'HERO';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-orbitron font-bold uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>HQ MISSION CONTROL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 uppercase tracking-tight">
            WELCOME BACK, {superheroName}.
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1 flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>S.A.T.U.R.D.A.Y. has prepared your next training mission.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <EnergyButton
            variant="primary"
            size="md"
            icon={Swords}
            onClick={() => navigate('/battle-arena')}
          >
            Launch Battle Arena
          </EnergyButton>
        </div>
      </div>

      {/* Main Stats / Power Level Section */}
      <PowerLevelCard />

      {/* Core Grid: Daily Mission + Streak Multiplier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DailyMissionCard />
        </div>
        <div className="lg:col-span-4">
          <StreakCard />
        </div>
      </div>

      {/* S.A.T.U.R.D.A.Y. AI Quick Command Hub */}
      <SaturdayQuickCard />

      {/* Recent Combat Missions & Academic Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Missions Feed */}
        <HolographicCard glowColor="blue" className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>RECENT ACADEMIC ENGAGEMENTS</span>
            </h3>
            <Badge variant="cyan" size="sm">LOGS</Badge>
          </div>

          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-xs text-slate-500 font-outfit text-center py-6 border border-dashed border-slate-800 rounded-xl">
                No activity yet — generate your first study note from Knowledge Hub or enter the
                Battle Arena.
              </p>
            )}
            {recent.map((log) => (
              <div
                key={`${log.kind}-${log.sortAt}-${log.title}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    {log.kind === 'quiz' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-orbitron font-bold text-slate-100">
                      {log.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-outfit">
                      Topic: <span className="text-slate-300 font-medium">{log.topic}</span> • {log.time}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-emerald-400">
                    {log.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </HolographicCard>

        {/* Academic Readiness Telemetry */}
        <HolographicCard glowColor="purple" className="p-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-base font-orbitron font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span>TOPIC COMBAT READINESS</span>
            </h3>
            <Badge variant="purple" size="sm">TELEMETRY</Badge>
          </div>

          <div className="space-y-4">
            {readiness.length === 0 && (
              <p className="text-xs text-slate-500 font-outfit text-center py-6 border border-dashed border-slate-800 rounded-xl">
                No quiz data yet — your topic readiness appears after your first battle.
              </p>
            )}
            {readiness.map((sub) => (
              <div key={sub.topic} className="space-y-1">
                <div className="flex justify-between text-xs font-rajdhani font-semibold">
                  <span className="text-slate-300">{sub.topic}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{sub.level}</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${sub.color}`}
                    style={{ width: `${sub.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </HolographicCard>
      </div>
    </div>
  );
};
