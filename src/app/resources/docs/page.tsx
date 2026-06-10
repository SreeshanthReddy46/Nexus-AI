"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowRight, FileText, ChevronRight, HelpCircle, Laptop, Settings, Compass } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const docArticles = [
    {
      title: "Quickstart Onboarding Guide",
      description: "Learn how to configure your organization settings and deploy your first vector agent database in under 5 minutes.",
      section: "Getting Started",
      readTime: "4 min read"
    },
    {
      title: "Syncing Google Workspace files",
      description: "Configure OAuth credentials to securely read and vector-index corporate Google Drive folders.",
      section: "Data Connectors",
      readTime: "6 min read"
    },
    {
      title: "Notion & Confluence Integrations",
      description: "Establish automated webhooks that sync Notion pages and Confluence tables into your AI brain.",
      section: "Data Connectors",
      readTime: "5 min read"
    },
    {
      title: "Resolving Graph Entanglements",
      description: "How to edit entity nodes and custom link mappings in the interactive SVG Knowledge Graph dashboard.",
      section: "Knowledge Graph",
      readTime: "8 min read"
    },
    {
      title: "Multi-Agent Decision Pipelines",
      description: "Understand the routing stages (Planner, Router, Graph, Critique) behind answers.",
      section: "Architecture",
      readTime: "7 min read"
    },
    {
      title: "Managing Enterprise Access Control",
      description: "Synchronize user permission schemas from active directories directly to Vector index paths.",
      section: "Security",
      readTime: "5 min read"
    }
  ];

  const filteredArticles = docArticles.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
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
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
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
                className="p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {art.section}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{art.readTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{art.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{art.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <a
                    href="#"
                    className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <HelpCircle className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">No documentation articles matched your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
