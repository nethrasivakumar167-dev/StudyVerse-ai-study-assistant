import React, { useState } from 'react';
import { HolographicCard } from '../ui/HolographicCard';
import { EnergyButton } from '../ui/EnergyButton';
import { Badge } from '../ui/Badge';
import { useSound } from '../../context/SoundContext';
import { CheckCircle2, XCircle, Zap, HelpCircle, ArrowRight } from 'lucide-react';

export const QuizQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  isAnswerSubmitted
}) => {
  const { playSfx } = useSound();
  const [localSelected, setLocalSelected] = useState(null);

  const letters = ['A', 'B', 'C', 'D'];

  const handleSelect = (idx) => {
    if (isAnswerSubmitted) return;
    playSfx('tap');
    setLocalSelected(idx);
    onAnswer(idx);
  };

  const activeAnswer = isAnswerSubmitted ? selectedAnswer : localSelected;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Telemetry */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="red" size="md">
            MISSION {String(questionIndex + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs font-orbitron text-amber-300">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>XP AVAILABLE: +{question.xp}</span>
        </div>
      </div>

      {/* Main Combat Question Card */}
      <HolographicCard glowColor="red" className="p-6 md:p-8 mb-6">
        <div className="text-[10px] font-orbitron text-slate-400 tracking-widest uppercase mb-2">
          QUESTION DOSSIER
        </div>
        <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white leading-snug mb-8">
          {question.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isChosen = activeAnswer === idx;
            const isCorrect = idx === question.correctAnswer;

            let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-amber-400/50 hover:bg-slate-800/80';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
              } else if (isChosen && !isCorrect) {
                optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            } else if (isChosen) {
              optionStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left font-outfit transition duration-200 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs shrink-0 border ${
                    isChosen
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {letters[idx]}
                  </span>
                  <span className="text-sm md:text-base">{option}</span>
                </div>

                {isAnswerSubmitted && (
                  <div>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation revealed on submit */}
        {isAnswerSubmitted && (
          <div className="mt-6 pt-5 border-t border-slate-800/90 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>S.A.T.U.R.D.A.Y. INTEL DEBRIEF</span>
            </div>
            <p className="text-sm text-slate-300 font-outfit leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              {question.explanation}
            </p>
          </div>
        )}
      </HolographicCard>
    </div>
  );
};
