import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles } from 'lucide-react';

interface TokenCandidate {
  token: string;
  prob: number;
}

const PRESETS: Record<string, { prompt: string; candidates: TokenCandidate[] }> = {
  coffee: {
    prompt: 'In South India, morning filter coffee is usually served in a',
    candidates: [
      { token: ' davara-tumbler', prob: 78 },
      { token: ' brass cup', prob: 12 },
      { token: ' glass mug', prob: 7 },
      { token: ' paper bowl', prob: 3 }
    ]
  },
  ai: {
    prompt: 'Deep Learning models identify complex image patterns using',
    candidates: [
      { token: ' convolutional layers', prob: 64 },
      { token: ' neural weights', prob: 22 },
      { token: ' random numbers', prob: 9 },
      { token: ' manual if-else', prob: 5 }
    ]
  },
  career: {
    prompt: 'To get hired as a fresher data analyst, the most valuable skill is',
    candidates: [
      { token: ' SQL database querying', prob: 58 },
      { token: ' Python data wrangling', prob: 26 },
      { token: ' PowerBI dashboarding', prob: 12 },
      { token: ' Photoshop editing', prob: 4 }
    ]
  }
};

export const TokenSimulator: React.FC<{ onSimulate?: () => void }> = ({ onSimulate }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('coffee');
  const [temperature, setTemperature] = useState<number>(0.5);
  const [generatedText, setGeneratedText] = useState<string>(PRESETS['coffee'].prompt);
  const [lastToken, setLastToken] = useState<string | null>(null);

  const current = PRESETS[selectedPreset];

  // Adjust probabilities based on temperature
  const adjustedCandidates = current.candidates.map((c) => {
    // temperature scaling
    const raw = Math.pow(c.prob, 1 / Math.max(0.2, temperature));
    return { token: c.token, prob: raw };
  });
  const sum = adjustedCandidates.reduce((acc, curr) => acc + curr.prob, 0);
  const normalizedCandidates = adjustedCandidates.map((c) => ({
    token: c.token,
    prob: Math.round((c.prob / sum) * 100)
  }));

  const handlePickToken = (token: string) => {
    setGeneratedText((prev) => prev + token);
    setLastToken(token);
    if (onSimulate) onSimulate();
  };

  const handleReset = () => {
    setGeneratedText(PRESETS[selectedPreset].prompt);
    setLastToken(null);
  };

  const handleChangePreset = (key: string) => {
    setSelectedPreset(key);
    setGeneratedText(PRESETS[key].prompt);
    setLastToken(null);
  };

  return (
    <div className="bg-[#0B101D] border border-purple-500/20 rounded-xl p-5 my-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Interactive LLM Token Predictor
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            See how language models calculate likelihood for the next word based on temperature
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Prompt
        </button>
      </div>

      {/* Preset tabs */}
      <div className="flex gap-2 mb-3">
        {Object.entries({
          coffee: 'Filter Coffee Analogy',
          ai: 'Deep Learning',
          career: 'Tech Career'
        }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleChangePreset(key)}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedPreset === key
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Generated text box */}
      <div className="p-3 bg-[#070A12] border border-slate-800 rounded-lg text-sm text-slate-200 font-mono mb-4 leading-relaxed">
        <span>{generatedText}</span>
        {lastToken && (
          <span className="text-cyan-400 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/60 ml-1 inline-block animate-pulse">
            {lastToken}
          </span>
        )}
      </div>

      {/* Temperature Slider */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-4 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
        <span className="font-medium text-slate-300">Sampling Temperature:</span>
        <div className="flex items-center gap-3 w-1/2">
          <input
            type="range"
            min="0.2"
            max="1.5"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <span className="font-mono text-purple-300 font-bold tabular-nums min-w-[2.5rem]">
            {temperature.toFixed(1)}
          </span>
        </div>
        <span className="text-slate-500 hidden sm:inline">
          {temperature < 0.5 ? 'Deterministic' : temperature > 1.0 ? 'Creative/Wild' : 'Balanced'}
        </span>
      </div>

      {/* Candidates List */}
      <div>
        <p className="text-xs font-semibold text-slate-300 mb-2">
          Predicted Next Tokens (Click to append):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {normalizedCandidates.map((cand, idx) => (
            <button
              key={idx}
              onClick={() => handlePickToken(cand.token)}
              className="flex items-center justify-between p-2.5 bg-slate-900/90 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-lg text-left transition-all group"
            >
              <span className="font-mono text-xs text-slate-200 group-hover:text-purple-300 flex items-center gap-1.5">
                <Play className="w-3 h-3 text-purple-400 fill-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                "{cand.token.trim()}"
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${cand.prob}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-cyan-400 tabular-nums font-semibold w-8 text-right">
                  {cand.prob}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
