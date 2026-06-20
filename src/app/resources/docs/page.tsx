"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  ChevronRight, 
  X, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Server, 
  Network 
} from "lucide-react";

interface Article {
  title: string;
  description: string;
  section: string;
  readTime: string;
  content: React.ReactNode;
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const docArticles: Article[] = [
    {
      title: "Machine Learning & AI Architecture Layout",
      description: "Understand the layered AI stack and databases: Qdrant vector retrieval, Neo4j knowledge graphs, and Postgres/Redis session memory.",
      section: "Architecture",
      readTime: "10 min read",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Our enterprise brain system is constructed in highly isolated data layers to guarantee compliance, zero hallucination retrieval, and low-latency response times.
          </p>

          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mt-6 mb-2">1. System Layer Hierarchy</h3>
          
          {/* Layer Flow Visual Diagram */}
          <div className="my-6 p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 text-center">System Dataflow Layers</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white relative z-10">
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md">User</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md">Frontend</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md">API Bridge</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md text-indigo-300">Orchestrator</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md">Retrieval</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md">Knowledge</div>
              <div className="text-indigo-400 rotate-90 md:rotate-0">➔</div>
              <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-center shadow-md text-emerald-400">Databases</div>
            </div>
          </div>

          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mt-6 mb-2">2. Database Knowledge Layer</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The database layer sits at the bottom of the retrieval hierarchy, dividing knowledge into three distinct models: semantic meaning, entity relationships, and historical user context.
          </p>

          {/* Database Stack Grid */}
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs font-bold font-mono">V</span>
                <h5 className="text-xs font-black text-white uppercase tracking-wider">Vector Database</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Stores meaning in high-dimensional vector embeddings.</p>
              
              <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Provider</span>
                <span className="text-[10px] text-blue-400 font-black uppercase">Qdrant</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest border-t border-slate-850 pt-3">Purpose</div>
                <div className="text-[11px] text-slate-300 font-medium">Allows AI models to find similar info using Approximate Nearest Neighbors (ANN) lookups.</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs font-bold font-mono">G</span>
                <h5 className="text-xs font-black text-white uppercase tracking-wider">Graph Database</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Stores relationships as nodes and directed linkages.</p>
              
              <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Provider</span>
                <span className="text-[10px] text-indigo-400 font-black uppercase">Neo4j</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest border-t border-slate-850 pt-3">Purpose</div>
                <div className="text-[11px] text-slate-300 font-medium">Maps dependency paths, system interfaces, and ownership lines (e.g., Project A → Depends On → Service B).</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">M</span>
                <h5 className="text-xs font-black text-white uppercase tracking-wider">Memory Database</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Stores user context, preferences, and session histories.</p>
              
              <div className="flex justify-between items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Provider</span>
                <span className="text-[10px] text-emerald-400 font-black uppercase">Postgres / Redis</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest border-t border-slate-850 pt-3">Purpose</div>
                <div className="text-[11px] text-slate-300 font-medium">Persists chat histories, recent user queries, active workspace configurations, and generated business reports.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quickstart Onboarding Guide",
      description: "Learn how to configure your organization settings and deploy your first vector agent database in under 5 minutes.",
      section: "Getting Started",
      readTime: "4 min read",
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Welcome to Nexus AI OS! This guide gets you up and running with your organizational agent workspaces:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Step 1</strong>: Create your enterprise account using your company work email.</li>
            <li><strong>Step 2</strong>: Setup your workspace title and user leadership directory profiles.</li>
            <li><strong>Step 3</strong>: Connect your first file vault (Notion, Google Drive, or local MD files).</li>
            <li><strong>Step 4</strong>: Start asking queries in the Chat interface to retrieve instant insights.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Syncing Google Workspace files",
      description: "Configure OAuth credentials to securely read and vector-index corporate Google Drive folders.",
      section: "Data Connectors",
      readTime: "6 min read",
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Integrate your Google Drive repositories securely into our vector backend:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Navigate to the **Integrations Center** inside settings.</li>
            <li>Select Google Drive and follow the secure OAuth2 redirection gate.</li>
            <li>Authorize read-only access to corporate folders.</li>
            <li>Our backend indexing daemon will auto-embed files to Qdrant every hour.</li>
          </ol>
        </div>
      )
    },
    {
      title: "Notion & Confluence Integrations",
      description: "Establish automated webhooks that sync Notion pages and Confluence tables into your AI brain.",
      section: "Data Connectors",
      readTime: "5 min read",
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Enable Notion and Confluence webhooks to index company guides instantly:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Generate an internal integration token inside your Notion developer console.</li>
            <li>Share specific workspaces with the generated integration.</li>
            <li>Nexus-AI automatically mirrors updates to document nodes on each page change.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Resolving Graph Entanglements",
      description: "How to edit entity nodes and custom link mappings in the interactive SVG Knowledge Graph dashboard.",
      section: "Knowledge Graph",
      readTime: "8 min read",
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Optimize node link alignments in the interactive Knowledge Graph dashboard:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the drag-and-drop handles on the node cards to untangle overlaps.</li>
            <li>Click on any relationship line (edge) to edit labels or delete links.</li>
            <li>Right-click to spawn a new entity card and connect it to existing nodes.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Multi-Agent Decision Pipelines",
      description: "Understand the routing stages (Planner, Router, Graph, Critique) behind answers.",
      section: "Architecture",
      readTime: "7 min read",
      content: (
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>Each user query runs through a strictly isolated chain of specialized python agents:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Planner Agent</strong>: Parses input questions to identify target entities and parameters.</li>
            <li><strong>Router Agent</strong>: Routes the request to either Vector, Graph, or Report databases.</li>
            <li><strong>Graph Agent</strong>: Scans relationship link maps inside the Neo4j stack.</li>
            <li><strong>Vector Agent</strong>: Performs semantic chunk matching in Qdrant indices.</li>
            <li><strong>Critic Agent</strong>: Validates answers against references for compliance and accuracy.</li>
          </ul>
        </div>
      )
    }
  ];

  const filteredArticles = docArticles.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24 relative overflow-hidden">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-black" />
            Product Documentation
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Documentation Center
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base leading-relaxed font-medium">
            Detailed guides, sync instructions, and security blueprints for building and managing your company&apos;s intelligence graph.
          </p>
          
          {/* Search bar */}
          <div className="relative w-full max-w-md mx-auto mt-8">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-black bg-white shadow-sm transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider pl-3">Documentation Index</h4>
            <div className="flex flex-col gap-1">
              <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-black">
                <span>Getting Started</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-black hover:bg-slate-50">
                <span>Data Sync</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-black hover:bg-slate-50">
                <span>Knowledge Graph</span>
                <ChevronRight className="h-3 w-3" />
              </button>
              <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-black hover:bg-slate-50">
                <span>Security Settings</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((art, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-xl border border-slate-200 hover:border-slate-350 hover:shadow-md transition-all bg-white flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {art.section}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{art.readTime}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-black transition-colors">{art.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{art.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveArticle(art)}
                    className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <BookOpen className="h-10 w-10 mx-auto text-slate-300 mb-2 animate-pulse" />
                <p className="text-sm">No documentation articles matched your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Modal Article Reader Overlay */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto relative p-8 md:p-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveArticle(null)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title & Metadata */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200">
                    {activeArticle.section}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{activeArticle.readTime}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight pr-8">
                  {activeArticle.title}
                </h2>
              </div>

              {/* Content Body */}
              <div className="border-t border-slate-100 pt-6">
                {activeArticle.content}
              </div>

              {/* Modal Action footer */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-black text-white hover:bg-slate-800 font-bold px-6 py-3 rounded-2xl text-xs uppercase tracking-widest transition-all shadow active:scale-95 cursor-pointer"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
