# Nexus AI OS - Enterprise Organizational Intelligence

Nexus AI OS is a next-generation "AI Brain" for modern enterprises. It centralizes fragmented organizational knowledge by indexing documents, repositories, and communication silos into a unified semantic knowledge graph.

## 🧠 ML Architecture & Technical Overview

Nexus uses a sophisticated **Hybrid RAG (Retrieval-Augmented Generation)** architecture combined with an **Entity-Relationship Knowledge Graph**.

### Core Components:
1.  **Multi-Modal Encoder:** Converts unstructured data (PDF, DOCX, Markdown, Code) into 1536-dimensional embeddings using state-of-the-art transformer models.
2.  **Hybrid Vector-Graph Retriever:**
    *   **Vector Search:** Performs HNSW (Hierarchical Navigable Small World) approximate nearest neighbor search for semantic similarity.
    *   **Graph Traversal:** Extracts structured relationships between entities (Teams, Projects, Servers) to provide high-precision context that standard RAG often misses.
3.  **Agentic Reasoning Chain:**
    *   **Planner Agent:** Deconstructs complex user queries into sub-tasks.
    *   **Router Agent:** Directs sub-tasks to relevant data silos (e.g., GitHub for code, Notion for docs).
    *   **Critic Agent:** Validates retrieved context against the generated response to eliminate hallucinations.
4.  **Trace Stack:** Full transparency into the "Chain-of-Thought" reasoning for every answer.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/nexus-ai.git
    cd nexus-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Access the platform:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 💳 Monetization & Access Tiers

Nexus AI OS scales with your organization. Users must select a plan before initiating a chat session.

| Feature | Free | Starter | Pro (Recommended) | Business |
| :--- | :--- | :--- | :--- | :--- |
| **Price** | ₹0/mo | ₹999/mo | ₹4,999/mo | ₹14,999/mo |
| **Indexing** | 50 Docs | 1,000 Docs | 10,000 Docs | Unlimited |
| **Agent Support** | Standard RAG | Advanced RAG | Multi-Agent Reasoning | Custom Fine-tuning |
| **Syncing** | Manual Upload | Notion/Drive | Confluence/GitHub | Dedicated VPC |
| **Trace Depth** | Basic | Standard | Expandable Stack | Full Audit Log |

## 🛠 Project Structure
- `src/app/page.tsx`: Interactive Landing Page.
- `src/app/chat/page.tsx`: Core Agent Workspace with Trace Logic.
- `src/app/plans/page.tsx`: Intelligence selection and monetization flow.
- `src/app/graph/page.tsx`: Force-directed knowledge graph visualization.
- `src/app/documents/page.tsx`: Document indexing and management.

## 🔒 Security & Compliance
Nexus is built for the enterprise. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Role-based access controls (RBAC) ensure that the AI agents only access documents the user is authorized to see.
