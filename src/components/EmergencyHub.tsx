import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  FileText,
  Building2,
  PhoneCall,
  Clock,
  Download,
  Copy,
  Check,
  Printer,
  ExternalLink,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { AnalysisResult } from '../types.js';

export interface TransferredIntel {
  upi?: string;
  bank?: string;
  phone?: string;
}

interface EmergencyHubProps {
  initialResult?: AnalysisResult | null;
  initialIntel?: TransferredIntel | null;
  onNavigateToScan?: () => void;
}

export const EmergencyHub: React.FC<EmergencyHubProps> = ({ initialResult, initialIntel }) => {
  const [victimName, setVictimName] = useState('');
  const [victimPhone, setVictimPhone] = useState('');
  const [victimCity, setVictimCity] = useState('');
  const [victimState, setVictimState] = useState('');
  const [victimBankName, setVictimBankName] = useState('');
  const [victimAccountNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionAmount, setTransactionAmount] = useState(
    initialResult?.extractedEntities?.amounts?.[0]?.replace(/[^0-9]/g, '') || ''
  );
  const [incidentType] = useState(
    initialResult?.headline || 'Digital Arrest / Cyber Coercion & Fraudulent Transfer'
  );
  const [suspectContact, setSuspectContact] = useState(
    initialIntel?.phone || initialResult?.extractedEntities?.contacts?.[0] || ''
  );
  const [suspectUpiOrAccount, setSuspectUpiOrAccount] = useState(
    initialIntel?.upi ||
      initialIntel?.bank ||
      initialResult?.extractedEntities?.paymentsDetected?.[0] ||
      ''
  );
  const [suspectUrlOrPlatform] = useState(
    initialResult?.urlDetails?.url || initialResult?.extractedEntities?.links?.[0] || 'WhatsApp / Telegram'
  );
  const [briefDescription, setBriefDescription] = useState(
    initialResult
      ? `Suspect approached via ${initialResult.inputType}. Evidence flagged: ${initialResult.signals.map((s) => s.name).join(', ')}. ${initialResult.summary}`
      : ''
  );

  const [activeDocTab, setActiveDocTab] = useState<'fir' | 'bank' | 'ic3' | 'hotlines'>('fir');
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (initialIntel) {
      if (initialIntel.phone) setSuspectContact(initialIntel.phone);
      if (initialIntel.upi || initialIntel.bank) {
        setSuspectUpiOrAccount(initialIntel.upi || initialIntel.bank || '');
      }
    }
  }, [initialIntel]);

  const handleGenerateReports = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/emergency/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          victimName,
          victimPhone,
          victimCity,
          victimState,
          victimBankName,
          victimAccountNumber,
          transactionId,
          transactionAmount,
          incidentType,
          suspectContact,
          suspectUpiOrAccount,
          suspectUrlOrPlatform,
          briefIncidentDescription: briefDescription,
          threatSignals: initialResult?.signals.map((s) => s.name) || ['Coercive Demands', 'Impersonation of Authority']
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate legal drafts');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if ((initialResult || initialIntel) && !reportData) {
      handleGenerateReports();
    }
  }, [initialResult, initialIntel]);

  const activeContent = reportData
    ? activeDocTab === 'fir'
      ? reportData.firComplaintDraft
      : activeDocTab === 'bank'
      ? reportData.bankFreezeLetter
      : activeDocTab === 'ic3'
      ? reportData.ic3ReportDraft
      : ''
    : '';

  const handleCopyCurrent = () => {
    if (!activeContent) return;
    navigator.clipboard.writeText(activeContent);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!activeContent) return;
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SCAMSHIELD-LEGAL-REPORT-${activeDocTab.toUpperCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Emergency Header */}
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E5484D]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Golden Hour Incident Response · India 1930 &amp; Global IC3</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252033] tracking-tight">
              Victim 911 Legal &amp; Bank Freeze Hub
            </h1>
            <p className="text-sm text-[#777181] max-w-2xl leading-relaxed">
              Generate official police FIR complaints, urgent bank lien freeze notices under RBI Master Directions, and international IC3 reports in minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="tel:1930"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5484D] hover:bg-[#cf393e] text-white font-semibold text-sm shadow-sm transition-colors whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Dial 1930 Helpline</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] text-[#252033] border border-[#F0E5EC] text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span>Cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C92D7D]" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F0E5EC] grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#E5484D] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-[#252033] block">First 120 Minutes</span>
              <span className="text-[#777181]">Dial 1930 immediately to freeze beneficiary mule accounts before cash-out.</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex items-start gap-3">
            <Building2 className="w-4 h-4 text-[#E99A24] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-[#252033] block">Notify Bank Fraud Desk</span>
              <span className="text-[#777181]">Submit the generated dispute notice under RBI Customer Protection rules.</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#C92D7D] shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <span className="font-bold text-[#252033] block">Preserve Evidence</span>
              <span className="text-[#777181]">Keep uncropped chat screenshots, 12-digit UTR numbers, and call logs.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Case Form */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-3">
              <h2 className="text-base font-bold text-[#252033] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E94D9B]" />
                <span>Case Details</span>
              </h2>
              <span className="text-xs text-[#777181]">Auto-fills legal drafts</span>
            </div>

            <form onSubmit={handleGenerateReports} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    placeholder="Your full legal name"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] font-mono focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">City / District</label>
                  <input
                    type="text"
                    value={victimCity}
                    onChange={(e) => setVictimCity(e.target.value)}
                    placeholder="e.g., Bengaluru"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={victimState}
                    onChange={(e) => setVictimState(e.target.value)}
                    placeholder="e.g., Karnataka"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">Your Bank</label>
                  <input
                    type="text"
                    value={victimBankName}
                    onChange={(e) => setVictimBankName(e.target.value)}
                    placeholder="e.g., HDFC Bank / SBI"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
                <div>
                  <label className="block text-[#252033] font-semibold mb-1">Disputed Amount</label>
                  <input
                    type="text"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    placeholder="e.g., 25,000"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#E5484D] font-mono font-bold focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#252033] font-semibold mb-1">Transaction Ref / UTR Number</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="12-digit UTR or reference number"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] font-mono focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                />
              </div>

              <div>
                <label className="block text-[#252033] font-semibold mb-1">Suspect UPI ID / Mule Account</label>
                <input
                  type="text"
                  value={suspectUpiOrAccount}
                  onChange={(e) => setSuspectUpiOrAccount(e.target.value)}
                  placeholder="e.g., fraudster@ybl or A/C number"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#C92D7D] font-mono font-semibold focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                />
              </div>

              <div>
                <label className="block text-[#252033] font-semibold mb-1">Suspect Phone / Handle</label>
                <input
                  type="text"
                  value={suspectContact}
                  onChange={(e) => setSuspectContact(e.target.value)}
                  placeholder="e.g., +91 78901 23456"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] font-mono focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                />
              </div>

              <div>
                <label className="block text-[#252033] font-semibold mb-1">Incident Summary</label>
                <textarea
                  rows={3}
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder="Describe how the suspect contacted you and requested funds..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] hover:from-[#d93d8b] hover:to-[#b3246d] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Drafts...' : 'Generate Legal Drafts'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Legal Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm">
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: 'fir', label: 'Police FIR / 1930' },
                { id: 'bank', label: 'Bank Freeze Notice' },
                { id: 'ic3', label: 'FBI IC3 Draft' },
                { id: 'hotlines', label: 'Helplines' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveDocTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeDocTab === tab.id
                      ? 'bg-[#FCE7F3] text-[#C92D7D]'
                      : 'text-[#777181] hover:text-[#252033]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeDocTab !== 'hotlines' && (
              <div className="flex items-center gap-1.5 px-1">
                <button
                  type="button"
                  onClick={handleCopyCurrent}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] text-[#252033] text-xs font-medium border border-[#F0E5EC] cursor-pointer"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-[#16A36A]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDoc ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] text-[#252033] text-xs font-medium border border-[#F0E5EC] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] text-[#252033] border border-[#F0E5EC] cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {activeDocTab === 'hotlines' ? (
            <div className="p-6 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#252033] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#E94D9B]" />
                <span>Official Reporting Directory</span>
              </h3>
              <div className="divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-xl overflow-hidden">
                {(reportData?.helplines || [
                  { country: 'India', agency: 'National Cyber Crime Reporting (I4C)', phone: '1930', portal: 'https://cybercrime.gov.in', notes: '24x7 toll-free financial fraud lien freeze helpline.' },
                  { country: 'USA', agency: 'FBI Internet Crime Complaint Center (IC3)', phone: 'ic3.gov', portal: 'https://www.ic3.gov', notes: 'Federal portal for wire fraud, BEC, and crypto scams.' },
                  { country: 'UK', agency: 'Action Fraud', phone: '0300 123 2040', portal: 'https://www.actionfraud.police.uk', notes: 'UK national fraud and cybercrime reporting centre.' }
                ]).map((hl: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#252033]">
                        {hl.country} — {hl.agency}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#E5484D]">{hl.phone}</span>
                    </div>
                    <p className="text-xs text-[#777181]">{hl.notes}</p>
                    <a
                      href={hl.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C92D7D] hover:underline pt-1"
                    >
                      <span>{hl.portal}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm font-mono text-xs text-[#252033] leading-relaxed overflow-x-auto max-h-[600px]">
              <pre className="whitespace-pre-wrap font-mono">
                {activeContent ||
                  'Complete the case details on the left and click "Generate Legal Drafts" to compile your official FIR and bank freeze notice.'}
              </pre>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-xs text-[#777181] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#E99A24] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Templates reference IT Act 2000 (Sec 66C/66D), BNS 2023 / IPC 420, and RBI Customer Protection guidelines. Submit through official government portals and obtain an acknowledgment receipt from your bank branch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
