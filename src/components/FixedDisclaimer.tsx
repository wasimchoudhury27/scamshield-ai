import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const FixedDisclaimer: React.FC = () => {
  return (
    <aside
      id="fixed-investigation-disclaimer"
      aria-label="Security Risk Assessment Disclaimer"
      className="rounded-2xl bg-[#FFF8FC] border border-[#F0E5EC] p-4 sm:p-5 flex items-start gap-3 text-xs text-[#777181]"
    >
      <ShieldAlert className="w-4 h-4 text-[#C92D7D] shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        <strong className="text-[#252033]">Assessment Notice:</strong> SCAMSHIELD AI provides automated risk intelligence, not legal determinations. Always verify organizations independently through official directories before transferring funds or sharing sensitive documents.
      </p>
    </aside>
  );
};
