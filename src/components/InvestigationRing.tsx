import React, { useEffect, useState } from 'react';
import { RiskBand, RiskSignal } from '../types.js';
import {
  CreditCard,
  Clock,
  UserCheck,
  Globe,
  Briefcase,
  Radio,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

export interface InvestigationRingProps {
  score: number;
  riskLevel: RiskBand;
  isAnalyzing?: boolean;
  activeStageIndex?: number;
  signals?: RiskSignal[];
  size?: 'normal' | 'compact' | 'hero';
}

interface OrbitalNode {
  id: string;
  name: string;
  label: string;
  angle: number;
  icon: React.FC<{ className?: string }>;
  category: string;
}

const ORBITAL_NODES: OrbitalNode[] = [
  { id: 'node-pay', name: 'Payment', label: 'Payment Demand', angle: -90, icon: CreditCard, category: 'PAYMENT' },
  { id: 'node-urg', name: 'Urgency', label: 'Coercive Deadline', angle: -30, icon: Clock, category: 'URGENCY' },
  { id: 'node-rec', name: 'Hiring', label: 'Unvetted Hiring', angle: 30, icon: Briefcase, category: 'EMPLOYMENT' },
  { id: 'node-lnk', name: 'URL / DNS', label: 'URL & Infrastructure', angle: 90, icon: Globe, category: 'URL_STRUCTURE' },
  { id: 'node-ide', name: 'Identity', label: 'Brand Impersonation', angle: 150, icon: UserCheck, category: 'IDENTITY' },
  { id: 'node-beh', name: 'Behavior', label: 'Social Engineering', angle: 210, icon: Radio, category: 'SOCIAL_ENG' }
];

export const InvestigationRing: React.FC<InvestigationRingProps> = ({
  score,
  riskLevel,
  isAnalyzing = false,
  activeStageIndex = 0,
  signals = [],
  size = 'normal'
}) => {
  const [displayedScore, setDisplayedScore] = useState(isAnalyzing ? 0 : score);
  const [hoveredNode, setHoveredNode] = useState<OrbitalNode | null>(null);

  useEffect(() => {
    if (isAnalyzing) return;
    let current = 0;
    const increment = Math.max(1, Math.floor(score / 28));
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayedScore(score);
        clearInterval(timer);
      } else {
        setDisplayedScore(current);
      }
    }, 22);
    return () => clearInterval(timer);
  }, [score, isAnalyzing]);

  const theme = {
    LOW: {
      color: '#16A36A',
      softBg: 'rgba(22, 163, 106, 0.1)',
      textClass: 'text-[#16A36A]',
      icon: ShieldCheck
    },
    MODERATE: {
      color: '#E99A24',
      softBg: 'rgba(233, 154, 36, 0.12)',
      textClass: 'text-[#E99A24]',
      icon: AlertTriangle
    },
    HIGH: {
      color: '#E99A24',
      softBg: 'rgba(233, 154, 36, 0.14)',
      textClass: 'text-[#E99A24]',
      icon: ShieldAlert
    },
    CRITICAL: {
      color: '#E5484D',
      softBg: 'rgba(229, 72, 77, 0.12)',
      textClass: 'text-[#E5484D]',
      icon: AlertOctagon
    }
  }[riskLevel];

  const IconComponent = theme.icon;

  const baseDim = 360;
  const center = baseDim / 2;
  const radius = baseDim * 0.32;
  const orbitRadius = baseDim * 0.44;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = isAnalyzing
    ? arcLength * 0.45
    : arcLength - arcLength * (displayedScore / 100);

  const isCategoryTriggered = (category: string) => {
    return signals.some((s) => s.category === category);
  };

  const containerClasses = {
    hero: 'w-[240px] h-[240px] min-[360px]:w-[270px] min-[360px]:h-[270px] sm:w-[310px] sm:h-[310px] md:w-[330px] md:h-[330px]',
    compact: 'w-[190px] h-[190px] sm:w-[220px] sm:h-[220px]',
    normal: 'w-[230px] h-[230px] sm:w-[260px] sm:h-[260px] md:w-[290px] md:h-[290px]'
  }[size];

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none max-w-full mx-auto ${containerClasses}`}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="absolute inset-6 rounded-full blur-2xl pointer-events-none transition-all duration-500 opacity-70"
        style={{
          backgroundColor: isAnalyzing ? 'rgba(233, 77, 155, 0.14)' : theme.softBg
        }}
      />

      <svg
        className="w-full h-full transform -rotate-135 pointer-events-none"
        viewBox={`0 0 ${baseDim} ${baseDim}`}
      >
        <circle
          cx={center}
          cy={center}
          r={orbitRadius}
          fill="none"
          stroke="#F0E5EC"
          strokeWidth="1.25"
          strokeDasharray="4 6"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#FCE7F3"
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isAnalyzing ? '#E94D9B' : theme.color}
          strokeWidth="12"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />

        {Array.from({ length: 24 }).map((_, i) => {
          const tickAngle = (i * 360) / 24;
          const rad = (tickAngle * Math.PI) / 180;
          const x1 = center + (radius - 18) * Math.cos(rad);
          const y1 = center + (radius - 18) * Math.sin(rad);
          const x2 = center + (radius - 23) * Math.cos(rad);
          const y2 = center + (radius - 23) * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#E7D2DF"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 z-10 pointer-events-none">
        {isAnalyzing ? (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-wider text-[#C92D7D] uppercase block">
              Analyzing
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#252033]">
              Step 0{Math.min(activeStageIndex + 1, 6)}
            </div>
            <span className="text-[11px] text-[#777181] block">
              Correlating signals
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-wider text-[#777181] uppercase block">
              Threat Index
            </span>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums tracking-tight text-[#252033]">
                {displayedScore}
              </span>
              <span className="text-sm sm:text-base font-mono text-[#777181] ml-1">/100</span>
            </div>
            <div className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide ${theme.textClass}`}>
              <IconComponent className="w-3.5 h-3.5 shrink-0" />
              <span>{riskLevel}</span>
            </div>
          </div>
        )}
      </div>

      {ORBITAL_NODES.map((node, index) => {
        const rad = (node.angle * Math.PI) / 180;
        const xPercent = ((center + orbitRadius * Math.cos(rad)) / baseDim) * 100;
        const yPercent = ((center + orbitRadius * Math.sin(rad)) / baseDim) * 100;
        const NodeIcon = node.icon;

        const isCurrentlyInspecting = isAnalyzing && activeStageIndex === index;
        const hasPassedInspection = isAnalyzing && activeStageIndex > index;
        const isTriggered = !isAnalyzing && isCategoryTriggered(node.category);

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => setHoveredNode(hoveredNode?.id === node.id ? null : node)}
            className="group cursor-pointer z-20 touch-manipulation"
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 border shadow-sm ${
                isCurrentlyInspecting
                  ? 'bg-[#E94D9B] border-[#C92D7D] text-white scale-110'
                  : isTriggered
                  ? 'bg-[#E5484D]/10 border-[#E5484D]/50 text-[#E5484D]'
                  : hasPassedInspection
                  ? 'bg-[#FCE7F3] border-[#E94D9B]/40 text-[#C92D7D]'
                  : 'bg-white border-[#F0E5EC] text-[#777181] hover:border-[#E94D9B]/50 hover:text-[#252033]'
              }`}
            >
              <NodeIcon className="w-4 h-4" />
            </div>

            <div
              className={`absolute -bottom-7 left-1/2 -translate-x-1/2 transition-opacity pointer-events-none whitespace-nowrap bg-[#252033] text-white px-2 py-0.5 rounded-md text-[10px] font-medium z-30 shadow-md ${
                hoveredNode?.id === node.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              {node.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
