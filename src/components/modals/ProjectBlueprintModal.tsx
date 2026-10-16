import React, { useState } from 'react';
import {
  X,
  FolderGit2,
  Table as TableIcon,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
  Maximize2,
  RotateCcw,
  Layers,
  Cpu,
  Database,
  Terminal,
  Calculator
} from 'lucide-react';
import { SkillNode } from '../../types';

interface ProjectBlueprintModalProps {
  skill: SkillNode;
  onClose: () => void;
  onNavigateToPortfolio?: () => void;
}

// Generated high-resolution visual previews
const EXCEL_IMAGES = {
  studentBudget: '/src/assets/images/excel_student_budget_1792135756916.jpg',
  expenseDashboard: '/src/assets/images/excel_expense_dashboard_1792135758040.jpg',
  budgetForecast: '/src/assets/images/excel_budget_forecast_1792135758094.jpg'
};

// Initial state for interactive live working spreadsheet preview
interface BudgetRow {
  category: string;
  item: string;
  budgeted: number;
  actual: number;
}

const INITIAL_EXPENSES: BudgetRow[] = [
  { category: 'Housing', item: 'Hostel / Apartment Rent', budgeted: 900, actual: 900 },
  { category: 'Food', item: 'Campus Mess & Meals', budgeted: 450, actual: 485 },
  { category: 'Education', item: 'AI Tools, Subscriptions & Books', budgeted: 250, actual: 210 },
  { category: 'Transit', item: 'Metro & Bus Pass', budgeted: 120, actual: 120 },
  { category: 'Food', item: 'Weekend Groceries', budgeted: 180, actual: 205 },
  { category: 'Utilities', item: 'High-speed Internet & Phone', budgeted: 60, actual: 58 },
  { category: 'Leisure', item: 'Streaming & Entertainment', budgeted: 150, actual: 180 },
  { category: 'Buffer', item: 'Miscellaneous Emergency Buffer', budgeted: 100, actual: 75 }
];

const INITIAL_INFLOWS: BudgetRow[] = [
  { category: 'Stipend', item: 'University Research Stipend', budgeted: 1500, actual: 1500 },
  { category: 'Freelance', item: 'Part-Time Web / AI Annotation', budgeted: 800, actual: 850 },
  { category: 'Grant', item: 'Academic Merit Scholarship', budgeted: 500, actual: 500 }
];

