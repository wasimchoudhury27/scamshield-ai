import React, { useState } from 'react';
import type { AnalysisResult, SignalSeverity } from '../types.js';
import { deriveThreatCategories } from '../utils/threatCategories.js';
import {
  AlertTriangle,
  Clock,
  Fingerprint,
  CreditCard,
  Briefcase,
  KeyRound,
  MessageSquareWarning,
  Server,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ThreatCategoryBreakdownProps {
  result: AnalysisResult;
}

export const ThreatCategoryBreakdown: React.FC<ThreatCategoryBreakdownProps> = ({ result }) => {
  const summary = deriveThreatCategories(result);
  const { categories, totalThreatPoints, dominantCategory } = summary;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(categories[0]?.id || null);
  const [viewMode, setViewMode] = useState<'both' | 'bars' | 'tags'>('both');

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'phishing':
        return ExternalLink;
      case 'brand_impersonation':
        return Fingerprint;
      case 'urgency_manipulation':
        return Clock;
      case 'payment_fraud':
        return CreditCard;
      case 'employment_fraud':
        return Briefcase;
      case 'credential_harvesting':
        return KeyRound;
      case 'social_engineering':
        return MessageSquareWarning;
      case 'infrastructure_anomalies':
        return Server;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityStyle = (severity: SignalSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          textColor: 'text-[#E5484D]',
          bgColor: 'bg-[#E5484D]/10',
          borderColor: 'border-[#E5484D]/30',
          barClass: 'bg-[#E5484D]',
          badgeText: 'Critical'
        };
      case 'HIGH':
      case 'MODERATE':
        return {
          textColor: 'text-[#E99A24]',
          bgColor: 'bg-[#E99A24]/10',
          borderColor: 'border-[#E99A24]/30',
          barClass: 'bg-[#E99A24]',
          badgeText: severity === 'HIGH' ? 'High' : 'Moderate'
        };
      case 'LOW':
      default:
        return {
          textColor: 'text-[#16A36A]',
          bgColor: 'bg-[#16A36A]/10',
          borderColor: 'border-[#16A36A]/30',
          barClass: 'bg-[#16A36A]',
          badgeText: 'Low'
        };
    }
  };

  const displayedCategories = selectedCategoryId
    ? categories.filter((c) => c.id === selectedCategoryId)
    : categories;

  if (categories.length === 0) {
    return (
      <div
        id="threat-category-breakdown"
        className="rounded-2xl bg-white border border-[#F0E5EC] p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#16A36A]/10 text-[#16A36A]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#252033]">Threat Categories</h3>
              <p className="text-xs text-[#777181]">
                Checked across phishing, impersonation, urgency, and payment demands
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#16A36A]">0 categories flagged</span>
        </div>

        <p className="text-sm text-[#777181] leading-relaxed">
          No coercive patterns, upfront deposit requests, or deceptive URL markers were isolated in this submission. Always verify through official channels before acting.
        </p>
      </div>
    );
  }

  return (
    <section
      id="threat-category-breakdown"
      className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E5EC] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-[#252033]">
                Identified Threat Categories
              </h3>
              <span className="text-xs font-semibold text-[#E5484D]">
                · {categories.length} flagged
              </span>
            </div>
            <p className="text-xs text-[#777181]">
              Breakdown of detected manipulation tactics and risk intensity
              {dominantCategory ? ` · Primary: ${dominantCategory.name}` : ''}
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-xl bg-[#FFF8FC] p-1 border border-[#F0E5EC] text-xs font-medium self-start sm:self-auto">
          {(['both', 'bars', 'tags'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === mode
                  ? 'bg-white text-[#C92D7D] font-semibold shadow-sm'
                  : 'text-[#777181] hover:text-[#252033]'
              }`}
            >
              {mode === 'both' ? 'Combined' : mode === 'bars' ? 'Bars' : 'Filters'}
            </button>
          ))}
        </div>
      </div>

      {/* Composite Threat Share Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#777181]">
          <span className="font-medium text-[#252033]">Composite Risk Share</span>
          <span className="font-mono tabular-nums">{totalThreatPoints} risk weight pts</span>
        </div>

        <div className="h-2.5 w-full bg-[#FFF8FC] rounded-full overflow-hidden border border-[#F0E5EC] flex gap-0.5 p-0.5">
          {categories.map((cat) => {
            const style = getSeverityStyle(cat.severity);
            const proportion = Math.max(8, Math.round((cat.score / Math.max(1, totalThreatPoints)) * 100));
            return (
              <button
                key={cat.id}
                type="button"
                title={`${cat.name}: ${cat.percentage}% (+${cat.score} pts)`}
                style={{ width: `${proportion}%` }}
                onClick={() => setSelectedCategoryId((prev) => (prev === cat.id ? null : cat.id))}
                className={`h-full rounded-full cursor-pointer transition-opacity ${style.barClass} ${
                  selectedCategoryId && selectedCategoryId !== cat.id ? 'opacity-40' : 'opacity-100'
                }`}
                aria-label={`Filter by ${cat.name}`}
              />
            );
          })}
        </div>
      </div>

      {(viewMode === 'both' || viewMode === 'tags') && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-[#252033] border-[#252033] text-white'
                : 'bg-[#FFF8FC] border-[#F0E5EC] text-[#777181] hover:text-[#252033]'
            }`}
          >
            All Categories ({categories.length})
          </button>

          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const style = getSeverityStyle(cat.severity);
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer inline-flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#FCE7F3] border-[#E94D9B] text-[#C92D7D]'
                    : 'bg-white border-[#F0E5EC] text-[#252033] hover:border-[#E94D9B]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${style.textColor} shrink-0`} />
                <span>{cat.name}</span>
                <span className="font-mono tabular-nums text-[#777181]">+{cat.score}</span>
              </button>
            );
          })}
        </div>
      )}

      {(viewMode === 'both' || viewMode === 'bars') && (
        <div className="divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-2xl overflow-hidden bg-[#FFF8FC]/40">
          {displayedCategories.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            const style = getSeverityStyle(cat.severity);
            const isExpanded = expandedCategoryId === cat.id;

            return (
              <div key={cat.id} className="p-4 sm:p-5 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl ${style.bgColor} ${style.textColor} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-[#252033]">{cat.name}</h4>
                        <span className={`text-xs font-semibold ${style.textColor}`}>
                          {style.badgeText}
                        </span>
                        <span className="text-xs text-[#777181]">
                          · {cat.signalCount} {cat.signalCount === 1 ? 'signal' : 'signals'}
                        </span>
                      </div>
                      <p className="text-xs text-[#777181] mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
                    <div className="text-right font-mono tabular-nums text-xs">
                      <span className={`font-bold ${style.textColor}`}>+{cat.score} pts</span>
                      <span className="text-[#777181] mx-1.5">·</span>
                      <span className="font-bold text-[#252033]">{cat.percentage}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedCategoryId((prev) => (prev === cat.id ? null : cat.id))}
                      className="p-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-[#777181] hover:text-[#252033] transition-colors cursor-pointer"
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 w-full bg-[#FFF8FC] rounded-full overflow-hidden border border-[#F0E5EC]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`h-full rounded-full ${style.barClass}`}
                  />
                </div>

                {cat.indicators.length > 0 && (
                  <p className="mt-2.5 text-xs text-[#777181] font-mono truncate">
                    Triggers: {cat.indicators.slice(0, 3).map((ind) => `"${ind}"`).join(' · ')}
                  </p>
                )}

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-[#F0E5EC] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#252033] block mb-1">Why it matters</span>
                        <p className="text-[#777181] leading-relaxed">{cat.description}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-[#16A36A] block mb-1">Recommended Defense</span>
                        <p className="text-[#252033] leading-relaxed">{cat.defensiveAction}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
