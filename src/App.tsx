import React, { useState, useRef } from 'react';
import { Navbar, MainNavTab } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { InvestigationConsole, InputMode } from './components/InvestigationConsole.js';
import { EvidenceLibrary } from './components/EvidenceLibrary.js';
import { InvestigationSequence } from './components/InvestigationSequence.js';
import { InvestigationDashboard } from './components/InvestigationDashboard.js';
import { HowItWorksModal } from './components/HowItWorksModal.js';
import { EmergencyHub, TransferredIntel } from './components/EmergencyHub.js';
import { ScambaiterHoneypot } from './components/ScambaiterHoneypot.js';
import { GlobalThreatRadar } from './components/GlobalThreatRadar.js';
import { ScamTrainingLab } from './components/ScamTrainingLab.js';
import { BenchmarksWhitepaper } from './components/BenchmarksWhitepaper.js';
import { AnalysisResult, DemoScenario } from './types.js';
import { AlertCircle, PhoneCall, Bot, ArrowRight } from 'lucide-react';

export default function App() {
  const [mainTab, setMainTab] = useState<MainNavTab>('scanner');
  const [activeMode, setActiveMode] = useState<InputMode>('message');
  const [isLoading, setIsLoading] = useState(false);
  const [scanStageIndex, setScanStageIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [honeypotIntel, setHoneypotIntel] = useState<TransferredIntel | null>(null);

  const [selectedDemoId, setSelectedDemoId] = useState<string | undefined>(undefined);
  const [presetText, setPresetText] = useState('');
  const [presetUrl, setPresetUrl] = useState('');
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const evidenceSectionRef = useRef<HTMLDivElement>(null);

  const scrollToEvidence = () => {
    setMainTab('scanner');
    setTimeout(() => {
      evidenceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const executeWithStagedAnimation = async (apiCall: () => Promise<AnalysisResult>) => {
    setIsLoading(true);
    setScanStageIndex(0);
    setError(null);
    setResult(null);
    setMainTab('scanner');

    const stageInterval = setInterval(() => {
      setScanStageIndex((prev) => (prev < 5 ? prev + 1 : prev));
    }, 260);

    try {
      const data = await apiCall();
      clearInterval(stageInterval);
      setScanStageIndex(5);

      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 380);
    } catch (err: any) {
      clearInterval(stageInterval);
      setIsLoading(false);
      setError(
        err.message ||
          'Threat analysis could not be completed. Please check your connection and try again.'
      );
    }
  };

  const handleAnalyzeMessage = (text: string, imageBase64?: string, mimeType?: string) => {
    executeWithStagedAnimation(async () => {
      const response = await fetch('/api/analyze/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, imageBase64, mimeType })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error during evidence analysis.');
      }

      return response.json();
    });
  };

  const handleAnalyzeUrl = (url: string) => {
    executeWithStagedAnimation(async () => {
      const response = await fetch('/api/analyze/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error during URL threat inspection.');
      }

      return response.json();
    });
  };

  const handleSelectDemo = (scenario: DemoScenario, autoSubmit: boolean = true) => {
    setSelectedDemoId(scenario.id);
    setError(null);
    setMainTab('scanner');

    if (scenario.type === 'url') {
      setActiveMode('url');
      setPresetUrl(scenario.content);
      if (autoSubmit) {
        handleAnalyzeUrl(scenario.content);
      }
    } else {
      setActiveMode('message');
      setPresetText(scenario.content);
      if (autoSubmit) {
        handleAnalyzeMessage(scenario.content);
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
    setSelectedDemoId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#FFF8FC] text-[#252033] flex flex-col font-sans saas-canvas-bg">
      <Navbar
        activeTab={mainTab}
        onSelectTab={(tab) => {
          setMainTab(tab);
          if (tab !== 'scanner') {
            setError(null);
          }
        }}
        onReset={handleReset}
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        isResultActive={!!result && !isLoading && mainTab === 'scanner'}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {mainTab === 'emergency' && (
          <EmergencyHub
            initialResult={result}
            initialIntel={honeypotIntel}
            onNavigateToScan={() => setMainTab('scanner')}
          />
        )}

        {mainTab === 'scambaiter' && (
          <ScambaiterHoneypot
            onTransferToEmergency={(intel) => {
              setHoneypotIntel(intel);
              setMainTab('emergency');
            }}
          />
        )}

        {mainTab === 'radar' && <GlobalThreatRadar />}

        {mainTab === 'training' && <ScamTrainingLab />}

        {mainTab === 'benchmarks' && <BenchmarksWhitepaper />}

        {mainTab === 'scanner' && (
          <>
            {!result && !isLoading && (
              <div className="space-y-12">
                {/* 2-Column Hero Split: Brand Positioning + Interactive Scanner Console */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <HeroSection
                      onJumpToSamples={scrollToEvidence}
                      onOpenBenchmarks={() => setMainTab('benchmarks')}
                      onOpenHowItWorks={() => setHowItWorksOpen(true)}
                    />
                  </div>
                  <div className="lg:col-span-7 flex">
                    <InvestigationConsole
                      onAnalyzeMessage={handleAnalyzeMessage}
                      onAnalyzeUrl={handleAnalyzeUrl}
                      isLoading={isLoading}
                      activeMode={activeMode}
                      setActiveMode={setActiveMode}
                      initialText={presetText}
                      initialUrl={presetUrl}
                    />
                  </div>
                </section>

                {error && (
                  <div className="p-4 rounded-xl bg-[#E5484D]/10 border border-[#E5484D]/30 text-[#E5484D] text-sm font-medium flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full-Width 4-Column Metric Strip */}
                <section className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#F0E5EC] rounded-2xl bg-white border border-[#F0E5EC] shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <span className="text-xs text-[#777181] block">Detection Precision</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#C92D7D] mt-1 block">
                      99.4%
                    </span>
                    <span className="text-xs text-[#777181] mt-0.5 block">Benchmarked on 24.5K cases</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs text-[#777181] block">Median Scan Speed</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#252033] mt-1 block">
                      240 ms
                    </span>
                    <span className="text-xs text-[#777181] mt-0.5 block">Dual rules + Gemini AI</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs text-[#777181] block">Supported Channels</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#252033] mt-1 block">
                      5 Vectors
                    </span>
                    <span className="text-xs text-[#777181] mt-0.5 block">Chat, URL, OCR, Email, Voice</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <span className="text-xs text-[#777181] block">Data Retention</span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#16A36A] mt-1 block">
                      Zero Logs
                    </span>
                    <span className="text-xs text-[#777181] mt-0.5 block">Volatile session-only memory</span>
                  </div>
                </section>

                {/* Evidence Archetype Library */}
                <div ref={evidenceSectionRef}>
                  <EvidenceLibrary
                    onSelectScenario={handleSelectDemo}
                    selectedId={selectedDemoId}
                    isLoading={isLoading}
                  />
                </div>

                {/* Response Suite Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setMainTab('emergency')}
                    className="text-left p-6 rounded-2xl bg-white border border-[#F0E5EC] hover:border-[#E5484D]/50 shadow-sm transition-all cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#E5484D]">Emergency 1930 Response</span>
                        <h3 className="text-base font-bold text-[#252033]">
                          Draft Police FIR &amp; Bank Freeze Notice
                        </h3>
                        <p className="text-xs sm:text-sm text-[#777181] leading-relaxed">
                          Generate official complaint templates under RBI Master Directions and IT Act Section 66D.
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#777181] group-hover:text-[#E5484D] shrink-0 mt-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMainTab('scambaiter')}
                    className="text-left p-6 rounded-2xl bg-white border border-[#F0E5EC] hover:border-[#E94D9B]/60 shadow-sm transition-all cursor-pointer group flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#C92D7D]">Counter-Scam Sandbox</span>
                        <h3 className="text-base font-bold text-[#252033]">
                          Launch AI Scambaiter Honeypot
                        </h3>
                        <p className="text-xs sm:text-sm text-[#777181] leading-relaxed">
                          Stall fraudsters safely in a sandboxed chat to capture mule UPI handles and bank accounts.
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#777181] group-hover:text-[#C92D7D] shrink-0 mt-1" />
                  </button>
                </section>
              </div>
            )}

            {isLoading && <InvestigationSequence currentStageIndex={scanStageIndex} />}

            {result && !isLoading && (
              <InvestigationDashboard
                result={result}
                onReset={handleReset}
                onOpenEmergencyHub={() => setMainTab('emergency')}
                onOpenScambaiter={() => setMainTab('scambaiter')}
              />
            )}
          </>
        )}
      </main>

      <HowItWorksModal isOpen={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />

      <footer className="border-t border-[#F0E5EC] bg-white py-7 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777181]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#252033]">SCAMSHIELD AI</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C92D7D] font-medium">Think Before You Click. Stay Protected.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setHowItWorksOpen(true)}
              className="hover:text-[#C92D7D] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={scrollToEvidence}
              className="hover:text-[#C92D7D] transition-colors cursor-pointer"
            >
              Sample Cases
            </button>
            <button
              type="button"
              onClick={() => setMainTab('emergency')}
              className="hover:text-[#E5484D] transition-colors cursor-pointer"
            >
              911 Legal Hub
            </button>
            <button
              type="button"
              onClick={() => setMainTab('benchmarks')}
              className="hover:text-[#C92D7D] transition-colors cursor-pointer"
            >
              Model Benchmarks (99.4%)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
