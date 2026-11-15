import React from 'react';
import { CheckCircle2, ArrowRight, BarChart3, HelpCircle } from 'lucide-react';

interface HeroSectionProps {
  onJumpToSamples?: () => void;
  onOpenBenchmarks?: () => void;
  onOpenHowItWorks?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJumpToSamples,
  onOpenBenchmarks,
  onOpenHowItWorks
}) => {
  return (
    <div className="flex flex-col justify-between h-full space-y-6 py-2">
      <div className="space-y-5">
        <p className="text-xs font-semibold tracking-wide text-[#C92D7D]">
          AI-Powered Scam Detection · Google Gemini Engine
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-[#252033] leading-[1.12] [text-wrap:balance]">
          Think Before You Click.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E94D9B] to-[#C92D7D]">
            Stay Protected.
          </span>
        </h1>

        <p className="text-base text-[#777181] leading-relaxed max-w-xl">
          Verify suspicious messages, phishing URLs, payment demands, job offers, and screenshots in seconds. Built for students, online shoppers, professionals, and small businesses.
        </p>

        <ul className="space-y-2.5 pt-1 text-sm text-[#252033]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
            <span>Detects advance-fee job, rental, and UPI payment coercion immediately</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
            <span>Inspects phishing domains, brand lookalikes, and document screenshots via OCR</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
            <span>Ephemeral memory analysis — zero stored messages or personal logs</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {onJumpToSamples && (
          <button
            type="button"
            onClick={onJumpToSamples}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FCE7F3] hover:bg-[#f9d5e8] text-[#C92D7D] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Try Real Scam Samples</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {onOpenBenchmarks && (
          <button
            type="button"
            onClick={onOpenBenchmarks}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BarChart3 className="w-4 h-4 text-[#E94D9B]" />
            <span>99.4% Benchmarks</span>
          </button>
        )}

        {onOpenHowItWorks && (
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#777181] hover:text-[#252033] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>How it works</span>
          </button>
        )}
      </div>
    </div>
  );
};
