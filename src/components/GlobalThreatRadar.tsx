import React, { useState, useEffect } from 'react';
import { Radio, Server, MapPin, Activity, Filter } from 'lucide-react';
import { GeographicThreatMap } from './GeographicThreatMap.js';
import { generateGeographicIntelligence } from '../utils/geoIntelligence.js';

export const GlobalThreatRadar: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedVector, setSelectedVector] = useState<string>('all');

  const defaultGeo = generateGeographicIntelligence({
    threatScore: 88,
    riskLevel: 'CRITICAL',
    inputType: 'message',
    signals: [],
    rawText: 'Cambodia Phnom Penh Myanmar KK Park Jamtara Mewat Lagos syndicate'
  });

  const fetchLiveFeed = async () => {
    try {
      const res = await fetch('/api/threats/live-feed');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data.incidents || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLiveFeed();
    const interval = setInterval(fetchLiveFeed, 12000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents =
    selectedVector === 'all'
      ? incidents
      : incidents.filter((i) => i.vector.toLowerCase().includes(selectedVector.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C92D7D]">
              <Radio className="w-4 h-4 shrink-0" />
              <span>Global Threat Radar · Live Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252033] tracking-tight">
              Global Cyber Fraud Syndicates &amp; Attack Stream
            </h1>
            <p className="text-sm text-[#777181] max-w-2xl leading-relaxed">
              Live tracking of transnational scam compounds, mule account networks, and active financial siphon corridors.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <span className="text-xs text-[#777181] block">Monitored Hubs</span>
              <span className="text-xl font-extrabold font-mono tabular-nums text-[#C92D7D]">14 Syndicates</span>
            </div>
            <div className="pl-6 border-l border-[#F0E5EC]">
              <span className="text-xs text-[#777181] block">Tracked Rails</span>
              <span className="text-xl font-extrabold font-mono text-[#252033]">TRC20 / UPI</span>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-[#F0E5EC] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#777181] mr-1 inline-flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#E94D9B]" />
            <span>Vector:</span>
          </span>
          {[
            { id: 'all', label: 'All Syndicates' },
            { id: 'digital arrest', label: 'Digital Arrest' },
            { id: 'electricity', label: 'Utility / APK' },
            { id: 'qr', label: 'QR Reversal' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'task', label: 'Telegram Task' }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSelectedVector(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedVector === btn.id
                  ? 'bg-[#FCE7F3] border-[#E94D9B] text-[#C92D7D]'
                  : 'bg-[#FFF8FC] border-[#F0E5EC] text-[#777181] hover:text-[#252033]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <GeographicThreatMap geoData={defaultGeo} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold text-[#252033] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E94D9B]" />
              <span>Live Intercept Stream</span>
            </h2>
            <span className="text-xs font-semibold text-[#16A36A]">Updating every 12s</span>
          </div>

          <div className="divide-y divide-[#F0E5EC] border border-[#F0E5EC] rounded-2xl overflow-hidden bg-white shadow-sm">
            {filteredIncidents.map((inc) => (
              <div key={inc.id} className="p-4 sm:p-5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[#777181]">
                    <span className="font-bold text-[#C92D7D]">{inc.id}</span>
                    <span>·</span>
                    <span>{inc.timestamp}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      inc.severity === 'CRITICAL' ? 'text-[#E5484D]' : 'text-[#E99A24]'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-bold text-[#252033] block">{inc.vector}</span>
                  <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#777181] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E5484D]" />
                    <span>{inc.sourceHub}</span>
                    <span>→</span>
                    <span className="font-semibold text-[#252033]">{inc.targetRegion}</span>
                  </div>
                </div>

                <p className="p-3 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] italic">
                  &ldquo;{inc.sampleSnippet}&rdquo;
                </p>

                <div className="flex items-center justify-between text-xs text-[#777181]">
                  <span>Rail: <strong className="text-[#16A36A]">{inc.paymentRail}</strong></span>
                  <span className="font-semibold text-[#C92D7D]">{inc.interceptionStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-[#252033] flex items-center gap-2 px-1">
            <Server className="w-4 h-4 text-[#E94D9B]" />
            <span>Major Transnational Syndicates</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                title: '1. Mekong Cyber Compounds',
                level: 'Critical',
                levelColor: 'text-[#E5484D]',
                desc: 'Operating across Sihanoukville, Phnom Penh SEZs, and Myawaddy KK Park. Known for Digital Arrest video extortion and crypto pig butchering.',
                rail: 'Tether TRC-20 & Mule Current A/Cs',
                action: 'INTERPOL Purple Notice 2024'
              },
              {
                title: '2. Jamtara & Mewat Rural Hubs',
                level: 'High Impact',
                levelColor: 'text-[#E99A24]',
                desc: 'Decentralized SIM-box clusters known for electricity disconnection SMS, malicious APK sideloading, and marketplace QR reversals.',
                rail: 'UPI VPAs & Rented Mule Accounts',
                action: 'CERT-In / I4C Operation CHAKRA'
              },
              {
                title: '3. West African BEC Rings',
                level: 'Transnational',
                levelColor: 'text-[#E99A24]',
                desc: 'Operating primarily out of Lagos and Benin City. Specializes in Business Email Compromise, CEO wire fraud, and lookalike domain spoofing.',
                rail: 'SWIFT Wire Transits & P2P Crypto',
                action: 'FBI Operation Eagle Sweep'
              }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#252033]">{s.title}</span>
                  <span className={`font-semibold ${s.levelColor}`}>{s.level}</span>
                </div>
                <p className="text-[#777181] leading-relaxed">{s.desc}</p>
                <div className="pt-2 border-t border-[#F0E5EC] space-y-1 text-[#777181]">
                  <div>Payment Rail: <strong className="text-[#252033]">{s.rail}</strong></div>
                  <div>Enforcement: <strong className="text-[#C92D7D]">{s.action}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
