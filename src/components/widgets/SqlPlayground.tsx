import React, { useState, useRef, useEffect } from 'react';
import {
  Database,
  Filter,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Layers,
  Copy,
  Check,
  Trash2,
  Info,
  PlusCircle,
  Building2,
  Table as TableIcon
} from 'lucide-react';
import {
  executeSqlQuery,
  SqlExecutionResponse,
  QueryResult,
  listAvailableTables,
  resetCustomTables
} from '../../services/sqlEngine';

interface SqlPreset {
  name: string;
  category: string;
  query: string;
  description: string;
}

const ENTERPRISE_PRESETS: SqlPreset[] = [
  {
    name: 'All High Performers',
    category: 'Filter & Sort',
    description: 'Filter rating >= 4.5 and sort by compensation descending',
    query: `SELECT * 
FROM employees 
WHERE rating >= 4.5 
ORDER BY salary DESC;`
  },
  {
    name: 'AI Engineering Team',
    category: 'Exact Match',
    description: 'Project specific columns for AI Engineering staff',
    query: `SELECT name, salary, rating 
FROM employees 
WHERE dept = 'AI Engineering';`
  },
  {
    name: 'Salary >= ₹10 Lakhs',
    category: 'Numeric Filter',
    description: 'Find all staff earning at or above ₹10 LPA (1,000,000)',
    query: `SELECT name, dept, salary 
FROM employees 
WHERE salary >= 1000000 
ORDER BY salary DESC;`
  },
  {
    name: 'Dept Aggregates',
    category: 'GROUP BY & HAVING',
    description: 'Calculate average compensation and staff counts by department',
    query: `SELECT 
    dept, 
    COUNT(id) AS total_staff, 
    AVG(salary) AS avg_salary,
    AVG(rating) AS avg_rating
FROM employees 
GROUP BY dept 
HAVING COUNT(id) >= 2 
ORDER BY avg_salary DESC;`
  },
  {
    name: 'Department JOIN',
    category: 'INNER JOIN',
    description: 'Relational join between employees and departments tables',
    query: `SELECT 
    e.name, 
    e.dept, 
    e.salary, 
    d.location, 
    d.manager 
FROM employees e 
JOIN departments d ON e.dept = d.dept_name 
ORDER BY e.salary DESC;`
  },
  {
    name: 'Top 3 by Rating',
    category: 'LIMIT',
    description: 'Top rated staff with limit clause',
    query: `SELECT name, dept, rating, salary 
FROM employees 
ORDER BY rating DESC, salary DESC 
LIMIT 3;`
  }
];