export const ProjectBlueprintModal: React.FC<ProjectBlueprintModalProps> = ({
  skill,
  onClose,
  onNavigateToPortfolio
}) => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'interactive' | 'requirements'>('visuals');
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string; caption: string } | null>(null);

  // Live Interactive Spreadsheet State
  const [inflowData, setInflowData] = useState<BudgetRow[]>(INITIAL_INFLOWS);
  const [expenseData, setExpenseData] = useState<BudgetRow[]>(INITIAL_EXPENSES);
  const [selectedMonth, setSelectedMonth] = useState<string>('November');

  const isExcelSkill = skill.id === 'da-excel' || skill.name.toLowerCase().includes('excel');

  // Calculations for interactive spreadsheet
  const totalBudgetedInflow = inflowData.reduce((sum, r) => sum + r.budgeted, 0);
  const totalActualInflow = inflowData.reduce((sum, r) => sum + r.actual, 0);

  const totalBudgetedOutflow = expenseData.reduce((sum, r) => sum + r.budgeted, 0);
  const totalActualOutflow = expenseData.reduce((sum, r) => sum + r.actual, 0);

  const netProjectedSavings = totalBudgetedInflow - totalBudgetedOutflow;
  const netActualSavings = totalActualInflow - totalActualOutflow;
  const actualSavingsRate = totalActualInflow > 0 ? ((netActualSavings / totalActualInflow) * 100).toFixed(1) : '0';

  const handleUpdateExpense = (index: number, field: 'budgeted' | 'actual', val: number) => {
    const updated = [...expenseData];
    updated[index] = { ...updated[index], [field]: isNaN(val) ? 0 : val };
    setExpenseData(updated);
  };

  const handleUpdateInflow = (index: number, field: 'budgeted' | 'actual', val: number) => {
    const updated = [...inflowData];
    updated[index] = { ...updated[index], [field]: isNaN(val) ? 0 : val };
    setInflowData(updated);
  };

  const handleResetInteractive = () => {
    setInflowData(INITIAL_INFLOWS);
    setExpenseData(INITIAL_EXPENSES);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0B0F1D] border border-purple-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 my-auto overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#070A14] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Resume Portfolio Project Blueprint
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {skill.level}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                  ⏱ {skill.estimatedTime}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {skill.name} Blueprint
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close blueprint modal"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-2 bg-[#090D1A] border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('visuals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'visuals'
                ? 'bg-purple-950 text-purple-200 border border-purple-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            type="button"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Visual Examples &amp; Previews</span>
          </button>

          {isExcelSkill && (
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'interactive'
                  ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              type="button"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Working Spreadsheet</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                Live
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'requirements'
                ? 'bg-cyan-950 text-cyan-200 border border-cyan-500/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            type="button"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Project Requirements &amp; Tools</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          {/* Overview Banner */}
          <div className="p-4 rounded-xl bg-[#070D18] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-cyan-300 text-xs font-semibold block">
                Target Portfolio Project Spec:
              </strong>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Tools:</span>
                {skill.tools.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-cyan-200 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed">{skill.projectIdea}</p>
          </div>

          {/* TAB 1: VISUAL EXAMPLES */}
          {activeTab === 'visuals' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Visual Project Deliverable Examples</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click any visual preview to expand to full size. These serve as exact design benchmarks for your submission.
                  </p>
                </div>
              </div>

              {isExcelSkill ? (
                <div className="space-y-6">
                  {/* Visual 1: Sample Monthly Student Budget Spreadsheet */}
                  <div className="rounded-xl border border-slate-800 bg-[#070A14] overflow-hidden hover:border-emerald-500/40 transition-colors group">
                    <div className="p-3 bg-[#090E1A] border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200 text-xs">
                          1. Sample Monthly Student Budget Spreadsheet
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Formula Model View
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        setZoomedImage({
                          src: EXCEL_IMAGES.studentBudget,
                          title: 'Sample Monthly Student Budget Spreadsheet',
                          caption:
                            'Figure 1.1: Complete Monthly Student Budget model built in Microsoft Excel. Displays segmented Inflow (Stipend, Part-time, Scholarship) and Outflow (Rent, Mess, Books, Transit) with automated SUM formulas, conditional formatting variance indicators (+ green / - red), and live remaining balance calculations.'
                        })
                      }
                      className="relative cursor-pointer aspect-video bg-[#04060C] flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={EXCEL_IMAGES.studentBudget}
                        alt="Sample Monthly Student Budget Spreadsheet"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                        <Maximize2 className="w-4 h-4 text-cyan-300" />
                        <span>Click to Enlarge Visual Preview</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#070A14] border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <p className="leading-relaxed">
                        <strong className="text-slate-300">Caption — Figure 1.1:</strong> Detailed student monthly budget spreadsheet featuring structured inflow/outflow line items, formula references (<code className="text-cyan-300 font-mono">=SUM(D9:D16)</code>, <code className="text-cyan-300 font-mono">=D4-C4</code>), and automated color-coded variance tags indicating budget compliance.
                      </p>
                      <span className="inline-block text-[10px] text-emerald-400 font-medium">
                        ✓ Demonstrates: Cell referencing, nested SUM, conditional formatting rules, and column variance calculations.
                      </span>
                    </div>
                  </div>

                  {/* Visual 2: Expense Summary Dashboard with Charts */}
                  <div className="rounded-xl border border-slate-800 bg-[#070A14] overflow-hidden hover:border-emerald-500/40 transition-colors group">
                    <div className="p-3 bg-[#090E1A] border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-slate-200 text-xs">
                          2. Expense Summary Dashboard with Dynamic Charts
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                        KPI Analytics View
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        setZoomedImage({
                          src: EXCEL_IMAGES.expenseDashboard,
                          title: 'Expense Summary Dashboard with Charts',
                          caption:
                            'Figure 1.2: Modern financial analytics dashboard interface. Visualizes student expenses with a categorized Donut Chart (Housing 42.2%, Food 24.5%, Education 20%, Transit 13.3%), side-by-side Budget vs Actual Expense Bar Chart, and KPI summary scorecards highlighting a 23.0% net savings rate.'
                        })
                      }
                      className="relative cursor-pointer aspect-video bg-[#04060C] flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={EXCEL_IMAGES.expenseDashboard}
                        alt="Expense Summary Dashboard with Charts"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                        <Maximize2 className="w-4 h-4 text-cyan-300" />
                        <span>Click to Enlarge Visual Preview</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#070A14] border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <p className="leading-relaxed">
                        <strong className="text-slate-300">Caption — Figure 1.2:</strong> Executive expense summary dashboard displaying category percentage allocation through an interactive donut visual, paired budget-versus-actual bar charts, and high-impact KPI scorecards tracking monthly inflow, outflow, and net savings margin.
                      </p>
                      <span className="inline-block text-[10px] text-cyan-400 font-medium">
                        ✓ Demonstrates: Pivot Charts, donut percentage distribution, KPI card formula linkage, and executive data presentation.
                      </span>
                    </div>
                  </div>

                  {/* Visual 3: 12-Month Budget Forecast Chart */}
                  <div className="rounded-xl border border-slate-800 bg-[#070A14] overflow-hidden hover:border-emerald-500/40 transition-colors group">
                    <div className="p-3 bg-[#090E1A] border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-slate-200 text-xs">
                          3. 12-Month Budget Forecast Chart &amp; Scenario Model
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                        Multi-Period Forecast View
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        setZoomedImage({
                          src: EXCEL_IMAGES.budgetForecast,
                          title: '12-Month Budget Forecast Chart',
                          caption:
                            'Figure 1.3: 12-Month Academic Year Financial Forecast Model. Illustrates projected cumulative emergency savings growth across months 1 through 12, benchmarking against a $25,000 target reserve threshold alongside monthly discretionary cash flow bars.'
                        })
                      }
                      className="relative cursor-pointer aspect-video bg-[#04060C] flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={EXCEL_IMAGES.budgetForecast}
                        alt="12-Month Budget Forecast Chart"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                        <Maximize2 className="w-4 h-4 text-cyan-300" />
                        <span>Click to Enlarge Visual Preview</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#070A14] border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                      <p className="leading-relaxed">
                        <strong className="text-slate-300">Caption — Figure 1.3:</strong> 12-month budget projection model plotting cumulative student emergency reserves over the academic year against target thresholds, coupled with monthly cash flow volume bars and historical trend lines.
                      </p>
                      <span className="inline-block text-[10px] text-purple-400 font-medium">
                        ✓ Demonstrates: Multi-period cash-flow projection, compound savings calculations, trendline estimation, and goal-seek reserve modeling.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Generalized Visual Architectures for other Skills (SQL, Python, AI RAG, etc.) */
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-slate-800 bg-[#070D18] space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Cpu className="w-4 h-4" />
                      <span>Architecture Diagram &amp; Data Pipeline Blueprint</span>
                    </div>
                    <div className="p-4 rounded-lg bg-[#04060E] border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
                      <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800">
                        <span>COMPONENT PIPELINE</span>
                        <span>STATUS: READY FOR IMPLEMENTATION</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 text-center">
                        <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
                          <strong>1. Data Ingestion</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Raw CSV / SQL / APIs</p>
                        </div>
                        <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                          <strong>2. Logic &amp; Transformation</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Wrangling &amp; Models</p>
                        </div>
                        <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                          <strong>3. Interactive UI / API</strong>
                          <p className="text-[10px] text-slate-400 mt-0.5">Dashboards &amp; Endpoints</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Visual Caption:</strong> End-to-end data pipeline flow for {skill.name}. Collects input records, applies automated transformations, and renders verifiable visual artifacts for hiring managers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIVE LIVE WORKING SPREADSHEET (Real calculations) */}
          {activeTab === 'interactive' && isExcelSkill && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Notice */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300 block font-semibold text-xs">
                      ⚡ Interactive Live Working Preview
                    </strong>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      This is a real functioning spreadsheet engine. Edit any of the input values in the &quot;Actual Spent&quot; or &quot;Budgeted&quot; columns below to see live formulas (<code className="text-emerald-300 font-mono">=SUM</code>, <code className="text-cyan-300 font-mono">=VARIANCE</code>, <code className="text-purple-300 font-mono">=SAVINGS_RATE</code>) dynamically recalculate in real time!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetInteractive}
                  className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-[#060911] border border-slate-700 hover:border-slate-500 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                  type="button"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Data</span>
                </button>
              </div>

              {/* Month Selector Bar & Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-[#070A14] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Monthly Inflow</span>
                  <span className="text-base font-bold text-emerald-300 font-mono">
                    ${totalActualInflow.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Budgeted: ${totalBudgetedInflow.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#070A14] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block">Total Actual Outflow</span>
                  <span className="text-base font-bold text-rose-300 font-mono">
                    ${totalActualOutflow.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Budgeted: ${totalBudgetedOutflow.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#070A14] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block">Net Monthly Savings</span>
                  <span
                    className={`text-base font-bold font-mono ${
                      netActualSavings >= 0 ? 'text-cyan-300' : 'text-rose-400'
                    }`}
                  >
                    ${netActualSavings.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {netActualSavings >= 0 ? 'Surplus' : 'Deficit'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#070A14] border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-medium block">Actual Savings Rate</span>
                  <span className="text-base font-bold text-purple-300 font-mono">
                    {actualSavingsRate}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Target: &gt;= 20%
                  </span>
                </div>
              </div>

              {/* Editable Outflows Spreadsheet Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#05070E]">
                <div className="px-4 py-2.5 bg-[#090D1A] border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-white">Monthly Expense Ledger — {selectedMonth}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Formula: Variance = Actual - Budgeted
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-[#070B16] text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Item / Description</th>
                      <th className="py-2 px-3 text-right">Budgeted ($)</th>
                      <th className="py-2 px-3 text-right">Actual Spent ($) [Editable]</th>
                      <th className="py-2 px-3 text-right">Variance ($)</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {expenseData.map((row, idx) => {
                      const variance = row.actual - row.budgeted;
                      const isOver = variance > 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-2 px-3 font-sans text-slate-300">{row.category}</td>
                          <td className="py-2 px-3 font-sans text-slate-200">{row.item}</td>
                          <td className="py-2 px-3 text-right text-slate-400">${row.budgeted}</td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              value={row.actual}
                              onChange={(e) =>
                                handleUpdateExpense(idx, 'actual', parseFloat(e.target.value))
                              }
                              className="w-20 px-1.5 py-0.5 rounded bg-[#090D1A] border border-slate-700 focus:border-cyan-400 text-white text-right font-mono text-xs focus:outline-none"
                              aria-label={`Actual spent for ${row.item}`}
                            />
                          </td>
                          <td
                            className={`py-2 px-3 text-right font-bold ${
                              isOver ? 'text-rose-400' : variance < 0 ? 'text-emerald-400' : 'text-slate-400'
                            }`}
                          >
                            {variance > 0 ? `+$${variance}` : variance < 0 ? `-$${Math.abs(variance)}` : '$0'}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                                isOver
                                  ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40'
                                  : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                              }`}
                            >
                              {isOver ? 'Overspent' : 'On Track'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-[#090D1A] border-t-2 border-slate-800 font-mono font-bold text-slate-200">
                    <tr>
                      <td colSpan={2} className="py-2.5 px-3 font-sans text-white">
                        Total Monthly Outflow (=SUM)
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300">${totalBudgetedOutflow}</td>
                      <td className="py-2.5 px-3 text-right text-rose-300 font-bold">${totalActualOutflow}</td>
                      <td
                        className={`py-2.5 px-3 text-right ${
                          totalActualOutflow > totalBudgetedOutflow ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {totalActualOutflow - totalBudgetedOutflow > 0
                          ? `+$${totalActualOutflow - totalBudgetedOutflow}`
                          : `-$${Math.abs(totalActualOutflow - totalBudgetedOutflow)}`}
                      </td>
                      <td className="py-2.5 px-3 text-center text-[11px] font-sans text-cyan-300">
                        {totalActualOutflow <= totalBudgetedOutflow ? 'Under Budget ✓' : 'Over Budget ⚠'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: REQUIREMENTS & DELIVERABLES */}
          {activeTab === 'requirements' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Curriculum Specifications &amp; Instructions</h3>
                <p className="text-slate-300 leading-relaxed">{skill.description}</p>
              </div>

              {/* Step by step checklist */}
              <div className="p-4 rounded-xl bg-[#070A14] border border-slate-800 space-y-3">
                <span className="font-bold text-cyan-300 text-xs block">
                  Step-by-Step Build Checklist:
                </span>
                <ul className="space-y-2 text-slate-300 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>1. Set Up Raw Data &amp; Input Structure:</strong> Separate raw transactional data from summary reports. Use consistent naming conventions and dates.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>2. Write Dynamic Formulas:</strong> Implement lookup functions (<code className="text-cyan-300 font-mono">XLOOKUP</code> / <code className="text-cyan-300 font-mono">INDEX/MATCH</code>), conditional aggregates (<code className="text-cyan-300 font-mono">SUMIFS</code>, <code className="text-cyan-300 font-mono">COUNTIFS</code>), and error handlers (<code className="text-cyan-300 font-mono">IFERROR</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>3. Build Summary Pivot Tables &amp; Charts:</strong> Aggregate expenses by category, period, and payment method. Link charts to pivot caches with slicers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>4. Design an Executive Dashboard:</strong> Arrange KPI metric cards, variance trendlines, and donut breakdowns onto a clean 16:9 presentation tab.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Interview Talking Points */}
              <div className="p-4 rounded-xl bg-[#090D1A] border border-purple-500/30 text-xs text-slate-300 space-y-2">
                <strong className="text-purple-300 block font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  How to Feature This on Your Resume (STAR Method):
                </strong>
                <p className="leading-relaxed text-slate-200">
                  &quot;Architected an automated multi-tab student budget model in Excel incorporating XLOOKUP, dynamic variance tracking, and a 12-month forecasting engine, enabling real-time expense monitoring and improving monthly savings compliance by 23%.&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#070A14] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">
              Complete the project in your local spreadsheet software or cloud sheets, then add the repository link to your Skill Portfolio.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToPortfolio && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPortfolio();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white font-medium transition-colors"
                type="button"
              >
                Go to Portfolio →
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors shadow-md shadow-purple-600/20"
              type="button"
            >
              Close Blueprint
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Zoom Lightbox */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between pb-2 text-white text-xs mb-1">
              <span className="font-bold text-sm text-cyan-300">{zoomedImage.title}</span>
              <button
                onClick={() => setZoomedImage(null)}
                className="px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
                type="button"
              >
                Close (ESC)
              </button>
            </div>
            <img
              src={zoomedImage.src}
              alt={zoomedImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-xl border border-slate-700 shadow-2xl object-contain bg-black"
            />
            <div className="mt-3 p-3 bg-[#0A0E1A] border border-slate-800 rounded-xl text-xs text-slate-300 max-w-3xl text-center">
              {zoomedImage.caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
