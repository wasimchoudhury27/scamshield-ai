import React from 'react';
import { ScoreBreakdownItem } from '../types.js';
import { Calculator } from 'lucide-react';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownItem[];
  totalScore: number;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, totalScore }) => {
  return (
    <div className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#252033]">
              Deterministic Score Breakdown
            </h4>
            <p className="text-xs text-[#777181]">
              Transparent additive mathematical weighting from isolated signals
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-[#777181] block">Threat Index</span>
          <span className="text-xl font-extrabold font-mono tabular-nums text-[#C92D7D]">
            {totalScore} / 100
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-xl overflow-hidden text-sm">
        {breakdown.map((item, idx) => {
          const isCompound = item.category === 'COMPOUND';
          return (
            <div
              key={idx}
              className={`flex items-center justify-between px-4 py-3 ${
                isCompound ? 'bg-[#FCE7F3]/40' : 'bg-white'
              }`}
            >
              <span className="text-[#252033] truncate pr-4">
                {isCompound ? `Compound Multiplier · ${item.label}` : item.label}
              </span>
              <span className={`font-mono font-bold tabular-nums shrink-0 ${isCompound ? 'text-[#C92D7D]' : 'text-[#252033]'}`}>
                +{item.points} pts
              </span>
            </div>
          );
        })}

        <div className="flex items-center justify-between px-4 py-3.5 bg-[#FFF8FC] font-bold">
          <span className="text-[#252033]">Final Evaluated Total</span>
          <span className="font-mono tabular-nums text-[#C92D7D] text-base">
            {totalScore} / 100
          </span>
        </div>
      </div>

      <p className="text-xs text-[#777181]">
        Weighted via SCAMSHIELD AI deterministic risk rules bounded strictly between 0 and 100.
      </p>
    </div>
  );
};
