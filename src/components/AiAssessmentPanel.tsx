import React from 'react';
import { AnalysisResult } from '../types.js';
import { Sparkles, HelpCircle, AlertTriangle, Target, ShieldCheck, Quote } from 'lucide-react';

interface AiAssessmentPanelProps {
  result: AnalysisResult;
}

export const AiAssessmentPanel: React.FC<AiAssessmentPanelProps> = ({ result }) => {
  const whatHappened = result.summary;
  const whySuspicious = result.whyThisScore;

  const amounts = result.extractedEntities.amounts || [];
  const scammerWants =
    amounts.length > 0
      ? `The sender is seeking an immediate financial transfer (${amounts.join(' / ')}) framed as an upfront fee, deposit, or processing charge before you can verify legitimacy.`
      : result.signals.some((s) => s.category === 'URL_STRUCTURE')
      ? 'The sender is attempting to direct you to an unverified or lookalike website to capture login credentials, banking PINs, or personal data.'
      : 'The sender is attempting to pressure you into taking urgent action without independent verification.';

  return (
    <section className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E5EC] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#252033]">
              Plain-Language Security Assessment
            </h3>
            <p className="text-xs text-[#777181]">
              Clear summary synthesized by Google Gemini &amp; deterministic risk rules
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-[#777181]">
          {result.aiAssisted ? 'Gemini AI Assisted' : 'Rule-Engine Summary'}
        </span>
      </div>

      {result.primaryQuote && (
        <div className="p-4 rounded-xl bg-[#FCE7F3]/45 border border-[#E94D9B]/30 flex items-start gap-3">
          <Quote className="w-5 h-5 text-[#C92D7D] shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1 space-y-1">
            <span className="text-xs font-semibold text-[#C92D7D] block">
              Key Triggering Excerpt
            </span>
            <p className="text-sm font-mono text-[#252033] italic break-words">
              &ldquo;{result.primaryQuote}&rdquo;
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2">
          <div className="flex items-center gap-2 text-[#C92D7D] text-xs font-bold uppercase tracking-wide">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>1. What Happened</span>
          </div>
          <p className="text-sm text-[#252033] leading-relaxed">{whatHappened}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2">
          <div className="flex items-center gap-2 text-[#E99A24] text-xs font-bold uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>2. Why It Is Suspicious</span>
          </div>
          <p className="text-sm text-[#252033] leading-relaxed">{whySuspicious}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2">
          <div className="flex items-center gap-2 text-[#E5484D] text-xs font-bold uppercase tracking-wide">
            <Target className="w-4 h-4 shrink-0" />
            <span>3. What the Sender Wants</span>
          </div>
          <p className="text-sm text-[#252033] leading-relaxed">{scammerWants}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2">
          <div className="flex items-center gap-2 text-[#16A36A] text-xs font-bold uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>4. Immediate Safety Rule</span>
          </div>
          <p className="text-sm text-[#252033] leading-relaxed">
            <strong>Do not transfer money or click links.</strong> Look up the organization independently via official websites or verified directories.
          </p>
        </div>
      </div>
    </section>
  );
};
