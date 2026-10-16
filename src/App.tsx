/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useProgressStore } from './hooks/useProgressStore';
import { Header, ActiveTab } from './components/layout/Header';
import { HeroBanner } from './components/layout/HeroBanner';
import { AiWorldView } from './components/views/AiWorldView';
import { MissionModeView } from './components/views/MissionModeView';
import { LearningAssistantView, AssistantSubject } from './components/views/LearningAssistantView';
import { AiTutorView } from './components/views/AiTutorView';
import { CareerDiscoveryView } from './components/views/CareerDiscoveryView';
import { PortfolioView } from './components/views/PortfolioView';
import { ProgressDashboardView } from './components/views/ProgressDashboardView';
import { UniversalSearchModal } from './components/search/UniversalSearchModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ArchitectureInfoModal } from './components/modals/ArchitectureInfoModal';
import { Award, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('world');
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const [targetLessonId, setTargetLessonId] = useState<string | null>(null);
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string>('');
  const [assistantInitialSubject, setAssistantInitialSubject] = useState<AssistantSubject>('Python');

  const {
    progress,
    levelInfo,
    notification,
    addXp,
    completeLesson,
    completeMission,
    unlockBadge,
    toggleSkill,
    updateProfile,
    addPortfolioProject,
    resetProgress
  } = useProgressStore();

  // Global keyboard shortcut for search (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        levelInfo={levelInfo}
        xp={progress.xp}
        streakDays={progress.streakDays}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenArchitectureInfo={() => setShowArchitectureModal(true)}
        onOpenSearch={() => setShowSearchModal(true)}
      />

      {/* Floating XP / Reward Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-950/95 border border-purple-500/60 shadow-2xl shadow-purple-600/40 text-white text-xs sm:text-sm">
            <div className="p-1.5 rounded-lg bg-purple-600/50">
              {notification.badge ? (
                <Award className="w-4 h-4 text-amber-300" />
              ) : (
                <Zap className="w-4 h-4 text-cyan-300 fill-cyan-300" />
              )}
            </div>
            <div>
              <span className="font-bold block leading-snug">{notification.message}</span>
              {notification.xp && (
                <span className="text-[11px] text-purple-300 font-mono">
                  Rank: {levelInfo.title}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero banner shown on main world tab */}
        {activeTab === 'world' && (
          <HeroBanner
            onNavigate={setActiveTab}
            levelInfo={levelInfo}
            xp={progress.xp}
            completedLessonsCount={progress.completedLessons.length}
            userProfile={progress.userProfile}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
            onOpenSearch={() => setShowSearchModal(true)}
          />
        )}

        {/* Dynamic View Panels */}
        {activeTab === 'world' && (
          <AiWorldView
            completedLessons={progress.completedLessons}
            onCompleteLesson={(lessonId, xpReward, scorePercent) => {
              completeLesson(lessonId, xpReward, scorePercent);
            }}
            onNavigateToMission={() => setActiveTab('missions')}
            recommendedTrackId={progress.userProfile.recommendedTrackId}
            targetLessonId={targetLessonId}
            onClearTargetLesson={() => setTargetLessonId(null)}
          />
        )}

        {activeTab === 'assistant' && (
          <LearningAssistantView
            onAddXp={addXp}
            onNavigateToTab={setActiveTab}
            initialPrompt={assistantInitialPrompt}
            initialSubject={assistantInitialSubject}
          />
        )}

        {activeTab === 'missions' && (
          <MissionModeView
            completedMissions={progress.completedMissions}
            unlockedBadges={progress.unlockedBadges}
            onCompleteMission={completeMission}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'tutor' && (
          <AiTutorView
            onAddXp={addXp}
            onOpenArchitectureInfo={() => setShowArchitectureModal(true)}
            onMissionComplete={() => {
              if (!progress.completedMissions.includes('mission-5')) {
                completeMission('mission-5', 150, 'bilingual-sage', 'Bilingual Sage');
              }
            }}
          />
        )}

        {activeTab === 'careers' && (
          <CareerDiscoveryView
            checklistSkills={progress.checklistSkills}
            onToggleSkill={toggleSkill}
            recommendedTrackId={progress.userProfile.recommendedTrackId}
            onNavigateToPortfolio={() => setActiveTab('portfolio')}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioView
            projects={progress.portfolioProjects}
            onAddProject={addPortfolioProject}
            onNavigateToRoadmap={() => setActiveTab('careers')}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboardView
            progress={progress}
            levelInfo={levelInfo}
            onResetProgress={resetProgress}
            onNavigate={setActiveTab}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        )}
      </main>

      {/* Universal Search Modal (Ctrl+K) */}
      <UniversalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onNavigateToTab={setActiveTab}
        onOpenLesson={(lessonId) => {
          setActiveTab('world');
          setTargetLessonId(lessonId);
        }}
        onOpenAssistantWithPrompt={(prompt, subj) => {
          setAssistantInitialPrompt(prompt);
          if (subj) setAssistantInitialSubject(subj as AssistantSubject);
          setActiveTab('assistant');
        }}
      />

      {/* Onboarding Questionnaire Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          currentProfile={progress.userProfile}
          onSaveProfile={(updates) => updateProfile(updates)}
          onClose={() => setShowOnboardingModal(false)}
          onSelectTrackNavigate={(trackId) => {
            setActiveTab('careers');
          }}
        />
      )}

      {/* Architecture & Demo Status Modal */}
      {showArchitectureModal && (
        <ArchitectureInfoModal
          onClose={() => setShowArchitectureModal(false)}
        />
      )}

      {/* Clean, Non-slop Footer */}
      <footer className="border-t border-slate-900 bg-[#060810] py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">FutureAI World</span>
            <span>·</span>
            <span>Global AI Learning & Career Development Platform</span>
            <span>·</span>
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="text-cyan-400 hover:underline"
            >
              Prototype Transparency & Roadmap
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span>Free & Open Interactive Curriculum</span>
            <span>·</span>
            <span>Tamil & English Mentorship</span>
            <span>·</span>
            <span>All Ages & Backgrounds</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
