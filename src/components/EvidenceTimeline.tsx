import React, { useState } from 'react';
import { RiskSignal } from '../types.js';
import {
  CreditCard,
  Clock,
  Briefcase,
  UserCheck,
  Shield,
  Radio,
  Globe,
  Server,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Quote,
  LayoutGrid,
  List
} from 'lucide-react';
import { motion } from 'motion/react';

interface EvidenceTimelineProps {
  signals: RiskSignal[];
}

export const EvidenceTimeline: React.FC<EvidenceTimelineProps> = ({ signals }) => {
  const [expandedId, setExpandedId] = useState<string | null>(signals[0]?.id || null);
  const [layoutMode, setLayoutMode] = useState<'timeline' | 'grid'>('timeline');

  const getSignalIcon = (category: RiskSignal['category']) => {
    switch (category) {
      case 'PAYMENT':
        return CreditCard;
      case 'URGENCY':
        return Clock;
      case 'EMPLOYMENT':
        return Briefcase;
      case 'IDENTITY':
        return UserCheck;
      case 'FINANCIAL':
        return Shield;
      case 'SOCIAL_ENG':
        return Radio;
      case 'URL_STRUCTURE':
        return Globe;
      case 'DOMAIN_INTEL':
        return Server;
      default:
        return AlertCircle;
    }
  };

  const getSeverityColor = (severity: RiskSignal['severity']) => {
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

  if (signals.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-6 text-center text-[#777181] text-sm">
        No high-confidence threat signals were isolated in this submission.
      </div>
    );
  }

  return (
    <section className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E5EC] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#252033]">
            Why SCAMSHIELD AI Flagged This
          </h3>
          <p className="text-xs text-[#777181] mt-0.5">
            Forensic evidence isolated from your submission · {signals.length} signal{signals.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="p-1 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] inline-flex items-center text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLayoutMode('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              layoutMode === 'timeline' ? 'bg-white text-[#C92D7D] font-semibold shadow-sm' : 'text-[#777181] hover:text-[#252033]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
              layoutMode === 'grid' ? 'bg-white text-[#C92D7D] font-semibold shadow-sm' : 'text-[#777181] hover:text-[#252033]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-2xl overflow-hidden'}>
        {signals.map((sig, index) => {
          const isExpanded = expandedId === sig.id;
          const Icon = getSignalIcon(sig.category);
          const stepNumber = String(index + 1).padStart(2, '0');

          return (
            <div
              key={sig.id}
              className={
                layoutMode === 'grid'
                  ? 'rounded-2xl border border-[#F0E5EC] bg-[#FFF8FC]/50 p-4 sm:p-5 space-y-3'
                  : 'bg-white p-4 sm:p-5 space-y-3'
              }
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : sig.id)}
                className="w-full text-left flex items-center justify-between gap-3 cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-[#777181] flex-wrap">
                      <span className="font-mono font-semibold text-[#C92D7D]">#{stepNumber}</span>
                      <span>·</span>
                      <span>{sig.category.replace('_', ' ')}</span>
                      <span>·</span>
                      <span className={`font-semibold ${getSeverityColor(sig.severity)}`}>{sig.severity}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">+{sig.scoreWeight} pts</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#252033] truncate mt-0.5">
                      {sig.name}
                    </h4>
                  </div>
                </div>

                <div className="w-8 h-8 flex items-center justify-center text-[#777181] rounded-lg bg-[#FFF8FC] border border-[#F0E5EC] shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#C92D7D]" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              <div className="space-y-2.5 text-sm">
                <p className="text-[#252033] leading-relaxed">{sig.whatDetected}</p>

                {sig.evidence.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex items-start gap-2">
                    <Quote className="w-4 h-4 text-[#E94D9B] shrink-0 mt-0.5" />
                    <p className="font-mono text-xs text-[#252033] italic break-words">
                      {sig.evidence.map((ev) => `"${ev}"`).join(' · ')}
                    </p>
                  </div>
                )}

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 space-y-2 text-xs sm:text-sm"
                  >
                    <p className="text-[#777181] leading-relaxed">
                      <strong className="text-[#252033]">Why it matters: </strong>
                      {sig.whyItMatters}
                    </p>
                    <p className="p-3 rounded-xl bg-[#16A36A]/10 border border-[#16A36A]/25 text-[#252033] leading-relaxed">
                      <strong className="text-[#16A36A]">Recommended defense: </strong>
                      {sig.recommendedAction}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
