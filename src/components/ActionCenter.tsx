import React, { useState } from 'react';
import { AnalysisResult } from '../types.js';
import {
  Ban,
  KeyRound,
  Building2,
  Flag,
  Copy,
  Check,
  Share2,
  ExternalLink,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface ActionCenterProps {
  result: AnalysisResult;
  onReset: () => void;
  onOpenEmergencyHub?: () => void;
  onOpenScambaiter?: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  result,
  onReset,
  onOpenEmergencyHub,
  onOpenScambaiter
}) => {
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedAdvice, setCopiedAdvice] = useState(false);

  const handleCopyReport = () => {
    const report = `SCAMSHIELD AI SECURITY BRIEFING
Risk Level: ${result.riskLevel} (${result.threatScore}/100)
Assessment: ${result.summary}
Primary Evidence: ${result.primaryQuote ? `"${result.primaryQuote}"` : 'Flagged by forensic indicators'}
Action Required: Do not transfer money, share OTPs, or click unverified links.
Investigated via SCAMSHIELD AI`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleShareAdvice = () => {
    const advice = `Safety Alert: I checked a suspicious message using SCAMSHIELD AI and it scored ${result.threatScore}/100 (${result.riskLevel}). Legitimate employers and landlords never demand upfront security deposits via UPI/GPay. Always verify directly.`;

    navigator.clipboard.writeText(advice);
    setCopiedAdvice(true);
    setTimeout(() => setCopiedAdvice(false), 2000);
  };

  const defensiveDirectives = [
    {
      title: 'Do Not Send Money',
      desc: 'Never transfer registration fees, laptop security deposits, or viewing gate-pass charges. Verified employers and landlords do not ask for advance UPI payments.',
      icon: Ban,
      color: 'text-[#E5484D]',
      bg: 'bg-[#E5484D]/10'
    },
    {
      title: 'Protect OTPs & IDs',
      desc: 'Never share Aadhaar/PAN scans, one-time passwords (OTPs), UPI PINs, or install remote-access apps like AnyDesk for unverified contacts.',
      icon: KeyRound,
      color: 'text-[#E99A24]',
      bg: 'bg-[#E99A24]/10'
    },
    {
      title: 'Verify Independently',
      desc: 'Look up the company or agency directly through official search results or verified directories — never use phone numbers or links inside the suspect message.',
      icon: Building2,
      color: 'text-[#C92D7D]',
      bg: 'bg-[#FCE7F3]'
    },
    {
      title: 'Block & Report',
      desc: 'Block the sender immediately and report the account to official national cybercrime authorities to protect others.',
      icon: Flag,
      color: 'text-[#16A36A]',
      bg: 'bg-[#16A36A]/10'
    }
  ];

  return (
    <section className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0E5EC] pb-4">
        <div>
          <h3 className="text-lg font-bold text-[#252033]">
            Recommended Next Steps
          </h3>
          <p className="text-xs text-[#777181]">
            Immediate protective actions based on this risk verdict
          </p>
        </div>
        <span className="text-xs font-medium text-[#16A36A]">
          Prioritized Safety Checklist
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defensiveDirectives.map((d, idx) => {
          const Icon = d.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${d.bg} ${d.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#252033]">{d.title}</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#777181] leading-relaxed">
                {d.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-[#F0E5EC] space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenEmergencyHub && (
            <button
              type="button"
              onClick={onOpenEmergencyHub}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5484D] hover:bg-[#cf393e] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Draft FIR &amp; Bank Freeze</span>
            </button>
          )}

          {onOpenScambaiter && (
            <button
              type="button"
              onClick={onOpenScambaiter}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] hover:from-[#d93d8b] hover:to-[#b3246d] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Open AI Honeypot</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyReport}
            className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF8FC] border border-[#F0E5EC] text-xs font-semibold text-[#252033] transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A36A]" />
                <span className="text-[#16A36A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#777181]" />
                <span>Copy Dossier</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareAdvice}
            className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF8FC] border border-[#F0E5EC] text-xs font-semibold text-[#252033] transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedAdvice ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A36A]" />
                <span className="text-[#16A36A]">Advice Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#777181]" />
                <span>Share Warning</span>
              </>
            )}
          </button>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-semibold text-[#C92D7D] transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>CyberCrime.gov.in</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#777181]">
          <span className="font-mono">Assessment ID: {result.id}</span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-[#C92D7D] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan another message or URL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
