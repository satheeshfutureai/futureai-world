import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Cpu, Cloud, Database, Lock, X } from 'lucide-react';

interface ArchitectureInfoModalProps {
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B0F1D] border border-cyan-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/40">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Architecture & Integration Transparency
              </h3>
              <p className="text-xs text-slate-400">
                Honest breakdown of functional MVP systems vs prototype demonstrations
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Functional Section */}
          <div className="p-4 rounded-xl bg-[#06101B] border border-emerald-500/30">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Currently 100% Functional in this Prototype:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li><strong>Offline Reactive State Engine:</strong> XP, streaks, levels, completed lessons, missions, and badges saved locally.</li>
              <li><strong>Interactive Micro-Simulators:</strong> Live LLM Token Prediction simulator, Python Code runner sandbox, and SQL query filter playground.</li>
              <li><strong>Interactive Assessments:</strong> Instant scoring, right/wrong feedback, and bilingual English & Tamil explanations.</li>
              <li><strong>Personalized Onboarding:</strong> Multi-step survey recommending tailored career tracks based on experience and goals.</li>
              <li><strong>Skill Portfolio:</strong> Verified project logger, reflection notes, and clipboard resume bullet exporter.</li>
              <li><strong>Career Roadmaps:</strong> 5 role tracks with salary benchmarks, prerequisite checklists, and project blueprints.</li>
            </ul>
          </div>

          {/* Prototype Demo Section */}
          <div className="p-4 rounded-xl bg-[#140F08] border border-amber-500/30">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>Current Prototype Demonstrations:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li><strong>Aura AI Tutor:</strong> Currently powered by a high-speed client-side semantic rule engine and bilingual knowledge base. Zero external API keys or paid quotas are required.</li>
              <li><strong>Error Debugger:</strong> Uses pre-computed explanations for common beginner Python, SQL, and API errors.</li>
              <li><strong>Career Salaries:</strong> Benchmark ranges based on current market reports; never a guarantee of job placement or income.</li>
            </ul>
          </div>

          {/* Production Upgrade Blueprint */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm mb-2">
              <Cloud className="w-4 h-4" />
              <span>Production Scale Readiness Roadmap:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px]">
              <div className="p-2.5 bg-[#070A12] rounded-lg border border-slate-800">
                <strong className="text-white block mb-1">1. Cloud Run AI Proxy</strong>
                <span className="text-slate-400">Deploy Express backend connecting Gemini 2.5 Flash for unlimited streaming chat without exposing API keys.</span>
              </div>
              <div className="p-2.5 bg-[#070A12] rounded-lg border border-slate-800">
                <strong className="text-white block mb-1">2. Cloud Database & Auth</strong>
                <span className="text-slate-400">Integrate Firebase/Cloud SQL for cross-device learner sync, mentor dashboards, and profile credentials.</span>
              </div>
              <div className="p-2.5 bg-[#070A12] rounded-lg border border-slate-800">
                <strong className="text-white block mb-1">3. Sandboxed Code Container</strong>
                <span className="text-slate-400">Isolate Python, SQL, and JavaScript compilation inside secure serverless execution containers.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
