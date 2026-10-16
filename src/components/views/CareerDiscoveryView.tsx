import React, { useState } from 'react';
import { CAREER_TRACKS, CAREER_DISCLAIMER } from '../../data/careers';
import { CareerTrack, SkillNode } from '../../types';
import { Briefcase, IndianRupee, Globe2, CheckCircle2, Circle, TrendingUp, Sparkles, FolderGit2, HelpCircle, AlertCircle, UserCheck } from 'lucide-react';
import { ProjectBlueprintModal } from '../modals/ProjectBlueprintModal';

interface CareerDiscoveryViewProps {
  checklistSkills: Record<string, boolean>;
  onToggleSkill: (skillId: string) => void;
  recommendedTrackId?: string;
  onNavigateToPortfolio?: () => void;
}

export const CareerDiscoveryView: React.FC<CareerDiscoveryViewProps> = ({
  checklistSkills,
  onToggleSkill,
  recommendedTrackId,
  onNavigateToPortfolio
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    recommendedTrackId || 'ai-engineer'
  );
  const [activeProjectModal, setActiveProjectModal] = useState<SkillNode | null>(null);

  const currentTrack = CAREER_TRACKS.find((c) => c.id === selectedRoleId) || CAREER_TRACKS[0];

  const masteredCount = currentTrack.coreSkills.filter((s) => !!checklistSkills[s.id]).length;
  const totalSkills = currentTrack.coreSkills.length;
  const progressPercent = Math.round((masteredCount / totalSkills) * 100);

  return (
    <div className="space-y-8">
      {/* Role Selection Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            IT Career Discovery & Skill Roadmaps
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore 5 high-impact tech pathways, verified market benchmarks, and step-by-step skill requirements.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0B0F1C] border border-slate-800 rounded-xl overflow-x-auto text-xs">
          {CAREER_TRACKS.map((track) => {
            const isRec = track.id === recommendedTrackId;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedRoleId(track.id)}
                className={`px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  selectedRoleId === track.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{track.role}</span>
                {isRec && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400" title="Your recommended track" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transparent Disclaimer Callout */}
      <div className="p-3.5 rounded-xl bg-[#0F1424] border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {CAREER_DISCLAIMER}
        </p>
      </div>

      {/* Role Overview Hero Card */}
      <div className="rounded-2xl border border-purple-900/30 bg-[#0B0F1C] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Demand: {currentTrack.marketDemand}</span>
              </div>
              {currentTrack.id === recommendedTrackId && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Matches Your Onboarding Profile</span>
                </div>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentTrack.role}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              {currentTrack.overview}
            </p>

            <div className="mt-3 p-3 rounded-lg bg-[#070912] border border-slate-800/80 text-xs text-slate-400">
              <strong className="text-purple-300 block mb-0.5">Who this path is best for:</strong>
              {currentTrack.suitableFor}
            </div>
          </div>

          {/* Salary Benchmark Cards */}
          <div className="flex flex-col sm:flex-row gap-3 min-w-[320px]">
            <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium mb-1">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>India CTC Benchmark</span>
              </div>
              <span className="text-sm font-bold text-white font-mono block">
                {currentTrack.salaryIndia}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Fresher to 3 YOE range</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium mb-1">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Global Range (USD)</span>
              </div>
              <span className="text-sm font-bold text-white font-mono block">
                {currentTrack.salaryGlobal}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Remote & Hybrid benchmark</span>
            </div>
          </div>
        </div>

        {/* Readiness Checklist Metric */}
        <div className="bg-[#070A12] p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-semibold">
              Roadmap Readiness: <strong className="text-purple-400 font-mono">{masteredCount} of {totalSkills} Skills Mastered</strong>
            </span>
            <span className="font-mono text-cyan-400 font-bold tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Skill Tree */}
      <div>
        <h4 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Interactive Skill Tree & Prerequisite Milestones
        </h4>

        <div className="space-y-4">
          {currentTrack.coreSkills.map((skill, idx) => {
            const isChecked = !!checklistSkills[skill.id];
            return (
              <div
                key={skill.id}
                className={`p-5 rounded-xl border transition-all ${
                  isChecked
                    ? 'bg-[#09101D] border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                    : 'bg-[#0B0F1C] border-slate-800 hover:border-purple-500/30 glow-card'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => onToggleSkill(skill.id)}
                      className="mt-0.5 transition-transform active:scale-90"
                      aria-label={isChecked ? 'Mark Incomplete' : 'Mark Complete'}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-purple-400 transition-colors" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                        <span className="font-mono text-purple-400 font-semibold">
                          Step 0{idx + 1}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                          {skill.level}
                        </span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400 text-[11px]">
                          Est. {skill.estimatedTime}
                        </span>
                      </div>

                      <h5 className="text-sm sm:text-base font-bold text-white mb-1.5">
                        {skill.name}
                      </h5>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {skill.description}
                      </p>

                      {/* Tool Tags */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-1 font-medium">Tools:</span>
                        {skill.tools.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-[#070912] border border-slate-800 text-[11px] text-cyan-300 font-mono"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Action: Portfolio Project Blueprint */}
                  <div className="shrink-0 md:text-right pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <button
                      onClick={() => setActiveProjectModal(skill)}
                      className="w-full md:w-auto px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-purple-950/60 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-500/60 text-xs font-semibold flex items-center justify-center md:justify-end gap-1.5 transition-all"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Resume Project Blueprint</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day-in-the-Life & Interview Tips Dual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Tasks */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0A0E1A]">
          <h4 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Typical Day in the Life of a {currentTrack.role}
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {currentTrack.dailyTasks.map((task, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-cyan-400 text-xs font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{task}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interview Tips */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0A0E1A]">
          <h4 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Interview Preparation Secrets
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {currentTrack.interviewTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-amber-400 text-xs font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Project Blueprint Modal */}
      {activeProjectModal && (
        <ProjectBlueprintModal
          skill={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
          onNavigateToPortfolio={onNavigateToPortfolio}
        />
      )}
    </div>
  );
};
