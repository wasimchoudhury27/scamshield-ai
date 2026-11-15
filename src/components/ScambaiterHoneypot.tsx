import React, { useState } from 'react';
import {
  Bot,
  User,
  Send,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight
} from 'lucide-react';
import type { TransferredIntel } from './EmergencyHub.js';

interface ChatMessage {
  id: string;
  sender: 'scammer' | 'scambaiter';
  text: string;
  timestamp: string;
}

interface ScambaiterHoneypotProps {
  onTransferToEmergency?: (intel: TransferredIntel) => void;
}

const PRELOADED_SCAMS = [
  {
    id: 'scam-task',
    title: 'Telegram Task Scam',
    initialMessage:
      'Dear candidate, congratulations! You are selected for part-time YouTube video like and subscribe task. Daily earning ₹3,500 - ₹8,000. Send ₹2,500 security deposit on UPI rahul.fintech@oksbi to unlock VIP Level 1 task portal immediately.'
  },
  {
    id: 'scam-digital-arrest',
    title: 'Digital Arrest Extortion',
    initialMessage:
      'This is Inspector Vikram Singh, CBI Anti-Corruption Branch New Delhi. A FedEx parcel with your Aadhaar contains 140 grams MDMA contraband and 5 fake passports. A non-bailable warrant is issued. To avoid public arrest, transfer ₹50,000 to government reserve verification account 919876543210 (IFSC: SBIN0001234) within 30 minutes.'
  },
  {
    id: 'scam-electricity',
    title: 'Electricity Disconnection',
    initialMessage:
      'Urgent notice from State Electricity Board: Your power supply will be permanently disconnected tonight at 9:30 PM due to unpaid balance of ₹480. Immediately call electricity officer at +91 91234 56789 or send fee via PhonePe to power.bill99@ybl.'
  },
  {
    id: 'scam-crypto',
    title: 'Crypto Arbitrage',
    initialMessage:
      'Hello friend! My uncle works at Singapore Crypto Hedge Fund. He gave me insider arbitrage signal. Deposit 500 USDT TRC-20 to wallet TJx9kLmn84bV29PqRsTuVwXyZ123456789 and you will receive 850 USDT in 2 hours guaranteed.'
  }
];

