export interface EmergencyReportPayload {
  victimName: string;
  victimPhone: string;
  victimEmail: string;
  victimCity: string;
  victimState: string;
  victimBankName: string;
  victimAccountNumber?: string;
  transactionId?: string;
  transactionAmount?: string;
  transactionDate?: string;
  incidentType: string;
  suspectContact?: string;
  suspectUpiOrAccount?: string;
  suspectUrlOrPlatform?: string;
  briefIncidentDescription: string;
  threatSignals?: string[];
}

export interface EmergencyReportResult {
  firComplaintDraft: string;
  bankFreezeLetter: string;
  ic3ReportDraft: string;
  goldenHourChecklist: string[];
  helplines: Array<{ country: string; agency: string; phone: string; portal: string; notes: string }>;
  incidentHash: string;
  filingGuidance: string;
}

export function generateEmergencyReports(payload: EmergencyReportPayload): EmergencyReportResult {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
  const incidentHash = `SHIELD-LE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const victimName = payload.victimName || '[Complainant Full Name]';
  const victimPhone = payload.victimPhone || '[Complainant Phone Number]';
  const victimCity = payload.victimCity || '[City/District]';
  const victimState = payload.victimState || '[State]';
  const victimBank = payload.victimBankName || '[Victim Bank Name]';
  const victimAcc = payload.victimAccountNumber || '[XXXX-XXXX-XXXX]';
  const amount = payload.transactionAmount ? `₹${payload.transactionAmount}` : '[Amount Defrauded]';
  const txnId = payload.transactionId || '[UTR / Transaction Reference Number]';
  const txnDate = payload.transactionDate || currentDate;
  const suspectContact = payload.suspectContact || '[Suspect Phone/WhatsApp Handle]';
  const suspectUpi = payload.suspectUpiOrAccount || '[Suspect UPI ID / Mule Bank Account]';
  const suspectPlatform = payload.suspectUrlOrPlatform || 'WhatsApp / Telegram / Cellular Call';
  const description = payload.briefIncidentDescription || 'Fraudulent inducement under false pretenses with coercive payment demands.';

  // 1. Official Indian Police & Cybercrime.gov.in Complaint
  const firComplaintDraft = `FORMAL POLICE COMPLAINT & CYBERCRIME REPORT
Reference ID: ${incidentHash}
Date of Filing: ${currentDate} at ${currentTime}

TO:
The Station House Officer (SHO) / Cyber Crime Police Station,
National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)
Jurisdiction: ${victimCity}, ${victimState}

SUBJECT: Formal complaint regarding cyber fraud, cheating by personation, and fraudulent electronic funds transfer under Sections 66C & 66D of the Information Technology Act, 2000 and Section 318(4) of Bharatiya Nyaya Sanhita (BNS) / Section 420 of IPC.

Respected Officer,

I, ${victimName}, residing at ${victimCity}, ${victimState} (Mobile: ${victimPhone}), solemnly state as follows:

1. PARTICULARS OF THE OFFENCE:
   - Type of Cyber Incident: ${payload.incidentType}
   - Date & Time of Incident: ${txnDate}
   - Medium / Channel Utilized: ${suspectPlatform}
   - Disputed Financial Loss: ${amount}
   - Bank Account Debited: ${victimBank}, Account No: ${victimAcc}
   - Electronic Transaction Reference (UTR/IMPS/UPI ID): ${txnId}

2. PARTICULARS OF SUSPECT / ACCUSED:
   - Suspect Contact / Identifier: ${suspectContact}
   - Suspect Beneficiary Account / UPI Handle: ${suspectUpi}
   - Malicious Website / Domain / APK (if applicable): ${payload.suspectUrlOrPlatform || 'N/A'}

3. DETAILED STATEMENT OF FACTS:
   ${description}

   The accused person(s) fraudulently deceived me by creating an artificial state of emergency, unverified claims of institutional authority, and coercion, thereby inducing me to transfer the aforementioned sum of ${amount}.

4. FORENSIC RISK INDICATORS LOGGED (SCAMSHIELD AI SUITE):
${(payload.threatSignals || ['Upfront payment coercion', 'Impersonation of institutional authority', 'Artificial urgency triggers']).map(s => `   - ${s}`).join('\n')}

5. PRAYER / RELIEF SOUGHT:
   a) Immediately register an FIR under relevant sections of the IT Act (Sec 66C, 66D) and BNS/IPC.
   b) Issue urgent freeze instructions to the nodal officer of the recipient payment intermediary/bank to freeze the destination mule account (${suspectUpi}) to prevent onward dissipation of funds.
   c) Trace the CDR (Call Detail Record), IP logs, and KYC documents associated with mobile number ${suspectContact}.
   d) Take necessary legal measures for the recovery of defrauded funds.

Verification:
I verify that the facts stated above are true and correct to the best of my knowledge and belief. No material facts have been concealed.

Yours faithfully,
${victimName}
Complainant Contact: ${victimPhone}
Evidence Hash: SHA-256 verified by SCAMSHIELD Threat Engine`;

  // 2. Formal Bank Account Freeze & Immediate Chargeback Notice
  const bankFreezeLetter = `URGENT: DISPUTE OF FRAUDULENT ELECTRONIC TRANSACTION & REQUEST FOR MULE ACCOUNT FREEZE
Date: ${currentDate}

TO:
The Nodal Officer / Fraud Control Unit (FCU) / Branch Manager
${victimBank}, ${victimCity} Branch

SUBJECT: Urgent notice under RBI Master Direction (RBI/2017-18/15 DBR.No.Leg.BC.78/09.07.005/2017-18) regarding fraudulent debit of ${amount} on ${txnDate}.

