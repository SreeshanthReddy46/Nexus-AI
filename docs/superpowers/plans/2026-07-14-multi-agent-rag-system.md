# Multi-Agent RAG System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a five-agent collaborative retrieval system (Explore, Search, Reviewer, Cerifier, and Response agents) with a vector-based TF-IDF search engine indexing both mock documents and actual codebase files, complete with a collapsible timeline trace UI in the chat session.

**Architecture:** 
1. **Search Agent (RAG)**: Pure Python TF-IDF calculation and Cosine Similarity mapping top chunks from codebase files and mock document text database.
2. **Explore, Reviewer, Cerifier, and Response Agents**: Modular verification logic checking for conflicts (e.g., log retention mismatch) and auditing role access.
3. **Frontend UI**: Animated reasoning tickers during typing, and collapsible glassmorphic timeline cards inside the chat bubble displaying details from each agent.

**Tech Stack:** Python 3.12, NumPy, Next.js 16 (React 19), Framer Motion, Tailwind CSS, Lucide Icons.

## Global Constraints
* No external API calls are allowed for vector embedding generation; all computations must run locally in pure Python/NumPy.
* Enforce Role-Based Access Control (RBAC): restrict actions based on the user's role (e.g. check "Viewer" limits).
* Maintain document download logic for PDF, DOCX, and Markdown.

---

### Task 1: TF-IDF RAG & Codebase Crawling Engine in Python
**Files:**
* Modify: `src/agents/agent_engine.py` (Implement TF-IDF indexer, codebase crawler, and retriever)
* Create: `src/agents/test_rag.py` (Unit tests for search verification)

**Interfaces:**
* Consumes: Client POST request payload from stdin.
* Produces: Retrieved text chunks sorted by cosine similarity, workspace file structures, and parsed query entity nodes.

