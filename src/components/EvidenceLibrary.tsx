import React from 'react';
import { DEMO_SCENARIOS } from '../data/demoScenarios.js';
import { DemoScenario } from '../types.js';
import { Briefcase, Home, Link2, FileCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface EvidenceLibraryProps {
  onSelectScenario: (scenario: DemoScenario, autoSubmit?: boolean) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export const EvidenceLibrary: React.FC<EvidenceLibraryProps> = ({
  onSelectScenario,
  selectedId
}) => {
  const getEvidenceMetadata = (id: string) => {
    switch (id) {
      case 'demo-job':
        return {
          code: 'Job Scam',
          threatType: 'Direct selection with an upfront ₹4,999 laptop security deposit demand.',
          signals: ['₹4,999 Security Fee', 'No Interview', '2-Hour Timer'],
          icon: Briefcase
        };
      case 'demo-rental':
        return {
          code: 'Rental Fraud',
          threatType: 'Owner out of town asking for ₹10,000 gate-pass QR deposit before viewing.',
          signals: ['₹10,000 QR Deposit', 'Military Pretext', '1 Slot Left'],
          icon: Home
        };
      case 'demo-url':
        return {
          code: 'Phishing URL',
          threatType: 'Spoofed banking KYC verification link hosted on a disposable .xyz domain.',
          signals: ['Disposable .xyz TLD', 'Bank Lookalike', 'Credential Form'],
          icon: Link2
        };
      case 'demo-appointment':
      default:
        return {
          code: 'Onboarding Fee',
          threatType: 'Fake corporate appointment letter demanding ₹3,450 biometric processing fee.',
          signals: ['₹3,450 Processing Fee', 'Legal Threat', '60-Min Limit'],
          icon: FileCheck
        };
    }
  };

  return (
    <section id="evidence-library-section" className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-[#F0E5EC]">
        <div>
          <h3 className="text-xl font-bold text-[#252033] tracking-tight">
            Test with Real Scam Archetypes
          </h3>
          <p className="text-sm text-[#777181]">
            Select any curated case below to run an instant AI and rule-engine investigation.
          </p>
        </div>
        <span className="text-xs font-medium text-[#C92D7D]">
          4 interactive samples
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_SCENARIOS.map((sc) => {
          const meta = getEvidenceMetadata(sc.id);
          const Icon = meta.icon;
          const isSelected = selectedId === sc.id;

          return (
            <motion.button
              key={sc.id}
              type="button"
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              onClick={() => onSelectScenario(sc, true)}
              className={`text-left rounded-2xl border p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer group ${
                isSelected
                  ? 'bg-[#FCE7F3]/50 border-[#E94D9B] shadow-[0_8px_24px_-8px_rgba(233,77,155,0.25)]'
                  : 'bg-white border-[#F0E5EC] hover:border-[#E94D9B]/60 hover:shadow-[0_10px_28px_-12px_rgba(37,32,51,0.12)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-medium text-[#777181]">
                    {meta.code}
                  </span>
                  <span className="w-8 h-8 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#252033] group-hover:text-[#C92D7D] transition-colors mb-1.5">
                  {sc.title}
                </h4>

                <p className="text-xs text-[#777181] leading-relaxed mb-4">
                  {meta.threatType}
                </p>

                <p className="text-[11px] text-[#777181] font-mono leading-relaxed mb-4">
                  {meta.signals.join(' · ')}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E5EC] flex items-center justify-between text-xs font-semibold">
                <span className="text-[#777181]">
                  {sc.type === 'url' ? 'Inspect URL' : 'Inspect Message'}
                </span>
                <span className="inline-flex items-center gap-1 text-[#C92D7D] group-hover:translate-x-0.5 transition-transform">
                  <span>Run Scan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
