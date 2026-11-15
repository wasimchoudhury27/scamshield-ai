# SCAMSHIELD AI

> **Pause. Verify. Protect.**  
> An AI-assisted workspace that helps people investigate suspicious digital content before they click, share information, or send money.

<p align="center">
  <a href="https://ai.studio/apps/6fa46430-2d83-427e-80c6-0b93f0fa3622"><strong>Open the updated AI Studio app ↗</strong></a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-7-3178c6?logo=typescript&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="Google Gemini" src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=googlegemini&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/Status-Project%20in%20development-E94D9B">
</p>

## Overview

**SCAMSHIELD AI** is a cybersecurity project designed to make scam investigation easier to understand and more accessible. It uses a modern web interface and server-side Google Gemini analysis to help users examine potentially fraudulent messages, emails, screenshots, job offers, payment demands, and URLs.

Instead of returning an unexplained warning, the experience is designed to surface risk indicators and explain why submitted content may deserve closer attention.

> **Important:** SCAMSHIELD AI provides AI-assisted analysis, not a guarantee or a definitive determination that content is safe or fraudulent. Always verify important requests through trusted, independent channels.

## Explore the project

| Resource | Link |
| --- | --- |
| Updated AI Studio app | [Open SCAMSHIELD AI](https://ai.studio/apps/6fa46430-2d83-427e-80c6-0b93f0fa3622) |
| GitHub repository | [wasimchoudhury27/scamshield-ai](https://github.com/wasimchoudhury27/scamshield-ai) |
| Security policy | [SECURITY.md](SECURITY.md) |
| Contribution guide | [CONTRIBUTING.md](CONTRIBUTING.md) |

## Core capabilities

- **Message investigation** — review suspicious SMS, chat messages, and social-media messages for common scam signals.
- **Email investigation** — examine suspicious email content, sender context, urgency tactics, and requests for sensitive information.
- **Image and screenshot analysis** — submit visual evidence for Gemini-powered, multimodal review.
- **URL review** — inspect a potentially suspicious web address for warning signs.
- **Explainable findings** — present risk indicators and plain-language explanations to help users decide what to verify next.
- **Evidence Library** — explore curated sample scenarios for demonstration and testing.

Capabilities depend on the configured app version and available integrations. AI-generated findings should always be treated as guidance that needs independent verification.

## How it works

```text
  Suspicious message / email / image / URL
                    |
                    v
             SCAMSHIELD interface
                    |
                    v
               Express API
                    |
                    v
           Google Gemini analysis
                    |
                    v
         Risk indicators + explanation
                    |
                    v
          User reviews next steps
```

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript |
| Build tooling | Vite, esbuild |
| Styling | Tailwind CSS 4 |
| Backend | Node.js, Express |
| AI integration | Google GenAI SDK (Gemini) |
| Icons and motion | Lucide React, Motion |
| Data visualisation | D3, TopoJSON |

## Project structure

```text
.
├── server.ts              # Express server and API entry point
├── server/
│   ├── analyzers/         # Analysis logic
│   └── services/          # Server-side services
├── src/
│   ├── components/        # Reusable interface components
│   ├── data/              # Supporting and demo data
│   ├── utils/             # Shared utilities
│   ├── App.tsx            # Main application
│   ├── main.tsx           # Frontend entry point
│   └── types.ts           # Shared TypeScript types
├── docs/                  # Project documentation
├── public/                # Static assets
├── index.html
├── package.json
└── vite.config.ts
```

## Run locally

### Prerequisites

- [Bun](https://bun.sh/) package manager
- A supported Node.js runtime
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/wasimchoudhury27/scamshield-ai.git
cd scamshield-ai
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root. Use `.env.example` as the reference:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

Keep your real API key private. Never commit `.env`, paste secrets into source files, or expose API credentials in browser-side code.

### 4. Start the development server

```bash
bun run dev
```

### 5. Build and type-check

```bash
bun run build
bun run lint
```

## Responsible use

- AI analysis can produce incorrect or incomplete results.
- A low-risk result does **not** prove that a message, link, website, or offer is safe.
- Do not share OTPs, passwords, payment-card details, recovery codes, or other sensitive information with the scanner.
- Verify payment requests, recruiters, employers, organisations, and website domains using independently obtained official contact details.
- Do not open suspicious links just to test them.
- Treat findings as decision support, not as a replacement for professional security investigation.

## Development status

SCAMSHIELD AI is an evolving project. The updated AI Studio experience is linked above. Repository documentation and implementation should be kept aligned as the application evolves.

## Maintainer

**Wasim Choudhury**  
GitHub: [@wasimchoudhury27](https://github.com/wasimchoudhury27)

---

If this project is useful to you, consider giving the repository a ⭐.
