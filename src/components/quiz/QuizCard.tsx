import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (scorePercent: number) => void;
  xpReward: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({ questions, onComplete, xpReward }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setHasSubmitted(true);
    if (selectedAnswer === currentQ.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasSubmitted(false);
    } else {
      const finalScore = Math.round(((correctCount + (selectedAnswer === currentQ.correctIndex ? 1 : 0)) / questions.length) * 100);
      setIsFinished(true);
      onComplete(finalScore);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setHasSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const passed = finalScore >= 50;
    return (
      <div className="bg-[#0B101D] border border-purple-500/30 rounded-xl p-6 text-center my-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          {passed ? 'Knowledge Check Completed!' : 'Knowledge Check Needs Practice'}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          You scored <strong className="text-purple-300 font-mono text-sm tabular-nums">{correctCount}/{questions.length}</strong> ({finalScore}%)
        </p>

        {passed && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Rewarded +{xpReward} XP to your Cyber Rank
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const isSelected = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.correctIndex;

  return (
    <div className="bg-[#0B101D] border border-slate-800 rounded-xl p-5 my-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
        <span className="font-semibold text-purple-400 uppercase tracking-wider">
          Knowledge Check {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-slate-400 font-mono">
          Potential XP: +{xpReward}
        </span>
      </div>

      {/* Question Text */}
      <h4 className="text-sm md:text-base font-semibold text-slate-100 mb-4 leading-relaxed">
        {currentQ.question}
      </h4>

      {/* Options */}
      <div className="space-y-2.5 mb-4">
        {currentQ.options.map((option, idx) => {
          let btnStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300';
          if (hasSubmitted) {
            if (idx === currentQ.correctIndex) {
              btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
            } else if (idx === selectedAnswer) {
              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
            }
          } else if (selectedAnswer === idx) {
            btnStyle = 'bg-purple-950/60 border-purple-500 text-purple-200';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={hasSubmitted}
              className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
            >
              <span className="font-mono text-xs w-5 h-5 rounded border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-snug">{option}</span>
              {hasSubmitted && idx === currentQ.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {hasSubmitted && idx === selectedAnswer && idx !== currentQ.correctIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box */}
      {hasSubmitted && (
        <div className={`p-3.5 rounded-lg border text-xs mb-4 leading-relaxed ${
          isCorrect ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
        }`}>
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            {isCorrect ? (
              <span className="text-emerald-400 font-bold">✓ Correct Answer!</span>
            ) : (
              <span className="text-rose-400 font-bold">✗ Incorrect</span>
            )}
          </div>
          <p className="text-slate-300 mb-1.5">{currentQ.explanationEng}</p>
          <p className="text-purple-300 font-sans border-t border-slate-800/60 pt-1.5 text-[11px]">
            தமிழ் விளக்கம்: {currentQ.explanationTamil}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
        {!hasSubmitted ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!isSelected}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isSelected
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-500/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
