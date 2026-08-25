<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

# 🧠 Nexus AI OS — Enterprise Organizational Intelligence

> **The Unified AI Brain for Modern Organizations.** Connect documents, repositories, team wikis, and communication silos into a self-organizing semantic knowledge graph — delivering instant, verified, and source-backed answers to complex organizational questions.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [The Problem & The Solution](#-the-problem--the-solution)
- [Key Features](#-key-features)
- [Multi-Agent Reasoning Pipeline](#-multi-agent-reasoning-pipeline)
- [Platform Workspaces](#-platform-workspaces)
- [System Architecture](#-system-architecture)
- [Enterprise Security & Governance](#-enterprise-security--governance)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 💡 Overview

**Nexus AI OS** is an intelligent organizational operating system that eliminates knowledge silos across growing teams and enterprise companies. By indexing unstructured documents, code repositories, specifications, and workflows into a unified semantic space, Nexus empowers employees to ask high-level questions and receive accurate, multi-dimensional answers backed by verifiable citations.

Whether onboarding new team members, auditing technical dependencies, or diagnosing project timelines, Nexus provides an autonomous, collaborative AI reasoning engine that searches, cross-checks, audits, and presents organizational facts in real time.

---

## 🧩 The Problem & The Solution

### The Challenge: Knowledge Fragmentation
Modern enterprises store critical information across dozens of isolated systems:
- Technical specifications in **GitHub**
- Product roadmaps in **Notion** & **Confluence**
- Policy and financial reports in **PDFs** & **Word Documents**
- Operational procedures in **Cloud Drives**

When an employee asks *"Why is our new payment checkout service delayed and who owns the dependency?"*, the answer is rarely found in one document. It requires piecing together architecture specs, sprint reports, and infrastructure guidelines.

### The Nexus Solution
1. **Centralized Indexing**: Continuously ingests and embeds organizational files into a high-dimensional vector space.
2. **Semantic Knowledge Graph**: Automatically identifies key entities (*teams, project leads, microservices, repositories*) and maps their dependencies.
3. **Multi-Agent RAG Chain**: Dispatches a cooperative network of specialized agents to retrieve context, detect conflicting information, verify access boundaries, and formulate concise, actionable answers.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| 🔗 **Multi-Source Ingestion** | Ingest and vectorize PDFs, Word documents (.docx/.doc), technical specifications, and team wikis. |
| 🕸️ **Interactive Knowledge Graph** | Visually explore organizational networks, service dependencies, team ownership, and related assets on an interactive canvas. |
| 🤖 **Autonomous Multi-Agent Chain** | Five cooperative AI agents execute in sequence to explore, retrieve, audit, verify, and synthesize answers. |
| 🔍 **Contradiction & Conflict Detection** | Automatically detects conflicting timelines, outdated specifications, or conflicting policy rules across different documents. |
| 📊 **Transparent Reasoning Traces** | Live, expandable execution traces showing every step of how the agents analyzed your query. |
| 📄 **Native Multi-Format Reports** | Instant generation and download of structured reports in PDF, DOCX, and Markdown formats. |
| 🛡️ **Role-Based Access Control (RBAC)** | Enforces strict permission boundaries to ensure team members only access data authorized for their role. |
| 📈 **Operational Analytics Dashboard** | Real-time telemetry tracking document index volumes, knowledge health metrics, and query activity. |

---

## 🤖 Multi-Agent Reasoning Pipeline

Nexus uses a pipeline of **five specialized AI agents** that collaborate sequentially to process every query:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Explore    │ ──▶ │    Search    │ ──▶ │   Reviewer   │
│    Agent     │     │    Agent     │     │    Agent     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
                                                 ▼
┌──────────────┐                          ┌──────────────┐
│   Response   │ ◀─────────────────────── │   Verifier   │
│    Agent     │                          │    Agent     │
└──────────────┘                          └──────────────┘
```

1. **Explore Agent**
   - Analyzes query intent, maps relevant organizational domains, and identifies technical boundaries.
2. **Search Agent (RAG Retriever)**
   - Performs semantic vector retrieval across indexed documents and repositories to extract the most relevant context chunks.
3. **Reviewer Agent (Audit & Conflict Detection)**
   - Cross-checks retrieved facts for contradictions, conflicting timelines, or policy mismatches across departments.
4. **Verifier Agent (Access & Reliability Guard)**
   - Evaluates RBAC boundaries, checks data provenance, and computes a confidence and reliability score.
5. **Response Agent (Synthesis & Report Generation)**
   - Formulates the final natural language answer, provides source citations, constructs visual workflow charts, and packages downloadable report files.

---

## 🖥️ Platform Workspaces

Nexus provides a suite of dedicated workspaces designed for different enterprise workflows:

- **💬 AI Chat Workspace (`/chat`)**: Ask complex natural-language questions, inspect real-time agent reasoning traces, view source citations, and export findings.
- **🕸️ Knowledge Graph Explorer (`/graph`)**: Interactive visual mapping of teams, projects, technologies, and team owners with filtering and dependency inspection.
- **📄 Document Management Hub (`/documents`)**: Upload, monitor, and manage document parsing, vector indexing status, and extracted entity tags.
- **📊 Executive Dashboard (`/dashboard`)**: Monitor organizational knowledge health, document ingestion rates, query volume trends, and system activity.
- **🎯 Guided Onboarding (`/onboarding`)**: Streamlined setup flow for configuring user roles, selecting primary data sources, and provisioning workspace preferences.
- **💳 Plans & Subscriptions (`/plans`)**: Transparent tier breakdown tailored for individuals, growing teams, and large enterprises.

---

## 🏗️ System Architecture

Nexus is built with a decoupled, high-performance architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT APPLICATION                        │
│   Next.js 16 • React 19 • Tailwind CSS 4 • Framer Motion • WebGL│
│   (Chat Workspace • Knowledge Graph • Dashboard • Doc Manager)  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION API LAYER                      │
│        Next.js Route Handlers & Process Orchestration           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     COGNITIVE AGENT ENGINE                      │
│             Python Multi-Agent RAG & Reasoning Core             │
│   • Semantic Indexing & Vector Search                           │
│   • Contradiction & Timeline Cross-Auditing                     │
│   • Knowledge Graph Entity & Relation Extraction                │
│   • Multi-Format Layout & Report Compiler                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Enterprise Security & Governance

- **Data Privacy & Isolation**: Dedicated data boundaries ensure workspace intelligence remains private to your organization.
- **Session & Credential Security**: Client-side storage uses secure multi-pass encryption to protect local preferences and authentication state.
- **Strict Format Validation**: Document ingestion strictly validates supported file types (.pdf, .docx, .doc) to prevent unauthorized file execution.
- **Transparent Provenance**: Every generated response includes verifiable citations pointing directly to the underlying source documents.

---

## 🛠 Tech Stack

### Frontend & UI
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **UI Library**: [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations & Visuals**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [OGL (WebGL)](https://github.com/oframe/ogl)
- **Analytics Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend & Agent Engine
- **Runtime**: [Python 3.10+](https://www.python.org/)
- **Vector Mathematics**: [NumPy](https://numpy.org/)
- **Integration**: Secure asynchronous process bridge between Next.js API layer and Python reasoning core

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js**: `v18.x` or higher
- **npm** / **yarn** / **pnpm**
- **Python**: `3.10+` with `numpy`

### Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SreeshanthReddy46/Nexus-AI.git
   cd Nexus-AI
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Python Dependencies:**
   ```bash
   pip install numpy
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the Platform:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

<p align="center">
  <strong>Built with 🧠 by the Nexus AI OS Team</strong>
  <br />
  <em>Transforming fragmented organizational data into unified, explainable intelligence.</em>
</p>
