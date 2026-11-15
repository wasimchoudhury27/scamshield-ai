import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  Search,
  Download,
  ArrowRight
} from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  category: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  incidentText: string;
  sourceChannel: string;
  hiddenRedFlags: string[];
  options: Array<{
    text: string;
    isSafe: boolean;
    scoreDelta: number;
    explanation: string;
  }>;
}

const TRAINING_SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: 'The "Digital Arrest" Video Call',
    category: 'Law Enforcement Extortion',
    threatLevel: 'CRITICAL',
    sourceChannel: 'Skype Video Call from "CBI_Official_HQ"',
    incidentText:
      'An officer in uniform on video call shows an official-looking arrest warrant from Mumbai Police. He claims a parcel sent to Thailand in your name contained 16 fake passports and MDMA narcotics. He demands you stay on camera 24/7 ("Digital Arrest") and transfer ₹75,000 to a "Reserve Bank of India Clearance Account" for legal clearance.',
    hiddenRedFlags: [
      '"Digital Arrest" does not exist under Indian law or CrPC.',
      'CBI and Police never conduct official investigations via Skype or WhatsApp.',
      'RBI never operates private clearance accounts for criminal cases.',
      'Demanding continuous video surveillance is an isolation tactic.'
    ],
    options: [
      {
        text: 'Pay the ₹75,000 immediately to avoid arrest and prove my innocence.',
        isSafe: false,
        scoreDelta: 0,
        explanation:
          'You would lose ₹75,000. Real police never request money transfers to clear cases.'
      },
      {
        text: 'Stay on the video call and plead with the officer to reduce the fine.',
        isSafe: false,
        scoreDelta: 5,
        explanation:
          'Staying on the call lets scammers isolate you from family and escalate pressure.'
      },
      {
        text: 'Disconnect immediately, refuse to transfer money, and report to Cyber Crime Helpline (1930).',
        isSafe: true,
        scoreDelta: 20,
        explanation:
          'Correct: "Digital Arrest" is 100% fraudulent. Disconnecting and calling 1930 is the safest response.'
      }
    ]
  },
  {
    id: 2,
    title: 'The YouTube Like & Review Telegram Task',
    category: 'Employment / Advance Fee Fraud',
    threatLevel: 'CRITICAL',
    sourceChannel: 'WhatsApp message from recruiter "HR Priya"',
    incidentText:
      'A recruiter messages offering ₹150 for every YouTube video you like. You complete 3 tasks and they actually send ₹450 to your UPI! Then, the "VIP Merchant Manager" invites you to a Telegram group where you must deposit ₹10,000 to unlock a ₹16,000 guaranteed return.',
    hiddenRedFlags: [
      'Small initial payouts (₹150–₹450) are bait to manufacture trust.',
      'Moving to Telegram removes accountability and introduces fake group shills.',
      'Genuine employers never ask candidates to deposit personal funds to earn commissions.'
    ],
    options: [
      {
        text: 'Deposit ₹10,000 because they proved legitimacy by paying the first ₹450.',
        isSafe: false,
        scoreDelta: 0,
        explanation:
          'The initial ₹450 is bait. Once you send ₹10,000, they lock the account and demand larger deposits.'
      },
      {
        text: 'Block the contact on WhatsApp and Telegram, and refuse to deposit any money.',
        isSafe: true,
        scoreDelta: 20,
        explanation:
          'Correct: You spotted the classic task-scam trust hook before sending large funds.'
      },
      {
        text: 'Ask the Telegram manager for his Aadhaar card before depositing ₹10,000.',
        isSafe: false,
        scoreDelta: 5,
        explanation:
          'Scammers routinely send stolen ID photos from prior victims.'
      }
    ]
  },
  {
    id: 3,
    title: 'Urgent Electricity Disconnection SMS',
    category: 'Utility Phishing & Malicious APK',
    threatLevel: 'HIGH',
    sourceChannel: 'SMS from sender "VK-POWERR"',
    incidentText:
      '"Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM because your previous month bill was not updated. Immediately contact officer Mr. Verma at 9876543210 or install our app via http://bijli-update.apk."',
    hiddenRedFlags: [
      'Official utility boards never threaten same-night disconnection via random SMS.',
      'Real utility bills cite your registered Consumer Account (CA) number.',
      'Installing an APK sideloads spyware that forwards banking OTPs.'
    ],
    options: [
      {
        text: 'Click the link and install the APK to pay quickly before power cuts.',
        isSafe: false,
        scoreDelta: 0,
        explanation:
          'Installing unknown APKs grants SMS and accessibility permissions to attackers.'
      },
      {
        text: 'Call the mobile number in the SMS and ask for an extension.',
        isSafe: false,
        scoreDelta: 5,
        explanation:
          'The operator will attempt to talk you into installing AnyDesk or QuickSupport.'
      },
      {
        text: 'Ignore the SMS and verify your bill directly on the official utility portal or app.',
        isSafe: true,
        scoreDelta: 20,
        explanation:
          'Correct: Always verify utility dues independently using your official consumer portal.'
      }
    ]
  },
  {
    id: 4,
    title: 'Marketplace QR Code "Scan to Receive Money"',
    category: 'UPI Reverse Payment Fraud',
    threatLevel: 'HIGH',
    sourceChannel: 'OLX / Quikr Chat & WhatsApp Call',
    incidentText:
      'You listed your sofa for ₹12,000. A buyer claiming to be an Army Officer wants it immediately without bargaining. He sends a QR code saying: "Scan this QR code in Google Pay and enter your 6-digit UPI PIN to credit ₹12,000 into your account."',
    hiddenRedFlags: [
      'You NEVER scan a QR code or enter a UPI PIN to RECEIVE money.',
      'Entering a UPI PIN always authorizes a DEBIT from your account.',
      'Impersonating military personnel is a common trust tactic.'
    ],
    options: [
      {
        text: 'Scan the QR code and enter my UPI PIN to receive the ₹12,000 payment.',
        isSafe: false,
        scoreDelta: 0,
        explanation:
          'Entering your UPI PIN will immediately debit ₹12,000 from your bank account.'
      },
      {
        text: 'Refuse to scan, explain that receiving money never needs a PIN, and report the user.',
        isSafe: true,
        scoreDelta: 20,
        explanation:
          'Correct: A UPI PIN is strictly for sending money, never for receiving.'
      }
    ]
  },
  {
    id: 5,
    title: 'The AI Voice Clone Distress Call',
    category: 'Vishing & AI Voice Impersonation',
    threatLevel: 'CRITICAL',
    sourceChannel: 'Unknown call mimicking a family member',
    incidentText:
      'You receive a frantic call sounding exactly like your child: "I was in a terrible accident, the police officer took my phone!" A stern man takes over demanding an immediate ₹50,000 UPI transfer for emergency hospital clearance.',
    hiddenRedFlags: [
      'AI voice synthesis can clone a voice from a short public social media clip.',
      'Panic and crying are engineered to prevent rational verification.',
      'Demanding private UPI transfers instead of verifiable hospital details.'
    ],
    options: [
      {
        text: 'Transfer ₹50,000 immediately because the voice sounded identical.',
        isSafe: false,
        scoreDelta: 0,
        explanation:
          'AI voice clones are convincing; always verify before transferring funds.'
      },
      {
        text: 'Hang up, call your family member directly on their known number, and confirm via a family safe word.',
        isSafe: true,
        scoreDelta: 20,
        explanation:
          'Correct: Calling their known number directly immediately breaks the impersonation.'
      }
    ]
  }
];

