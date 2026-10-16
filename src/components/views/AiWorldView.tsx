import React, { useState } from 'react';
import { LEARNING_ZONES } from '../../data/learningContent';
import { Lesson, LearningZone, LessonDifficulty } from '../../types';
import { Cpu, Terminal, Database, Compass, Clock, Award, CheckCircle2, ChevronRight, X, Sparkles, Brain, Code, BookOpen } from 'lucide-react';
import { TokenSimulator } from '../widgets/TokenSimulator';
import { PythonTester } from '../widgets/PythonTester';
import { SqlPlayground } from '../widgets/SqlPlayground';
import { LessonSqlEditor } from '../widgets/LessonSqlEditor';
import { MatrixMultiplyVisualizer } from '../widgets/MatrixMultiplyVisualizer';
import { QuizCard } from '../quiz/QuizCard';

interface AiWorldViewProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, xpReward: number, scorePercent: number) => void;
  onNavigateToMission?: () => void;
  recommendedTrackId?: string;
  targetLessonId?: string | null;
  onClearTargetLesson?: () => void;
}

export const AiWorldView: React.FC<AiWorldViewProps> = ({
  completedLessons,
  onCompleteLesson,
  onNavigateToMission,
  recommendedTrackId,
  targetLessonId,
  onClearTargetLesson
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | LessonDifficulty>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  React.useEffect(() => {
    if (targetLessonId) {
      for (const zone of LEARNING_ZONES) {
        const found = zone.lessons.find((l) => l.id === targetLessonId);
        if (found) {
          setActiveLesson(found);
          break;
        }
      }
      onClearTargetLesson?.();
    }
  }, [targetLessonId, onClearTargetLesson]);

  const getZoneIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-cyan-400" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'Brain': return <Brain className="w-5 h-5 text-pink-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const filteredZones = LEARNING_ZONES.filter((z) => {
    if (selectedZoneId !== 'all' && z.id !== selectedZoneId) return false;
    return true;
  }).map((zone) => {
    if (selectedDifficulty === 'All') return zone;
    return {
      ...zone,
      lessons: zone.lessons.filter((l) => l.difficulty === selectedDifficulty)
    };
  }).filter((zone) => zone.lessons.length > 0);

  return (
    <div className="space-y-8">
      {/* Zone & Difficulty Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            AI World Learning Zones
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore 6 immersive sectors covering foundational literacy, prompt design, coding, analytics, and deep tech.
          </p>
        </div>

        {/* Filter Controls: Difficulty + Sector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Tiers */}
          <div className="flex items-center gap-1 p-1 bg-[#070A14] border border-slate-800 rounded-xl text-xs">
            <span className="text-slate-500 text-[11px] px-2 font-medium">Difficulty:</span>
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#0B0F1C] border border-slate-800 rounded-xl overflow-x-auto text-xs max-w-full">
            <button
              onClick={() => setSelectedZoneId('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedZoneId === 'all'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Zones
            </button>
            {LEARNING_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedZoneId === zone.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {zone.title.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="space-y-8">
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-2xl border border-slate-800/80 bg-[#0A0E1A]/80 p-6 glow-card"
          >
            {/* Zone Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 shadow-inner">
                  {getZoneIcon(zone.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      {zone.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-purple-300 border border-slate-700">
                      {zone.difficultyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {zone.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {zone.id === 'python-coding' && (
                  <button
                    onClick={() => setActiveLesson(zone.lessons[0])}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-950/30"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Launch Python Sandbox</span>
                  </button>
                )}
                {zone.id === 'data-analytics' && (
                  <button
                    onClick={() => {
                      const sqlLesson = zone.lessons.find((l) => l.interactiveWidget === 'sql_filter') || zone.lessons[0];
                      setActiveLesson(sqlLesson);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-950/30"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Launch SQL Playground</span>
                  </button>
                )}
                <div className="text-xs text-slate-500 font-mono hidden sm:block">
                  {zone.lessons.length} Modules
                </div>
              </div>
            </div>

            {/* Lessons List in Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zone.lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="p-4 rounded-xl bg-[#0F1424] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top tags */}
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                            {lesson.difficulty}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[11px] text-slate-400">
                            {lesson.requiresCoding ? 'Python Code' : 'Zero-Code / Concept'}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-purple-400 font-mono">+{lesson.xpReward} XP</span>
                        </div>

                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-purple-300 transition-colors mb-1.5 leading-snug">
                        {lesson.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {lesson.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveLesson(lesson)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-purple-600 text-slate-300 hover:text-white border border-slate-700/60 hover:border-purple-500 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>{isCompleted ? 'Review Lesson' : 'Launch Module'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Reader Drawer / Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0A0E1A] border border-purple-500/40 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0E1322]">
              <div>
                <div className="flex items-center gap-2 text-xs text-purple-400 font-mono mb-1">
                  <span>Level: {activeLesson.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeLesson.requiresCoding ? 'Hands-on Coding' : 'Conceptual Clarity'}</span>
                  <span aria-hidden="true">·</span>
                  <span>+{activeLesson.xpReward} XP</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Summary & Objectives */}
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs sm:text-sm text-purple-200 space-y-2">
                <div>
                  <span className="font-semibold block mb-0.5 text-purple-300">Core Takeaway:</span>
                  <p>{activeLesson.summary}</p>
                </div>
                {activeLesson.prerequisites && activeLesson.prerequisites.length > 0 && (
                  <div className="pt-2 border-t border-purple-900/40 text-xs">
                    <strong className="text-slate-300 block mb-0.5">Prerequisites:</strong>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {activeLesson.prerequisites.map((p, pIdx) => (
                        <li key={pIdx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
                  <div className="pt-2 border-t border-purple-900/40 text-xs">
                    <strong className="text-cyan-300 block mb-0.5">Learning Objectives:</strong>
                    <ul className="list-disc list-inside text-cyan-200/90 space-y-0.5">
                      {activeLesson.learningObjectives.map((obj, oIdx) => (
                        <li key={oIdx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sections */}
              {activeLesson.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-white border-l-2 border-purple-500 pl-2.5">
                    {sec.title}
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    {sec.content}
                  </p>

                  {/* Plain English summary */}
                  {sec.plainEnglishSummary && (
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400">
                      <strong className="text-slate-300 block mb-0.5">Key Principle:</strong>
                      {sec.plainEnglishSummary}
                    </div>
                  )}

                  {/* Code snippet or Interactive SQL Editor */}
                  {sec.codeSnippet && (
                    (activeLesson.id === 'sql-relational' || sec.title === 'Querying Relational Tables with Precision') ? (
                      <LessonSqlEditor initialQuery={sec.codeSnippet} />
                    ) : (
                      <div className="my-3 p-3.5 bg-[#05070E] border border-slate-800 rounded-xl overflow-x-auto">
                        <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
                          {sec.codeSnippet}
                        </pre>
                      </div>
                    )
                  )}

                  {/* Tanglish Analogy if present */}
                  {sec.tanglishAnalogy && (
                    <div className="my-3 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
                      <span className="font-bold text-cyan-300 block mb-1">
                        💡 Simple Tanglish Analogy:
                      </span>
                      <p className="text-indigo-200 leading-relaxed">
                        {sec.tanglishAnalogy}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Worked Example if present */}
              {activeLesson.workedExample && (
                <div className="p-4 rounded-xl bg-[#070D18] border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Worked Example: {activeLesson.workedExample.title}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong className="text-slate-200">Scenario:</strong> {activeLesson.workedExample.scenario}
                  </p>
                  <div className="space-y-1 text-xs text-slate-400 pl-2 border-l border-cyan-500/30">
                    {activeLesson.workedExample.steps.map((step, sIdx) => (
                      <p key={sIdx}>{step}</p>
                    ))}
                  </div>
                  {activeLesson.workedExample.codeOrCalculation && (
                    <div className="p-2.5 bg-[#04060C] border border-slate-800 rounded-lg font-mono text-xs text-cyan-200">
                      <code>{activeLesson.workedExample.codeOrCalculation}</code>
                    </div>
                  )}
                  {activeLesson.workedExample.expectedOutput && (
                    <div className="text-[11px] text-emerald-300 font-mono">
                      ✓ Expected Result: {activeLesson.workedExample.expectedOutput}
                    </div>
                  )}
                </div>
              )}

              {/* Practice Task if present */}
              {activeLesson.practiceTask && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <span className="text-xs font-bold text-amber-300 block">
                    🎯 Practice Challenge:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeLesson.practiceTask.task}
                  </p>
                  <p className="text-[11px] text-amber-200/80 italic">
                    💡 Hint: {activeLesson.practiceTask.hint}
                  </p>
                </div>
              )}

              {/* Interactive Widget if attached */}
              {activeLesson.interactiveWidget === 'token_simulator' && (
                <TokenSimulator />
              )}
              {activeLesson.interactiveWidget === 'python_tester' && (
                <PythonTester />
              )}
              {activeLesson.interactiveWidget === 'sql_filter' && (
                <SqlPlayground />
              )}
              {activeLesson.interactiveWidget === 'matrix_multiply' && (
                <MatrixMultiplyVisualizer />
              )}

              {/* Interactive Knowledge Check Quiz */}
              <div className="pt-4 border-t border-slate-800">
                <QuizCard
                  questions={activeLesson.quiz}
                  xpReward={activeLesson.xpReward}
                  onComplete={(score) => {
                    onCompleteLesson(activeLesson.id, activeLesson.xpReward, score);
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#0E1322] flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Status: {completedLessons.includes(activeLesson.id) ? (
                  <strong className="text-emerald-400">✓ Completed & Earned</strong>
                ) : (
                  <span className="text-slate-300">Complete the quiz above to claim XP</span>
                )}
              </span>
              <button
                onClick={() => setActiveLesson(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Close Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
