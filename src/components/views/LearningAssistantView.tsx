import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  RotateCcw,
  BookOpen,
  Terminal,
  Code2,
  Bug,
  HelpCircle,
  Award,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Database,
  FileSpreadsheet,
  Cpu,
  Layers,
  Globe,
  Trash2,
  Download
} from 'lucide-react';
import { MarkdownView } from '../common/MarkdownView';
import { ActiveTab } from '../layout/Header';

export type AssistantSubject =
  | 'Python'
  | 'SQL'
  | 'Excel & Spreadsheets'
  | 'Java'
  | 'HTML & CSS'
  | 'Data Analytics & Stats'
  | 'AI & Machine Learning'
  | 'Deep Learning';

export type AssistantMode = 'explain' | 'example' | 'practice' | 'debug';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  subject?: AssistantSubject;
  mode?: AssistantMode;
  isError?: boolean;
}

interface LearningAssistantViewProps {
  onAddXp?: (amount: number, reason: string) => void;
  onNavigateToTab?: (tab: ActiveTab) => void;
  initialPrompt?: string;
  initialSubject?: AssistantSubject;
}

const SUBJECT_CONFIGS: Record<AssistantSubject, {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  starters: string[];
}> = {
  'Python': {
    icon: Terminal,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300',
    borderColor: 'border-emerald-500/40',
    starters: [
      'Explain Python list comprehensions with 3 beginner-friendly examples',
      'How to load, filter, and inspect a CSV dataset using pandas',
      'Explain *args and **kwargs in Python functions',
      'How do Python generators and the yield keyword work?'
    ]
  },
  'SQL': {
    icon: Database,
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300',
    borderColor: 'border-cyan-500/40',
    starters: [
      'Explain the difference between WHERE and HAVING in SQL with examples',
      'Write an INNER JOIN and LEFT JOIN query on employees and departments',
      'How do aggregate functions (COUNT, AVG, SUM) work with GROUP BY?',
      'How to write a subquery to find employees earning above department average'
    ]
  },
  'Excel & Spreadsheets': {
    icon: FileSpreadsheet,
    color: 'from-green-500/20 to-emerald-500/20 text-green-300',
    borderColor: 'border-green-500/40',
    starters: [
      'Explain XLOOKUP vs VLOOKUP with exact formula syntax',
      'How to use INDEX and MATCH for two-way matrix lookups',
      'Write a SUMIFS formula to sum sales for a specific department and month',
      'How to build a 12-month budget forecast in Excel with growth rates'
    ]
  },
  'Java': {
    icon: Code2,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-300',
    borderColor: 'border-amber-500/40',
    starters: [
      'Explain the 4 pillars of Object-Oriented Programming (OOP) in Java',
      'What is the difference between an ArrayList and a LinkedList?',
      'How do Java Interfaces differ from Abstract Classes?',
      'Write a clean example using Java Stream API filter and map'
    ]
  },
  'HTML & CSS': {
    icon: Globe,
    color: 'from-rose-500/20 to-pink-500/20 text-rose-300',
    borderColor: 'border-rose-500/40',
    starters: [
      'Create a modern 3-card responsive layout using Flexbox',
      'CSS Grid vs Flexbox: When should I choose each?',
      'How to build a sticky dark-mode navigation bar with Tailwind CSS',
      'Explain CSS specificity, the box model, and rem vs em units'
    ]
  },
  'Data Analytics & Stats': {
    icon: Layers,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-300',
    borderColor: 'border-blue-500/40',
    starters: [
      'Explain P-Values and statistical significance in simple everyday language',
      'What is the difference between Mean, Median, Mode, and standard deviation?',
      'How to detect and treat missing data or outliers in an analytics pipeline',
      'Correlation vs Causation: Explain with real-world business examples'
    ]
  },
  'AI & Machine Learning': {
    icon: Sparkles,
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-300',
    borderColor: 'border-purple-500/40',
    starters: [
      'Supervised vs Unsupervised vs Reinforcement learning explained simply',
      'How to diagnose Overfitting vs Underfitting and prevent it',
      'Explain Precision, Recall, F1-score, and ROC-AUC for evaluation',
      'How does a Decision Tree split data and choose the best feature?'
    ]
  },
  'Deep Learning': {
    icon: Cpu,
    color: 'from-violet-500/20 to-fuchsia-500/20 text-violet-300',
    borderColor: 'border-violet-500/40',
    starters: [
      'How does Backpropagation calculate gradients across neural layers?',
      'What is the role of Activation Functions (ReLU, Sigmoid, Softmax)?',
      'Explain Convolutional Neural Networks (CNNs) for image recognition',
      'How do Transformer Attention Mechanisms (Self-Attention) work?'
    ]
  }
};

const STORAGE_KEY = 'futureai_assistant_chat_v1';