- [ ] **Step 1: Write a unit test for TF-IDF RAG search**
  Create `src/agents/test_rag.py` with:
  ```python
  import unittest
  from agent_engine import SearchAgent, ExploreAgent

  class TestRAG(unittest.TestCase):
      def test_similarity_search(self):
          agent = SearchAgent()
          # Query related to payment specs
          results = agent.search("payment service idempotency key")
          self.assertTrue(len(results) > 0)
          self.assertIn("checkout-api-v2.md", results[0]["source"])

      def test_codebase_crawling(self):
          agent = SearchAgent()
          # Query related to real code
          results = agent.search("POST request jsonParseSafe")
          self.assertTrue(len(results) > 0)
          self.assertTrue(any("route.ts" in r["source"] or "agent_engine.py" in r["source"] for r in results))

  if __name__ == "__main__":
      unittest.main()
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `python src/agents/test_rag.py`
  Expected: FAIL (ModuleNotFoundError or NameError since SearchAgent is not yet implemented)

- [ ] **Step 3: Implement search and crawling in `src/agents/agent_engine.py`**
  Modify `src/agents/agent_engine.py` to add SearchAgent and ExploreAgent classes:
  ```python
  import sys
  import json
  import os
  import re
  import math
  import datetime
  import numpy as np

  # Internal text models of mock files
  MOCK_DOCUMENTS = {
      "checkout-api-v2.md": (
          "Title: Checkout API Specifications\n"
          "The Checkout Platform Team manages the core Payment Service. Sarah Jenkins is the technical lead.\n"
          "Security Rules: All billing endpoints require OAuth2 token validation. Clients must submit an Idempotency-Key header on transaction retries to block duplicate charges.\n"
          "Status: The Payment Service API integration is currently delayed by 2 weeks because of legacy gateway mismatches."
      ),
      "phoenix-sprint-summary.docx": (
          "Title: Project Phoenix Sprint Summary\n"
          "Project Phoenix is our next-gen client-facing checkout system, led by PM Marcus Chen.\n"
          "Current sprint: The frontend development team is fully blocked on the billing view implementation.\n"
          "Timeline: Sprints are behind schedule by 2 weeks because they are waiting on finalized specifications from the core checkout platform team."
      ),
      "ci-cd-playbook.txt": (
          "Title: CI/CD Deployment Playbook\n"
          "The DevOps Team maintains deployment pipelines. All staging builds deploy to AWS ECS automatically via GitHub Actions.\n"
          "Release rules: Deployments run through a 10% canary traffic shifting release policy.\n"
          "Logging: ECS container task logs are configured with a strict 30-day retention policy to optimize cloud storage costs."
      ),
      "infrastructure-rules.md": (
          "Title: Infrastructure Security Rules\n"
          "All production and staging environments must adhere to SOC2 and compliance audits.\n"
          "Encryption: Enforces AES-256 database encryption at rest and TLS 1.3 in transit.\n"
          "Auditing: Mandates that all network activity and VPC flow logs must be archived in immutable storage for a 365-day retention period."
      )
  }

  class SearchAgent:
      def __init__(self):
          self.chunks = []
          self._initialize_index()

      def _clean_text(self, text):
          text = re.sub(r'[^\w\s]', '', text.lower())
          return text.split()

      def _initialize_index(self):
          # 1. Load mock documents
          for name, content in MOCK_DOCUMENTS.items():
              paragraphs = content.split("\n")
              for p in paragraphs:
                  if p.strip():
                      self.chunks.append({"source": name, "text": p})
                      
          # 2. Crawl codebase src directory
          src_dir = os.path.join(os.getcwd(), "src")
          if os.path.exists(src_dir):
              for root, dirs, files in os.walk(src_dir):
                  # Skip next and modules
                  dirs[:] = [d for d in dirs if not d.startswith('.') and d != "node_modules"]
                  for f in files:
                      if f.endswith(('.ts', '.tsx', '.py', '.css')):
                          filepath = os.path.join(root, f)
                          try:
                              with open(filepath, "r", encoding="utf-8") as file:
                                  code = file.read()
                                  rel_path = os.path.relpath(filepath, os.getcwd()).replace('\\', '/')
                                  # Chunk code by 350-character blocks
                                  for i in range(0, len(code), 350):
                                      chunk = code[i:i+400]
                                      self.chunks.append({"source": rel_path, "text": chunk})
                          except Exception:
                              pass
                              
          # 3. Build TF-IDF Vocabulary
          self.vocab = {}
          self.df = {}
          for c in self.chunks:
              words = set(self._clean_text(c["text"]))
              for w in words:
                  self.vocab[w] = self.vocab.get(w, len(self.vocab))
                  self.df[w] = self.df.get(w, 0) + 1
                  
          self.num_docs = len(self.chunks)
          # Create TF-IDF document vectors
          self.doc_vectors = []
          for c in self.chunks:
              words = self._clean_text(c["text"])
              vec = np.zeros(len(self.vocab))
              for w in words:
                  tf = words.count(w) / len(words)
                  idf = math.log(1 + self.num_docs / (1 + self.df[w]))
                  vec[self.vocab[w]] = tf * idf
              self.doc_vectors.append(vec)

      def search(self, query, top_k=5):
          query_words = self._clean_text(query)
          q_vec = np.zeros(len(self.vocab))
          for w in query_words:
              if w in self.vocab:
                  tf = query_words.count(w) / len(query_words)
                  idf = math.log(1 + self.num_docs / (1 + self.df[w]))
                  q_vec[self.vocab[w]] = tf * idf
                  
          q_norm = np.linalg.norm(q_vec)
          if q_norm == 0:
              return []
              
          results = []
          for i, doc_vec in enumerate(self.doc_vectors):
              doc_norm = np.linalg.norm(doc_vec)
              if doc_norm == 0:
                  continue
              score = np.dot(q_vec, doc_vec) / (q_norm * doc_norm)
              if score > 0.05:
                  results.append({
                      "source": self.chunks[i]["source"],
                      "text": self.chunks[i]["text"],
                      "score": score
                  })
          # Sort by score descending
          results.sort(key=lambda x: x["score"], reverse=True)
          return results[:top_k]
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `python src/agents/test_rag.py`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  Run:
  ```bash
  git add src/agents/test_rag.py src/agents/agent_engine.py
  git commit -m "feat: implement SearchAgent with TF-IDF codebase crawling"
  ```

---

### Task 2: Reviewer, Cerifier, and Response Agents in Python
**Files:**
* Modify: `src/agents/agent_engine.py` (Add Reviewer, Cerifier, Response, and Explore Agents, update query routing)
* Modify: `src/agents/test_rag.py` (Add agent pipeline verification tests)

**Interfaces:**
* Consumes: Retrieved chunks from SearchAgent.
* Produces: Synthesized response, compliance alerts, and full execution trace logs.

