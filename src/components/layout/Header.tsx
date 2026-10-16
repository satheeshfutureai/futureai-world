import React from 'react';
import { LevelInfo } from '../../hooks/useProgressStore';
import { Compass, Flame, SlidersHorizontal, Info, Search, Sparkles } from 'lucide-react';

export type ActiveTab = 'world' | 'missions' | 'assistant' | 'tutor' | 'careers' | 'portfolio' | 'progress';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  levelInfo: LevelInfo;
  xp: number;
  streakDays: number;
  onOpenOnboarding: () => void;
  onOpenArchitectureInfo: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  levelInfo,
  xp,
  streakDays,
  onOpenOnboarding,
  onOpenArchitectureInfo,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#080B14]/90 backdrop-blur-md border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onTabChange('world')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 shadow-sm shadow-purple-500/20">
            <div className="w-full h-full bg-[#080B14] rounded-[6px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
            FutureAI World
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs lg:text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('world')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'world'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI World
          </button>
          <button
            onClick={() => onTabChange('assistant')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'assistant'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => onTabChange('missions')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'missions'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mission Mode
          </button>
          <button
            onClick={() => onTabChange('tutor')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'tutor'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Tutor Demo
          </button>
          <button
            onClick={() => onTabChange('careers')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'careers'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Career Roadmaps
          </button>
          <button
            onClick={() => onTabChange('portfolio')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'portfolio'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Skill Portfolio
          </button>
          <button
            onClick={() => onTabChange('progress')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'progress'
                ? 'text-white border-purple-500 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Progress
          </button>
        </nav>

        {/* Zone 3: Universal Search Bar & Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F1D] hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 text-slate-300 hover:text-white transition-all text-xs group shadow-sm"
            title="Global AI Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-slate-400 group-hover:text-slate-200">Search AI, code...</span>
            <kbd className="hidden md:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-purple-300">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenOnboarding}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs transition-colors"
            title="Personalized Learning Settings"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">My Profile</span>
          </button>

          <button
            onClick={onOpenArchitectureInfo}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition-colors"
            title="Architecture & Demo Status"
          >
            <Info className="w-4 h-4" />
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-lg">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-mono font-semibold tabular-nums">{streakDays}d Streak</span>
          </div>

          <button
            onClick={() => onTabChange('progress')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all text-xs whitespace-nowrap shrink-0 group"
          >
            <div className="flex flex-col text-right">
              <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
                Lv. {levelInfo.level}
              </span>
              <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                {xp} XP
              </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {levelInfo.level}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between border-t border-slate-800/80 px-2 py-2 bg-[#060810]/95 text-[11px] overflow-x-auto gap-1">
        <button
          onClick={onOpenSearch}
          className="px-2 py-1 rounded bg-purple-950/50 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1 shrink-0"
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
        </button>
        <button
          onClick={() => onTabChange('world')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'world' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          World
        </button>
        <button
          onClick={() => onTabChange('assistant')}
          className={`px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 ${activeTab === 'assistant' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Assistant</span>
        </button>
        <button
          onClick={() => onTabChange('missions')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'missions' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          Missions
        </button>
        <button
          onClick={() => onTabChange('tutor')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'tutor' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          AI Tutor
        </button>
        <button
          onClick={() => onTabChange('careers')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'careers' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          Careers
        </button>
        <button
          onClick={() => onTabChange('portfolio')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'portfolio' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          Portfolio
        </button>
        <button
          onClick={() => onTabChange('progress')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'progress' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          Progress
        </button>
      </div>
    </header>
  );
};
