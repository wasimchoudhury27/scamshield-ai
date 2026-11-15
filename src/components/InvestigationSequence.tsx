import React from 'react';
import { InvestigationRing } from './InvestigationRing.js';
import { CheckCircle2, Loader2, CircleDashed } from 'lucide-react';

export interface InvestigationStage {
  step: string;
  label: string;
  detail: string;
}

export const INVESTIGATION_STAGES: InvestigationStage[] = [
  { step: '01', label: 'Scanning Message Tokens', detail: 'Parsing text structure, entities, and contact handles' },
  { step: '02', label: 'Checking Payment Demands', detail: 'Detecting advance deposits, UPI handles, and QR traps' },
  { step: '03', label: 'Evaluating Urgency Signals', detail: 'Identifying countdown deadlines and coercion language' },
  { step: '04', label: 'Checking Impersonation', detail: 'Verifying claimed brands, unvetted offers, and recruiters' },
  { step: '05', label: 'Inspecting Link Infrastructure', detail: 'Checking domain entropy, TLD risk, and lookalike targets' },
  { step: '06', label: 'Building Forensic Verdict', detail: 'Synthesizing evidence with Google Gemini threat reasoning' }
];

interface InvestigationSequenceProps {
  currentStageIndex: number;
}

export const InvestigationSequence: React.FC<InvestigationSequenceProps> = ({ currentStageIndex }) => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 py-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        <InvestigationRing
          score={0}
          riskLevel="LOW"
          isAnalyzing={true}
          activeStageIndex={currentStageIndex}
          size="normal"
        />

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-[#252033] tracking-tight">
            Analyzing Your Submission
          </h3>
          <p className="text-sm text-[#777181]">
            Correlating deterministic risk signals with Google Gemini intelligence
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-6 shadow-[0_10px_30px_-12px_rgba(201,45,125,0.12)] space-y-2.5">
        <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-3 mb-3 text-xs">
          <span className="font-semibold text-[#C92D7D]">Investigation Pipeline</span>
          <span className="font-mono tabular-nums text-[#777181]">
            {Math.min(currentStageIndex + 1, 6)} of 6 steps
          </span>
        </div>

        {INVESTIGATION_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={stage.step}
              className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-150 ${
                isCurrent
                  ? 'bg-[#FCE7F3]/60 border border-[#E94D9B]/40'
                  : isDone
                  ? 'bg-[#FFF8FC] border border-[#F0E5EC]'
                  : 'opacity-45 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`font-mono text-xs font-bold tabular-nums ${
                    isCurrent ? 'text-[#C92D7D]' : isDone ? 'text-[#16A36A]' : 'text-[#777181]'
                  }`}
                >
                  {stage.step}
                </span>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#252033] truncate">
                    {stage.label}
                  </div>
                  <div className="text-xs text-[#777181] truncate hidden sm:block">
                    {stage.detail}
                  </div>
                </div>
              </div>

              <div className="shrink-0 ml-3">
                {isDone && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#16A36A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Done</span>
                  </div>
                )}
                {isCurrent && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#C92D7D]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Checking</span>
                  </div>
                )}
                {!isDone && !isCurrent && <CircleDashed className="w-4 h-4 text-[#E7D2DF]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
