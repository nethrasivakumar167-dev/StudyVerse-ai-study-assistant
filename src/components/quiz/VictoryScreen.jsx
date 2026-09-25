import React from 'react';
import { HolographicCard } from '../ui/HolographicCard';
import { EnergyButton } from '../ui/EnergyButton';
import { ExportDropdown } from '../ui/ExportDropdown';
import { Badge } from '../ui/Badge';
import { quizService } from '../../services/quizService';
import { Trophy, Sparkles, Zap, RotateCcw, ArrowRight, FileText, FileJson } from 'lucide-react';

export const VictoryScreen = ({
  results,
  quizData,
  onPlayAgain,
  onGoToDashboard
}) => {
  const { correctCount, totalQuestions, totalXpEarned, accuracy, rankAchieved, bonusMessage } = results;

  const handleExportQuiz = async (format) => {
    const quizId = quizData?.quizId || quizData?.id || quizData?._id;
    await quizService.exportQuiz(quizId, format, quizData);
  };

  return (
    <div className="max-w-xl mx-auto text-center animate-fade-in">
      <HolographicCard glowColor="gold" className="p-8 md:p-10 relative overflow-hidden">
        {/* Glow Core */}
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 via-red-500 to-yellow-300 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.6)] animate-pulse">
          <Trophy className="w-12 h-12 text-slate-950" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400 text-xs font-orbitron uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VICTORY PROTOCOL ACHIEVED</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-red-400 mb-2">
          MISSION COMPLETE
        </h2>

        <p className="text-sm text-slate-400 font-outfit mb-6">
          {bonusMessage || 'Outstanding combat performance. Your knowledge power has leveled up.'}
        </p>

        {/* Score Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8">
          <div>
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">Score</div>
            <div className="text-2xl font-orbitron font-extrabold text-white">
              {correctCount} / {totalQuestions}
            </div>
          </div>

          <div className="border-x border-slate-800">
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">XP GAINED</div>
            <div className="text-2xl font-orbitron font-extrabold text-amber-300 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>+{totalXpEarned}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-rajdhani uppercase text-slate-400 font-semibold">ACCURACY</div>
            <div className="text-2xl font-orbitron font-extrabold text-emerald-400">
              {accuracy}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-rajdhani text-slate-400 uppercase">Power Level Rank:</span>
          <Badge variant="gold" size="md">
            {rankAchieved} RANK
          </Badge>
        </div>

        {/* Export Quiz Intel */}
        {quizData && (
          <div className="mb-8 flex items-center justify-center">
            <ExportDropdown
              label="Export Quiz Dossier"
              size="md"
              variant="outline"
              options={[
                { label: 'PDF Combat Dossier', format: 'pdf', ext: '.pdf', icon: FileText },
                { label: 'JSON Dataset', format: 'json', ext: '.json', icon: FileJson }
              ]}
              onExport={handleExportQuiz}
            />
          </div>
        )}

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <EnergyButton
            variant="tactical"
            size="md"
            icon={RotateCcw}
            onClick={onPlayAgain}
            className="w-full sm:w-auto"
          >
            Play Again
          </EnergyButton>

          <EnergyButton
            variant="primary"
            size="lg"
            icon={ArrowRight}
            onClick={onGoToDashboard}
            className="w-full sm:w-auto"
          >
            Return to Mission Control
          </EnergyButton>
        </div>
      </HolographicCard>
    </div>
  );
};

