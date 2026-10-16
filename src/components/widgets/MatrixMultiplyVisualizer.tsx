import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const MatrixMultiplyVisualizer: React.FC = () => {
  const [x1, setX1] = useState(2);
  const [x2, setX2] = useState(3);
  const [w1, setW1] = useState(0.8);
  const [w2, setW2] = useState(-0.5);
  const [bias, setBias] = useState(1.2);

  const rawSum = x1 * w1 + x2 * w2 + bias;
  const reluOutput = Math.max(0, rawSum);
  const sigmoidOutput = 1 / (1 + Math.exp(-rawSum));

  return (
    <div className="bg-[#0B101D] border border-indigo-500/20 rounded-xl p-5 my-4">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Artificial Neuron Math Visualizer
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Adjust inputs, synaptic weights, and bias to see activation output
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          y = Activation(∑ wᵢxᵢ + b)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Inputs */}
        <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-2">Inputs (Data Signals):</span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Input x₁:</span>
                <span className="font-mono text-cyan-300 tabular-nums">{x1}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={x1}
                onChange={(e) => setX1(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Input x₂:</span>
                <span className="font-mono text-cyan-300 tabular-nums">{x2}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={x2}
                onChange={(e) => setX2(parseInt(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Weights & Bias */}
        <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800">
          <span className="font-semibold text-slate-300 block mb-2">Synaptic Weights & Bias:</span>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Weight w₁:</span>
                <span className="font-mono text-purple-300 tabular-nums">{w1.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={w1}
                onChange={(e) => setW1(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Weight w₂:</span>
                <span className="font-mono text-purple-300 tabular-nums">{w2.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={w2}
                onChange={(e) => setW2(parseFloat(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Calculated Activation Output */}
        <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="font-semibold text-slate-300 block mb-2">Neuron Output:</span>
            <div className="text-[11px] text-slate-400 font-mono mb-2">
              Sum = ({x1}×{w1.toFixed(1)}) + ({x2}×{w2.toFixed(1)}) + {bias} = <strong className="text-slate-200">{rawSum.toFixed(2)}</strong>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ReLU (Max 0, Sum):</span>
              <span className="font-mono text-emerald-400 font-bold tabular-nums">
                {reluOutput.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sigmoid Probability:</span>
              <span className="font-mono text-purple-400 font-bold tabular-nums">
                {(sigmoidOutput * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
