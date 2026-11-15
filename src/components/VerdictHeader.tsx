import React, { useState } from 'react';
import { AnalysisResult } from '../types.js';
import { InvestigationRing } from './InvestigationRing.js';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  RotateCcw,
  Copy,
  Check,
  ArrowLeft,
  Globe,
  Layers
} from 'lucide-react';

interface VerdictHeaderProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const VerdictHeader: React.FC<VerdictHeaderProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const reportText = `SCAMSHIELD AI THREAT REPORT
Assessment ID: ${result.id}
Risk Verdict: ${result.riskLevel} (${result.threatScore}/100)
Confidence: ${result.evidenceStrength} Evidence
Summary: ${result.summary}

Primary Observable Evidence:
${result.primaryQuote ? `"${result.primaryQuote}"` : 'Multiple structural signals detected'}

Why SCAMSHIELD AI flagged this:
${result.whyThisScore}

Key Signals Isolated:
${result.signals.map((s, i) => `${i + 1}. [${s.category}] ${s.name} (+${s.scoreWeight} pts): ${s.whatDetected}`).join('\n')}

Recommended Actions:
${result.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

Generated via SCAMSHIELD AI (Think Before You Click. Stay Protected.)`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const getVerdictTheme = () => {
    switch (result.riskLevel) {
      case 'CRITICAL':
        return {
          color: '#E5484D',
          badgeText: 'Critical Risk Verdict',
          textClass: 'text-[#E5484D]',
          bgSoft: 'bg-[#E5484D]/10',
          borderSoft: 'border-[#E5484D]/30',
          icon: AlertOctagon
        };
      case 'HIGH':
        return {
          color: '#E99A24',
          badgeText: 'High Risk Verdict',
          textClass: 'text-[#E99A24]',
          bgSoft: 'bg-[#E99A24]/10',
          borderSoft: 'border-[#E99A24]/30',
          icon: ShieldAlert
        };
      case 'MODERATE':
        return {
          color: '#E99A24',
          badgeText: 'Moderate Suspicion',
          textClass: 'text-[#E99A24]',
          bgSoft: 'bg-[#E99A24]/10',
          borderSoft: 'border-[#E99A24]/30',
          icon: AlertTriangle
        };
      case 'LOW':
      default:
        return {
          color: '#16A36A',
          badgeText: 'Low Risk Verdict',
          textClass: 'text-[#16A36A]',
          bgSoft: 'bg-[#16A36A]/10',
          borderSoft: 'border-[#16A36A]/30',
          icon: ShieldCheck
        };
    }
  };

  const theme = getVerdictTheme();
  const IconComponent = theme.icon;

  return (
    <div className="space-y-4">
      {/* Case Subbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onReset}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-[#252033] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            title="Return to scanner"
            aria-label="Back to scanner"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#777181] font-mono">
              <span className="font-semibold text-[#C92D7D]">Case #{result.id.slice(-8)}</span>
              <span aria-hidden="true">·</span>
              <span>{new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-xs text-[#777181] truncate max-w-md mt-0.5">
              Input: &ldquo;{result.inputSnippet}&rdquo;
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyReport}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                <span className="text-[#16A36A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#777181] shrink-0" />
                <span>Copy Report</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Main Verdict Surface */}
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-8 shadow-[0_14px_40px_-14px_rgba(201,45,125,0.12)] relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: theme.color }}
        />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="shrink-0 w-full lg:w-auto flex justify-center">
            <InvestigationRing
              score={result.threatScore}
              riskLevel={result.riskLevel}
              signals={result.signals}
              size="hero"
            />
          </div>

          <div className="flex-1 space-y-4 text-center lg:text-left w-full min-w-0">
            <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${theme.textClass}`}>
              <IconComponent className="w-4 h-4 shrink-0" />
              <span>{theme.badgeText}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252033] leading-tight [text-wrap:balance]">
              {result.headline}
            </h2>

            <p className="text-sm sm:text-base text-[#777181] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {result.summary}
            </p>

            {/* Unboxed Metadata Line */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 text-xs text-[#777181]">
              <span>
                Confidence: <strong className="text-[#252033]">{result.evidenceStrength}</strong>
              </span>
              {result.extractedEntities.amounts && result.extractedEntities.amounts.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Payment demand: <strong className="text-[#E5484D] font-mono">{result.extractedEntities.amounts.join(', ')}</strong>
                  </span>
                </>
              )}
              {result.extractedEntities.claimedOrg && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Claimed entity: <strong className="text-[#252033]">{result.extractedEntities.claimedOrg}</strong>
                  </span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>
                Engine: <strong className="text-[#C92D7D]">{result.aiAssisted ? 'Google Gemini + Rules' : 'Rule Engine'}</strong>
              </span>
            </div>

            {/* Section Jump Links */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <a
                href="#threat-category-breakdown"
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-semibold text-[#252033] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#E94D9B]" />
                <span>Threat Categories</span>
              </a>
              <a
                href="#geographic-threat-visualization"
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-semibold text-[#252033] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#E94D9B]" />
                <span>Geographic Telemetry</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
