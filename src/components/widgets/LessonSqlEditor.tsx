import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Database,
  Terminal,
  Loader2,
  Trash2,
  Filter
} from 'lucide-react';
import { executeSqlQuery, SqlExecutionResponse } from '../../services/sqlEngine';

interface LessonSqlEditorProps {
  initialQuery?: string;
  onQueryRun?: () => void;
}

const DEFAULT_LESSON_QUERY = `SELECT 
    department, 
    COUNT(employee_id) AS total_staff,
    AVG(salary) AS avg_salary
FROM employees
WHERE performance_rating >= 4.0
GROUP BY department
HAVING COUNT(employee_id) > 2
ORDER BY avg_salary DESC;`;

export const LessonSqlEditor: React.FC<LessonSqlEditorProps> = ({
  initialQuery = DEFAULT_LESSON_QUERY,
  onQueryRun
}) => {
  const [queryText, setQueryText] = useState<string>(initialQuery);
  const [executionResponse, setExecutionResponse] = useState<SqlExecutionResponse>(() =>
    executeSqlQuery(initialQuery)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Re-run if initialQuery changes
  useEffect(() => {
    setQueryText(initialQuery);
    setExecutionResponse(executeSqlQuery(initialQuery));
  }, [initialQuery]);

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    // Slight tick for visual feedback
    setTimeout(() => {
      const resp = executeSqlQuery(queryText);
      setExecutionResponse(resp);
      setIsRunning(false);
      if (resp.success && onQueryRun) {
        onQueryRun();
      }
    }, 90);
  };

  const handleReset = () => {
    setQueryText(initialQuery);
    const resp = executeSqlQuery(initialQuery);
    setExecutionResponse(resp);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleClear = () => {
    setQueryText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Keyboard controls: Tab for 4 spaces indentation, Ctrl+Enter to run
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const nextVal = queryText.substring(0, start) + '    ' + queryText.substring(end);
      setQueryText(nextVal);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Calculate lines for gutter
  const lineCount = Math.max(queryText.split('\n').length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const queryResult = executionResponse.result;

  return (
    <div className="my-4 rounded-xl border border-cyan-500/30 bg-[#070B16] p-3.5 sm:p-4 shadow-xl shadow-cyan-950/20">
      {/* Editor Header Bar with Badges and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">Interactive SQL Code Editor</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Database className="w-2.5 h-2.5 text-emerald-400" />
                <span>Live Query Engine</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Select all, edit query clauses, and execute directly against the sample employee records.
            </p>
          </div>
        </div>

        {/* Buttons: Copy Code, Reset Query, Run Query */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#0A0F1D] border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1.5 transition-colors"
            title="Copy Code to Clipboard"
            type="button"
          >
            {copiedQuery ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#0A0F1D] border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Reset to original lesson query"
            type="button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Query</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            type="button"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Run Query</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div className="relative rounded-xl border border-slate-800 bg-[#05070E] overflow-hidden focus-within:border-emerald-500/60 transition-colors mb-3">
        {/* Editor Sub-toolbar */}
        <div className="px-3 py-1.5 bg-[#090D18] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="ml-1 text-emerald-300 font-semibold">lesson_query.sql</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[10px] hidden sm:inline">Press Ctrl+Enter to Run</span>
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-300 transition-colors"
              title="Clear editor contents"
              type="button"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Textarea with Gutter */}
        <div className="flex font-mono text-xs leading-relaxed min-h-[160px]">
          {/* Line Numbers Gutter */}
          <div
            className="select-none py-3 px-2.5 text-right text-slate-600 bg-[#04060C] border-r border-slate-800/70 font-mono text-[11px]"
            aria-hidden="true"
          >
            {lineNumbers.map((num) => (
              <div key={num} className="leading-relaxed">
                {num}
              </div>
            ))}
          </div>

          {/* Editable Textarea with full select all, type, delete support */}
          <textarea
            ref={textareaRef}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.max(lineCount, 7)}
            className="flex-1 bg-transparent text-emerald-300 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed overflow-x-auto whitespace-pre selection:bg-emerald-900/60 selection:text-white"
            placeholder="Type your SELECT query here..."
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Editable Lesson SQL Query"
          />
        </div>
      </div>

      {/* Execution Status / Error / Success Banner */}
      {!executionResponse.success ? (
        <div className="p-3 mb-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-rose-300 mb-0.5 font-bold">SQL Error:</strong>
            <p className="font-mono text-[11px] leading-relaxed">{executionResponse.error}</p>
            <span className="text-[10px] text-rose-300/70 mt-1 block">
              Tip: Click &quot;Reset Query&quot; above to restore the original working query or check column names.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Query returned <strong className="text-emerald-300 tabular-nums">{queryResult?.rowCount || 0}</strong>{' '}
              {queryResult?.rowCount === 1 ? 'row' : 'rows'}
            </span>
          </div>
          {queryResult?.executionTimeMs !== undefined && (
            <span className="font-mono text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              ⚡ {queryResult.executionTimeMs}ms
            </span>
          )}
        </div>
      )}

      {/* Dynamic Results Table */}
      {executionResponse.success && queryResult && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#05070E]">
          {queryResult.rows.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              <Filter className="w-5 h-5 text-slate-600 mx-auto mb-1.5" />
              <p className="font-medium text-slate-300">0 rows matched this query criteria.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Try relaxing the WHERE or HAVING conditions (e.g. performance_rating &gt;= 3.5).
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D18] text-slate-300 border-b border-slate-800 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  {queryResult.columns.map((col, idx) => (
                    <th key={idx} className="py-2 px-3 whitespace-nowrap">
                      {formatHeaderLabel(col)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {queryResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-emerald-950/20 transition-colors">
                    {queryResult.columns.map((col, cIdx) => {
                      const val = row[col];
                      return (
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap text-slate-200">
                          {formatCellValue(col, val)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Dataset Context Bar */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
        <span>Connected to Sample Enterprise Dataset (employees table: 8 records)</span>
        <span className="font-mono text-emerald-400/80">Ctrl+A to select all • Tab to indent</span>
      </div>
    </div>
  );
};

function formatHeaderLabel(colName: string): string {
  if (colName.toLowerCase() === 'id') return 'ID';
  if (colName.toLowerCase() === 'dept' || colName.toLowerCase() === 'department') return 'Department';
  if (colName.toLowerCase() === 'salary') return 'Salary (₹)';
  if (colName.toLowerCase() === 'avg_salary') return 'Avg Salary (₹)';
  if (colName.toLowerCase() === 'rating' || colName.toLowerCase() === 'performance_rating') return 'Rating';
  if (colName.toLowerCase() === 'total_staff') return 'Total Staff';
  return colName.replace(/_/g, ' ');
}

function formatCellValue(colName: string, val: any): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-slate-600">NULL</span>;
  if (typeof val === 'number') {
    const colLower = colName.toLowerCase();
    if (colLower.includes('salary') || colLower.includes('budget')) {
      return (
        <span className="text-emerald-300 font-semibold">
          ₹{val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
      );
    }
    if (colLower.includes('rating')) {
      return <span className="text-amber-300 font-bold">{val.toFixed(1)} ★</span>;
    }
    return <span className="text-cyan-300">{val}</span>;
  }
  return String(val);
}
