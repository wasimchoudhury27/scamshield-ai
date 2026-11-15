import React from 'react';
import { AnalysisResult } from '../types.js';
import { VerdictHeader } from './VerdictHeader.js';
import { ThreatCategoryBreakdown } from './ThreatCategoryBreakdown.js';
import { ThreatTimeline } from './ThreatTimeline.js';
import { EvidenceTimeline } from './EvidenceTimeline.js';
import { AiAssessmentPanel } from './AiAssessmentPanel.js';
import { ActionCenter } from './ActionCenter.js';
import { UrlDetailsCard } from './UrlDetailsCard.js';
import { ScoreBreakdown } from './ScoreBreakdown.js';
import { GeographicThreatMap } from './GeographicThreatMap.js';
import { FixedDisclaimer } from './FixedDisclaimer.js';
import { generateGeographicIntelligence } from '../utils/geoIntelligence.js';
import { motion } from 'motion/react';

interface InvestigationDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  onOpenEmergencyHub?: () => void;
  onOpenScambaiter?: () => void;
}

export const InvestigationDashboard: React.FC<InvestigationDashboardProps> = ({
  result,
  onReset,
  onOpenEmergencyHub,
  onOpenScambaiter
}) => {
  const geoData =
    result.geographicIntelligence ||
    generateGeographicIntelligence({
      threatScore: result.threatScore,
      riskLevel: result.riskLevel,
      inputType: result.inputType,
      signals: result.signals,
      extractedEntities: result.extractedEntities,
      urlDetails: result.urlDetails,
      rawText: result.rawInputText || result.inputSnippet
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 pb-8"
    >
      <VerdictHeader result={result} onReset={onReset} />

      <ThreatCategoryBreakdown result={result} />

      <ThreatTimeline result={result} />

      {result.urlDetails && <UrlDetailsCard details={result.urlDetails} />}

      <GeographicThreatMap geoData={geoData} />

      <EvidenceTimeline signals={result.signals} />

      <AiAssessmentPanel result={result} />

      <ActionCenter
        result={result}
        onReset={onReset}
        onOpenEmergencyHub={onOpenEmergencyHub}
        onOpenScambaiter={onOpenScambaiter}
      />

      <ScoreBreakdown
        breakdown={result.scoreBreakdown}
        totalScore={result.threatScore}
      />

      <FixedDisclaimer />
    </motion.div>
  );
};
