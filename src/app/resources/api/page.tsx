"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Search, ArrowRight, Terminal, Globe, Key, AlertCircle, Copy, Check } from "lucide-react";

export default function ApiPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const codeExample = `curl -X POST "https://api.nexus-ai.com/v1/query" \\
  -H "Authorization: Bearer NXS_API_KEY_LIVE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Who owns the billing checkout database?",
    "stream_traces": true,
    "confidence_threshold": 0.85
  }'`;

  const responseExample = `{
  "answer": "The checkout billing service is owned by the Payments Platform team led by Marcus Chen.",
  "confidence": 0.98,
  "sources": [
    "billing-service-mapping.pdf",
    "payments-team-assignment.json"
  ],
  "traces": [
    { "agent": "Planner", "action": "Analyzing request parameters..." },
    { "agent": "Graph Router", "action": "Discovered node match 'Checkout Platform' -> 'Payments'..." }
  ]
}`;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <Code className="h-3.5 w-3.5 text-black" />
            Developer API Hub
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            API Reference Guide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Integrate your company&apos;s intelligence gateway into external platforms, webhooks, or custom REST servers.
          </p>
        </div>
      </section>

      {/* Main Developer Workspace */}
      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Details / Sidebar docs */}
        <div className="lg:col-span-1 space-y-8">
          {/* Section 1: Authentication */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Key className="h-5 w-5 text-black" />
              <h2 className="font-bold text-base">Authentication</h2>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Every request to the Nexus AI API Gateway requires a bearer authorization token. Retrieve your keys from your organization admin settings dashboard panel.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between">
              <code className="text-[10px] text-slate-600 font-mono">Authorization: Bearer &lt;KEY&gt;</code>
              <button 
                onClick={() => copyToClipboard("Authorization: Bearer NXS_API_KEY_LIVE", "auth")}
                className="text-slate-400 hover:text-black transition-colors"
              >
                {copiedKey === "auth" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Section 2: Endpoints */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Globe className="h-5 w-5 text-black" />
              <h2 className="font-bold text-base">Key API Endpoints</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <span className="bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">POST</span>
                  <span className="font-mono text-slate-700 text-xs ml-2">/v1/query</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Submit Inquiry</span>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <span className="bg-slate-950 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">POST</span>
                  <span className="font-mono text-slate-700 text-xs ml-2">/v1/documents</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Upload File</span>
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div>
                  <span className="bg-slate-100 text-slate-600 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold border">GET</span>
                  <span className="font-mono text-slate-700 text-xs ml-2">/v1/graph</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Fetch Map Relations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Playground Box */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5 text-black" />
            Interactive Request Sandbox
          </h2>

          {/* Code Example block */}
          <div className="rounded-xl border border-slate-200 bg-slate-950 overflow-hidden text-slate-300">
            <div className="bg-slate-900 px-4 py-2 flex justify-between items-center text-xs border-b border-slate-800">
              <span className="font-mono font-bold text-slate-400">cURL Request Example</span>
              <button 
                onClick={() => copyToClipboard(codeExample, "curl")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedKey === "curl" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="p-4 text-[10px] sm:text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{codeExample}</code>
            </pre>
          </div>

          {/* Mock Response Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-950 overflow-hidden text-slate-300">
            <div className="bg-slate-900 px-4 py-2 flex justify-between items-center text-xs border-b border-slate-800">
              <span className="font-mono font-bold text-slate-400">JSON API Response Status [200 OK]</span>
              <button 
                onClick={() => copyToClipboard(responseExample, "json")}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedKey === "json" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="p-4 text-[10px] sm:text-xs font-mono overflow-x-auto leading-relaxed text-slate-400">
              <code>{responseExample}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
