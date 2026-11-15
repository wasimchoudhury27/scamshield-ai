import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ScambaitChatPayload {
  scammerMessage: string;
  history: Array<{ role: 'user' | 'assistant'; text: string }>;
  persona?: 'elderly' | 'student' | 'executive' | 'crypto_novice';
}

export interface ExtractedIntel {
  upiIds: string[];
  bankAccounts: string[];
  cryptoWallets: string[];
  phoneNumbers: string[];
  links: string[];
  threatVector: string;
}

export interface ScambaitResponse {
  reply: string;
  persona: string;
  extractedIntel: ExtractedIntel;
  adversaryTacticIdentified: string;
  recommendedNextMove: string;
  timeWastedMinutes: number;
}

// Deterministic intelligence extractor regexes
export function extractIntelligenceEntities(text: string): ExtractedIntel {
  const upiRegex = /([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})/gi;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const cryptoRegex = /\b(?:0x[a-fA-F0-9]{40}|T[A-Za-z1-9]{33}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/g;
  const bankRegex = /\b\d{9,18}\b/g;

  const upiMatches = Array.from(new Set(text.match(upiRegex) || []));
  const phoneMatches = Array.from(new Set(text.match(phoneRegex) || [])).filter(p => p.replace(/\D/g, '').length >= 10);
  const urlMatches = Array.from(new Set(text.match(urlRegex) || []));
  const cryptoMatches = Array.from(new Set(text.match(cryptoRegex) || []));
  const bankMatches = Array.from(new Set(text.match(bankRegex) || [])).filter(b => b.length >= 11 && b.length <= 16);

  let vector = 'Advance Fee / Coercion Fraud';
  const lower = text.toLowerCase();
  if (lower.includes('telegram') || lower.includes('task') || lower.includes('like') || lower.includes('rating')) {
    vector = 'Part-Time Task / Telegram Siphon Syndicate';
  } else if (lower.includes('police') || lower.includes('cbi') || lower.includes('arrest') || lower.includes('customs') || lower.includes('parcel')) {
    vector = 'Digital Arrest & Law Enforcement Impersonation';
  } else if (lower.includes('usdt') || lower.includes('tron') || lower.includes('trading') || lower.includes('crypto')) {
    vector = 'Pig Butchering / High-Yield Crypto Arbitrage';
  } else if (lower.includes('electricity') || lower.includes('power') || lower.includes('bill')) {
    vector = 'Utility Disconnection / Malicious APK Push';
  }

  return {
    upiIds: upiMatches,
    bankAccounts: bankMatches,
    cryptoWallets: cryptoMatches,
    phoneNumbers: phoneMatches,
    links: urlMatches,
    threatVector: vector
  };
}

const PERSONA_PROMPTS = {
  elderly: 'You are an 72-year-old grandmother named Mrs. Eleanor Higgins. You are polite, confused by modern apps like GPay or Telegram, have bad eyesight, make slight spelling typos, but genuinely seem to want to help. You stall for time by asking for their exact UPI ID, IFSC code, or bank account name so you can ask your grandson or write it in your chequebook.',
  student: 'You are Rahul Sharma, a 19-year-old first-year college student desperate for a part-time job or pocket money. You speak casually, use slight student slang, sound eager to pay the registration deposit, but claim your bank server failed and ask them for an alternate payment UPI handle or phone number.',
  executive: 'You are Robert Vance, a busy corporate operations manager. You are authoritative and demanding: you state that company policy strictly requires an official GST invoice, corporate beneficiary account, and branch IFSC before payment clearance can be authorized by accounts payable.',
  crypto_novice: 'You are Alex, an eager retail investor who just downloaded a crypto app. You are confused between TRC-20 and ERC-20 networks, and keep asking the scammer to paste their exact deposit address and proof of platform registration.'
};

const FALLBACK_RESPONSES = {
  elderly: [
    "Oh dear, my glasses are so blurry today. I tried entering that on the phone screen like you asked, but my banking app keeps giving me 'Error 902'. Could you please tell me your exact 16-digit bank account number and the bank branch name again? I'll write it down in my little notepad.",
    "Hello sir, I am so nervous about this. My heart is beating fast. Is this really from the government department? If I go to the bank branch tomorrow morning, which exact beneficiary name and IFSC code should I give the cashier so they don't arrest me?",
    "Bless you for helping an old lady. I pressed the green button but it asked for a UPI VPA ID or phone number. What is your direct office number or UPI address so I can tell my grandson Tommy to send it immediately?"
  ],
  student: [
    "Bro wait, I just tried sending it via PhonePe but it says 'Receiver UPI limit reached' or transaction failed. Do you have an alternate UPI ID or direct bank account number? I really need this job, please don't give my slot to someone else!",
    "Sir I am ready with the 5,000 deposit from my semester fee savings! But my GPay is asking for beneficiary name and IFSC. Can you send me your official bank account details so I can transfer via IMPS right now?",
    "Bro quick question, will the daily 3,000 commission come to my GooglePay or Paytm? Send me your manager's direct WhatsApp number so I can confirm my onboarding voucher."
  ],
  executive: [
    "Our internal corporate compliance department requires vendor KYC verification before any disbursement above 10,000 can be processed. Kindly provide your entity's legal registered name, GSTIN, and corporate bank IFSC code so our accounts desk can release the RTGS transfer.",
    "I have flagged this request with our treasury desk. In accordance with ISO 27001 anti-fraud protocol, please provide the registered dispatch order ID and official domain-linked email address for authorization.",
    "The transaction is staged in our ERP queue. Our audit team requires the beneficiary bank account holder's name and branch address to bypass the vendor hold. Please supply these credentials immediately."
  ],
  crypto_novice: [
    "Wait, my Binance app is asking whether your USDT wallet is on the Tron TRC-20 network or Ethereum ERC-20 network! If I send to the wrong network my funds get burned forever. What is your exact deposit wallet address?",
    "I'm at the Bitcoin ATM right now! It's asking me to scan a QR code or paste the public key string. Can you type out your full wallet address here in text? I want to invest the $2,000 before the pool closes.",
    "The exchange is holding my transfer for 15 minutes security delay unless I verify the recipient platform license. What is the official website URL of your liquidity pool?"
  ]
};

export async function generateScambaitTurn(payload: ScambaitChatPayload): Promise<ScambaitResponse> {
  const personaKey = payload.persona || 'elderly';
  const intel = extractIntelligenceEntities(
    payload.scammerMessage + ' ' + (payload.history?.map(h => h.text).join(' ') || '')
  );

  const ai = getAiClient();
  let replyText = '';

  if (ai) {
    try {
      const prompt = `You are playing an ethical, defensive AI Honeypot Scambaiter agent designed to safely waste a scammer's time, protect victims, and bait the scammer into revealing their bank accounts, UPI IDs, phone numbers, or mule identities for police evidence.

PERSONA INSTRUCTIONS:
${PERSONA_PROMPTS[personaKey]}

RULES:
1. Stay 100% in character. Sound completely authentic, human, emotional, and believable.
2. NEVER mention that you are an AI, a scambaiter, or running a simulation.
3. NEVER make threats, swear, or insult the scammer.
4. Feign genuine intent to cooperate, but encounter small, realistic hurdles (app glitch, wrong network, need bank account details, need manager name).
5. Actively prompt the scammer to provide actionable identifiers: "Which UPI ID?", "What is your bank account number?", "Can I have your direct phone number?"
6. Keep the reply short to medium (2-4 sentences max), mimicking real chat messages.

SCAMMER'S LATEST MESSAGE:
"${payload.scammerMessage}"

CONVERSATION HISTORY:
${payload.history.map(h => `${h.role === 'user' ? 'Scammer' : 'You'}: ${h.text}`).join('\n')}

Generate ONLY the in-character reply:`;

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Scambait Gemini request timed out')), 8000)
        )
      ]);

      if (response.text) {
        replyText = response.text.trim();
      }
    } catch (err) {
      console.warn('Scambait AI generation fallback triggered:', err);
    }
  }

  // Fallback if AI unavailable or rate-limited
  if (!replyText) {
    const list = FALLBACK_RESPONSES[personaKey];
    const hash = Math.abs(payload.scammerMessage.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    replyText = list[hash % list.length];
  }

  const turnCount = payload.history.length + 1;
  const timeWasted = Math.max(5, turnCount * 3 + Math.floor(Math.random() * 4));

  return {
    reply: replyText,
    persona: personaKey,
    extractedIntel: intel,
    adversaryTacticIdentified: intel.threatVector,
    recommendedNextMove: intel.upiIds.length || intel.bankAccounts.length 
      ? 'Adversary payment rail identified! Recommend freezing mule accounts via 1930 Cybercrime helpline.'
      : 'Continue baiting for payment VPA or bank IFSC code to complete evidence dossier.',
    timeWastedMinutes: timeWasted
  };
}