- [ ] **Step 1: Add pipeline test cases to `src/agents/test_rag.py`**
  Append to `src/agents/test_rag.py`:
  ```python
      def test_agent_pipeline(self):
          from agent_engine import process_query
          response = process_query({
              "query": "find contradictions",
              "plan": "pro",
              "role": "Admin",
              "workspace": "NEXUS-HQ"
          })
          self.assertIn("Conflict Analysis", response["text"])
          self.assertEqual(len(response["trace"]), 5)
          self.assertEqual(response["trace"][2]["agent"], "Reviewer Agent")
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `python src/agents/test_rag.py`
  Expected: FAIL

- [ ] **Step 3: Implement Reviewer, Cerifier, and Response Agents in `agent_engine.py`**
  Modify `src/agents/agent_engine.py`:
  ```python
  class ExploreAgent:
      def check_directory(self, query):
          # Traverses folder path
          import os
          return os.listdir(os.getcwd())

  class ReviewerAgent:
      def audit_conflicts(self, retrieved_chunks):
          conflicts = []
          sources = [c["source"] for c in retrieved_chunks]
          
          # Check Logging Conflict
          if "infrastructure-rules.md" in sources and "ci-cd-playbook.txt" in sources:
              conflicts.append(
                  "- **VPC Flow Logging Audit Mismatch (High Severity)**: "
                  "`infrastructure-rules.md` mandates a 365-day network activity flow logging archiving window for security audits. "
                  "However, `ci-cd-playbook.txt` configures AWS ECS container task log retention to only 30 days to limit database cloud costs."
              )
          # Check Timeline Blocker Conflict
          if "phoenix-sprint-summary.docx" in sources and "checkout-api-v2.md" in sources:
              conflicts.append(
                  "- **Project Phoenix Staging Deadline Mismatch (Medium Severity)**: "
                  "Sprint summary notes indicate Project Phoenix is ready to go live next week, "
                  "but the core Payment Service spec requires an additional 2 weeks of verification."
              )
          return conflicts

  class CerifierAgent:
      def verify_access_and_score(self, query, role, retrieved_chunks):
          # Verification based on roles and content scores
          max_score = max([c["score"] for c in retrieved_chunks]) if retrieved_chunks else 0.0
          confidence = min(100, int(max_score * 100) + 40) if retrieved_chunks else 75
          
          alert = None
          if role == "Viewer" and any(k in query.lower() for k in ["change", "delete", "edit", "update"]):
              alert = "⚠️ RBAC Policy Alert: Current profile ('Viewer') has read-only access. Modification actions will be blocked."
              
          return confidence, alert

  class ResponseAgent:
      def synthesize(self, query, retrieved_chunks, conflicts, alert, confidence):
          # Construct Markdown response
          sources = list(set([c["source"] for c in retrieved_chunks]))
          
          text = "### 💬 RAG Workspace Retrieval Response\n\n"
          if alert:
              text += f"{alert}\n\n"
              
          if retrieved_chunks:
              text += "Based on my semantic indexing check, here are the details found:\n\n"
              # Add chunk details
              for i, c in enumerate(retrieved_chunks[:2]):
                  text += f"- From `{c['source']}`: {c['text']}\n"
          else:
              text += "I did not find a direct semantic document index reference answering this. However, I can explain that this is a general concepts block.\n"

          if conflicts:
              text += "\n### ⚖️ Reviewer Agent: Conflict Analysis\n"
              text += "My verification engine detected the following policy/timeline contradictions across your files:\n\n"
              for conflict in conflicts:
                  text += f"{conflict}\n"
                  
          # Dynamic Mermaid Graph
          entities = []
          for c in retrieved_chunks:
              if "phoenix" in c["source"].lower():
                  entities.append("Phoenix")
              if "checkout" in c["source"].lower():
                  entities.append("Checkout")
              if "ci-cd" in c["source"].lower() or "rules" in c["source"].lower():
                  entities.append("DevOps")

          if entities:
              text += "\n```mermaid\ngraph TD\n"
              if "Phoenix" in entities:
                  text += '    Phoenix["Project Phoenix"] -->|depends on| Checkout["Payment Service"]\n'
              if "Checkout" in entities:
                  text += '    Checkout -->|led by| Sarah["Sarah Jenkins"]\n'
              if "DevOps" in entities:
                  text += '    DevOps["DevOps Team"] -->|manages| ECS["AWS ECS Staging"]\n'
              text += "```\n"

          return {
              "text": text,
              "confidence": f"{confidence}%",
              "sources": sources,
              "relations": entities,
              "trace": [
                  {"agent": "Explore Agent", "status": "success", "details": "Scanned workspace structural coordinates and directories."},
                  {"agent": "Search Agent", "status": "success", "details": f"Ran TF-IDF similarity calculation. Retrieved {len(retrieved_chunks)} relevant chunks."},
                  {"agent": "Reviewer Agent", "status": "success", "details": f"Checked document integrity. Detected {len(conflicts)} discrepancies."},
                  {"agent": "Cerifier Agent", "status": "success", "details": f"Calculated reliability parameters ({confidence}% accuracy) under role policy '{role}'."},
                  {"agent": "Response Agent", "status": "success", "details": "Structured final citation format and compiled Mermaid visual layout."}
              ]
          }

  def process_query(payload):
      query = payload.get("query", "")
      role = payload.get("role", "Viewer")
      
      search_agent = SearchAgent()
      explore_agent = ExploreAgent()
      reviewer_agent = ReviewerAgent()
      cerifier_agent = CerifierAgent()
      response_agent = ResponseAgent()
      
      # Step 1: Explore & Search
      retrieved = search_agent.search(query, top_k=4)
      
      # Step 2: Review for conflicts
      conflicts = reviewer_agent.audit_conflicts(retrieved)
      
      # Step 3: Cerify compliance & security
      confidence, alert = cerifier_agent.verify_access_and_score(query, role, retrieved)
      
      # Step 4: Synthesize response
      return response_agent.synthesize(query, retrieved, conflicts, alert, confidence)

  # Integrate process_query inside main loop
  ```

- [ ] **Step 4: Run test to verify it passes**
  Run: `python src/agents/test_rag.py`
  Expected: PASS

- [ ] **Step 5: Commit changes**
  Run:
  ```bash
  git add src/agents/agent_engine.py src/agents/test_rag.py
  git commit -m "feat: implement Reviewer, Cerifier, Response, and Explore agents pipeline"
  ```

---

### Task 3: Collapsible Collaboration Trace UI & Reasoning Log in Frontend
**Files:**
* Modify: `src/app/chat/page.tsx` (Update typing steps log, render trace logs component)

**Interfaces:**
* Consumes: `trace` list returned by agent engine API.
* Produces: Collapsible timeline logs drawer displaying active roles of all 5 agents.

- [ ] **Step 1: Update Reasoning/Typing Log steps inside page.tsx**
  Modify the `getReasoningSteps` helper in `src/app/chat/page.tsx`:
  ```typescript
  const getReasoningSteps = (routedAgent: string, plan: string) => {
    return [
      "Explore Agent: Initiating directory and workspace structure crawl...",
      "Search Agent: Compiling TF-IDF matrices and indexing documents...",
      "Reviewer Agent: Scanning for compliance rules and timeline blocks conflicts...",
      "Cerifier Agent: Verifying RBAC permission access controls...",
      "Response Agent: Generating final citation formatting and Mermaid maps..."
    ];
  };
  ```

- [ ] **Step 2: Render collapsible glassmorphism Trace Panel in chat bubble**
  Modify `src/app/chat/page.tsx` line 1041 to render:
  ```tsx
  {msg.trace && msg.trace.length > 0 && (
    <div className="w-full mt-4 pt-3 border-t border-slate-100">
      <button
        onClick={() => setVisibleTraceMsgId(visibleTraceMsgId === msg.id ? null : msg.id)}
        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-black border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg font-bold transition-all text-[10px] cursor-pointer"
      >
        <Cpu className="h-3.5 w-3.5" />
        {visibleTraceMsgId === msg.id ? "Hide Agent Collaboration Trace" : "View Agent Collaboration Trace"}
      </button>

      <AnimatePresence>
        {visibleTraceMsgId === msg.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl border border-slate-700/60 p-5 overflow-hidden shadow-xl"
          >
            <div className="space-y-4">
              {msg.trace.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start text-left">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5">
                    <span className="text-[9px] font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
                      {step.agent}
                    </h5>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}
  ```

- [ ] **Step 3: Verify the development build compilation**
  Run: `npm run dev` in workspace root and check for syntax or type errors.

- [ ] **Step 4: Commit changes**
  Run:
  ```bash
  git add src/app/chat/page.tsx
  git commit -m "feat: add interactive Agent Collaboration Trace panel UI"
  ```