export const LearningAssistantView: React.FC<LearningAssistantViewProps> = ({
  onAddXp,
  onNavigateToTab,
  initialPrompt,
  initialSubject
}) => {
  const [subject, setSubject] = useState<AssistantSubject>(initialSubject || 'Python');
  const [mode, setMode] = useState<AssistantMode>('explain');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: `### Welcome to your Universal AI Learning Assistant! 🚀\n\nI provide patient, interactive guidance across **Python, SQL, Excel, Java, HTML/CSS, Data Analytics, Statistics, AI, and Deep Learning**.\n\nChoose a subject above, pick a mode below, or select any question to get started. You can also paste code snippets to debug or ask for step-by-step examples!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: 'Python',
        mode: 'explain'
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Handle incoming initial prompt if passed from search
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject,
      mode
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setErrorMsg(null);

    // Format dialog history for context retention
    const historyPayload = messages
      .filter((m) => !m.isError)
      .slice(-8)
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text
      }));

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
          subject,
          mode
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Assistant service unavailable');
      }

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No answer generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject,
        mode
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Award XP for asking learning questions
      if (onAddXp) {
        onAddXp(25, `Learned with AI Assistant (${subject})`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error communicating with assistant';
      setErrorMsg(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Unable to complete response**: ${msg}\n\nPlease verify network connection or try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    const resetList: Message[] = [
      {
        id: 'new-session',
        sender: 'assistant',
        text: `### New Session Started (${subject} • ${mode.toUpperCase()})\n\nHow can I help you master **${subject}** today? Ask a question, paste code to debug, or try one of the quick prompts below!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject,
        mode
      }
    ];
    setMessages(resetList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetList));
    } catch {
      // ignore
    }
  };

  const handleExportChat = () => {
    const markdown = messages
      .map((m) => `### ${m.sender === 'user' ? 'Learner' : 'AI Assistant'} (${m.timestamp})\n\n${m.text}\n\n---\n`)
      .join('\n');
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FutureAI_Learning_Assistant_${subject.replace(/\s+/g, '_')}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentConfig = SUBJECT_CONFIGS[subject];
  const IconComponent = currentConfig.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Subject Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0C1224] via-[#090D18] to-[#120E24] border border-purple-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-600/30 shrink-0">
              <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Universal AI Learning Assistant
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/40">
                  Full Stack & STEM
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Interactive multi-turn tutor for Python, SQL, Excel, Java, HTML/CSS, Statistics, and AI/ML.
              </p>
            </div>
          </div>

          {/* Session Control Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={handleExportChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
              title="Export Conversation as Markdown"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition-colors"
              title="Reset Chat Session"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Subjects Horizontal Slider */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Select Learning Track:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {(Object.keys(SUBJECT_CONFIGS) as AssistantSubject[]).map((subjKey) => {
              const cfg = SUBJECT_CONFIGS[subjKey];
              const SubjIcon = cfg.icon;
              const isSelected = subject === subjKey;
              return (
                <button
                  key={subjKey}
                  onClick={() => setSubject(subjKey)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                    isSelected
                      ? `bg-purple-600/30 border-purple-500 text-white shadow-md shadow-purple-900/30 font-semibold`
                      : `bg-[#070A14] hover:bg-[#0D1322] border-slate-800 text-slate-300 hover:border-slate-700`
                  }`}
                >
                  <SubjIcon className="w-3.5 h-3.5" />
                  <span>{subjKey}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1">Mode:</span>
            <button
              onClick={() => setMode('explain')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'explain'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              💡 Explain Concept
            </button>
            <button
              onClick={() => setMode('example')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'example'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              💻 Step-by-Step Code
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'practice'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              🎯 Practice Challenge
            </button>
            <button
              onClick={() => setMode('debug')}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                mode === 'debug'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              🐛 Debug My Code
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Earn +25 XP per learning inquiry</span>
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="bg-[#070A14] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] sm:h-[650px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-purple-600/30 border border-purple-500/50 text-white rounded-br-sm'
                      : 'bg-[#0B101E] border border-slate-800/90 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {/* Meta tag */}
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/60 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-300">
                        {isUser ? 'Learner' : 'AI Assistant'}
                      </span>
                      {msg.subject && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-purple-300 font-mono">
                          {msg.subject}
                        </span>
                      )}
                      {msg.mode && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono uppercase">
                          {msg.mode}
                        </span>
                      )}
                    </div>
                    <span className="font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 font-sans">
                    <MarkdownView content={msg.text} />
                  </div>

                  {/* Quick Action Buttons for assistant messages */}
                  {!isUser && !msg.isError && (
                    <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {msg.text.toLowerCase().includes('python') && onNavigateToTab && (
                          <button
                            onClick={() => {
                              onNavigateToTab('world');
                              setTimeout(() => {
                                document.getElementById('interactive-playground')?.scrollIntoView({ behavior: 'smooth' });
                              }, 250);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-colors flex items-center gap-1"
                          >
                            <Terminal className="w-3 h-3" />
                            <span>Try in Python Sandbox</span>
                          </button>
                        )}
                        {msg.text.toLowerCase().includes('sql') && onNavigateToTab && (
                          <button
                            onClick={() => {
                              onNavigateToTab('world');
                              setTimeout(() => {
                                document.getElementById('interactive-playground')?.scrollIntoView({ behavior: 'smooth' });
                              }, 250);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-colors flex items-center gap-1"
                          >
                            <Database className="w-3 h-3" />
                            <span>Try in SQL Playground</span>
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Context retained across session
                      </span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs p-3 rounded-xl bg-[#0B101E] border border-slate-800 max-w-sm">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span>AI Assistant is writing step-by-step guidance...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Starter Prompts for Current Subject */}
        <div className="px-4 py-2.5 bg-[#090D18] border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Try:
            </span>
            {currentConfig.starters.map((starter, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(starter)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-purple-950/40 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-500/30 text-[11px] whitespace-nowrap transition-colors shrink-0 text-left"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#05070E] border-t border-slate-800">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }
              }}
              placeholder={`Ask any ${subject} question, request code examples, or paste code to debug... (Shift+Enter for newline)`}
              className="flex-1 bg-[#090D18] border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none font-sans"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isLoading}
              className="h-11 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
