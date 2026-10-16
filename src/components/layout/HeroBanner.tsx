import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Target, Bot, FolderGit2, UserCheck, Search } from 'lucide-react';
import { ActiveTab } from './Header';
import { LevelInfo } from '../../hooks/useProgressStore';
import { UserProfile } from '../../types';

interface HeroBannerProps {
  onNavigate: (tab: ActiveTab) => void;
  levelInfo: LevelInfo;
  xp: number;
  completedLessonsCount: number;
  userProfile?: UserProfile;
  onOpenOnboarding?: () => void;
  onOpenSearch?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  levelInfo,
  xp,
  completedLessonsCount,
  userProfile,
  onOpenOnboarding,
  onOpenSearch
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-[#0B0F1C] mb-8 shadow-2xl">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/futureai_world_hero_1792125157329.jpg"
          alt="FutureAI World Cyber Academy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B14] via-[#080B14]/90 to-[#080B14]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-8 md:py-12 lg:px-12 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Education & Tech Career Growth for All Backgrounds</span>
          </div>

          {userProfile && (
            <button
              onClick={onOpenOnboarding}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-medium transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Track: {userProfile.recommendedTrackId.replace('-', ' ').toUpperCase()}</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
          Level Up Your Tech Career in <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">FutureAI World</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
          From absolute non-technical beginners to experienced builders: explore foundational AI literacy, prompt design, Python, SQL, and modern AI engineering with bilingual Tamil & English mentorship.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => onNavigate('missions')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 whitespace-nowrap"
          >
            <span>Start Mission Mode</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('tutor')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Ask Aura AI Tutor</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 hover:border-purple-500/60 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4 text-purple-400" />
            <span>Universal AI Search</span>
          </button>

          <button
            onClick={() => onNavigate('portfolio')}
            className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-700/80 hover:border-slate-500 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <FolderGit2 className="w-4 h-4 text-slate-400" />
            <span>Real Skill Portfolio</span>
          </button>
        </div>

        {/* Live HUD Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-[#070A12]/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Current Rank</span>
            <span className="text-white font-bold">{levelInfo.title}</span>
          </div>

          <div className="bg-[#070A12]/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Total Experience</span>
            <span className="text-purple-400 font-mono font-bold tabular-nums">{xp} XP</span>
          </div>

          <div className="bg-[#070A12]/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Lessons Mastered</span>
            <span className="text-cyan-400 font-mono font-bold tabular-nums">{completedLessonsCount} Completed</span>
          </div>

          <div className="bg-[#070A12]/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Next Rank Level</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
