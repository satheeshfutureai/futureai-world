import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  BookOpen,
  Terminal,
  Compass,
  Briefcase,
  Layers,
  ExternalLink,
  Globe,
  Loader2,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Code2
} from 'lucide-react';
import { InAppSearchResult, searchInAppContent } from '../../services/inAppSearch';
import { MarkdownView } from '../common/MarkdownView';
import { ActiveTab } from '../layout/Header';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTab) => void;
  onOpenLesson?: (lessonId: string) => void;
  onOpenBlueprint?: (blueprintId: string) => void;
  onOpenCareer?: (careerId: string) => void;
  onOpenAssistantWithPrompt?: (prompt: string, subject?: string) => void;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

const SEARCH_HISTORY_KEY = 'futureai_search_history_v1';

const SUGGESTED_QUERIES = [
  'What are the core differences between Machine Learning and Deep Learning?',
  'How to write a SQL query with GROUP BY and HAVING?',
  'Explain Python list comprehensions with examples',
  'Excel VLOOKUP vs XLOOKUP formula comparison',
  'What math skills are required for Artificial Intelligence?',
  'Data Analyst career roadmap & salary benchmarks',
  'Explain Convolutional Neural Networks for image classification',
  'How do Large Language Models and BPE tokenizers work?'
];

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onOpenLesson,
  onOpenBlueprint,
  onOpenCareer,
  onOpenAssistantWithPrompt
}) => {
  const [query, setQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'ai' | 'in_app' | 'web'>('all');
  const [enableWebSearch, setEnableWebSearch] = useState(false);

  // Results
  const [inAppResults, setInAppResults] = useState<InAppSearchResult[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [webSources, setWebSources] = useState<Array<{ title: string; url: string }>>([]);
  const [webStatus, setWebStatus] = useState<{
    available: boolean;
    warning?: string;
    message?: string;
    errorType?: string;
  }>({ available: false });
  const [answerType, setAnswerType] = useState<'web_grounded' | 'ai_educational' | 'time_sensitive_blocked'>('ai_educational');
  const [isTimeSensitive, setIsTimeSensitive] = useState<boolean>(false);
  const [isVerifiedCurrent, setIsVerifiedCurrent] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Search History
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save query to history
  const saveToHistory = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [
      { query: trimmed, timestamp: Date.now() },
      ...history.filter(h => h.query.toLowerCase() !== trimmed.toLowerCase())
    ].slice(0, 10);
    setHistory(next);
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  // Perform search
  const handlePerformSearch = async (targetQuery: string, withWeb: boolean = enableWebSearch) => {
    const q = targetQuery.trim();
    if (!q) return;

    setQuery(q);
    setHasSearched(true);
    saveToHistory(q);

    // 1. In-app search instant indexing
    const matchedInApp = searchInAppContent(q);
    setInAppResults(matchedInApp);

    // 2. Fetch Dynamic AI answer from server
    setIsLoadingAi(true);
    setAiError(null);
    setAiAnswer('');
    setWebSources([]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          enableWebSearch: withWeb
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate search response');
      }

      setAiAnswer(data.aiAnswer || '');
      setWebSources(data.webSources || []);
      setWebStatus(data.webSearchStatus || { available: false });
      setAnswerType(data.answerType || 'ai_educational');
      setIsTimeSensitive(Boolean(data.isTimeSensitive));
      setIsVerifiedCurrent(Boolean(data.isVerifiedCurrent));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reaching search engine';
      setAiError(msg);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleInAppAction = (item: InAppSearchResult) => {
    onClose();
    if (item.actionType === 'open_lesson' && item.actionPayload && onOpenLesson) {
      onNavigateToTab('world');
      onOpenLesson(item.actionPayload);
    } else if (item.actionType === 'open_widget') {
      onNavigateToTab('world');
      // Scroll to widget if on world
      setTimeout(() => {
        const el = document.getElementById('interactive-playground');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else if (item.actionType === 'open_blueprint' && item.actionPayload && onOpenBlueprint) {
      onNavigateToTab('portfolio');
      onOpenBlueprint(item.actionPayload);
    } else if (item.actionType === 'open_career' && item.actionPayload && onOpenCareer) {
      onNavigateToTab('careers');
      onOpenCareer(item.actionPayload);
    } else {
      onNavigateToTab(item.targetTab);
    }
  };

  const handleAskAssistant = () => {
    if (onOpenAssistantWithPrompt) {
      onClose();
      onOpenAssistantWithPrompt(query);
    } else {
      onClose();
      onNavigateToTab('assistant');
    }
  };

  const handleCopyAnswer = () => {
    if (!aiAnswer) return;
    navigator.clipboard.writeText(aiAnswer);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090D18] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/40 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0C1222]/90 flex items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-purple-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePerformSearch(query);
                }
              }}
              placeholder="Search anything: AI, Python, SQL, Excel, Java, Math, Science, Careers..."
              className="w-full bg-[#05070E] border border-slate-700/80 focus:border-purple-500 rounded-xl pl-11 pr-24 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-sans"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setHasSearched(false);
                  setInAppResults([]);
                  setAiAnswer('');
                  setWebSources([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-12 text-slate-400 hover:text-white p-1"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handlePerformSearch(query)}
              disabled={!query.trim() || isLoadingAi}
              className="absolute right-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              {isLoadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Ask AI</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options & Filter Bar */}
        <div className="px-4 py-2.5 bg-[#070A14] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tab Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTabFilter === 'all'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setActiveTabFilter('ai')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTabFilter === 'ai'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>AI Answer</span>
            </button>
            <button
              onClick={() => setActiveTabFilter('in_app')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTabFilter === 'in_app'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3 text-cyan-400" />
              <span>In-App Curriculum ({inAppResults.length})</span>
            </button>
            <button
              onClick={() => setActiveTabFilter('web')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTabFilter === 'web'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Web Sources ({webSources.length})</span>
            </button>
          </div>

          {/* Web Search Grounding Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={enableWebSearch}
                onChange={(e) => {
                  setEnableWebSearch(e.target.checked);
                  if (query.trim() && hasSearched) {
                    handlePerformSearch(query, e.target.checked);
                  }
                }}
                className="w-3.5 h-3.5 accent-purple-600 rounded bg-slate-900 border-slate-700"
              />
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Globe className="w-3 h-3 text-cyan-400" />
                Live Web Grounding
              </span>
            </label>
          </div>
        </div>

        {/* Modal Body / Results Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Initial State / Suggested Queries & Recent History (before search) */}
          {!hasSearched && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Recent History */}
              {history.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      Recent Searches
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handlePerformSearch(h.query)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 transition-all text-left"
                      >
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{h.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Topics */}
              <div>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Popular Inquiries Across AI & Tech
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUGGESTED_QUERIES.map((sq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePerformSearch(sq)}
                      className="p-3 rounded-xl bg-[#070A14] hover:bg-[#0E1528] border border-slate-800/80 hover:border-purple-500/40 text-left transition-all group flex items-start gap-2.5"
                    >
                      <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
                        {sq}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Jump to Sandboxes */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-cyan-950/20 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Interactive Sandbox Environments</h4>
                    <p className="text-xs text-slate-400">Launch real-time Python with Pandas or SQL Database Playground directly.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTab('world');
                      setTimeout(() => {
                        document.getElementById('interactive-playground')?.scrollIntoView({ behavior: 'smooth' });
                      }, 250);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    Open Sandboxes
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToTab('assistant');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-sm transition-colors"
                  >
                    AI Assistant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Searched Results View */}
          {hasSearched && (
            <div className="space-y-6">
              {/* Live Web Grounding Unavailable Warning Banner */}
              {(enableWebSearch || isTimeSensitive || webStatus.warning) && (!webStatus.available || webSources.length === 0) && (
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-amber-300 text-xs sm:text-sm">
                      Live web search is currently unavailable. This answer is not verified against current web sources.
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      Google Search Grounding encountered an API quota limit (429 RESOURCE_EXHAUSTED). {isTimeSensitive ? 'Real-time news and time-sensitive queries are safely paused to avoid fabricated events.' : 'Educational foundational concepts below are generated via synthesized AI models without external web verification.'}
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 1: DYNAMIC AI ANSWER */}
              {(activeTabFilter === 'all' || activeTabFilter === 'ai') && (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0D1326] to-[#080B15] border border-purple-500/40 shadow-lg">
                  <div className="flex items-center justify-between gap-2 mb-3 border-b border-purple-500/20 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-sm">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            FutureAI Universal Response
                          </h3>
                          {answerType === 'web_grounded' && webSources.length > 0 && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <Globe className="w-3 h-3 text-emerald-400" />
                              Verified Web Grounded ({webSources.length} sources)
                            </span>
                          )}
                          {answerType === 'ai_educational' && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/30">
                              AI-Generated Educational Explanation
                            </span>
                          )}
                          {answerType === 'time_sensitive_blocked' && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/40">
                              Current News Grounding Required
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {answerType === 'web_grounded'
                            ? 'Cross-referenced in real-time with Google Search Grounding'
                            : 'AI synthesis tailored to your inquiry (Not live web search)'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {aiAnswer && (
                        <button
                          onClick={handleCopyAnswer}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors"
                          title="Copy Answer"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handlePerformSearch(query)}
                        disabled={isLoadingAi}
                        className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-purple-300 border border-slate-800 transition-colors"
                        title="Regenerate Answer"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Loading State */}
                  {isLoadingAi && (
                    <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
                      <p className="text-xs">Consulting the Gemini knowledge model...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {aiError && !isLoadingAi && (
                    <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                        <span>Could not generate live answer</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{aiError}</p>
                      <button
                        onClick={() => handlePerformSearch(query)}
                        className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-medium text-xs transition-colors"
                      >
                        Retry Query
                      </button>
                    </div>
                  )}

                  {/* Display AI Answer */}
                  {aiAnswer && !isLoadingAi && (
                    <div className="space-y-4">
                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        <MarkdownView content={aiAnswer} />
                      </div>

                      {/* Footer Actions inside AI Answer */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleAskAssistant}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-colors font-medium text-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Continue with Learning Assistant</span>
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {answerType === 'web_grounded'
                            ? 'Grounding verified via Google Search tools.'
                            : 'Educational assistant response generated client-server securely.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: VERIFIED WEB SOURCES (When web grounding is active or configured) */}
              {(activeTabFilter === 'all' || activeTabFilter === 'web') && (
                <div className="p-4 rounded-xl bg-[#070A14] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      Verified Web Grounding Sources
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${
                      webStatus.available && webSources.length > 0
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                    }`}>
                      {webStatus.available && webSources.length > 0 ? 'Live Grounding Active' : 'Grounding Unavailable (429 Quota)'}
                    </span>
                  </div>

                  {webStatus.warning && (
                    <div className="text-[11px] text-amber-300/90 leading-relaxed bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{webStatus.warning}</span>
                    </div>
                  )}

                  {webSources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {webSources.map((ws, i) => (
                        <a
                          key={i}
                          href={ws.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E1A] hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 transition-all group"
                        >
                          <div className="flex flex-col truncate pr-2">
                            <span className="font-medium text-slate-200 group-hover:text-emerald-300 truncate">
                              {ws.title || ws.url}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate font-mono">
                              {ws.url}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    !isLoadingAi && (
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-1">
                        <p className="font-medium text-slate-300">
                          Live web search is currently unavailable. This answer is not verified against current web sources.
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Authentic sources cannot be fetched when Google Search Grounding quota is exhausted. In accordance with platform integrity, no citations, mock URLs, or fabricated dates are generated.
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* SECTION 3: IN-APP CURRICULUM MATCHES */}
              {(activeTabFilter === 'all' || activeTabFilter === 'in_app') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      Relevant In-App Lessons & Interactive Tools ({inAppResults.length})
                    </span>
                    {inAppResults.length > 0 && (
                      <span className="text-[11px] text-slate-500">
                        Click any item to launch directly in FutureAI World
                      </span>
                    )}
                  </div>

                  {inAppResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5">
                      {inAppResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleInAppAction(item)}
                          className="p-3.5 rounded-xl bg-[#080B15] hover:bg-[#0E1528] border border-slate-800/90 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800 group-hover:border-cyan-500/40 shrink-0">
                              {item.category === 'Interactive Tool' ? (
                                <Terminal className="w-4 h-4" />
                              ) : item.category === 'Career Roadmap' ? (
                                <Briefcase className="w-4 h-4" />
                              ) : item.category === 'Project Blueprint' ? (
                                <Layers className="w-4 h-4" />
                              ) : item.category === 'Mission Quest' ? (
                                <Compass className="w-4 h-4" />
                              ) : (
                                <BookOpen className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {item.title}
                                </h4>
                                {item.badgeText && (
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${item.badgeColor || 'border-slate-700 text-slate-300'}`}>
                                    {item.badgeText}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <button
                            className="px-2.5 py-1 rounded-lg bg-slate-900 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white border border-slate-800 group-hover:border-cyan-500 text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1"
                          >
                            <span>Launch</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-300">
                        No in-app curriculum lessons directly match this query
                      </h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Don't worry! The AI Dynamic Answer above explains your topic, or you can ask the interactive AI Assistant for a tailored deep dive.
                      </p>
                      <button
                        onClick={handleAskAssistant}
                        className="mt-2 px-3.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-medium transition-all"
                      >
                        Ask Learning Assistant About "{query}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Keyboard Bar */}
        <div className="px-4 py-2.5 bg-[#060810] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Enter</kbd> to search
            </span>
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">Esc</kbd> to close
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>FutureAI Universal Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
};
