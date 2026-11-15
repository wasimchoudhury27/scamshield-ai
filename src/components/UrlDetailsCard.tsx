import React from 'react';
import { UrlDetails } from '../types.js';
import { Globe, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface UrlDetailsCardProps {
  details: UrlDetails;
}

export const UrlDetailsCard: React.FC<UrlDetailsCardProps> = ({ details }) => {
  return (
    <div className="rounded-2xl bg-white border border-[#F0E5EC] p-5 sm:p-7 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-lg font-bold text-[#252033] truncate">
              URL &amp; Domain Intelligence
            </h4>
            <p className="text-xs text-[#777181] truncate">
              Protocol encryption, top-level domain risk, and lookalike spoofing check
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {details.isHttps ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A36A]">
              <Lock className="w-3.5 h-3.5" />
              <span>HTTPS Encrypted</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5484D]">
              <Unlock className="w-3.5 h-3.5" />
              <span>Insecure HTTP</span>
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Target Host</span>
          <span className="text-[#252033] font-mono font-semibold break-all text-sm">
            {details.domain}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Top-Level Domain (TLD)</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[#252033] font-semibold text-sm">.{details.tld}</span>
            {['xyz', 'top', 'work', 'click', 'loan', 'buzz'].includes(details.tld) && (
              <span className="text-xs font-semibold text-[#E99A24]">High-Risk TLD</span>
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Impersonation Target</span>
          {details.lookalikeTarget ? (
            <span className="text-[#E5484D] font-semibold inline-flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Spoofs {details.lookalikeTarget}</span>
            </span>
          ) : (
            <span className="text-[#777181]">None detected</span>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Domain Age Record</span>
          <span className="text-[#252033] font-medium">{details.domainAgeStatus}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Subdomain Hierarchy</span>
          <span className="text-[#252033] font-mono">
            {details.subdomains.length > 0
              ? `${details.subdomains.join('.')} (${details.subdomains.length} level)`
              : 'Apex / Root Domain'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC]">
          <span className="text-[#777181] block mb-1">Encoding &amp; Host Type</span>
          <span className="text-[#252033] font-medium">
            {details.isIpAddress
              ? 'Raw IP Host'
              : details.isPunycode
              ? 'Punycode IDN Detected'
              : 'Standard DNS Domain'}
          </span>
        </div>
      </div>

      {details.flaggedKeywords.length > 0 && (
        <p className="text-xs text-[#777181] font-mono">
          Observable indicators: {details.flaggedKeywords.join(' · ')}
        </p>
      )}
    </div>
  );
};
