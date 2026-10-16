import React, { useState } from 'react';
import { PortfolioProject, LessonDifficulty, SkillNode } from '../../types';
import { FolderGit2, ExternalLink, Github, Plus, CheckCircle2, ShieldCheck, Sparkles, Filter, FileText, X } from 'lucide-react';
import { ProjectBlueprintModal } from '../modals/ProjectBlueprintModal';

interface PortfolioViewProps {
  projects: PortfolioProject[];
  onAddProject: (project: PortfolioProject) => void;
  onNavigateToRoadmap?: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  projects,
  onAddProject,
  onNavigateToRoadmap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedBlueprintSkill, setSelectedBlueprintSkill] = useState<SkillNode | null>(null);

  // New project form state
  const [title, setTitle] = useState('');
  const [roleTrack, setRoleTrack] = useState('AI Engineer');
  const [category, setCategory] = useState('AI Engineering');
  const [difficulty, setDifficulty] = useState<LessonDifficulty>('Beginner');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');

  const completedProjects = projects.filter((p) => p.status === 'completed_verified');
  const sampleBlueprints = projects.filter((p) => p.status === 'sample_starter');

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : selectedCategory === 'completed'
    ? completedProjects
    : selectedCategory === 'blueprints'
    ? sampleBlueprints
    : projects.filter((p) => p.roleTrack.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newProject: PortfolioProject = {
      id: `proj-user-${Date.now()}`,
      title: title.trim(),
      category,
      roleTrack,
      difficulty,
      status: 'completed_verified',
      description: description.trim(),
      skillsDemonstrated: skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      completedAt: 'Today',
      reflectionNotes: reflectionNotes.trim() || 'Verified working implementation.'
    };

    onAddProject(newProject);
    setShowAddModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setSkillsStr('');
    setLiveUrl('');
    setGithubUrl('');
    setReflectionNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Portfolio Header Banner */}
      <div className="rounded-2xl border border-purple-900/30 bg-[#0B0F1C] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Proof-of-Work Verification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Real Skill Portfolio
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Showcase tangible projects, documented code repositories, and verified skills to recruiters.
              Distinguish sample starter blueprints from your completed implementations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Export Portfolio Summary</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-purple-600/30 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Project</span>
            </button>
          </div>
        </div>

        {/* Portfolio Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-[#070A12] p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Verified Completed</span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums text-sm">
              {completedProjects.length} Projects
            </span>
          </div>

          <div className="bg-[#070A12] p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Ready Starter Blueprints</span>
            <span className="font-mono text-purple-400 font-bold tabular-nums text-sm">
              {sampleBlueprints.length} Templates
            </span>
          </div>

          <div className="bg-[#070A12] p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Skills Demonstrated</span>
            <span className="font-mono text-cyan-400 font-bold tabular-nums text-sm">
              {Array.from(new Set(completedProjects.flatMap((p) => p.skillsDemonstrated))).length} Unique Skills
            </span>
          </div>

          <div className="bg-[#070A12] p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 block mb-0.5">Hiring Recruiter Ready</span>
            <span className="text-slate-200 font-bold text-sm">
              {completedProjects.length >= 2 ? 'High Signal ✓' : 'Add 1 more project'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0B0F1C] border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Items ({projects.length})
        </button>
        <button
          onClick={() => setSelectedCategory('completed')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Verified Completed ({completedProjects.length})
        </button>
        <button
          onClick={() => setSelectedCategory('blueprints')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
            selectedCategory === 'blueprints'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Starter Blueprints ({sampleBlueprints.length})
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => {
          const isVerified = proj.status === 'completed_verified';
          return (
            <div
              key={proj.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isVerified
                  ? 'bg-[#09101E] border-emerald-500/40 glow-card shadow-sm shadow-emerald-500/5'
                  : 'bg-[#0B0F1C] border-slate-800 hover:border-purple-500/40 glow-card'
              }`}
            >
              <div>
                {/* Top status indicator badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Completed & Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Sample Project Blueprint
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    {proj.difficulty}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  {proj.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Skills Tags */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">Demonstrated Competencies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.skillsDemonstrated.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-[#070912] border border-slate-800 text-[11px] text-cyan-300 font-mono"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reflection note if present */}
                {proj.reflectionNotes && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mb-4 leading-relaxed">
                    <strong className="text-slate-300 block mb-0.5">Learner Notes & Architecture:</strong>
                    {proj.reflectionNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                {isVerified ? (
                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-white flex items-center gap-1 underline underline-offset-4"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Ready to implement in Python / Web</span>
                )}

                {!isVerified && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        if (proj.id === 'proj-excel' || proj.title.toLowerCase().includes('excel')) {
                          setSelectedBlueprintSkill({
                            id: 'da-excel',
                            name: 'Advanced Excel & Spreadsheets',
                            level: 'Beginner',
                            estimatedTime: '1 - 2 weeks',
                            tools: ['Excel', 'Google Sheets', 'XLOOKUP', 'Pivot Tables'],
                            description: proj.description,
                            projectIdea: 'Build an automated 12-month student budget & expense forecaster with scenario analysis and dynamic charts.'
                          });
                        } else {
                          setSelectedBlueprintSkill({
                            id: proj.id,
                            name: proj.title,
                            level: proj.difficulty,
                            estimatedTime: '2 - 3 weeks',
                            tools: proj.skillsDemonstrated,
                            description: proj.description,
                            projectIdea: proj.description
                          });
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-medium flex items-center gap-1 transition-colors"
                      type="button"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Blueprint &amp; Visuals</span>
                    </button>

                    <button
                      onClick={() => {
                        setTitle(proj.title);
                        setDescription(proj.description);
                        setSkillsStr(proj.skillsDemonstrated.join(', '));
                        setCategory(proj.category);
                        setRoleTrack(proj.roleTrack);
                        setShowAddModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
                      type="button"
                    >
                      Submit as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F1D] border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
                Add Verified Project to Portfolio
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Project Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Swiggy Rush Hour Delivery Analyzer"
                  className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Track:</label>
                  <select
                    value={roleTrack}
                    onChange={(e) => setRoleTrack(e.target.value)}
                    className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="AI Engineer">AI Engineer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Machine Learning Engineer">ML Engineer</option>
                    <option value="Full-Stack Developer">Full-Stack Dev</option>
                    <option value="AI Product Specialist">AI Product Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description & Problem Solved:</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the dataset, business challenge, or user requirement addressed..."
                  className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Skills Demonstrated (comma separated):</label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  placeholder="e.g. Python, SQL, Pandas, Streamlit"
                  className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">GitHub Repo URL:</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live App URL:</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://my-app.run.app"
                    className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Key Takeaways & Reflection:</label>
                <textarea
                  rows={2}
                  value={reflectionNotes}
                  onChange={(e) => setReflectionNotes(e.target.value)}
                  placeholder="What was the hardest bug solved or key learning?"
                  className="w-full bg-[#060810] border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-white shadow-md shadow-emerald-600/30"
                >
                  Verify & Claim +175 XP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Summary Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F1D] border border-purple-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Verified Candidate Skill Transcript
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#060810] border border-slate-800 rounded-xl text-xs font-mono text-slate-200 space-y-3 leading-relaxed mb-4 max-h-80 overflow-y-auto">
              <div className="text-purple-300 font-bold border-b border-slate-800 pb-2">
                FUTUREAI WORLD — CANDIDATE PORTFOLIO DOSSIER
              </div>
              <p>Generated: October 2026</p>
              <p>Status: {completedProjects.length} Verified Completed Projects</p>
              <div className="border-t border-slate-800 pt-2">
                <strong className="text-cyan-300 block mb-1">VERIFIED PROJECTS:</strong>
                {completedProjects.map((p, idx) => (
                  <div key={idx} className="mb-2">
                    <div>{idx + 1}. {p.title} ({p.roleTrack})</div>
                    <div className="text-slate-400 text-[11px]">- {p.description}</div>
                    <div className="text-slate-400 text-[11px]">- Tools: {p.skillsDemonstrated.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(
                    completedProjects
                      .map((p) => `• ${p.title} (${p.roleTrack}): ${p.description}`)
                      .join('\n')
                  );
                  alert('Portfolio bullets copied to clipboard for your resume!');
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
              >
                Copy Resume Bullets
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Blueprint Modal */}
      {selectedBlueprintSkill && (
        <ProjectBlueprintModal
          skill={selectedBlueprintSkill}
          onClose={() => setSelectedBlueprintSkill(null)}
        />
      )}
    </div>
  );
};
