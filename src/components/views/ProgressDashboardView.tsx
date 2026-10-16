import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { LevelInfo } from '../../hooks/useProgressStore';
import { BADGES, LEARNING_ZONES } from '../../data/learningContent';
import { Award, Zap, Flame, BookOpen, CheckCircle2, RotateCcw, Sparkles, Lock, ShieldCheck, FolderGit2, User, SlidersHorizontal } from 'lucide-react';
import { ActiveTab } from '../layout/Header';

interface ProgressDashboardViewProps {
  progress: UserProgress;
  levelInfo: LevelInfo;
  onResetProgress: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenOnboarding: () => void;
}

export const ProgressDashboardView: React.FC<ProgressDashboardViewProps> = ({
  progress,
  levelInfo,
  onResetProgress,
  onNavigate,
  onOpenOnboarding
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Flatten all lessons to get titles
  const allLessons = LEARNING_ZONES.flatMap((z) => z.lessons);
  const totalLessons = allLessons.length;
  const completedCount = progress.completedLessons.length;
  const lessonPercent = Math.round((completedCount / totalLessons) * 100);
  const verifiedProjectsCount = progress.portfolioProjects.filter((p) => p.status === 'completed_verified').length;

  return (
    <div className="space-y-8">
      {/* Top Banner Profile Summary */}
      <div className="rounded-2xl border border-purple-900/30 bg-[#0B0F1C] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl shadow-purple-600/30">
                <div className="w-full h-full bg-[#080B14] rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-[10px] text-purple-400 font-mono uppercase tracking-wider font-semibold">Rank</span>
                  <span className="text-xl font-black text-white">{levelInfo.level}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {levelInfo.title}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/30">
                  Global Learner Record
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Target Pathway: <strong className="text-cyan-300 capitalize">{progress.userProfile.recommendedTrackId.replace('-', ' ')}</strong> · Language: {progress.userProfile.preferredLanguage.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenOnboarding}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-purple-500/40 flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Edit Pathway Profile</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 hover:border-rose-900/40 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-medium">
              Progress to Next Rank (Level {Math.min(5, levelInfo.level + 1)}):
            </span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">
              {levelInfo.currentLevelXp} / {levelInfo.neededLevelXp} XP ({levelInfo.progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
            <Zap className="w-4 h-4" />
            <span>Total XP Earned</span>
          </div>
          <span className="text-2xl font-black text-white font-mono tabular-nums">
            {progress.xp}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Across all learning zones</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Active Study Streak</span>
          </div>
          <span className="text-2xl font-black text-white font-mono tabular-nums">
            {progress.streakDays} Days
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Daily habit consistency</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Lessons Completed</span>
          </div>
          <span className="text-2xl font-black text-white font-mono tabular-nums">
            {completedCount} / {totalLessons}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">{lessonPercent}% curriculum cleared</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0E1A] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
            <FolderGit2 className="w-4 h-4" />
            <span>Verified Projects</span>
          </div>
          <span className="text-2xl font-black text-white font-mono tabular-nums">
            {verifiedProjectsCount}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Proof-of-work portfolio items</span>
        </div>
      </div>

      {/* Cyber Badges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Cyber Achievement Crests & Badges
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {progress.unlockedBadges.length} of {BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge, idx) => {
            const isUnlocked = progress.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-[#0B101D] border-purple-500/40 shadow-sm shadow-purple-600/10'
                    : 'bg-[#080B14] border-slate-800/60 opacity-60'
                }`}
              >
                {/* Badge Icon Slot */}
                <div className="relative shrink-0">
                  {idx === 0 ? (
                    <img
                      src="/src/assets/images/badge_matrix_master_1792125160979.jpg"
                      alt={badge.title}
                      referrerPolicy="no-referrer"
                      className={`w-12 h-12 rounded-xl object-cover border ${
                        isUnlocked ? 'border-purple-400 shadow-md' : 'border-slate-700 grayscale'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                        isUnlocked
                          ? 'bg-purple-950/80 border-purple-500/50 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/40">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Modules Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-[#0A0E1A] p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          Curriculum Completion Audit
        </h3>

        {completedCount === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm mb-3">No modules completed yet. Dive into your first learning zone to start earning XP!</p>
            <button
              onClick={() => onNavigate('world')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold"
            >
              Go to AI World
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {allLessons
              .filter((lesson) => progress.completedLessons.includes(lesson.id))
              .map((lesson) => (
                <div key={lesson.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-semibold text-slate-200 block">
                        {lesson.title}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lesson.difficulty} · {lesson.readTime} · Awarded +{lesson.xpReward} XP
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-emerald-400 font-bold">
                    Score: {progress.quizScores[lesson.id] || 100}%
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F1D] border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Reset Learning Progress?</h4>
            <p className="text-xs text-slate-400 mb-5">
              This will reset your XP back to 150, restore completed lessons, and clear unlocked badges.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