const CUSTOM_PRACTICE_TEMPLATES: SqlPreset[] = [
  {
    name: 'Student Gradebook',
    category: 'DDL & DML',
    description: 'Create custom students table, insert test records, and compute track statistics',
    query: `-- 1. Create a custom students table
CREATE TABLE students (
    id INT,
    name VARCHAR(50),
    track VARCHAR(50),
    score INT,
    city VARCHAR(50)
);

-- 2. Insert user-defined student records
INSERT INTO students (id, name, track, score, city) VALUES
    (1, 'Ananya Sharma', 'AI Engineering', 94, 'Bengaluru'),
    (2, 'Karthik Raja', 'Data Analytics', 88, 'Chennai'),
    (3, 'Pooja Nair', 'AI Engineering', 96, 'Kochi'),
    (4, 'Deepak Verma', 'Cloud DevOps', 79, 'Hyderabad'),
    (5, 'Sneha Patel', 'Data Analytics', 91, 'Bengaluru'),
    (6, 'Rohan Das', 'AI Engineering', 85, 'Chennai');

-- 3. Query aggregated performance by track
SELECT 
    track, 
    COUNT(id) AS total_students, 
    AVG(score) AS avg_score,
    MAX(score) AS top_score
FROM students
WHERE score >= 80
GROUP BY track
ORDER BY avg_score DESC;`
  },
  {
    name: 'E-Commerce Inventory',
    category: 'Inventory',
    description: 'Create products table, insert stock items, and calculate category valuations',
    query: `-- 1. Create custom products table
CREATE TABLE products (
    product_id INT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price INT,
    stock_qty INT
);

-- 2. Insert custom inventory items
INSERT INTO products (product_id, product_name, category, price, stock_qty) VALUES
    (101, 'Neural Edge TPU V2', 'Hardware', 24999, 15),
    (102, 'Vision Sensor Pro', 'Hardware', 12450, 8),
    (103, 'AI Cloud Subscription', 'SaaS', 3499, 120),
    (104, 'Data Pipeline Suite', 'Software', 8999, 45),
    (105, 'Quantum Simulator Dongle', 'Hardware', 45000, 3);

-- 3. Find category stock statistics
SELECT 
    category,
    COUNT(product_id) AS items_count,
    AVG(price) AS avg_category_price,
    SUM(stock_qty) AS total_units_in_stock
FROM products
WHERE stock_qty > 0
GROUP BY category
ORDER BY avg_category_price DESC;`
  },
  {
    name: 'AI Prompt Registry',
    category: 'AI Benchmarks',
    description: 'Create an AI prompt benchmark table and evaluate token usage by model',
    query: `-- 1. Create prompt experiments table
CREATE TABLE ai_prompts (
    prompt_id INT,
    title VARCHAR(60),
    model VARCHAR(40),
    tokens_used INT,
    rating DECIMAL(2,1)
);

-- 2. Insert prompt benchmark logs
INSERT INTO ai_prompts (prompt_id, title, model, tokens_used, rating) VALUES
    (1, 'Python Code Explainer', 'gemini-3.8-flash', 142, 4.9),
    (2, 'SQL Query Generator', 'gemini-3.8-flash', 98, 4.7),
    (3, 'Data Cleaning Script', 'gemini-2.5-flash', 210, 4.2),
    (4, 'Tamil Tutor Assistant', 'gemini-3.8-flash', 165, 4.8),
    (5, 'Resume Analyzer', 'gemini-2.5-flash', 320, 3.9);

-- 3. Analyze performance and tokens by model
SELECT 
    model, 
    COUNT(prompt_id) AS prompt_count, 
    AVG(rating) AS avg_rating, 
    AVG(tokens_used) AS avg_tokens
FROM ai_prompts
WHERE rating >= 4.0
GROUP BY model
ORDER BY avg_rating DESC;`
  },
  {
    name: 'Blank Custom Table',
    category: 'Blank Canvas',
    description: 'Start from scratch: create your own table, insert your rows, and query them',
    query: `-- Step 1: Create your custom table
CREATE TABLE my_table (
    id INT,
    item_name TEXT,
    metric_value INT
);

-- Step 2: Insert your custom records
INSERT INTO my_table (id, item_name, metric_value) VALUES
    (1, 'Alpha Project', 120),
    (2, 'Beta Prototype', 280),
    (3, 'Gamma Release', 390);

-- Step 3: Run your query
SELECT * 
FROM my_table 
WHERE metric_value >= 150 
ORDER BY metric_value DESC;`
  }
];

