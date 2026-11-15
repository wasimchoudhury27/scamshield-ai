import React, { useState } from 'react';
import { ShieldCheck, Menu, X, RotateCcw } from 'lucide-react';

export type MainNavTab = 'scanner' | 'emergency' | 'scambaiter' | 'radar' | 'training' | 'benchmarks';

interface NavbarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onReset: () => void;
  onOpenHowItWorks: () => void;
  isResultActive: boolean;
}

const NAV_ITEMS: Array<{ id: MainNavTab; label: string }> = [
  { id: 'scanner', label: 'Threat Scanner' },
  { id: 'emergency', label: '911 Legal Hub' },
  { id: 'scambaiter', label: 'AI Honeypot' },
  { id: 'radar', label: 'Threat Radar' },
  { id: 'training', label: 'IQ Lab' }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onReset,
  onOpenHowItWorks,
  isResultActive
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePrimaryAction = () => {
    if (isResultActive) {
      onReset();
    } else if (activeTab !== 'scanner') {
      onSelectTab('scanner');
    } else {
      onOpenHowItWorks();
    }
  };

  const primaryActionLabel = isResultActive
    ? 'New Scan'
    : activeTab !== 'scanner'
    ? 'Open Scanner'
    : 'How It Works';

  return (
    <header className="sticky top-0 z-40 border-b border-[#F0E5EC] bg-white/92 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => {
            onReset();
            onSelectTab('scanner');
          }}
          className="flex items-center gap-2.5 cursor-pointer group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E94D9B] rounded-lg"
          id="navbar-brand-logo"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#E94D9B] to-[#C92D7D] text-white shadow-[0_6px_16px_-4px_rgba(233,77,155,0.45)] group-hover:scale-[1.03] transition-transform duration-150">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#252033]">
            SCAMSHIELD <span className="text-[#E94D9B]">AI</span>
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Text Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E94D9B] rounded ${
                  isActive
                    ? 'text-[#C92D7D] font-semibold'
                    : 'text-[#777181] hover:text-[#252033]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 rounded-full bg-gradient-to-r from-[#E94D9B] to-[#C92D7D]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden lg:flex items-center shrink-0">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] hover:from-[#d93d8b] hover:to-[#b3246d] text-white text-sm font-semibold shadow-[0_6px_18px_-4px_rgba(233,77,155,0.4)] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C92D7D] focus-visible:ring-offset-2"
          >
            {isResultActive && <RotateCcw className="w-3.5 h-3.5" />}
            <span>{primaryActionLabel}</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {isResultActive && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FCE7F3] text-[#C92D7D] text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-[#F0E5EC] bg-white text-[#252033] hover:bg-[#FFF8FC] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#F0E5EC] bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FCE7F3] text-[#C92D7D] font-semibold'
                    : 'text-[#252033] hover:bg-[#FFF8FC]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              onSelectTab('benchmarks');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-[#FCE7F3] text-[#C92D7D] font-semibold'
                : 'text-[#777181] hover:bg-[#FFF8FC]'
            }`}
          >
            Model Benchmarks
          </button>
        </div>
      )}
    </header>
  );
};