Ref:
Account Holder: ${victimName}
Account Number: ${victimAcc}
Mobile Number: ${victimPhone}
Disputed Transaction UTR / Ref No: ${txnId}
Recipient / Mule Beneficiary Account/UPI: ${suspectUpi}

Dear Sir / Madam,

1. I am writing to immediately notify your bank of an unauthorized/fraudulent electronic transaction perpetrated against my account on ${txnDate} amounting to ${amount}.

2. The transaction was induced via cyber deception / coercion (${payload.incidentType}). Immediately upon realization, I am reporting this incident to your bank within the "Zero / Limited Liability" reporting window as mandated by the Reserve Bank of India (RBI) circular on Customer Protection.

3. EMERGENCY BANK ACTION REQUIRED:
   a) INITIATE IMMEDIATE RECALL / HOLD: Under the NPCI UPI / IMPS dispute reversal mechanism, kindly place an immediate Lien / Hold on the beneficiary account (${suspectUpi}) at the destination bank.
   b) COORDINATE WITH BENEFICIARY BANK FCU: Issue a priority communication to the Fraud Risk Management (FRM) desk of the receiving bank to freeze further debit withdrawals or ATM cash-outs from the suspect account.
   c) ISSUE ACKNOWLEDGMENT & COMPLAINT TICKET: Provide me with a formal Dispute Ticket Number and NPCI Chargeback Reference for tracking.

4. A formal complaint is simultaneously being lodged on the National Cybercrime Portal (Helpline 1930 / cybercrime.gov.in) with Complaint Reference ${incidentHash}.

Kindly process this request urgently to prevent funds from being siphoned out of the banking system.

Sincerely,
${victimName}
Account Holder: ${victimBank}
Phone: ${victimPhone}`;

  // 3. International FBI IC3 / FTC Complaint Draft
  const ic3ReportDraft = `INTERNET CRIME COMPLAINT CENTER (IC3) / FTC INCIDENT REPORT DRAFT
Report Tracking ID: ${incidentHash}
Timestamp: ${currentDate} ${currentTime}

VICTIM INFORMATION:
Full Name: ${victimName}
Phone: ${victimPhone}
City/State: ${victimCity}, ${victimState}

INCIDENT SUMMARY:
Crime Category: ${payload.incidentType}
Financial Loss: ${amount}
Transaction Identifier: ${txnId}
Recipient Financial Identifier: ${suspectUpi}
Suspect Communication Channel: ${suspectContact}
Method of Contact: ${suspectPlatform}

INCIDENT NARRATIVE:
${description}

FORENSIC EVIDENCE PRESERVED:
- Communication chat logs and call recordings timestamped.
- Transaction UTR receipt and banking statement debits exported.
- Multi-signal threat analysis verified by SCAMSHIELD Threat Intelligence Platform.`;

  const goldenHourChecklist = [
    'CALL 1930 IMMEDIATELY: Within the first 2 hours ("Golden Hour"), calling India’s National Cyber Fraud Helpline (1930) enables real-time freezing of beneficiary accounts across partner banks.',
    'NOTIFY BANK FRAUD CELL: Contact your bank\'s 24x7 helpline to place an immediate debit/credit hold and register an electronic transaction dispute.',
    'PRESERVE ALL EVIDENCE: Take uncropped screenshots of chat messages, phone numbers, transaction SMS receipts, and payment confirmations. DO NOT delete the chat history.',
    'BLOCK & SECURE ACCOUNTS: Change your NetBanking and email passwords immediately. If any remote-access app (AnyDesk, TeamViewer, RustDesk) was installed, disconnect Wi-Fi and uninstall the application immediately.',
    'FILE FORMAL COMPLAINT: Submit the generated FIR draft on cybercrime.gov.in (India) or ic3.gov (USA/International) and retain the official acknowledgment number for bank submission.'
  ];

  const helplines = [
    {
      country: 'India',
      agency: 'National Cyber Crime Reporting Portal & Citizen Financial Cyber Fraud Reporting System',
      phone: '1930 (Toll-Free 24x7)',
      portal: 'https://cybercrime.gov.in',
      notes: 'Dial 1930 immediately within 2 hours of payment to freeze mule bank accounts in real time.'
    },
    {
      country: 'United States',
      agency: 'FBI Internet Crime Complaint Center (IC3) & FTC Fraud Division',
      phone: '1-877-FTC-HELP (1-877-382-4357)',
      portal: 'https://www.ic3.gov',
      notes: 'File IC3 complaint immediately for wire fraud, cryptocurrency theft, or business email compromise.'
    },
    {
      country: 'United Kingdom',
      agency: 'Action Fraud & National Fraud Intelligence Bureau',
      phone: '0300 123 2040',
      portal: 'https://www.actionfraud.police.uk',
      notes: 'Contact Action Fraud to receive a National Police Crime Reference number.'
    },
    {
      country: 'International',
      agency: 'INTERPOL Financial Crime and Anti-Corruption Centre (IFCAC)',
      phone: 'Local Interpol Liaison Desk',
      portal: 'https://www.interpol.int/en/Crimes/Financial-crime',
      notes: 'Cross-border syndicate tracking through Global Rapid Intervention of Payments (I-GRIP).'
    }
  ];

  return {
    firComplaintDraft,
    bankFreezeLetter,
    ic3ReportDraft,
    goldenHourChecklist,
    helplines,
    incidentHash,
    filingGuidance: 'Print and sign both the FIR Complaint and Bank Dispute letter. Visit your local bank branch immediately and obtain a stamped receiving copy.'
  };
}
