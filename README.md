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
- [Multi-Agent Collaborative System](#-multi-agent-collaborative-system)
- [Security, Encryption & Input Validation](#-security-encryption--input-validation)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Pricing & Access Tiers](#-pricing--access-tiers)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Why Nexus AI OS?

Most organizations suffer from **knowledge fragmentation** — critical information is scattered across Notion pages, Google Docs, GitHub repos, Confluence wikis, and Slack threads. When someone asks _"Why is Project Phoenix delayed?"_, the answer may span 5 different tools and 3 different teams.

**Nexus solves this by:**

1. **Indexing everything** — PDF and Word (.docx/.doc) documents are ingested and embedded into a high-dimensional vector space.
2. **Building a knowledge graph** — Entities (people, teams, projects, servers) and their relationships are automatically extracted and mapped.
3. **Reasoning with agents** — A cooperative chain of specialized AI agents crawls, retrieves, audits, fact-checks, and synthesizes every answer.

The result? **Instant, source-backed, contradiction-aware answers** to any organizational question.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🔗 **Omnipresent Indexing** | Connect to PDF, DOCX, Notion, Confluence, GitHub, and Google Drive. Nexus indexes and structures everything. |
| 🕸️ **Automatic Knowledge Graph** | Entities and structural relationships are extracted automatically, creating an explicit map of teams, projects, and tech. |
| 🤖 **Multi-Agent RAG** | Ingest and query workspace files using 5 collaborative backend agents working in tandem. |
| 🔒 **Hardened Local Encryption** | Dynamic block-cipher obfuscation with multi-pass XOR keys and position-dependent salt shifts. |
| 💻 **Collapsible Trace Panel** | A glassmorphic Trace Panel showing exactly how the agents collaborated to synthesize the answer. |
| 📝 **Natively Built PDF Reports** | A compliant PDF layout compiler built directly in Python to export reports without external dependencies. |
| 🛡️ **Strict GitHub Regex Checks** | Prevents malformed repository input during onboarding using high-fidelity pattern matching. |
| 📊 **Interactive Dashboard** | Analytics panels for workspace health, document metrics, and team activity. |

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
│ ├────────────────────────┼──────────────────────────────────────┤
│ │                    NEXT.JS API LAYER                            │
│ │              ┌───────────┴───────────┐                          │
│ │              │  /api/agent/route.ts  │                          │
│ │              │  (Spawns Python via   │                          │
│ │              │   stdin/stdout bridge)│                          │
│ │              └───────────┬───────────┘                          │
│ ├────────────────────────┼──────────────────────────────────────┤
│ │               PYTHON AGENT ENGINE                               │
│ │  ┌───────────────────────┴──────────────────────────┐           │
│ │  │              agent_engine.py                      │           │
│ │  │  ┌────────────┐ ┌────────────┐ ┌──────────────┐  │           │
│ │  │  │  Explore   │→│   Search   │→│   Reviewer   │  │           │
│ │  │  │   Agent    │ │   Agent    │ │    Agent     │  │           │
│ │  │  └────────────┘ └────────────┘ └──────┬───────┘  │           │
│ │  │                                       │          │           │
│ │  │                                ┌──────┴──────┐   │           │
│ │  │                                │  Cerifier   │   │           │
│ │  │                                │   Agent     │   │           │
│ │  │                                └──────┬──────┘   │           │
│ │  │                                       │          │           │
│ │  │                                ┌──────┴──────┐   │           │
│ │  │                                │  Response   │   │           │
│ │  │                                │   Agent     │   │           │
│ │  │                                └─────────────┘   │           │
│ │  └──────────────────────────────────────────────────┘           │
│ └─────────────────────────────────────────────────────────────────┘
```

### How a Query Flows

1. **User submits a question** in the Chat workspace (e.g., _"find contradictions"_).
2. **Next.js API route** receives the POST request and spawns the Python agent engine as a child process, passing the query via `stdin`.
3. **Explore Agent** maps directory structures and traverses technology scopes.
4. **Search Agent** executes a sliding-window file crawl and generates a TF-IDF cosine-similarity retrieval.
5. **Reviewer Agent** audits the retrieved text segments for policy or schedule contradictions.
6. **Cerifier Agent** validates role boundaries (Viewer RBAC) and assigns a data reliability score.
7. **Response Agent** synthesizes the final text answer, builds a dynamic Mermaid flowchart, and packages the download files.
8. **Structured JSON** is printed via `stdout` containing the text, citations, Mermaid nodes, and the collaborative trace.

---

## 🤖 Multi-Agent Collaborative System

Nexus uses a pipeline of **5 specialized agent types** that execute sequentially during every workspace RAG query:

### 1. Explore Agent
> Analyzes the local workspace and charts the system layout. Maps file and directory nodes dynamically.

### 2. Search Agent (RAG Retriever)
> Builds a TF-IDF index across mock files and crawled code files. Executes cosine similarity calculations to retrieve the top 10 relevant context chunks.

### 3. Reviewer Agent
> Audits the retrieved text segments for mismatches and conflicts (e.g. logging archiving mismatches or Project Phoenix timeline delays).

### 4. Cerifier Agent
> Evaluates user roles against RBAC permission boundaries (warns and blocks modification commands for the `Viewer` role) and computes a data reliability score.

### 5. Response Agent
> Merges agent outputs, draws dynamic Mermaid graphs representing structural dependencies, coordinates PDF/DOCX downloads, and packages the execution logs.

---

## 🔒 Security, Encryption & Input Validation

Nexus enforces strict, enterprise-ready compliance layers across the frontend and backend:

### 1. High-Security Cryptographical Mixing Engine
All user data and credentials stored client-side in `localStorage` or `sessionStorage` are encrypted using a customized mixing cipher:
* **Diffusion Layer**: Char values are XORed with a dynamically offset index from a 256-bit encryption key.
* **Salt Shifting**: Every character is shifted by a positional constant (`i * 17`) to ensure duplicate plaintext strings yield completely unique ciphertext blocks.
* **Base64 Packaging**: Formats mixed bytes safely for storage transport.

### 2. Strict Onboarding URL Validations
The GitHub connection input enforces strict format compliance using a regex block parser:
`/^(https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+?))(?:\.git|\/)?$/`
It completely prevents invalid formats or third-party domains, and makes verification pings to `api.github.com` to check repository availability.

### 3. PDF & Word Document Restrictions
To prevent server scripting vulnerabilities and enforce indexing standards, file uploads in the Document Center and Onboarding screens are restricted:
* **Allowed Extensions**: strictly `.pdf`, `.docx`, and `.doc`.
* **Blocked Extensions**: `.txt`, `.md`, `.exe`, `.js`, `.py`, `.sh`, `.jar`, etc.

### 4. Zero-Leak Console Sanitization
* Spawning subprocess channels in Next.js suppress `stderr` dumps and trace metrics from error objects.
* Encryption failure paths log static generic messages to avoid key extraction from memory dumps.

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

---

## 📂 Project Structure

```
nexus-ai/
├── public/                        # Static assets & reports
│   └── reports/                   # Auto-generated PDF/DOCX/MD reports
│
├── src/
│   ├── agents/
│   │   ├── agent_engine.py        # 🧠 Unified Python multi-agent RAG engine
│   │   └── test_rag.py            # 🧪 Python unit tests for Search and Pipeline
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── agent/
│   │   │       └── route.ts       # Next.js route: Spawns Python agents via stdin/stdout
│   │   │
│   │   ├── chat/
│   │   │   └── page.tsx           # 💬 Chat workspace with interactive Trace panel
│   │   │
│   │   ├── documents/
│   │   │   └── page.tsx           # 📄 Document management with PDF/Word restrictions
│   │   │
│   │   ├── graph/
│   │   │   └── page.tsx           # 🕸️ Force-directed knowledge graph
│   │   │
│   │   ├── onboarding/
│   │   │   └── page.tsx           # 🎯 Onboarding setup with GitHub regex checks
│   │   │
│   │   └── login/
│   │       └── page.tsx           # 🔑 Logins and registration
│   │
│   └── utils/
│       └── crypto.ts              # 🔐 Dynamic block-cipher cryptographic utilities
```

---

## 🛠 Tech Stack

### Frontend
* **Next.js 16**: App Router framework with React Server Components.
* **React 19** & **TypeScript 5**: UI and type-safe components.
* **Tailwind CSS 4**: Modern glassmorphic styles.
* **Framer Motion**: Micro-animations and sliding trace transitions.

### Backend
* **Python 3.10+**: Multi-agent RAG pipeline using NumPy for vectorized searches.
* **Next.js subprocess IPC**: Spawns Python modules safely using process streams.

---

## 💳 Pricing & Access Tiers

| Feature | Free | Starter | Pro ⭐ | Business |
|:---|:---:|:---:|:---:|:---:|
| **Price** | ₹0/mo | ₹999/mo | ₹4,999/mo | ₹14,999+/mo |
| **Documents** | 5 | 10 | 10,000 | Unlimited |
| **Queries** | 100/mo | Unlimited | Unlimited | Unlimited |
| **Agent Support** | Explore & Search | Audit & Review | Collapsible Trace UI | Dedicated VPC |
| **Allowed Files** | PDF/Word | PDF/Word | PDF/Word | PDF/Word |

---

## 🤝 Contributing

Contributions are welcome! Please fork this repository, create your feature branch, commit your changes, and open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with 🧠 by the Nexus AI OS Team</strong>
  <br />
  <em>Turning organizational chaos into structured intelligence.</em>
</p>
