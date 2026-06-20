<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# 🧠 Nexus AI OS — Enterprise Organizational Intelligence

> **Your company's AI brain.** Ask questions across documents, projects, teams, and knowledge silos — Nexus maps your organizational intelligence automatically.

Nexus AI OS is a next-generation platform that centralizes fragmented organizational knowledge by indexing documents, repositories, and communication silos into a **unified semantic knowledge graph**. It combines a polished Next.js frontend with a Python-powered multi-agent reasoning backend to deliver source-backed, explainable answers to complex enterprise queries.

---

## 📑 Table of Contents

- [Why Nexus AI OS?](#-why-nexus-ai-os)
- [Key Features](#-key-features)
- [Architecture Overview](#-architecture-overview)
- [Multi-Agent System](#-multi-agent-system)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Pricing & Access Tiers](#-pricing--access-tiers)
- [Security & Compliance](#-security--compliance)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why Nexus AI OS?

Most organizations suffer from **knowledge fragmentation** — critical information is scattered across Notion pages, Google Docs, GitHub repos, Confluence wikis, and Slack threads. When someone asks _"Why is Project Phoenix delayed?"_, the answer may span 5 different tools and 3 different teams.

**Nexus solves this by:**

1. **Indexing everything** — PDF, DOCX, Markdown, code repositories, and cloud storage are ingested and embedded into a high-dimensional vector space.
2. **Building a knowledge graph** — Entities (people, teams, projects, servers) and their relationships are automatically extracted and mapped.
3. **Reasoning with agents** — A chain of specialized AI agents plans, routes, retrieves, and fact-checks every answer before presenting it with full transparency.

The result? **Instant, source-backed, hallucination-resistant answers** to any organizational question.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🔗 **Omnipresent Indexing** | Connect to PDF, DOCX, Notion, Confluence, GitHub, and Google Drive. Nexus indexes and structures everything. |
| 🕸️ **Automatic Knowledge Graph** | Entities and structural relationships are extracted automatically, creating an explicit map of teams, projects, and tech. |
| 🤖 **Multi-Agent Reasoning** | Queries route through an agent chain (Planner → Router → Graph → Critic) to aggregate verified answers. |
| 🔒 **Enterprise Permissions** | Role-based access controls (RBAC) respect original document permissions. Admins maintain full visibility. |
| 🔍 **Agent Execution Traces** | Inspect the step-by-step reasoning of every AI agent. Total transparency behind every citation. |
| ⚡ **Instant API Gateway** | Expose your company's intelligence via secure webhooks and custom REST endpoints. |
| 📊 **Interactive Dashboard** | Analytics panels for workspace health, document metrics, and team activity. |
| 📝 **Report Generation** | Auto-generate weekly reports, executive summaries, and risk assessments in PDF, DOCX, and Markdown. |
| 🎯 **Command Palette** | Quick-access command palette (Ctrl+K) for instant navigation and actions. |

---

## 🏗 Architecture Overview

Nexus uses a **Hybrid RAG (Retrieval-Augmented Generation)** architecture combined with an **Entity-Relationship Knowledge Graph**.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │
│  │ Chat UI  │  │  Graph   │  │   Docs   │  │   Dashboard   │   │
│  │ /chat    │  │ /graph   │  │ /documents│  │  /dashboard   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬───────┘   │
│       └──────────────┴─────────────┴────────────────┘           │
│                          │  POST /api/agent                     │
├──────────────────────────┼──────────────────────────────────────┤
│                    NEXT.JS API LAYER                            │
│              ┌───────────┴───────────┐                          │
│              │  /api/agent/route.ts  │                          │
│              │  (Spawns Python via   │                          │
│              │   stdin/stdout bridge)│                          │
│              └───────────┬───────────┘                          │
├──────────────────────────┼──────────────────────────────────────┤
│               PYTHON AGENT ENGINE                               │
│  ┌───────────────────────┴──────────────────────────┐           │
│  │              agent_engine.py                      │           │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐    │           │
│  │  │ Planner  │→│  Router  │→│ Domain Agents  │    │           │
│  │  │  Agent   │ │  Agent   │ │ (Graph/Code/   │    │           │
│  │  │          │ │          │ │  Memory/Report)│    │           │
│  │  └──────────┘ └──────────┘ └───────┬────────┘    │           │
│  │                                     │             │           │
│  │                              ┌──────┴──────┐      │           │
│  │                              │   Critic    │      │           │
│  │                              │   Agent     │      │           │
│  │                              └─────────────┘      │           │
│  └───────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### How a Query Flows

1. **User submits a question** in the Chat workspace (e.g., _"Why is Project Phoenix delayed?"_).
2. **Next.js API route** receives the POST request and spawns the Python agent engine as a child process, passing the query via `stdin`.
3. **Planner Agent** deconstructs the query into sub-tasks and identifies target entities.
4. **Router Agent** directs sub-tasks to the appropriate domain agents (Graph, Vector, Code, Memory).
5. **Domain Agents** retrieve and synthesize information from the knowledge graph and document embeddings.
6. **Critic Agent** validates the response against source documents to eliminate hallucinations.
7. **Response is returned** as structured JSON via `stdout`, including the answer, confidence score, source citations, entity relations, and the full agent execution trace.

---

## 🤖 Multi-Agent System

Nexus uses **6 specialized agent types** that are autonomously routed based on the query intent:

### Research Agent
> Handles general knowledge queries by combining vector search with graph traversal.
- _"Why is Project Phoenix delayed?"_
- _"Who owns the payment service?"_
- _"Explain our deployment process."_

### Graph Intelligence Agent
> Traverses the knowledge graph to answer relationship and dependency queries. Returns Mermaid diagrams.
- _"What are Project Phoenix's dependencies?"_
- _"Which teams use this system?"_
- _"Who is responsible for the checkout platform?"_

### Code Intelligence Agent
> Analyzes the codebase structure, generates documentation, and performs security audits.
- _"Explain this codebase."_
- _"Generate documentation."_
- _"Find security risks."_

### Memory Agent
> Restores session context and retrieves historical user activity.
- _"What reports did I create last week?"_
- _"Show my recent searches."_
- _"Continue previous analysis."_

### Report Agent
> Auto-generates structured reports in PDF, DOCX, and Markdown formats.
- _"Generate a weekly report."_
- _"Create an executive summary."_
- _"Write a project status report."_

### Identity & RBAC Agent
> Provides role-based access audits and user profile information.
- _"Who am I?"_
- _"What are my permissions?"_

---

## 🛠️ Hardened Security & Technical Specs

Nexus AI OS has been audited and updated to enforce premium enterprise security, strict input validations, and advanced visual formatting:

### 1. Zero-Leak Console Sanitization
To prevent any data exposure to developers, server operators, or users inspecting logs:
- **Server-Side API Guard**: Next.js route handlers ([route.ts](file:///c:/Users/hp/nexus-ai/src/app/api/agent/route.ts)) remove all raw standard error outputs (`stderrData`), raw execution dumps (`stdoutData`), and exception details from console errors.
- **Client-Side DevTools Protection**: All client-side pages and components (including `Navbar.tsx`, `SideRays.tsx`, `graph/page.tsx`, `dashboard/page.tsx`, and `chat/page.tsx`) suppress stack traces and log details, printing only generic errors.
- **Crypto & Key Protection**: Encryption failures ([crypto.ts](file:///c:/Users/hp/nexus-ai/src/utils/crypto.ts)) log a static message without printing error arguments, preventing key extraction from memory dumps.

### 2. Live GitHub Repository Verification
During the workspace onboarding wizard:
- When a user inputs a repository name or URL, the platform validates format constraints.
- The browser client executes a verification ping to `https://api.github.com/repos/{owner}/{repo}` to confirm existence and accessibility before proceeding. Invalid or private repositories present warning details to correct input names.

### 3. Compliant Binary PDF Report Engine
Instead of writing plain text to a `.pdf` file format:
- A custom binary layout compiler (`SimplePDFWriter`) has been written natively in Python without external dependencies inside [agent_engine.py](file:///c:/Users/hp/nexus-ai/src/agents/agent_engine.py).
- It writes compliant PDF byte arrays (handling catalogs, page pointers, Helvetica-Bold and Helvetica font sizes, stream lengths, cross-reference tables, and file trailers).
- Generates viewable, wrap-aligned PDFs, DOCX files, and Markdown pages stored under `public/reports/` (fully ignored by git to keep commits clean).

### 4. Premium Scan Upload Animations
- Supporting **PDF, DOCX, TXT, and Markdown** uploads in the Document Center and Onboarding dropzone.
- Featuring an orbital check loader, pulsing check indicators, a horizontal scanning laser line, and dynamic labels that read the exact extension to display format-specific parsing status (e.g., *“Reading DOCX stream...”*, *“Reading Markdown stream...”*).

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:---|:---|
| **Node.js** | 18.x or higher |
| **npm** or **yarn** | Latest stable |
| **Python** | 3.10+ (for the agent engine) |

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SreeshanthReddy46/Nexus-AI.git
   cd nexus-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the platform:**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### First-Time User Flow

```
Landing Page → Sign Up → Onboarding → Select Plan → Chat Workspace
```

1. Visit the landing page and click **Get Started**.
2. Create an account on the login/signup page.
3. Complete the onboarding wizard to configure your workspace.
4. Select an intelligence plan (Free tier available).
5. Start asking questions in the AI chat workspace.

---

## 📂 Project Structure

```
nexus-ai/
├── public/                        # Static assets & generated reports
│   └── reports/                   # Auto-generated PDF/DOCX/MD reports
│
├── src/
│   ├── agents/
│   │   └── agent_engine.py        # 🧠 Core Python multi-agent reasoning engine
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── agent/
│   │   │       └── route.ts       # API bridge: spawns Python agent via stdin/stdout
│   │   │
│   │   ├── chat/
│   │   │   └── page.tsx           # 💬 Core AI chat workspace with trace logic
│   │   │
│   │   ├── company/
│   │   │   └── page.tsx           # 🏢 Company profile & workspace settings
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx           # 📊 Analytics dashboard with charts
│   │   │
│   │   ├── documents/
│   │   │   └── page.tsx           # 📄 Document indexing & management
│   │   │
│   │   ├── graph/
│   │   │   └── page.tsx           # 🕸️ Force-directed knowledge graph visualization
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx           # 🔑 Authentication (login/signup)
│   │   │
│   │   ├── onboarding/
│   │   │   └── page.tsx           # 🎯 First-time user onboarding wizard
│   │   │
│   │   ├── plans/
│   │   │   └── page.tsx           # 💳 Intelligence tier selection
│   │   │
│   │   ├── resources/
│   │   │   └── page.tsx           # 📚 Help center & resources
│   │   │
│   │   ├── globals.css            # Global styles & design tokens
│   │   ├── layout.tsx             # Root layout with metadata & fonts
│   │   └── page.tsx               # 🏠 Landing page (hero, demo, pricing, FAQ)
│   │
│   ├── components/
│   │   ├── CommandPalette.tsx      # ⌨️ Ctrl+K command palette
│   │   ├── InteractiveBackground.tsx  # ✨ Animated particle background
│   │   └── Navbar.tsx             # 🧭 Global navigation bar
│   │
│   └── utils/
│       └── crypto.ts              # 🔐 Client-side password hashing utilities
│
├── package.json                   # Dependencies & scripts
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
└── postcss.config.mjs             # PostCSS (Tailwind) configuration
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|:---|:---|
| **Next.js 16** | App Router framework with React Server Components |
| **React 19** | UI component library |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Premium animations, scroll reveals, and micro-interactions |
| **Lucide React** | Consistent iconography |
| **Recharts** | Dashboard data visualizations |

### Backend
| Technology | Purpose |
|:---|:---|
| **Next.js API Routes** | Serverless API endpoints (TypeScript) |
| **Python 3.10+** | Multi-agent reasoning engine |
| **stdin/stdout Bridge** | Secure IPC between Node.js and Python |

### Design Principles
- **Glassmorphism** — Frosted glass cards and layered transparency
- **Parallax scrolling** — Depth via scroll-linked floating elements
- **Micro-animations** — Spring-based transitions on every interaction
- **Responsive** — Mobile-first layouts across all pages

---

## 💳 Pricing & Access Tiers

Nexus AI OS scales with your organization. Users select a plan before accessing the chat workspace.

| Feature | Free | Starter | Pro ⭐ | Business |
|:---|:---:|:---:|:---:|:---:|
| **Price** | ₹0/mo | ₹999/mo | ₹4,999/mo | ₹14,999+/mo |
| **Documents** | 50 | 1,000 | 10,000 | Unlimited |
| **Queries** | 100/mo | Unlimited | Unlimited | Unlimited |
| **Agent Support** | Standard RAG | Advanced RAG | Multi-Agent Reasoning | Custom Fine-tuning |
| **Integrations** | Manual Upload | Notion & Drive | Confluence & GitHub | Dedicated VPC |
| **Trace Depth** | Basic | Standard | Expandable Stack | Full Audit Log |
| **API Access** | — | Standard | Priority | Custom SLA |
| **SSO** | — | — | — | ✅ |

---

## 🔒 Security & Compliance

Nexus is built for the enterprise with security at every layer:

- **Encryption at Rest** — AES-256 encryption for all stored data
- **Encryption in Transit** — TLS 1.3 for all network communications
- **Role-Based Access Control (RBAC)** — AI agents only access documents the user is authorized to see
- **Password Security** — Credentials are hashed using bcrypt; never stored in plain text
- **Process Isolation** — Python agent engine runs in a sandboxed child process with stdin/stdout-only communication
- **Graph ACLs** — Access control lists on the knowledge graph enforce namespace-level read/write boundaries

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with 🧠 by the Nexus AI OS Team</strong>
  <br />
  <em>Turning organizational chaos into structured intelligence.</em>
</p>