export const ScambaiterHoneypot: React.FC<ScambaiterHoneypotProps> = ({ onTransferToEmergency }) => {
  const [selectedPersona, setSelectedPersona] = useState<'elderly' | 'student' | 'executive' | 'crypto_novice'>('elderly');
  const [scammerInput, setScammerInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'scammer',
      text: PRELOADED_SCAMS[0].initialMessage,
      timestamp: '11:42 AM'
    },
    {
      id: 'msg-2',
      sender: 'scambaiter',
      text: "Oh dear, my glasses are so blurry today! I tried typing rahul.fintech@oksbi on my phone, but my Google Pay keeps saying 'Transaction limit reached'. Could you give me your direct 16-digit bank account number and branch IFSC so my grandson can send it for me?",
      timestamp: '11:43 AM'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [timeWastedMinutes, setTimeWastedMinutes] = useState(18);
  const [extractedUpi, setExtractedUpi] = useState<string[]>(['rahul.fintech@oksbi']);
  const [extractedBank, setExtractedBank] = useState<string[]>([]);
  const [extractedCrypto, setExtractedCrypto] = useState<string[]>([]);
  const [extractedPhones, setExtractedPhones] = useState<string[]>([]);
  const [copiedIntel, setCopiedIntel] = useState(false);

  const personas = [
    {
      id: 'elderly',
      name: 'Eleanor Higgins (72)',
      role: 'Confused Senior',
      desc: 'Polite, tech-challenged, asks for bank account and IFSC details.'
    },
    {
      id: 'student',
      name: 'Rahul Sharma (19)',
      role: 'College Student',
      desc: 'Eager for work, reports payment app failure to elicit alternate UPIs.'
    },
    {
      id: 'executive',
      name: 'Robert Vance (48)',
      role: 'Operations Manager',
      desc: 'Requests GST invoices and corporate beneficiary verification.'
    },
    {
      id: 'crypto_novice',
      name: 'Alex Chen (24)',
      role: 'Crypto Novice',
      desc: 'Stalls over TRC-20 vs ERC-20 fees to verify wallet addresses.'
    }
  ];

  const handleSelectPreloaded = (scam: (typeof PRELOADED_SCAMS)[0]) => {
    setMessages([
      {
        id: `msg-${Date.now()}-1`,
        sender: 'scammer',
        text: scam.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    const upi = scam.initialMessage.match(/([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/gi) || [];
    const phones = scam.initialMessage.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g) || [];
    const crypto = scam.initialMessage.match(/\b(?:0x[a-fA-F0-9]{40}|T[A-Za-z1-9]{33}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g) || [];
    const bank = scam.initialMessage.match(/\b\d{10,16}\b/g) || [];

    setExtractedUpi(Array.from(new Set(upi)));
    setExtractedPhones(Array.from(new Set(phones)));
    setExtractedCrypto(Array.from(new Set(crypto)));
    setExtractedBank(Array.from(new Set(bank)));
    setTimeWastedMinutes(8);
  };

  const handleSendScammerTurn = async (customMessage?: string) => {
    const textToSend = customMessage || scammerInput;
    if (!textToSend.trim() || isLoading) return;

    const newScammerMsg: ChatMessage = {
      id: `msg-${Date.now()}-scam`,
      sender: 'scammer',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, newScammerMsg];
    setMessages(updatedHistory);
    setScammerInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/scambait/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scammerMessage: textToSend,
          history: updatedHistory.map((m) => ({
            role: m.sender === 'scammer' ? 'user' : 'assistant',
            text: m.text
          })),
          persona: selectedPersona
        })
      });

      if (!response.ok) throw new Error('Scambait API error');
      const data = await response.json();

      const newAgentMsg: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        sender: 'scambaiter',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...updatedHistory, newAgentMsg]);
      setTimeWastedMinutes((prev) => prev + (data.timeWastedMinutes || 4));

      if (data.extractedIntel) {
        if (data.extractedIntel.upiIds?.length) {
          setExtractedUpi((prev) => Array.from(new Set([...prev, ...data.extractedIntel.upiIds])));
        }
        if (data.extractedIntel.bankAccounts?.length) {
          setExtractedBank((prev) => Array.from(new Set([...prev, ...data.extractedIntel.bankAccounts])));
        }
        if (data.extractedIntel.cryptoWallets?.length) {
          setExtractedCrypto((prev) => Array.from(new Set([...prev, ...data.extractedIntel.cryptoWallets])));
        }
        if (data.extractedIntel.phoneNumbers?.length) {
          setExtractedPhones((prev) => Array.from(new Set([...prev, ...data.extractedIntel.phoneNumbers])));
        }
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        sender: 'scambaiter',
        text: "I tried sending that just now, but the screen showed 'Payment pending bank verification'. Could you confirm the account holder name and IFSC code so I can authorize it?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...updatedHistory, fallbackMsg]);
      setTimeWastedMinutes((prev) => prev + 5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEvidenceDossier = () => {
    const dossier = `SCAMSHIELD AI COUNTER-INTELLIGENCE DOSSIER
Time Wasted: ${timeWastedMinutes} minutes
UPI Handles: ${extractedUpi.join(', ') || 'None'}
Bank Accounts: ${extractedBank.join(', ') || 'None'}
Phone Numbers: ${extractedPhones.join(', ') || 'None'}
Crypto Wallets: ${extractedCrypto.join(', ') || 'None'}

TRANSCRIPT:
${messages.map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}: ${m.text}`).join('\n\n')}`;

    navigator.clipboard.writeText(dossier);
    setCopiedIntel(true);
    setTimeout(() => setCopiedIntel(false), 2000);
  };

  const intelCount =
    extractedUpi.length + extractedBank.length + extractedCrypto.length + extractedPhones.length;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl bg-white border border-[#F0E5EC] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C92D7D]">
              <Bot className="w-4 h-4 shrink-0" />
              <span>Counter-Scam Sandbox · Safe AI Engagement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252033] tracking-tight">
              AI Scambaiter Honeypot
            </h1>
            <p className="text-sm text-[#777181] max-w-2xl leading-relaxed">
              Engage suspicious senders in an isolated sandbox. The AI persona stalls for time and prompts fraudsters to reveal mule UPI IDs, bank accounts, and phone numbers for reporting.
            </p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div>
              <span className="text-xs text-[#777181] block">Time Stalled</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-[#252033]">
                {timeWastedMinutes}m
              </span>
            </div>
            <div className="pl-6 border-l border-[#F0E5EC]">
              <span className="text-xs text-[#777181] block">Intel Captured</span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-[#16A36A]">
                {intelCount}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-[#F0E5EC] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#777181] mr-1">Load scenario:</span>
          {PRELOADED_SCAMS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelectPreloaded(s)}
              className="px-3 py-1.5 rounded-lg bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-xs font-medium text-[#252033] transition-colors cursor-pointer"
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          {/* Persona Selector */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-3">
            <span className="text-xs font-semibold text-[#777181] block">Select Honeypot Persona</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPersona(p.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedPersona === p.id
                      ? 'bg-[#FCE7F3]/60 border-[#E94D9B] text-[#252033]'
                      : 'bg-[#FFF8FC] border-[#F0E5EC] text-[#777181] hover:border-[#E94D9B]/50'
                  }`}
                >
                  <span className="text-xs font-bold block text-[#252033]">{p.name}</span>
                  <span className="text-[11px] text-[#C92D7D] font-semibold block">{p.role}</span>
                  <span className="text-[11px] text-[#777181] line-clamp-2 mt-1">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Chat */}
          <div className="rounded-2xl bg-white border border-[#F0E5EC] overflow-hidden shadow-sm flex flex-col h-[500px]">
            <div className="px-4 py-3 bg-[#FFF8FC] border-b border-[#F0E5EC] flex items-center justify-between text-xs">
              <span className="font-bold text-[#252033]">Isolated Containment Chat</span>
              <span className="text-[#C92D7D] font-semibold">
                Persona: {personas.find((p) => p.id === selectedPersona)?.name}
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FFF8FC]/30">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${m.sender === 'scambaiter' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'scammer' && (
                    <div className="w-8 h-8 rounded-xl bg-[#E5484D]/10 text-[#E5484D] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                      m.sender === 'scambaiter'
                        ? 'bg-[#FCE7F3] border border-[#E94D9B]/30 text-[#252033] rounded-tr-none'
                        : 'bg-white border border-[#F0E5EC] text-[#252033] rounded-tl-none shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] text-[#777181] mb-1">
                      <span className="font-semibold">
                        {m.sender === 'scambaiter' ? 'AI Honeypot' : 'Suspect Sender'}
                      </span>
                      <span className="font-mono">{m.timestamp}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>

                  {m.sender === 'scambaiter' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E94D9B] to-[#C92D7D] text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#C92D7D] p-2">
                  <Bot className="w-4 h-4 animate-spin" />
                  <span>Generating persona response...</span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-white border-t border-[#F0E5EC] space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={scammerInput}
                  onChange={(e) => setScammerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendScammerTurn()}
                  placeholder="Paste scammer reply or simulate an adversary message..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] text-[#252033] text-sm focus:outline-none focus:bg-white focus:border-[#E94D9B]"
                />
                <button
                  type="button"
                  onClick={() => handleSendScammerTurn()}
                  disabled={isLoading || !scammerInput.trim()}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#E94D9B] to-[#C92D7D] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-[#777181] px-1">
                <span>Sandboxed simulation · No real payments enabled</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSendScammerTurn('Send the ₹5,000 immediately to backup99@okicici or your warrant executes!')
                  }
                  className="text-[#C92D7D] font-semibold hover:underline cursor-pointer"
                >
                  Simulate Scammer Threat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Intelligence */}
        <div className="lg:col-span-4">
          <div className="p-5 rounded-2xl bg-white border border-[#F0E5EC] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E5EC] pb-3">
              <h2 className="text-sm font-bold text-[#252033] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#16A36A]" />
                <span>Captured Identifiers</span>
              </h2>
              <span className="text-xs font-semibold text-[#16A36A]">Active</span>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#777181]">UPI / VPA Handles</span>
              {extractedUpi.length === 0 ? (
                <p className="text-xs text-[#777181]">None captured yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {extractedUpi.map((u, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] font-mono text-xs text-[#E5484D] font-semibold flex items-center justify-between">
                      <span className="truncate">{u}</span>
                      <span className="text-[11px] text-[#777181]">Mule VPA</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#777181]">Bank Accounts</span>
              {extractedBank.length === 0 ? (
                <p className="text-xs text-[#777181]">None detected.</p>
              ) : (
                <div className="space-y-1.5">
                  {extractedBank.map((b, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] font-mono text-xs text-[#E99A24] font-semibold">
                      A/C: {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#777181]">Phone Numbers</span>
              {extractedPhones.length === 0 ? (
                <p className="text-xs text-[#777181]">None isolated.</p>
              ) : (
                <div className="space-y-1.5">
                  {extractedPhones.map((ph, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] font-mono text-xs text-[#252033]">
                      {ph}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {extractedCrypto.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#777181]">Crypto Wallets</span>
                <div className="space-y-1.5">
                  {extractedCrypto.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#FFF8FC] border border-[#F0E5EC] font-mono text-xs text-[#C92D7D] break-all">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#F0E5EC] space-y-2">
              <button
                type="button"
                onClick={handleCopyEvidenceDossier}
                className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#FFF8FC] hover:bg-[#FCE7F3] border border-[#F0E5EC] text-[#252033] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedIntel ? <Check className="w-3.5 h-3.5 text-[#16A36A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIntel ? 'Dossier Copied' : 'Copy Evidence Dossier'}</span>
              </button>

              {onTransferToEmergency && (
                <button
                  type="button"
                  onClick={() =>
                    onTransferToEmergency({
                      upi: extractedUpi[0],
                      bank: extractedBank[0],
                      phone: extractedPhones[0]
                    })
                  }
                  className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-[#E5484D] hover:bg-[#cf393e] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>File 1930 Complaint with Intel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
