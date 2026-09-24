import React, { useState, useEffect } from 'react';
import { useHero } from '../context/HeroContext';
import { missionService } from '../services/missionService';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  CalendarDays,
  Target,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  ListTodo,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

const defaultDeadline = () => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

// Soonest deadline first; missions without a deadline last (mirrors the API).
const sortMissions = (list) =>
  [...list].sort((a, b) => {
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });

const deadlineInfo = (iso) => {
  if (!iso) return null;
  const due = new Date(new Date(iso).toDateString());
  const today = new Date(new Date().toDateString());
  const days = Math.round((due - today) / 86400000);
  const dateLabel = new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
  if (days < 0)
    return { label: `Overdue ${-days}d`, dateLabel, cls: 'bg-red-500/10 border-red-400/40 text-red-300' };
  if (days === 0) return { label: 'Due today', dateLabel, cls: 'bg-amber-500/10 border-amber-400/40 text-amber-300' };
  if (days === 1) return { label: 'Due tomorrow', dateLabel, cls: 'bg-amber-500/10 border-amber-400/40 text-amber-300' };
  return { label: `In ${days}d`, dateLabel, cls: 'bg-slate-800 border-slate-700 text-slate-300' };
};

export const MissionPlanner = () => {
  const { addXp, refreshDailyMission } = useHero();

  const [goal, setGoal] = useState('');
  const [topic, setTopic] = useState('');
  const [availableHours, setAvailableHours] = useState(2);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [protocol, setProtocol] = useState(null);
  const [protocolError, setProtocolError] = useState(null);

  // Mission to-do list state
  const [missions, setMissions] = useState([]);
  const [mTitle, setMTitle] = useState('');
  const [mNote, setMNote] = useState('');
  const [mDeadline, setMDeadline] = useState(defaultDeadline);
  const [isAdding, setIsAdding] = useState(false);
  const [missionError, setMissionError] = useState(null);
  const [confirmMission, setConfirmMission] = useState(null); // { mission, mode: 'done' | 'remove' }

  // Restore saved missions + last generated plan (plan storage requirement).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [list, plan] = await Promise.all([
        missionService.getMissions(),
        missionService.getSavedPlan()
      ]);
      if (cancelled) return;
      if (Array.isArray(list)) setMissions(sortMissions(list));
      if (plan) setProtocol(plan);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGenerateProtocol = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setIsGenerating(true);
    setProtocolError(null);

    try {
      const data = await missionService.generateProtocol({
        goal,
        topic: topic.trim(),
        availableHours,
        deadlineDays
      });
      setProtocol(data);
      if (typeof refreshDailyMission === 'function') {
        await refreshDailyMission();
      }
      addXp(75, `Training Protocol Initialized for ${topic.trim()}`);
    } catch (err) {
      console.error(err);
      setProtocolError(err.response?.data?.message || err.message || 'Study plan generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddMission = async (e) => {
    e.preventDefault();
    if (!mTitle.trim() || isAdding) return;
    setIsAdding(true);
    setMissionError(null);
    try {
      const created = await missionService.addMission({
        title: mTitle.trim(),
        note: mNote.trim(),
        deadline: mDeadline || null
      });
      setMissions((prev) => sortMissions([...prev, created]));
      setMTitle('');
      setMNote('');
      setMDeadline(defaultDeadline());
      addXp(10, 'Mission Logged');
    } catch {
      setMissionError('Could not save the mission — check the connection and retry.');
    } finally {
      setIsAdding(false);
    }
  };

  // Mark done -> confirm -> DELETE (or plain removal -> confirm -> DELETE).
  const handleConfirmMission = async () => {
    const target = confirmMission;
    setConfirmMission(null);
    if (!target) return;
    await missionService.removeMission(target.mission.id);
    setMissions((prev) => prev.filter((m) => m.id !== target.mission.id));
    if (target.mode === 'done') {
      addXp(30, `Mission Cleared: ${target.mission.title.slice(0, 40)}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-orbitron font-bold uppercase mb-2">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>STRATEGIC STUDY PROTOCOLS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-orbitron font-black text-white uppercase tracking-tight">
          MISSION PLANNER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-outfit mt-1">
          Formulate a multi-day superhero study protocol for any topic tailored to your target exam and daily bandwidth.
        </p>
      </div>

      {/* Mission To-Do List */}
      <HolographicCard glowColor="gold" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-orbitron font-bold text-white uppercase flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-amber-400" />
            <span>Mission To-Do List</span>
          </h3>
          <Badge variant="gold" size="md">
            {missions.length} ACTIVE
          </Badge>
        </div>

        {/* Add mission form */}
        <form onSubmit={handleAddMission} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Mission Title
              </label>
              <input
                type="text"
                value={mTitle}
                onChange={(e) => setMTitle(e.target.value)}
                placeholder="e.g. Revise DB normalization"
                maxLength={120}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-outfit text-sm outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Deadline
              </label>
              <input
                type="date"
                value={mDeadline}
                onChange={(e) => setMDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-outfit text-sm outline-none transition [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Short Note
              </label>
              <input
                type="text"
                value={mNote}
                onChange={(e) => setMNote(e.target.value)}
                placeholder="e.g. Focus on 3NF decompositions"
                maxLength={280}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-outfit text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-red-400 font-outfit">{missionError || ''}</span>
            <EnergyButton type="submit" variant="primary" size="md" icon={Plus} disabled={isAdding || !mTitle.trim()}>
              {isAdding ? 'Saving...' : 'Add Mission (+10 XP)'}
            </EnergyButton>
          </div>
        </form>

        {/* Mission list */}
        <div className="mt-5 space-y-2.5">
          {missions.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500 font-outfit border border-dashed border-slate-800 rounded-xl">
              No missions yet — add your first to-do above. Tick a mission when done; it asks you to confirm,
              then clears it from the list.
            </div>
          )}

          {missions.map((m) => {
            const dl = deadlineInfo(m.deadline);
            return (
              <div
                key={m.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition group"
              >
                <button
                  type="button"
                  onClick={() => setConfirmMission({ mission: m, mode: 'done' })}
                  title="Mark as done"
                  className="mt-0.5 p-0.5 rounded-full cursor-pointer shrink-0"
                >
                  <span className="block w-5 h-5 rounded-full border-2 border-slate-600 group-hover:border-emerald-400 transition flex items-center justify-center">
                    <CheckCircle2 className="w-0 h-0 group-hover:w-3.5 group-hover:h-3.5 text-emerald-400 transition-all" />
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-outfit font-semibold text-white truncate">{m.title}</span>
                    {dl && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${dl.cls}`}
                      >
                        <Clock className="w-3 h-3" />
                        {dl.label} · {dl.dateLabel}
                      </span>
                    )}
                  </div>
                  {m.note && <p className="text-xs text-slate-400 font-outfit mt-1 break-words">{m.note}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmMission({ mission: m, mode: 'remove' })}
                  title="Remove mission"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </HolographicCard>

      {/* Confirm dialog: mark done -> confirm -> DELETE */}
      <Modal
        isOpen={!!confirmMission}
        onClose={() => setConfirmMission(null)}
        title={confirmMission?.mode === 'done' ? 'Confirm: Mission Complete' : 'Confirm: Remove Mission'}
        maxWidth="max-w-md"
      >
        <p className="text-sm text-slate-300 font-outfit">
          {confirmMission?.mode === 'done'
            ? 'Mark this mission as done?'
            : 'Remove this mission from your list?'}{' '}
          <span className="text-white font-semibold">"{confirmMission?.mission?.title}"</span>
        </p>
        <p className="text-xs text-slate-500 font-outfit mt-2">
          It will be deleted from your to-do list permanently.
          {confirmMission?.mode === 'done' && ' You will earn +30 XP.'}
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setConfirmMission(null)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-rajdhani font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
          <EnergyButton onClick={handleConfirmMission} variant="primary" size="md" icon={CheckCircle2}>
            {confirmMission?.mode === 'done' ? 'Confirm & Delete (+30 XP)' : 'Confirm & Delete'}
          </EnergyButton>
        </div>
      </Modal>

      {/* Plan Builder Form */}
      <HolographicCard glowColor="cyan" className="p-6">
        <h3 className="text-lg font-orbitron font-bold text-white uppercase mb-4 flex items-center gap-2">
          <span>CONFIGURE TRAINING PROTOCOL</span>
        </h3>

        <form onSubmit={handleGenerateProtocol} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Target Topic / Study Domain
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Operating Systems, Quantum Physics, React, Calculus..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white font-outfit text-sm outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Ultimate Mission Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master for Finals, Prepare for Tech Interview"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white font-outfit text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Daily Study Bandwidth: {availableHours} Hours / Day
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5 tracking-wider">
                Protocol Duration: {deadlineDays} Days
              </label>
              <input
                type="range"
                min="3"
                max="14"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <EnergyButton
              type="submit"
              variant="secondary"
              size="lg"
              icon={Target}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? 'Generating Strategy...' : 'Build Training Protocol (+75 XP)'}
            </EnergyButton>
          </div>
        </form>
      </HolographicCard>

      {/* Protocol Error State with Retry */}
      {protocolError && !isGenerating && (
        <HolographicCard glowColor="red" className="p-6 sm:p-8 animate-fade-in border-red-500/40 bg-red-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-red-300 uppercase">
                  PLAN GENERATION INTERRUPTED
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-outfit mt-1 leading-relaxed">
                  {protocolError}
                </p>
              </div>
            </div>

            <EnergyButton
              variant="primary"
              size="md"
              icon={RotateCcw}
              onClick={() => handleGenerateProtocol()}
            >
              Retry Generation
            </EnergyButton>
          </div>
        </HolographicCard>
      )}

      {/* Generated Protocol Roadmap */}
      {protocol && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <div className="text-[10px] font-orbitron text-amber-400 uppercase tracking-wider">
                ACTIVE PROTOCOL · DAY 1 SYNCED TO MISSION CONTROL
              </div>
              <h2 className="text-xl font-orbitron font-extrabold text-white">
                {protocol.protocolName}
              </h2>
              {protocol.summary && (
                <p className="text-xs text-slate-400 font-outfit mt-1 max-w-2xl leading-relaxed">
                  {protocol.summary}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="gold" size="md">
                TOTAL XP POOL: +{protocol.estimatedXpPool} XP
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {protocol.days.map((day) => (
              <HolographicCard
                key={day.day}
                glowColor={day.completed ? 'cyan' : 'gold'}
                className="p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm border ${
                        day.completed
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-amber-400'
                      }`}
                    >
                      D{day.day}
                    </div>

                    <div>
                      <h3 className="text-base font-orbitron font-bold text-white">
                        {day.title}
                      </h3>
                      {day.focus && (
                        <p className="text-xs text-amber-300/80 font-outfit mt-0.5">
                          {day.focus}
                        </p>
                      )}
                      <div className="text-xs text-slate-400 font-outfit flex items-center gap-2 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Duration: {day.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                      +{day.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Objectives */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {day.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-outfit">
                      <CheckCircle2 className={`w-4 h-4 ${day.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
