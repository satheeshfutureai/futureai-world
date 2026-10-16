import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Terminal,
  Loader2,
  Trash2,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import {
  executePythonCode,
  subscribePyodideStatus,
  PyodideStatus
} from '../../services/pyodideService';

interface CodeTemplate {
  name: string;
  description: string;
  code: string;
}

const CODE_TEMPLATES: CodeTemplate[] = [
  {
    name: 'Quick Test & Print',
    description: 'Basic prints, math expressions, and string formatting',
    code: `# Basic Python prints and calculations
print("Hello World")
print(2 + 3)

# String formatting and variables
student_name = "FutureAI Explorer"
starting_xp = 150
print(f"Welcome {student_name}! Starting XP: {starting_xp}")`
  },
  {
    name: 'Student Score Analyzer',
    description: 'List comprehensions, dictionary iteration, and statistics',
    code: `# Calculate top performing AI students
students = [
    {"name": "Ananya", "score": 94, "zone": "AI Basics"},
    {"name": "Karthik", "score": 88, "zone": "Python"},
    {"name": "Siddharth", "score": 96, "zone": "Data Analytics"},
    {"name": "Meera", "score": 79, "zone": "Python"}
]

# Filter high achievers (score >= 85)
high_achievers = [s["name"] for s in students if s["score"] >= 85]
avg_score = sum(s["score"] for s in students) / len(students)

print(f"Total Evaluated: {len(students)}")
print(f"High Achievers (>=85%): {', '.join(high_achievers)}")
print(f"Batch Average: {avg_score:.2f}%")`
  },
  {
    name: 'Pandas Data Filter',
    description: 'Real in-browser Pandas DataFrame creation and column querying',
    code: `import pandas as pd

# Load IT applicant dataset
data = {
    'Candidate': ['Ramesh', 'Divya', 'Arjun', 'Sneha', 'Vikram'],
    'Skills': ['SQL, Python', 'Excel, Tableau', 'PyTorch, Python', 'PowerBI', 'Python, Scikit-Learn'],
    'YearsExp': [1, 3, 2, 4, 2]
}
df = pd.DataFrame(data)

print("--- Full IT Applicants Dataset ---")
print(df)

# Filter applicants who specialize in Python
python_devs = df[df['Skills'].str.contains('Python')]
print("\n--- Filtered Python Developers ---")
print(python_devs[['Candidate', 'Skills', 'YearsExp']])`
  },
  {
    name: 'Algorithms & Loops',
    description: 'Custom function, while loop, and Fibonacci generator',
    code: `# Fibonacci sequence generator function
def generate_fibonacci(n):
    fib = [0, 1]
    while len(fib) < n:
        fib.append(fib[-1] + fib[-2])
    return fib

count = 8
result = generate_fibonacci(count)
print(f"First {count} Fibonacci numbers: {result}")
print(f"Sum of series: {sum(result)}")`
  }
];