export const SqlPlayground: React.FC<{ onQueryRun?: () => void }> = ({ onQueryRun }) => {
  const [activeMode, setActiveMode] = useState<'enterprise' | 'custom'>('custom');
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [queryText, setQueryText] = useState<string>(CUSTOM_PRACTICE_TEMPLATES[0].query);
  const [executionResponse, setExecutionResponse] = useState<SqlExecutionResponse>(() =>
    executeSqlQuery(CUSTOM_PRACTICE_TEMPLATES[0].query)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedQuery, setCopiedQuery] = useState<boolean>(false);
  const [showSchemaHint, setShowSchemaHint] = useState<boolean>(false);
  const [availableTables, setAvailableTables] = useState(() => listAvailableTables());

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Refresh available tables list
  const refreshTables = () => {
    setAvailableTables(listAvailableTables());
  };

  const handleSelectMode = (mode: 'enterprise' | 'custom') => {
    setActiveMode(mode);
    setSelectedPreset(0);
    const initialTmpl = mode === 'enterprise' ? ENTERPRISE_PRESETS[0] : CUSTOM_PRACTICE_TEMPLATES[0];
    setQueryText(initialTmpl.query);
    const resp = executeSqlQuery(initialTmpl.query);
    setExecutionResponse(resp);
    refreshTables();
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    const presets = activeMode === 'enterprise' ? ENTERPRISE_PRESETS : CUSTOM_PRACTICE_TEMPLATES;
    const newQuery = presets[idx].query;
    setQueryText(newQuery);
    const resp = executeSqlQuery(newQuery);
    setExecutionResponse(resp);
    refreshTables();
    if (resp.success && onQueryRun) {
      onQueryRun();
    }
  };

  const handleExecute = () => {
    setIsRunning(true);
    setTimeout(() => {
      const resp = executeSqlQuery(queryText);
      setExecutionResponse(resp);
      setIsRunning(false);
      refreshTables();
      if (resp.success && onQueryRun) {
        onQueryRun();
      }
    }, 80);
  };

  const handleReset = () => {
    const presets = activeMode === 'enterprise' ? ENTERPRISE_PRESETS : CUSTOM_PRACTICE_TEMPLATES;
    const defaultQuery = presets[selectedPreset].query;
    setQueryText(defaultQuery);
    const resp = executeSqlQuery(defaultQuery);
    setExecutionResponse(resp);
    refreshTables();
  };

  const handleClear = () => {
    setQueryText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleResetDatabase = () => {
    resetCustomTables();
    refreshTables();
    const presets = activeMode === 'enterprise' ? ENTERPRISE_PRESETS : CUSTOM_PRACTICE_TEMPLATES;
    const resp = executeSqlQuery(presets[selectedPreset].query);
    setExecutionResponse(resp);
  };

  const handleTableClick = (tableName: string) => {
    const tableQuery = `SELECT * FROM ${tableName};`;
    setQueryText(tableQuery);
    const resp = executeSqlQuery(tableQuery);
    setExecutionResponse(resp);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCopyQuery = () => {
    navigator.clipboard?.writeText(queryText);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const updated = queryText.substring(0, start) + spaces + queryText.substring(end);
      setQueryText(updated);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      });
    }
  };

  const lineCount = Math.max(queryText.split('\n').length, 1);
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const queryResult: QueryResult | undefined = executionResponse.result;
  const currentPresets = activeMode === 'enterprise' ? ENTERPRISE_PRESETS : CUSTOM_PRACTICE_TEMPLATES;

  return (
    <div className="bg-[#0B101D] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 my-5 shadow-xl shadow-emerald-950/20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
                <span>Interactive SQL Database Playground</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span>DDL &amp; DML Engine</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {availableTables.length} Active Tables
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Execute client-side SQL queries, create your own tables with <code className="text-cyan-300 font-mono">CREATE TABLE</code>, insert records with <code className="text-emerald-300 font-mono">INSERT INTO</code>, and run analytical queries.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowSchemaHint(!showSchemaHint)}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#060911] border border-slate-800 hover:border-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            title="View database schema and available tables"
            type="button"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Schema Reference</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning}
            className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#060911] border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
            title="Reset to current preset template"
            type="button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleExecute}
            disabled={isRunning || !queryText.trim()}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
            type="button"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isRunning ? 'Running...' : 'Run Query / Script'}</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs (Enterprise vs Custom SQL Practice) */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <button
          onClick={() => handleSelectMode('custom')}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            activeMode === 'custom'
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          type="button"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Custom SQL Practice</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 ml-1 font-mono">
            New
          </span>
        </button>

        <button
          onClick={() => handleSelectMode('enterprise')}
          className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            activeMode === 'enterprise'
              ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-950 font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
          type="button"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Enterprise DB (Employees)</span>
        </button>
      </div>

      {/* Preset / Template Selector Chips */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {activeMode === 'custom' ? 'Custom Table Practice Templates:' : 'Curriculum Presets (Click to load & edit):'}
          </span>
          {activeMode === 'custom' && (
            <span className="text-[10px] text-emerald-400/90">
              Supports CREATE TABLE, INSERT INTO &amp; SELECT queries
            </span>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {currentPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedPreset === idx
                  ? activeMode === 'custom'
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/60 shadow-sm shadow-emerald-500/10 font-semibold'
                    : 'bg-cyan-950 text-cyan-200 border border-cyan-500/60 shadow-sm shadow-cyan-500/10 font-semibold'
                  : 'bg-[#060911] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
              type="button"
            >
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tables Bar (Click to inspect or query) */}
      <div className="mb-3 px-3 py-2 rounded-xl bg-[#070D18] border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active Database Tables:</span>
          </span>
          {availableTables.map((tbl) => (
            <button
              key={tbl.name}
              onClick={() => handleTableClick(tbl.name)}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#050810] border border-slate-700 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              title={`Click to run SELECT * FROM ${tbl.name}`}
              type="button"
            >
              <span className={tbl.isCustom ? 'text-emerald-400 font-semibold' : 'text-cyan-300 font-semibold'}>
                {tbl.name}
              </span>
              <span className="text-[10px] text-slate-500">({tbl.rowCount} rows)</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleResetDatabase}
          className="text-[11px] text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1"
          title="Reset all custom tables to initial state"
          type="button"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Custom Tables</span>
        </button>
      </div>

      {/* Database Schema Reference Drawer (Collapsible) */}
      {showSchemaHint && (
        <div className="mb-3 p-3.5 rounded-xl bg-[#070D18] border border-cyan-500/30 text-xs text-slate-300 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Database Tables &amp; Column Signatures:
            </span>
            <span className="text-[11px] text-slate-500">Case-insensitive keywords &amp; identifiers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-[11px]">
            {availableTables.map((tbl) => (
              <div key={tbl.name} className="p-2.5 rounded-lg bg-[#04060E] border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <strong className={tbl.isCustom ? 'text-emerald-400' : 'text-cyan-400'}>
                    TABLE {tbl.name}
                  </strong>
                  <span className="text-[10px] text-slate-500">{tbl.rowCount} rows</span>
                </div>
                <div className="text-slate-300 text-[10px] leading-relaxed break-words">
                  {tbl.columns.map((c, i) => (
                    <span key={c}>
                      <span className="text-indigo-300">{c}</span>
                      {i < tbl.columns.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editable SQL Code Editor Area */}
      <div className="relative rounded-xl border border-slate-800 bg-[#060911] overflow-hidden focus-within:border-emerald-500/60 transition-colors mb-3">
        {/* Editor Toolbar */}
        <div className="px-3.5 py-1.5 bg-[#090D18] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-emerald-300 font-semibold">
              {activeMode === 'custom' ? 'custom_practice.sql' : 'enterprise_query.sql'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[10px] hidden sm:inline">Press Ctrl+Enter to Run</span>
            <button
              onClick={handleCopyQuery}
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              title="Copy Query Text"
              type="button"
            >
              {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span className="text-[10px]">{copiedQuery ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-rose-300 transition-colors"
              title="Clear Editor"
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
            className="select-none py-3 px-2.5 text-right text-slate-600 bg-[#050810] border-r border-slate-800/70 font-mono text-[11px]"
            aria-hidden="true"
          >
            {lineNumbers.map((num) => (
              <div key={num} className="leading-relaxed">
                {num}
              </div>
            ))}
          </div>

          {/* Fully Editable Textarea */}
          <textarea
            ref={textareaRef}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={Math.max(lineCount, 7)}
            className="flex-1 bg-transparent text-emerald-300 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed overflow-x-auto whitespace-pre selection:bg-emerald-900/60 selection:text-white"
            placeholder="Write CREATE TABLE, INSERT INTO, or SELECT queries..."
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Editable SQL Query"
          />
        </div>
      </div>

      {/* Execution Status / Message / Error Banner */}
      {!executionResponse.success ? (
        <div className="p-3.5 mb-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-rose-300 mb-0.5 font-bold">SQL Execution Error:</strong>
            <p className="font-mono text-[11px] leading-relaxed">{executionResponse.error}</p>
            <span className="text-[10px] text-rose-300/70 mt-1 block">
              Tip: In this sandbox, supported commands are CREATE TABLE, INSERT INTO, and SELECT.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 text-xs text-slate-400 px-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              {executionResponse.message ? (
                <span>{executionResponse.message}</span>
              ) : (
                <span>
                  Query returned <strong className="text-emerald-300 tabular-nums">{queryResult?.rowCount || 0}</strong>{' '}
                  {queryResult?.rowCount === 1 ? 'row' : 'rows'}
                </span>
              )}
            </span>
          </div>
          {queryResult?.executionTimeMs !== undefined && (
            <span className="font-mono text-[11px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
              ⚡ {queryResult.executionTimeMs}ms
            </span>
          )}
        </div>
      )}

      {/* Dynamic Result Table */}
      {executionResponse.success && queryResult && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#060911]">
          {queryResult.rows.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Filter className="w-6 h-6 text-slate-600 mx-auto mb-2" />
              <p className="font-medium text-slate-300">Zero rows in this view.</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {queryResult.columns.length > 0
                  ? `Table created with columns (${queryResult.columns.join(', ')}). Add INSERT INTO to populate records.`
                  : 'Try relaxing your WHERE conditions or checking column values.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090D18] text-slate-300 border-b border-slate-800 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  {queryResult.columns.map((col, idx) => (
                    <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
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
                        <td key={cIdx} className="py-2 px-3 whitespace-nowrap">
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

      {/* Footer Helper */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
        <span>
          Supported SQL: CREATE TABLE, INSERT INTO, SELECT (WHERE, ORDER BY, LIMIT, GROUP BY, HAVING, COUNT, AVG, SUM, MIN, MAX)
        </span>
        <span>
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">Ctrl+Enter</kbd> to run
        </span>
      </div>
    </div>
  );
};

// Formatting helpers for table presentation
function formatHeaderLabel(colName: string): string {
  if (colName.toLowerCase() === 'id') return 'ID';
  if (colName.toLowerCase() === 'dept' || colName.toLowerCase() === 'department') return 'Department';
  if (colName.toLowerCase() === 'salary') return 'Salary (₹)';
  if (colName.toLowerCase() === 'price') return 'Price (₹)';
  if (colName.toLowerCase() === 'avg_salary' || colName.toLowerCase() === 'avg_price') return 'Avg (₹)';
  return colName.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCellValue(colName: string, val: any): React.ReactNode {
  if (val === null || val === undefined) return <span className="text-slate-600">NULL</span>;
  if (typeof val === 'boolean') {
    return <span className={val ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{val ? 'TRUE' : 'FALSE'}</span>;
  }
  if (typeof val === 'number') {
    const colLower = colName.toLowerCase();
    if (colLower.includes('salary') || colLower.includes('budget') || colLower.includes('price') || colLower.includes('valuation')) {
      return (
        <span className="text-emerald-300 font-semibold">
          ₹{val.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </span>
      );
    }
    if (colLower.includes('rating') || colLower.includes('score')) {
      return <span className="text-amber-300 font-bold">{val}</span>;
    }
    return <span className="text-cyan-300">{val}</span>;
  }
  return String(val);
}
