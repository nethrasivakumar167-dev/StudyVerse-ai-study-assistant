import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHero } from '../../context/HeroContext';
import { missionService } from '../../services/missionService';
import { HolographicCard } from '../ui/HolographicCard';
import { EnergyButton } from '../ui/EnergyButton';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  PlusCircle,
  Sliders,
  Trash2,
  Clock,
  CalendarDays
} from 'lucide-react';

export const DailyMissionCard = () => {
  const { dailyMission, toggleMissionTask, clearDailyMission, refreshDailyMission, addXp } = useHero();
  const navigate = useNavigate();

  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [hours, setHours] = useState(2);
  const [days, setDays] = useState(7);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleOpenModify = () => {
    setHours(2);
    setDays(7);
    setErrorMsg(null);
    setIsModifyOpen(true);
  };

  const handleSaveModify = async (e) => {
    if (e) e.preventDefault();
    if (!dailyMission?.topic) return;
    setIsSaving(true);
    setErrorMsg(null);

    try {
      await missionService.generateProtocol({
        topic: dailyMission.topic,
        availableHours: hours,
        deadlineDays: days,
        goal: `Master ${dailyMission.topic} across ${days} days`
      });
      await refreshDailyMission();
      addXp(40, `Study Protocol Adjusted: ${hours}h/day, ${days} days`);
      setIsModifyOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update protocol');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    await clearDailyMission();
    setIsDeleteOpen(false);
  };

  if (!dailyMission || !Array.isArray(dailyMission.tasks) || dailyMission.tasks.length === 0) {
    return (
      <HolographicCard glowColor="red" className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" />
            <span className="text-xs font-orbitron font-bold text-red-400 uppercase tracking-widest">
              TODAY'S MISSION
            </span>
          </div>
          <Badge variant="red" size="sm">INACTIVE</Badge>
        </div>
        <h3 className="text-2xl font-orbitron font-extrabold text-white mb-2">
          NO ACTIVE MISSION SET
        </h3>
        <p className="text-xs text-slate-400 font-outfit mb-6 max-w-xl leading-relaxed">
          You have no active study missions scheduled for today. Build a personalized multi-day training protocol in Mission Planner or jump straight into the Battle Arena to level up!
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80">
          <EnergyButton
            variant="tactical"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/mission-planner')}
          >
            Create Training Protocol
          </EnergyButton>
          <EnergyButton
            variant="primary"
            size="md"
            icon={ArrowRight}
            onClick={() => navigate('/battle-arena')}
          >
            Launch Battle Arena
          </EnergyButton>
        </div>
      </HolographicCard>
    );
  }

  return (
    <>
      <HolographicCard glowColor="red" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-orbitron font-bold text-red-400 uppercase tracking-widest">
                TODAY'S MISSION
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white">
              {dailyMission.title}
            </h3>
            <p className="text-xs text-slate-400 font-outfit mt-0.5">
              Topic: <span className="text-amber-300 font-semibold">{dailyMission.topic}</span>
            </p>
          </div>

          <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/mission-planner')}
                title="Add New Study Plan (Mission Planner)"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-orbitron font-bold transition border border-slate-700 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>ADD</span>
              </button>

              <button
                type="button"
                onClick={handleOpenModify}
                title="Modify Time per Day & Number of Days"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 text-xs font-orbitron font-bold transition border border-slate-700 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>MODIFY</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                title="Delete Active Study Mission"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs transition border border-slate-700 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <Badge variant="gold" size="md" className="text-xs font-orbitron">
              +{dailyMission.rewardXp} XP
            </Badge>
          </div>
        </div>

        {/* Checklist Tasks */}
        <div className="space-y-2.5 my-5">
          {dailyMission.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleMissionTask(task.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                task.completed
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                )}
                <span className={`text-sm font-outfit ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.label}
                </span>
              </div>
              {task.completed && (
                <span className="text-[10px] font-orbitron font-bold text-emerald-400 uppercase">
                  DONE
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {dailyMission.isCompleted
                ? 'All objectives achieved! +250 XP Credited.'
                : `${dailyMission.tasks.filter((t) => t.completed).length}/${dailyMission.tasks.length} Objectives Cleared`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <EnergyButton
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => navigate('/battle-arena')}
            >
              {dailyMission.isCompleted ? 'Battle Again' : 'Start Mission'}
            </EnergyButton>
          </div>
        </div>
      </HolographicCard>

      {/* Modify Protocol Modal */}
      <Modal
        isOpen={isModifyOpen}
        onClose={() => setIsModifyOpen(false)}
        title="MODIFY STUDY PROTOCOL"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveModify} className="space-y-4">
          <p className="text-xs text-slate-400 font-outfit">
            Adjust your daily bandwidth and protocol duration for{' '}
            <span className="text-amber-300 font-semibold">{dailyMission.topic}</span>. The AI will recalculate and update your active mission objectives.
          </p>

          <div className="space-y-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Daily Study Bandwidth</span>
                </span>
                <span className="text-cyan-400 font-mono text-sm">{hours} Hours / Day</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>1h (60m)</span>
                <span>3h (180m)</span>
                <span>6h (360m)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-rajdhani font-bold text-slate-300 uppercase mb-1.5">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                  <span>Protocol Duration</span>
                </span>
                <span className="text-amber-400 font-mono text-sm">{days} Days</span>
              </div>
              <input
                type="range"
                min="3"
                max="14"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>3 Days</span>
                <span>7 Days</span>
                <span>14 Days</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 font-outfit p-2 rounded-lg bg-red-500/10 border border-red-500/30">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModifyOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-rajdhani font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Cancel
            </button>
            <EnergyButton
              type="submit"
              variant="secondary"
              size="md"
              icon={Sliders}
              disabled={isSaving}
            >
              {isSaving ? 'Recalculating...' : 'Save & Update Protocol (+40 XP)'}
            </EnergyButton>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="CLEAR TODAY'S MISSION"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-slate-300 font-outfit">
          Are you sure you want to remove today's active study mission for{' '}
          <span className="text-white font-semibold">"{dailyMission.topic}"</span>?
        </p>
        <p className="text-xs text-slate-500 font-outfit mt-2">
          This will clear the scheduled objectives from Mission Control. You can configure a new protocol at any time in Mission Planner.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-sm font-rajdhani font-bold uppercase tracking-wider transition cursor-pointer"
          >
            Cancel
          </button>
          <EnergyButton
            type="button"
            onClick={handleConfirmDelete}
            variant="danger"
            size="md"
            icon={Trash2}
          >
            Clear Mission
          </EnergyButton>
        </div>
      </Modal>
    </>
  );
};
