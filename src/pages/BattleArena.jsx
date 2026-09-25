import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHero } from '../context/HeroContext';
import { useSound } from '../context/SoundContext';
import { quizService } from '../services/quizService';
import { SAMPLE_TOPICS } from '../data/mockData';
import { QuizQuestion } from '../components/quiz/QuizQuestion';
import { ComboMeter } from '../components/quiz/ComboMeter';
import { VictoryScreen } from '../components/quiz/VictoryScreen';
import { HolographicCard } from '../components/ui/HolographicCard';
import { EnergyButton } from '../components/ui/EnergyButton';
import { ExportDropdown } from '../components/ui/ExportDropdown';
import {
  Swords,
  Timer,
  ArrowRight,
  Shield,
  RotateCcw,
  FileText,
  FileJson
} from 'lucide-react';

export const BattleArena = () => {
  const { addXp } = useHero();
  const { playSfx } = useSound();
  const location = useLocation();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState(() => (location.state?.quizData ? 'BATTLE' : 'SETUP'));
  const [topic, setTopic] = useState(() => location.state?.quizData?.topic || location.state?.topic || 'Process Scheduling');
  const [difficulty, setDifficulty] = useState(() => location.state?.quizData?.difficulty || location.state?.difficulty || 'HERO');
  const [questionCount, setQuestionCount] = useState(() => location.state?.quizData?.totalQuestions || location.state?.count || 5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState(() => location.state?.quizData || null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [victoryData, setVictoryData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // Sync incoming navigation quizData
  useEffect(() => {
    if (location.state?.quizData) {
      const qData = location.state.quizData;
      setQuizData(qData);
      setTopic(qData.topic || 'Document Intel');
      setDifficulty(qData.difficulty || 'HERO');
      setQuestionCount(qData.totalQuestions || qData.questions?.length || 5);
      setGameState('BATTLE');
      setCurrentIndex(0);
      setCorrectCount(0);
      setCombo(0);
      setEarnedXp(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
    }
  }, [location.state]);

  const handleSubmitAnswer = (chosenIdx = selectedAnswer) => {
    if (isAnswerSubmitted || !quizData) return;
    setIsAnswerSubmitted(true);

    const currentQ = quizData.questions[currentIndex];
    const isCorrect = chosenIdx === currentQ.correctAnswer;

    if (isCorrect) {
      playSfx('success');
      const comboMult = combo >= 4 ? 2.5 : combo >= 2 ? 1.5 : 1.0;
      const qXp = Math.round(currentQ.xp * comboMult);
      setCorrectCount((prev) => prev + 1);
      setCombo((prev) => prev + 1);
      setEarnedXp((prev) => prev + qXp);
      addXp(qXp, `Battle Hit! ${combo > 1 ? `${combo}x Combo` : ''}`);
    } else {
      setCombo(0);
    }
  };

  // Timer countdown
  useEffect(() => {
    let timer;
    if (gameState === 'BATTLE' && !isAnswerSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isAnswerSubmitted && gameState === 'BATTLE') {
      handleSubmitAnswer(-1); // Time out
    }
    return () => clearInterval(timer);
  }, [gameState, isAnswerSubmitted, timeLeft, handleSubmitAnswer]);

  const handleStartBattle = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      playSfx('energy');
      const data = await quizService.generateQuiz({ topic: topic.trim(), difficulty, count: questionCount });
      setQuizData(data);
      setCurrentIndex(0);
      setCorrectCount(0);
      setCombo(0);
      setEarnedXp(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
      setGameState('BATTLE');
    } catch (err) {
      console.error('Failed to start battle:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Quiz generation is temporarily unavailable. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleAnswerSelect = (idx) => {
    setSelectedAnswer(idx);
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < quizData.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
    } else {
      // Complete Mission
      const totalBonusXp = earnedXp + 100; // Completion reward
      addXp(100, 'Battle Arena Mission Victory Bonus');
      playSfx('levelup');

      const results = await quizService.submitQuiz({
        correctCount,
        totalQuestions: quizData.questions.length,
        totalXpEarned: totalBonusXp,
        topic,
        difficulty
      });

      setVictoryData(results);
      setGameState('VICTORY');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Setup Screen */}
      {gameState === 'SETUP' && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-orbitron font-bold uppercase mb-3 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Swords className="w-4 h-4" />
              <span>SUPERHERO COMBAT SIMULATOR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-white uppercase tracking-tight">
              BATTLE ARENA
            </h1>

            <p className="text-sm text-slate-400 font-outfit mt-2">
              "Knowledge is your weapon. Let's see what you've learned."
            </p>
          </div>

          <HolographicCard glowColor="red" className="p-6 sm:p-8">
            <h3 className="text-lg font-orbitron font-bold text-white uppercase mb-4">
              CONFIGURE COMBAT PARAMETERS
            </h3>

            <div className="space-y-5">
              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between gap-3 text-sm font-outfit shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartBattle}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/50 text-rose-200 font-orbitron text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Topic Input */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Target Topic / Battle Domain
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Process Scheduling, French Revolution, Organic Chemistry, Dynamic Programming..."
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-white font-outfit text-base outline-none transition"
                  required
                />

                {/* Suggestions */}
                <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-rajdhani font-semibold text-slate-400 uppercase mr-1">
                    Quick Pick:
                  </span>
                  {SAMPLE_TOPICS.slice(0, 5).map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setTopic(sample)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/40 text-[11px] font-outfit text-slate-300 hover:text-red-300 transition cursor-pointer"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Tiers */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Combat Difficulty Tier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'RECRUIT', label: 'Beginner (Recruit)' },
                    { id: 'HERO', label: 'Intermediate (Hero)' },
                    { id: 'SUPERHERO', label: 'Advanced (Superhero)' },
                    { id: 'LEGENDARY', label: 'Master (Legendary)' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setDifficulty(tier.id)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer font-orbitron text-xs font-bold ${
                        difficulty === tier.id
                          ? 'bg-red-500/20 border-red-500 text-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count Selection */}
              <div>
                <label className="block text-xs font-rajdhani font-bold text-slate-300 uppercase mb-2 tracking-wider">
                  Target Question Pool
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-orbitron text-xs font-bold ${
                        questionCount === num
                          ? 'bg-red-500/20 border-red-500 text-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {num} QUESTIONS
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs font-mono text-slate-400">
                  ESTIMATED XP POOL: <strong className="text-amber-300">+350 XP</strong>
                </div>

                <EnergyButton
                  variant="primary"
                  size="lg"
                  icon={Swords}
                  onClick={handleStartBattle}
                  disabled={!topic.trim() || isLoading}
                >
                  {isLoading ? 'Initializing Combat...' : 'Enter Battle Arena'}
                </EnergyButton>

              </div>
            </div>
          </HolographicCard>
        </div>
      )}

      {/* Active Battle Screen */}
      {gameState === 'BATTLE' && quizData && (
        <div className="space-y-6">
          {/* Live Battle Top Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl flex items-center gap-1.5 font-mono font-bold text-sm ${
                timeLeft <= 10 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-200'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
              <ComboMeter combo={combo} />
            </div>

            <div className="flex items-center gap-3">
              <ExportDropdown
                label="Export Quiz"
                size="sm"
                variant="tactical"
                options={[
                  { label: 'PDF Combat Dossier', format: 'pdf', ext: '.pdf', icon: FileText },
                  { label: 'JSON Dataset', format: 'json', ext: '.json', icon: FileJson }
                ]}
                onExport={(format) => {
                  const qId = quizData.quizId || quizData.id || quizData._id;
                  return quizService.exportQuiz(qId, format, quizData);
                }}
              />

              <div className="text-right">
                <div className="text-[10px] font-rajdhani text-slate-400 uppercase">XP GAINED</div>
                <div className="text-sm font-mono font-bold text-amber-300">+{earnedXp} XP</div>
              </div>
            </div>
          </div>

          {/* Current Question Component */}
          <QuizQuestion
            question={quizData.questions[currentIndex]}
            questionIndex={currentIndex}
            totalQuestions={quizData.questions.length}
            onAnswer={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
            isAnswerSubmitted={isAnswerSubmitted}
          />

          {/* Action Footer */}
          <div className="flex justify-end gap-3 max-w-2xl mx-auto">
            {!isAnswerSubmitted ? (
              <EnergyButton
                variant="primary"
                size="md"
                onClick={() => handleSubmitAnswer()}
                disabled={selectedAnswer === null}
              >
                Confirm Strike (Submit)
              </EnergyButton>
            ) : (
              <EnergyButton
                variant="primary"
                size="md"
                icon={ArrowRight}
                onClick={handleNextQuestion}
              >
                {currentIndex + 1 < quizData.questions.length ? 'Next Combat Objective' : 'Complete Mission'}
              </EnergyButton>
            )}
          </div>
        </div>
      )}

      {/* Victory Celebration Screen */}
      {gameState === 'VICTORY' && victoryData && (
        <VictoryScreen
          results={victoryData}
          quizData={quizData}
          onPlayAgain={() => setGameState('SETUP')}
          onGoToDashboard={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
};
