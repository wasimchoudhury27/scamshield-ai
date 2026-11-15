import React, { useState, useMemo } from 'react';
import { AnalysisResult, RiskSignal } from '../types.js';
import {
  Clock,
  AlertTriangle,
  CreditCard,
  Briefcase,
  UserCheck,
  Radio,
  Globe,
  ChevronRight,
  ChevronLeft,
  Quote,
  AlignLeft
} from 'lucide-react';

interface ThreatTimelineProps {
  result: AnalysisResult;
}

export interface TimelineMilestone {
  id: string;
  stepNumber: number;
  phaseName: string;
  stageTitle: string;
  category: RiskSignal['category'] | 'HOOK' | 'ULTIMATUM';
  severity: RiskSignal['severity'];
  pointsContribution: number;
  cumulativeScore: number;
  textPosition: {
    startChar: number;
    endChar: number;
    percentage: number;
    paragraphIndex: number;
  };
  quoteText: string;
  whatDetected: string;
  psychologicalIntent: string;
}

export const ThreatTimeline: React.FC<ThreatTimelineProps> = ({ result }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'stepper' | 'stream'>('stepper');

  const fullText = result.rawInputText || result.inputSnippet || '';

  const milestones: TimelineMilestone[] = useMemo(() => {
    const rawText = fullText;
    const lowerText = rawText.toLowerCase();

    const matchedItems: {
      signal: RiskSignal;
      earliestPos: number;
      bestQuote: string;
    }[] = [];

    result.signals.forEach((sig) => {
      let earliestPos = Infinity;
      let bestQuote = '';

      if (sig.evidence && sig.evidence.length > 0) {
        for (const ev of sig.evidence) {
          const cleanEv = ev.trim().toLowerCase();
          const pos = lowerText.indexOf(cleanEv);
          if (pos !== -1 && pos < earliestPos) {
            earliestPos = pos;
            bestQuote = ev;
          }
        }
      }

      if (earliestPos === Infinity) {
        const keywords = sig.name.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
        for (const kw of keywords) {
          const pos = lowerText.indexOf(kw);
          if (pos !== -1 && pos < earliestPos) {
            earliestPos = pos;
            bestQuote = sig.evidence[0] || sig.whatDetected;
            break;
          }
        }
      }

      if (earliestPos === Infinity) {
        if (sig.category === 'EMPLOYMENT' || sig.category === 'IDENTITY') earliestPos = 20;
        else if (sig.category === 'URGENCY') earliestPos = Math.floor(rawText.length * 0.4);
        else if (sig.category === 'PAYMENT' || sig.category === 'FINANCIAL') earliestPos = Math.floor(rawText.length * 0.7);
        else earliestPos = Math.floor(rawText.length * 0.5);
        bestQuote = sig.evidence[0] || sig.whatDetected;
      }

      matchedItems.push({
        signal: sig,
        earliestPos,
        bestQuote: bestQuote || sig.whatDetected
      });
    });

    matchedItems.sort((a, b) => a.earliestPos - b.earliestPos);

    let runningScore = 0;
    const items: TimelineMilestone[] = [];

    matchedItems.forEach((item, index) => {
      const sig = item.signal;
      const pts = sig.scoreWeight || 20;
      runningScore = Math.min(100, runningScore + pts);

      const textUpToPos = rawText.slice(0, item.earliestPos);
      const paragraphIndex = textUpToPos.split(/\n\s*\n/).length;
      const percentage = rawText.length > 0 ? Math.min(100, Math.round((item.earliestPos / rawText.length) * 100)) : 50;

      let phaseName = `Stage 0${index + 1}`;
      let stageTitle = sig.name;
      let psychologicalIntent = sig.whyItMatters;

      if (index === 0 && (sig.category === 'EMPLOYMENT' || sig.category === 'IDENTITY')) {
        phaseName = 'Stage 01 · Pretext Hook';
        stageTitle = 'Trust Acquisition & Bait';
        psychologicalIntent = 'Lowers defenses through perceived authority, flattery, or an unvetted instant selection.';
      } else if (sig.category === 'URGENCY') {
        phaseName = `Stage 0${index + 1} · Urgency Pressure`;
        stageTitle = 'Manufactured Deadline Pressure';
        psychologicalIntent = 'Prevents verification by creating an artificial expiration countdown.';
      } else if (sig.category === 'PAYMENT' || sig.category === 'FINANCIAL') {
        phaseName = `Stage 0${index + 1} · Financial Demand`;
        stageTitle = 'Monetary Extraction Trap';
        psychologicalIntent = 'Demands an upfront transfer (UPI, deposit, or fee) framed as refundable or mandatory.';
      } else if (index === matchedItems.length - 1 && runningScore >= 80) {
        phaseName = `Stage 0${index + 1} · Final Ultimatum`;
        stageTitle = 'Consequence Threat';
        psychologicalIntent = 'Uses threat of cancellation or legal action to force immediate compliance.';
      }

      items.push({
        id: `milestone-${sig.id || index}`,
        stepNumber: index + 1,
        phaseName,
        stageTitle,
        category: sig.category,
        severity: sig.severity,
        pointsContribution: pts,
        cumulativeScore: runningScore,
        textPosition: {
          startChar: item.earliestPos,
          endChar: item.earliestPos + item.bestQuote.length,
          percentage,
          paragraphIndex
        },
        quoteText: item.bestQuote,
        whatDetected: sig.whatDetected,
        psychologicalIntent
      });
    });

    if (items.length === 0) {
      items.push({
        id: 'milestone-empty',
        stepNumber: 1,
        phaseName: 'Stage 01 · Baseline Scan',
        stageTitle: 'Baseline Content Evaluation',
        category: 'HOOK',
        severity: 'LOW',
        pointsContribution: 0,
        cumulativeScore: result.threatScore,
        textPosition: { startChar: 0, endChar: rawText.length, percentage: 100, paragraphIndex: 1 },
        quoteText: rawText.slice(0, 150) || 'Analyzed content',
        whatDetected: 'No advance-fee or high-threat triggers were isolated in sequential analysis.',
        psychologicalIntent: 'The communication appears standard without obvious deceptive escalation.'
      });
    }

    return items;
  }, [fullText, result.signals, result.threatScore]);

  const activeMilestone = milestones[activeStepIndex] || milestones[0];

  const getSeverityTextColor = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-[#E5484D]';
      case 'HIGH':
      case 'MODERATE':
        return 'text-[#E99A24]';
      case 'LOW':
      default:
        return 'text-[#16A36A]';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PAYMENT':
      case 'FINANCIAL':
        return CreditCard;
      case 'URGENCY':
        return Clock;
      case 'EMPLOYMENT':
        return Briefcase;
      case 'IDENTITY':
        return UserCheck;
      case 'SOCIAL_ENG':
        return Radio;
      case 'URL_STRUCTURE':
      case 'DOMAIN_INTEL':
        return Globe;
      default:
        return AlertTriangle;
    }
  };

  return (
    <section id="threat-timeline-section" className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E5EC] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#252033]">
              Attack Anatomy Timeline
            </h3>
            <p className="text-xs text-[#777181]">
              Step-by-step progression of deceptive triggers across your submission · {milestones.length} stages
            </p>
          </div>
        </div>

        <div className="p-1 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] inline-flex items-center text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('stepper')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'stepper' ? 'bg-white text-[#C92D7D] font-semibold shadow-sm' : 'text-[#777181] hover:text-[#252033]'
            }`}
          >
            Step-by-Step
          </button>
          <button
            type="button"
            onClick={() => setViewMode('stream')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'stream' ? 'bg-white text-[#C92D7D] font-semibold shadow-sm' : 'text-[#777181] hover:text-[#252033]'
            }`}
          >
            Full Stream
          </button>
        </div>
      </div>

      {viewMode === 'stepper' && (
        <div className="space-y-6">
          {/* Interactive Track */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-4">
            <div className="flex items-center justify-between text-xs text-[#777181]">
              <span className="font-semibold text-[#252033]">Progression Track</span>
              <span className="font-mono tabular-nums text-[#C92D7D] font-semibold">
                +{activeMilestone.pointsContribution} pts in stage {activeMilestone.stepNumber}
              </span>
            </div>

            <div className="relative pt-2 pb-1">
              <div className="absolute top-6 left-4 right-4 h-1 bg-[#F0E5EC] rounded-full" />
              <div
                className="absolute top-6 left-4 h-1 bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] rounded-full transition-all duration-300"
                style={{ width: `${(activeStepIndex / Math.max(1, milestones.length - 1)) * 92}%` }}
              />

              <div className="relative flex justify-between items-center z-10">
                {milestones.map((m, idx) => {
                  const isActive = idx === activeStepIndex;
                  const isPassed = idx < activeStepIndex;
                  const Icon = getCategoryIcon(m.category);

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveStepIndex(idx)}
                      className="flex flex-col items-center cursor-pointer min-w-[44px]"
                      aria-label={`Stage ${m.stepNumber}: ${m.stageTitle}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                          isActive
                            ? 'bg-gradient-to-br from-[#E94D9B] to-[#C92D7D] border-[#C92D7D] text-white scale-110 shadow-md'
                            : isPassed
                            ? 'bg-[#FCE7F3] border-[#E94D9B]/50 text-[#C92D7D]'
                            : 'bg-white border-[#F0E5EC] text-[#777181] hover:border-[#E94D9B]/40'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-mono tabular-nums mt-1.5 font-semibold ${isActive ? 'text-[#C92D7D]' : 'text-[#777181]'}`}>
                        0{m.stepNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F0E5EC] text-xs">
              <button
                type="button"
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#F0E5EC] text-[#252033] font-medium disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <span className="font-mono tabular-nums text-[#777181]">
                {activeStepIndex + 1} / {milestones.length}
              </span>

              <button
                type="button"
                disabled={activeStepIndex === milestones.length - 1}
                onClick={() => setActiveStepIndex((prev) => Math.min(milestones.length - 1, prev + 1))}
                className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#F0E5EC] text-[#252033] font-medium disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detail Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#C92D7D]">{activeMilestone.phaseName}</span>
                <span className={`font-semibold ${getSeverityTextColor(activeMilestone.severity)}`}>
                  {activeMilestone.severity} · +{activeMilestone.pointsContribution} pts
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#252033]">{activeMilestone.stageTitle}</h4>
                <p className="text-sm text-[#777181] mt-1 leading-relaxed">{activeMilestone.whatDetected}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FCE7F3]/40 border border-[#F0E5EC] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C92D7D]">
                  <Quote className="w-3.5 h-3.5 shrink-0" />
                  <span>Observed Excerpt</span>
                </div>
                <p className="text-xs sm:text-sm font-mono text-[#252033] italic leading-relaxed break-words">
                  &ldquo;{activeMilestone.quoteText}&rdquo;
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#252033] block">Psychological Intent</span>
                <p className="text-sm text-[#777181] leading-relaxed">{activeMilestone.psychologicalIntent}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#777181]">Cumulative Risk</span>
                  <span className="font-mono font-bold tabular-nums text-[#252033]">
                    {activeMilestone.cumulativeScore} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FFF8FC] overflow-hidden border border-[#F0E5EC]">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      activeMilestone.cumulativeScore >= 80
                        ? 'bg-[#E5484D]'
                        : activeMilestone.cumulativeScore >= 50
                        ? 'bg-[#E99A24]'
                        : 'bg-[#E94D9B]'
                    }`}
                    style={{ width: `${activeMilestone.cumulativeScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs border-b border-[#F0E5EC] pb-2">
                  <span className="font-semibold text-[#252033] inline-flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-[#E94D9B]" />
                    <span>Evidence in Context</span>
                  </span>
                  <span className="font-mono text-[#777181]">~{activeMilestone.textPosition.percentage}%</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#F0E5EC] max-h-56 overflow-y-auto font-mono text-xs text-[#252033] leading-relaxed whitespace-pre-wrap break-words">
                  {fullText.length > 0 ? (
                    (() => {
                      const quote = activeMilestone.quoteText;
                      const idx = fullText.toLowerCase().indexOf(quote.toLowerCase());
                      if (idx === -1) return fullText;
                      const before = fullText.slice(0, idx);
                      const match = fullText.slice(idx, idx + quote.length);
                      const after = fullText.slice(idx + quote.length);
                      return (
                        <>
                          <span className="opacity-55">{before}</span>
                          <mark className="bg-[#FCE7F3] text-[#C92D7D] px-1 py-0.5 rounded font-bold">
                            {match}
                          </mark>
                          <span className="opacity-55">{after}</span>
                        </>
                      );
                    })()
                  ) : (
                    <span>No textual content available.</span>
                  )}
                </div>
              </div>

              <div className="text-xs text-[#777181] flex items-center justify-between font-mono">
                <span>Paragraph {activeMilestone.textPosition.paragraphIndex}</span>
                <span className="text-[#C92D7D] font-semibold">
                  Stage 0{activeMilestone.stepNumber} / 0{milestones.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'stream' && (
        <div className="divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-2xl overflow-hidden">
          {milestones.map((m) => {
            const Icon = getCategoryIcon(m.category);
            return (
              <div key={m.id} className="p-5 bg-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-[#C92D7D] block">{m.phaseName}</span>
                      <h4 className="text-sm font-bold text-[#252033]">{m.stageTitle}</h4>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-semibold ${getSeverityTextColor(m.severity)}`}>
                    {m.severity} · +{m.pointsContribution} pts
                  </span>
                </div>

                <p className="p-3 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] font-mono text-xs text-[#252033] italic">
                  &ldquo;{m.quoteText}&rdquo;
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#252033] block mb-0.5">Observed Pattern</span>
                    <p className="text-[#777181] leading-relaxed">{m.whatDetected}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#C92D7D] block mb-0.5">Psychological Intent</span>
                    <p className="text-[#777181] leading-relaxed">{m.psychologicalIntent}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
