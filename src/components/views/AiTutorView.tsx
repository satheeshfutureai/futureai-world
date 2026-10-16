import React, { useState, useEffect } from 'react';
import { TUTOR_KNOWLEDGE_BASE, STARTER_QUESTIONS, COMMON_ERRORS_DATABASE, ErrorHelpItem } from '../../data/tutorKnowledge';
import { ChatMessage, QuizQuestion, LessonDifficulty } from '../../types';
import {
  Send,
  Bot,
  Sparkles,
  Languages,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  RotateCcw,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { MarkdownView } from '../common/MarkdownView';

type LanguageMode = 'tanglish' | 'ta' | 'en';
type TutorTab = 'chat' | 'debug_error' | 'guided_practice';

interface AiTutorViewProps {
  onAddXp: (amount: number, reason?: string) => void;
  onMissionComplete?: () => void;
  onOpenArchitectureInfo?: () => void;
  userLevel?: LessonDifficulty;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  onAddXp,
  onMissionComplete,
  onOpenArchitectureInfo,
  userLevel = 'Beginner'
}) => {
  const [activeTab, setActiveTab] = useState<TutorTab>('chat');
  const [langMode, setLangMode] = useState<LanguageMode>('tanglish');
  const [currentLevel, setCurrentLevel] = useState<LessonDifficulty>(userLevel);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverHealth, setServerHealth] = useState<{ status: string; hasApiKey: boolean; model: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Conversation history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'tutor',
      language: 'tanglish',
      timestamp: 'Just now',
      isLiveAI: true,
      modelName: 'Gemini 3.8 Flash',
      text: "Vanakkam! I'm Aura, your AI mentor powered by Gemini 3.8 Flash. I can explain any AI, coding, data, or career topic in conversational Tanglish, Tamil, or English. Ask me an open-ended question, paste code to debug, or try a starter question!"
    }
  ]);

  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);

  // Error debugger state
  const [selectedError, setSelectedError] = useState<ErrorHelpItem>(COMMON_ERRORS_DATABASE[0]);
  const [customErrorInput, setCustomErrorInput] = useState('');
  const [customErrorLoading, setCustomErrorLoading] = useState(false);
  const [customErrorResult, setCustomErrorResult] = useState<string | null>(null);

  // Guided practice state
  const [practiceReviews, setPracticeReviews] = useState<Record<number, { text: string; loading: boolean }>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});

  const practiceItems = TUTOR_KNOWLEDGE_BASE.filter((k) => k.guidedPractice);

  // Check server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch((err) => {
        console.warn('Could not reach /api/health:', err);
        setServerHealth({ status: 'offline', hasApiKey: false, model: 'gemini-3.8-flash' });
      });
  }, []);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (queryText?: string, retryMessage?: ChatMessage) => {
    const textToSend = queryText || inputValue.trim();
    if (!textToSend || isLoading) return;

    // Create user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      language: langMode,
      timestamp: 'Just now'
    };

    if (!retryMessage) {
      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6),
          language: langMode,
          level: currentLevel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const tutorReply: ChatMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: data.reply,
        language: langMode,
        timestamp: 'Just now',
        isLiveAI: true,
        modelName: data.model || 'Gemini 3.8 Flash'
      };

      setMessages((prev) => [...prev, tutorReply]);
      onAddXp(25, 'Consulted Aura Live AI Tutor (+25 XP)');

      if (onMissionComplete) {
        onMissionComplete();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
      console.error('Tutor Chat Error:', errorMessage);

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'tutor',
        text: `⚠️ **AI Service Notice:** ${errorMessage}\n\nPlease check your internet connection or verify that GEMINI_API_KEY is configured in the server secrets.`,
        language: langMode,
        timestamp: 'Just now',
        isError: true,
        retryable: true,
        originalQuery: textToSend
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugCustomError = async () => {
    if (!customErrorInput.trim() || customErrorLoading) return;
    setCustomErrorLoading(true);
    setCustomErrorResult(null);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Debug and explain this error message:\n\n${customErrorInput.trim()}\n\nExplain why it occurred, show the exact fix, and provide a prevention tip in ${langMode.toUpperCase()}.`,
          language: langMode,
          level: currentLevel
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze error.');
      }
      setCustomErrorResult(data.reply);
      onAddXp(30, 'Analyzed custom error with Gemini (+30 XP)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error analyzing code.';
      setCustomErrorResult(`⚠️ Could not reach AI service: ${msg}`);
    } finally {
      setCustomErrorLoading(false);
    }
  };

  const handleReviewPractice = async (idx: number, goal: string, starterText: string) => {
    const studentAnswer = practiceAnswers[idx] || '';
    if (!studentAnswer.trim()) return;

    setPracticeReviews((prev) => ({
      ...prev,
      [idx]: { text: '', loading: true }
    }));

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `The student is completing this exercise:\nGoal: ${goal}\nExercise: ${starterText}\n\nStudent Answer:\n"${studentAnswer}"\n\nPlease evaluate their answer kindly in ${langMode.toUpperCase()}. Tell them what they did right, any missing details, and award positive feedback.`,
          language: langMode,
          level: currentLevel
        })
      });

      const data = await response.json();
      setPracticeReviews((prev) => ({
        ...prev,
        [idx]: { text: data.reply || data.error, loading: false }
      }));
      onAddXp(50, 'Completed and verified Guided Practice (+50 XP)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error evaluating practice';
      setPracticeReviews((prev) => ({
        ...prev,
        [idx]: { text: `⚠️ Review failed: ${msg}`, loading: false }
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-purple-900/30 bg-[#0B0F1C] p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="/src/assets/images/avatar_cyber_tutor_1792125158105.jpg"
                alt="Aura AI Tutor"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/60 shadow-lg shadow-purple-600/30"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#0B0F1C] rounded-full ${
                  serverHealth?.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
                title={serverHealth?.hasApiKey ? 'Connected to Gemini API' : 'API Key Setup Needed'}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Aura Personal AI Tutor
                </h2>
                {serverHealth?.hasApiKey ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>Gemini 3.8 Flash Live</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>API Key Required on Server</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real generative AI mentor delivering adaptive explanations in English, Tamil, and conversational Tanglish
              </p>
            </div>
          </div>

          {/* Right Controls: Learner Level & Language Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Level Selector */}
            <div className="flex items-center gap-1 p-1 bg-[#070A12] border border-slate-800 rounded-xl text-xs">
              <span className="text-slate-500 text-[11px] px-1.5 font-medium">Level:</span>
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setCurrentLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    currentLevel === lvl
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#070A12] border border-slate-800 rounded-xl text-xs">
              <Languages className="w-3.5 h-3.5 text-purple-400 ml-1.5" />
              <button
                onClick={() => setLangMode('tanglish')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  langMode === 'tanglish'
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tanglish
              </button>
              <button
                onClick={() => setLangMode('ta')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  langMode === 'ta'
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLangMode('en')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  langMode === 'en'
                    ? 'bg-purple-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Feature Mode Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Live Chat & Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('debug_error')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'debug_error'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Error Debugger</span>
          </button>

          <button
            onClick={() => setActiveTab('guided_practice')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'guided_practice'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guided Practice</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Live Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Starter Chips */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Recommended Starter Questions (Click to Ask Live):
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {STARTER_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0F1424] hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-xs font-medium text-slate-300 hover:text-purple-300 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-[#0A0E1A] border border-slate-800 rounded-2xl flex flex-col h-[540px] overflow-hidden shadow-xl">
            {/* Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isTutor = msg.sender === 'tutor';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${isTutor ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {isTutor && (
                      <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-purple-300" />
                      </div>
                    )}

                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.isError
                          ? 'bg-rose-950/40 border border-rose-500/50 text-rose-200'
                          : isTutor
                          ? 'bg-[#12182B] border border-slate-800 text-slate-200 shadow-sm'
                          : 'bg-purple-600 text-white font-medium ml-12'
                      }`}
                    >
                      {/* Live Badge for model output */}
                      {isTutor && (
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-purple-400 font-mono">
                            <Sparkles className="w-3 h-3" />
                            {msg.modelName || 'Gemini 3.8 Flash'}
                          </span>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}

                      {msg.isError ? (
                        <div className="whitespace-pre-line text-rose-200">
                          {msg.text}
                        </div>
                      ) : (
                        <MarkdownView content={msg.text} />
                      )}

                      {/* Retry Button if error */}
                      {msg.isError && msg.originalQuery && (
                        <div className="mt-3 pt-2 border-t border-rose-900/40 flex justify-end">
                          <button
                            onClick={() => handleSendMessage(msg.originalQuery, msg)}
                            disabled={isLoading}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Retry Question</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#12182B] border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Aura is reasoning with Gemini 3.8 Flash in {langMode.toUpperCase()}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-[#0B0F1C] border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                placeholder={`Ask Aura anything (e.g., "Explain AI vs ML in Tanglish", "Teach me Python variables")...`}
                className="flex-1 bg-[#060810] border border-slate-800 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 whitespace-nowrap"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mode 2: Explain a Code Error */}
      {activeTab === 'debug_error' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#090D1A] border border-amber-500/20 text-xs text-amber-200">
            <span className="font-bold block mb-1">Code Debugger & Diagnostic Engine:</span>
            Paste any red error message from your terminal, Python interpreter, or SQL database. Aura uses live Gemini reasoning to explain the root cause and provide the exact fix.
          </div>

          {/* Custom Error Input Box */}
          <div className="p-5 rounded-2xl bg-[#0A0E1A] border border-slate-800 space-y-3">
            <label className="block text-xs font-bold text-slate-200">
              Paste Any Terminal Error Message or Python Traceback:
            </label>
            <textarea
              rows={4}
              value={customErrorInput}
              onChange={(e) => setCustomErrorInput(e.target.value)}
              placeholder="e.g. ValueError: could not convert string to float: 'N/A' or IndentationError: unindent does not match any outer indentation level"
              className="w-full bg-[#060810] border border-slate-800 focus:border-purple-500/50 rounded-xl p-3 text-xs font-mono text-cyan-200 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleDebugCustomError}
                disabled={!customErrorInput.trim() || customErrorLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {customErrorLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{customErrorLoading ? 'Analyzing Error...' : 'Diagnose with Gemini'}</span>
              </button>
            </div>

            {/* Custom Error Result Display */}
            {customErrorResult && (
              <div className="p-4 rounded-xl bg-[#08101E] border border-purple-500/40 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-cyan-300">Aura AI Diagnostic Analysis</span>
                  <span className="text-[10px] text-purple-400 font-mono">Gemini 3.8 Flash</span>
                </div>
                <MarkdownView content={customErrorResult} />
              </div>
            )}
          </div>

          {/* Quick Pre-Computed Beginner Errors */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Common Beginner Python & SQL Errors (Click to Inspect):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_ERRORS_DATABASE.map((err) => (
                <button
                  key={err.id}
                  onClick={() => setSelectedError(err)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedError.id === err.id
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-400 font-mono inline-block mb-1">
                    {err.category}
                  </span>
                  <div className="font-mono text-xs font-semibold text-slate-100 truncate">
                    {err.errorName}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pre-Computed Error Detail */}
          <div className="p-6 rounded-2xl bg-[#0A0E1A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>{selectedError.errorName}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Category: {selectedError.category}
              </span>
            </div>

            <div className="p-3 bg-[#060810] border border-rose-950/80 rounded-xl font-mono text-xs text-rose-300">
              <code>{selectedError.sampleErrorMessage}</code>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <strong className="text-cyan-300 block">Plain English Explanation:</strong>
                <p className="text-slate-300 leading-relaxed">{selectedError.explanationEng}</p>
              </div>

              <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-xl space-y-1.5">
                <strong className="text-purple-300 block">Tanglish & Tamil விளக்கம்:</strong>
                <p className="text-indigo-200 leading-relaxed mb-2">{selectedError.explanationTanglish}</p>
                <p className="text-purple-200 border-t border-indigo-900/40 pt-2 text-[11px]">{selectedError.explanationTamil}</p>
              </div>
            </div>

            <div>
              <strong className="text-emerald-400 text-xs block mb-2 font-semibold">
                ✓ Verified Fix & Clean Syntax:
              </strong>
              <div className="p-4 bg-[#05070E] border border-emerald-500/30 rounded-xl overflow-x-auto">
                <pre className="font-mono text-xs text-emerald-300 leading-relaxed">
                  {selectedError.fixSolution}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Guided Practice */}
      {activeTab === 'guided_practice' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#090D1A] border border-cyan-500/20 text-xs text-cyan-200">
            <span className="font-bold block mb-1">AI-Assisted Guided Exercises:</span>
            Write your answer to the practice challenge below and click "Get AI Review" to have Gemini 3.8 Flash grade your logic and suggest improvements!
          </div>

          {practiceItems.map((item, idx) => {
            const p = item.guidedPractice!;
            const review = practiceReviews[idx];
            return (
              <div key={idx} className="p-6 rounded-2xl bg-[#0A0E1A] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                    Exercise 0{idx + 1}: {item.title}
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">+50 XP</span>
                </div>

                <h4 className="text-sm font-bold text-white">
                  Goal: {p.goal}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {p.starterText}
                </p>

                {/* User Answer Input */}
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={2}
                    value={practiceAnswers[idx] || ''}
                    onChange={(e) => setPracticeAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                    placeholder="Type your answer here to have Aura evaluate it..."
                    className="w-full bg-[#060810] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleReviewPractice(idx, p.goal, p.starterText)}
                      disabled={!(practiceAnswers[idx] || '').trim() || review?.loading}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {review?.loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      <span>{review?.loading ? 'Aura is Reviewing...' : 'Get AI Review on My Answer'}</span>
                    </button>
                    <span className="text-[11px] text-slate-500">Hint: {p.solutionHint}</span>
                  </div>
                </div>

                {/* AI Review Result */}
                {review && review.text && (
                  <div className="mt-3 p-4 bg-[#08101E] border border-cyan-500/40 rounded-xl text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                    <strong className="text-cyan-300 block mb-1">Aura AI Tutor Feedback:</strong>
                    <MarkdownView content={review.text} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