export const PythonTester: React.FC<{ onRun?: () => void }> = ({ onRun }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [code, setCode] = useState(CODE_TEMPLATES[0].code);
  const [output, setOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [engineStatus, setEngineStatus] = useState<PyodideStatus>('unloaded');
  const [copiedOutput, setCopiedOutput] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const unsubscribe = subscribePyodideStatus((status) => {
      setEngineStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    setCode(CODE_TEMPLATES[idx].code);
    setOutput(null);
    setIsError(false);
    setExecutionTime(null);
    setProgressMsg(null);
  };

  const handleRun = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setIsError(false);
    setProgressMsg('Initializing WebAssembly runtime...');

    try {
      const result = await executePythonCode(code, (status) => {
        setProgressMsg(status);
      });

      setOutput(result.output);
      setIsError(!result.success);
      setExecutionTime(result.executionTimeMs);

      if (result.success && onRun) {
        onRun();
      }
    } catch (err: any) {
      setOutput(err?.message || 'Unexpected execution failure.');
      setIsError(true);
    } finally {
      setIsRunning(false);
      setProgressMsg(null);
    }
  };

  const handleReset = () => {
    setCode(CODE_TEMPLATES[activeTab].code);
    setOutput(null);
    setIsError(false);
    setExecutionTime(null);
    setProgressMsg(null);
  };

  const handleClearOutput = () => {
    setOutput(null);
    setIsError(false);
    setExecutionTime(null);
  };

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard?.writeText(output);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Keyboard navigation: Tab inserts 4 spaces, Ctrl+Enter / Cmd+Enter runs code
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      // Set new text with 4 spaces inserted
      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);

      // Move cursor after the inserted spaces
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      });
    }
  };

  // Generate line numbers for gutter
  const lineCount = Math.max(code.split('\n').length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="bg-[#0B101D] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 my-5 shadow-xl shadow-cyan-950/20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Interactive Python Sandbox</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>Pyodide WASM Engine</span>
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Real in-browser Python 3.12 execution. Edit code, test logic, and inspect live console output.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#060911] border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Reset code to template default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Code Template Chips */}
      <div className="mb-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Preset Curriculum Templates:
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CODE_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleTabChange(idx)}
              disabled={isRunning}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === idx
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                  : 'bg-[#060911] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div className="relative rounded-xl border border-slate-800 bg-[#060911] overflow-hidden focus-within:border-cyan-500/60 transition-colors">
        {/* Editor Toolbar */}
        <div className="px-3.5 py-1.5 bg-[#090D18] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-cyan-300 font-semibold">{CODE_TEMPLATES[activeTab].name}.py</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[10px]">
            <span className="hidden sm:inline">Press Ctrl+Enter to Run</span>
            <span>Lines: {lineCount}</span>
          </div>
        </div>

        {/* Code Input Area with Gutter */}
        <div className="flex font-mono text-xs leading-relaxed min-h-[220px]">
          {/* Line Numbers Gutter */}
          <div
            className="select-none py-3 px-2.5 text-right text-slate-600 bg-[#050810] border-r border-slate-800/70 font-mono text-[11px]"
            aria-hidden="true"
          >
            {lineNumbers.map((num) => (
              <div key={num} className="leading-relaxed">
                {num}
              </div>
            ))}
          </div>

          {/* Editable Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.max(lineCount, 9)}
            className="flex-1 bg-transparent text-cyan-200 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed overflow-x-auto whitespace-pre selection:bg-cyan-900/60 selection:text-white"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Python Code Editor"
          />
        </div>
      </div>

      {/* Progress / Status Notice */}
      {isRunning && progressMsg && (
        <div className="mt-3 px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
          <span>{progressMsg}</span>
        </div>
      )}

      {/* Execution Output Console */}
      {output !== null && (
        <div
          className={`mt-4 rounded-xl border p-4 transition-all animate-in fade-in duration-200 ${
            isError
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              : 'bg-[#060911] border-emerald-500/40 text-slate-100'
          }`}
        >
          {/* Console Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              {isError ? (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">Execution Error (Traceback)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Execution Output (Console)</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              {executionTime !== null && (
                <span className="font-mono text-[11px] text-slate-500">
                  ⚡ {executionTime}ms
                </span>
              )}

              <button
                onClick={handleCopyOutput}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy Output"
              >
                {copiedOutput ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={handleClearOutput}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-300 transition-colors"
                title="Clear Output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Console Output Body */}
          <pre
            className={`font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed ${
              isError ? 'text-rose-300' : 'text-slate-200'
            }`}
          >
            {output}
          </pre>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              engineStatus === 'ready'
                ? 'bg-emerald-400'
                : engineStatus === 'loading'
                ? 'bg-amber-400 animate-ping'
                : 'bg-slate-600'
            }`}
          />
          <span>
            {engineStatus === 'ready'
              ? 'WASM Runtime Ready (Python 3.12)'
              : engineStatus === 'loading'
              ? 'Loading WebAssembly Pyodide...'
              : 'Client-Side Sandbox Ready'}
          </span>
        </span>
        <span className="text-slate-500">
          Tip: You can import standard math, random, json, collections, and pandas
        </span>
      </div>
    </div>
  );
};