export const ScamTrainingLab: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [studentName, setStudentName] = useState('Alex Morgan');

  const scenario = TRAINING_SCENARIOS[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    const opt = scenario.options[optIdx];
    setTotalScore((prev) => prev + opt.scoreDelta);
  };

  const handleNext = () => {
    if (currentIdx < TRAINING_SCENARIOS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setTotalScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C92D7D]">
              <Award className="w-4 h-4 shrink-0" />
              <span>Interactive Defense Lab · 5 Real Scenarios</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252033] tracking-tight">
              Scam IQ Training Lab
            </h1>
            <p className="text-sm text-[#777181] max-w-2xl leading-relaxed">
              Practice spotting Digital Arrest calls, Telegram task hooks, malicious APKs, UPI QR reversals, and AI voice clones.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <span className="text-xs text-[#777181] block">Score</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-[#C92D7D]">
                {totalScore}/100
              </span>
            </div>
            <div className="pl-6 border-l border-[#F0E5EC]">
              <span className="text-xs text-[#777181] block">Progress</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-[#252033]">
                {currentIdx + 1}/{TRAINING_SCENARIOS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E5EC] pb-4">
                <div>
                  <span className="text-xs font-semibold text-[#C92D7D] block">
                    Scenario {scenario.id} of {TRAINING_SCENARIOS.length} · {scenario.category}
                  </span>
                  <h2 className="text-xl font-bold text-[#252033] mt-0.5">{scenario.title}</h2>
                </div>
                <span
                  className={`text-xs font-bold ${
                    scenario.threatLevel === 'CRITICAL' ? 'text-[#E5484D]' : 'text-[#E99A24]'
                  }`}
                >
                  {scenario.threatLevel} RISK
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#777181]">
                  <Search className="w-3.5 h-3.5 text-[#E94D9B]" />
                  <span>Channel: <strong className="text-[#252033]">{scenario.sourceChannel}</strong></span>
                </div>
                <p className="text-sm text-[#252033] leading-relaxed">{scenario.incidentText}</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#777181] block">Choose your response:</span>
                {scenario.options.map((opt, idx) => {
                  const isPicked = selectedOption === idx;
                  const showResult = selectedOption !== null;

                  let btnClass = 'bg-white border-[#F0E5EC] text-[#252033] hover:border-[#E94D9B]';
                  if (showResult) {
                    if (opt.isSafe) {
                      btnClass = 'bg-[#16A36A]/10 border-[#16A36A] text-[#252033]';
                    } else if (isPicked) {
                      btnClass = 'bg-[#E5484D]/10 border-[#E5484D] text-[#252033]';
                    } else {
                      btnClass = 'bg-[#FFF8FC] border-[#F0E5EC] text-[#777181] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer text-sm flex items-start gap-3 ${btnClass}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#FCE7F3] text-[#C92D7D] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        <span className="font-medium block">{opt.text}</span>
                        {showResult && isPicked && (
                          <p className={`text-xs pt-2 border-t ${opt.isSafe ? 'border-[#16A36A]/30 text-[#16A36A]' : 'border-[#E5484D]/30 text-[#E5484D]'}`}>
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                      {showResult && opt.isSafe && <CheckCircle2 className="w-5 h-5 text-[#16A36A] shrink-0" />}
                      {showResult && isPicked && !opt.isSafe && <XCircle className="w-5 h-5 text-[#E5484D] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="min-h-[42px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentIdx === TRAINING_SCENARIOS.length - 1 ? 'View Certificate' : 'Next Scenario'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#252033] border-b border-[#F0E5EC] pb-3">
                <AlertTriangle className="w-4 h-4 text-[#E99A24]" />
                <span>Key Red Flags</span>
              </div>
              <ul className="space-y-3 text-xs text-[#777181]">
                {scenario.hiddenRedFlags.map((flag, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] leading-relaxed">
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm text-center space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#E94D9B] to-[#C92D7D] text-white flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#C92D7D] uppercase tracking-wider">
                SCAMSHIELD AI Defense Lab
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#252033]">
                Cyber Safety Completion Certificate
              </h2>
            </div>

            <div className="p-6 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] space-y-3 max-w-md mx-auto">
              <span className="text-xs text-[#777181] block">Awarded to</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#F0E5EC] text-[#252033] font-bold text-center text-lg focus:outline-none focus:border-[#E94D9B]"
              />
              <p className="text-xs text-[#777181]">
                Completed 5 anti-fraud simulations with a score of{' '}
                <strong className="text-[#C92D7D] font-mono">{totalScore}/100</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[42px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
