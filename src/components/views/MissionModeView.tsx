import React, { useState } from 'react';
import { MISSIONS } from '../../data/missions';
import { Mission } from '../../types';
import { Target, Award, CheckCircle2, ChevronRight, Zap, Sparkles, Terminal, Brain, Database, Languages, Compass, Lock, FolderGit2, Cpu } from 'lucide-react';
import { ActiveTab } from '../layout/Header';

interface MissionModeViewProps {
  completedMissions: string[];
  unlockedBadges: string[];
  onCompleteMission: (missionId: string, xpReward: number, badgeId: string, badgeTitle: string) => void;
  onNavigate: (tab: ActiveTab) => void;
}

export const MissionModeView: React.FC<MissionModeViewProps> = ({
  completedMissions,
  unlockedBadges,
  onCompleteMission,
  onNavigate
}) => {
  const [activeMissionModal, setActiveMissionModal] = useState<Mission | null>(null);

  const totalMissions = MISSIONS.length;
  const completedCount = completedMissions.length;
  const completionPercent = Math.round((completedCount / totalMissions) * 100);

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Languages': return <Languages className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-pink-400" />;
      case 'FolderGit2': return <FolderGit2 className="w-5 h-5 text-emerald-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-400" />;
      default: return <Award className="w-5 h-5 text-purple-400" />;
    }
  };

  const tiers = [1, 2, 3, 4];

  const handleExecuteMission = (m: Mission) => {
    onCompleteMission(m.id, m.xpReward, m.badgeId, m.badgeTitle);
    setActiveMissionModal(null);
  };

  return (
    <div className="space-y-8">
      {/* Header and Progress Card */}
      <div className="rounded-2xl border border-purple-900/30 bg-[#0B0F1C] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Cyber Quest Progression</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mission Mode
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Complete tiered beginner challenges to earn XP points, level up your cyber ranking, and unlock collectible profile badges.
            </p>
          </div>

          {/* Quest Progress Bar Card */}
          <div className="bg-[#070A12] p-4 rounded-xl border border-slate-800 min-w-[240px]">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-slate-400 font-medium">Quest Clearance:</span>
              <span className="font-mono font-bold text-purple-400 tabular-nums">
                {completedCount} / {totalMissions} ({completionPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 block mt-2">
              {completedCount === totalMissions ? 'All Tiers Cleared!' : `${totalMissions - completedCount} quests remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Tiered Quest Tree */}
      <div className="space-y-8">
        {tiers.map((tierNum) => {
          const tierMissions = MISSIONS.filter((m) => m.tier === tierNum);
          const tierTitle = tierMissions[0]?.tierLabel || `Tier ${tierNum}`;
          const isTierUnlocked = tierNum === 1 || completedMissions.length >= (tierNum - 1);

          return (
            <div key={tierNum} className="space-y-4">
              {/* Tier Header */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-950/50 text-purple-300 border border-purple-500/30">
                  {tierTitle}
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-900/40 to-transparent" />
                {!isTierUnlocked && (
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Lock className="w-3.5 h-3.5" />
                    Locked until previous tier is active
                  </span>
                )}
              </div>

              {/* Mission Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tierMissions.map((m) => {
                  const isDone = completedMissions.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-[#0A101D] border-emerald-500/30'
                          : 'bg-[#0B0F1D] border-slate-800 hover:border-purple-500/40 glow-card'
                      }`}
                    >
                      <div>
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                              {getMissionIcon(m.badgeIcon)}
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                                Reward Crest
                              </span>
                              <span className="text-xs font-semibold text-purple-300">
                                {m.badgeTitle}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tabular-nums">
                              +{m.xpReward} XP
                            </span>
                            {isDone && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            )}
                          </div>
                        </div>

                        {/* Title & Desc */}
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 leading-snug">
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {m.description}
                        </p>

                        <div className="p-2.5 rounded-lg bg-[#070912] border border-slate-800/80 text-xs text-slate-300 mb-4">
                          <span className="font-semibold text-slate-400 block mb-0.5">Objective:</span>
                          {m.objective}
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-2">
                        {isDone ? (
                          <div className="w-full py-2 px-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Mission Accomplished</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveMissionModal(m)}
                            className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 active:scale-95 text-white transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 whitespace-nowrap"
                          >
                            <span>Inspect & Complete Quest</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Detail / Challenge Action Modal */}
      {activeMissionModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F1D] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-500/40">
                {getMissionIcon(activeMissionModal.badgeIcon)}
              </div>
              <div>
                <span className="text-xs text-purple-400 font-mono">
                  {activeMissionModal.tierLabel}
                </span>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {activeMissionModal.title}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#070A14] border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 mb-5">
              <div>
                <strong className="text-white block mb-1">Challenge Briefing:</strong>
                <p className="text-slate-300 leading-relaxed">{activeMissionModal.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <strong className="text-cyan-300 block mb-1">Required Objective:</strong>
                <p className="text-slate-300 leading-relaxed">{activeMissionModal.objective}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">XP Bounty:</span>
                <span className="text-purple-400 font-bold">+{activeMissionModal.xpReward} XP</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">Unlockable Crest:</span>
                <span className="text-emerald-400 font-bold">{activeMissionModal.badgeTitle}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {activeMissionModal.taskType === 'portfolio' ? (
                <button
                  onClick={() => {
                    setActiveMissionModal(null);
                    onNavigate('portfolio');
                  }}
                  className="text-xs text-cyan-300 hover:underline"
                >
                  Open Skill Portfolio →
                </button>
              ) : activeMissionModal.relatedZoneId ? (
                <button
                  onClick={() => {
                    setActiveMissionModal(null);
                    onNavigate('world');
                  }}
                  className="text-xs text-cyan-300 hover:underline"
                >
                  Launch in AI World →
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMissionModal(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleExecuteMission(activeMissionModal)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claim Mission & XP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
