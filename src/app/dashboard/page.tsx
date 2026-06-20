"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Share2,
  HelpCircle,
  Cpu,
  ArrowRight,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw
} from "lucide-react";

// Mock data for dashboard
const INITIAL_STATS = {
  documents: 5420,
  knowledgeNodes: 45221,
  questionsToday: 384,
  agentRuns: 1201
};

const CHART_DATA = [
  { day: "Mon", questions: 240, runs: 850 },
  { day: "Tue", questions: 280, runs: 920 },
  { day: "Wed", questions: 340, runs: 1100 },
  { day: "Thu", questions: 384, runs: 1201 },
  { day: "Fri", questions: 310, runs: 980 },
  { day: "Sat", questions: 120, runs: 410 },
  { day: "Sun", font: "Sun", questions: 140, runs: 490 }
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "upload",
    title: "Document Index Updated",
    desc: "financial-forecast-q4.pdf parsed into 142 vectors.",
    time: "12 mins ago"
  },
  {
    id: 2,
    type: "agent",
    title: "Critic Agent Flagged Query",
    desc: "Flagged response confidence score below threshold for prompt 'deployment constraints'.",
    time: "25 mins ago"
  },
  {
    id: 3,
    type: "graph",
    title: "Knowledge Node Added",
    desc: "Sarah Jenkins connected as Lead Owner for 'Payment Gateway v2'.",
    time: "1 hr ago"
  },
  {
    id: 4,
    type: "sync",
    title: "GitHub Sync Success",
    desc: "Repository 'checkout-service' synced. Extracted 42 endpoints.",
    time: "2 hrs ago"
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    // Check local auth and onboarding status
    const auth = localStorage.getItem("nexus_auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    const onboarded = localStorage.getItem("nexus_onboarded");
    if (onboarded !== "true") {
      router.push("/onboarding");
      return;
    }

    const plan = localStorage.getItem("nexus_plan");
    if (plan) {
      setTimeout(() => setCurrentPlan(plan), 0);
    }

    // Load custom documents if any are in localStorage
    const savedDocs = localStorage.getItem("nexus_docs");
    if (savedDocs) {
      try {
        const docsArray = JSON.parse(savedDocs);
        const docsCount = 5420 + docsArray.length;
        const nodesCount = 45221 + (docsArray.length * 8); // approximate nodes extracted
        setTimeout(() => {
          setStats(prev => ({
            ...prev,
            documents: docsCount,
            knowledgeNodes: nodesCount
          }));
        }, 0);
      } catch (e) {
        console.error("Error reading docs cache.");
      }
    }
    setTimeout(() => setLoading(false), 0);
  }, [router]);

  const handleResetSimulation = () => {
    localStorage.removeItem("nexus_docs");
    localStorage.removeItem("nexus_chats");
    setStats(INITIAL_STATS);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center bg-white">
        <div className="text-slate-400 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  // Find max value in chart data to scale SVG chart
  const maxVal = Math.max(...CHART_DATA.map(d => d.runs));
  const svgWidth = 500;
  const svgHeight = 150;
  const padding = 20;

  // Generate SVG path coordinates for Questions
  const questionsPoints = CHART_DATA.map((d, idx) => {
    const x = padding + (idx * (svgWidth - padding * 2)) / (CHART_DATA.length - 1);
    const y = svgHeight - padding - (d.questions / maxVal) * (svgHeight - padding * 2);
    return { x, y };
  });

  // Generate SVG path coordinates for Agent Runs
  const runsPoints = CHART_DATA.map((d, idx) => {
    const x = padding + (idx * (svgWidth - padding * 2)) / (CHART_DATA.length - 1);
    const y = svgHeight - padding - (d.runs / maxVal) * (svgHeight - padding * 2);
    return { x, y };
  });

  const getPathString = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return "";
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Control Center</h1>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              currentPlan === "pro" || currentPlan === "business" 
                ? "bg-black text-white" 
                : currentPlan === "starter" 
                  ? "bg-amber-100 text-amber-700" 
                  : "bg-slate-100 text-slate-500"
            }`}>
              {currentPlan === "free" && <RefreshCw className="h-3 w-3" />}
              {currentPlan === "starter" && <TrendingUp className="h-3 w-3" />}
              {(currentPlan === "pro" || currentPlan === "business") && <Activity className="h-3 w-3 text-emerald-400" />}
              {currentPlan} Plan
            </div>
          </div>
          <p className="text-slate-500 text-sm">Real-time status of company knowledge integrations and AI activity.</p>
        </div>
        <div className="flex items-center gap-3">
          {(currentPlan === "free" || currentPlan === "starter") && (
            <Link href="/plans" className="text-xs font-bold text-black border-2 border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all flex items-center gap-2">
              Upgrade Intelligence
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            onClick={handleResetSimulation}
            className="premium-btn-secondary text-xs py-2 px-3 text-slate-500 hover:text-black flex items-center gap-1.5"
            title="Reset simulated data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset State
          </button>
          <Link href="/documents" className="premium-btn text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Index Document
          </Link>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="premium-card flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50">
            <FileText className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Documents Indexed</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.documents.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>
                {currentPlan === "free" ? "Approaching 50 doc cap" : 
                 currentPlan === "starter" ? "1,000 document limit" : 
                 "Unlimited indexing active"}
              </span>
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="premium-card flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50">
            <Share2 className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Knowledge Nodes</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.knowledgeNodes.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span>
                {currentPlan === "free" ? "Basic Graph Enabled" : 
                 "Deep entity link analysis"}
              </span>
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="premium-card flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50">
            <HelpCircle className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Questions Today</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.questionsToday.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <Activity className="h-3 w-3 text-black animate-pulse" />
              <span>
                {currentPlan === "free" ? "384 / 100 queries used" : 
                 "Unlimited active inquiries"}
              </span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="premium-card flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-50">
            <Cpu className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agent Runs</p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats.agentRuns.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="font-semibold text-slate-600">
                {currentPlan === "free" ? "Basic RAG" : 
                 currentPlan === "starter" ? "Advanced Agent" : 
                 "Multi-Agent Chain"}
              </span>
              <span>critic-approved score</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main split grid: Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Analytics Chart Container */}
        <div className="lg:col-span-2 premium-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Agent Inquiries & Runs</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                  Questions
                </span>
                <span className="flex items-center gap-1.5 text-slate-900">
                  <span className="h-2 w-2 rounded-full bg-black"></span>
                  Agent Runs
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG Line Chart */}
            <div className="w-full relative mt-6 border-b border-slate-100 pb-2">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = padding + ratio * (svgHeight - padding * 2);
                  return (
                    <line
                      key={idx}
                      x1={padding}
                      y1={y}
                      x2={svgWidth - padding}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Question line (grey) */}
                <path
                  d={getPathString(questionsPoints)}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Runs line (black) */}
                <path
                  d={getPathString(runsPoints)}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Dots on nodes */}
                {questionsPoints.map((pt, idx) => (
                  <circle
                    key={`q-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                ))}

                {runsPoints.map((pt, idx) => (
                  <circle
                    key={`r-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#000000"
                  />
                ))}
              </svg>

              {/* Chart labels underneath */}
              <div className="flex justify-between px-3 mt-2 text-[10px] font-medium text-slate-400">
                {CHART_DATA.map((d, idx) => (
                  <span key={idx} className="w-8 text-center">{d.day}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total API Cost estimate today: $4.82</span>
            <Link href="/chat" className="font-semibold text-black hover:underline flex items-center gap-1">
              Ask AI Workspace
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="premium-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {RECENT_ACTIVITIES.map((act, idx) => (
                  <li key={act.id}>
                    <div className="relative pb-8">
                      {idx !== RECENT_ACTIVITIES.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center ring-8 ring-white">
                            {act.type === "upload" ? (
                              <FileText className="h-4 w-4 text-black" />
                            ) : act.type === "agent" ? (
                              <Cpu className="h-4 w-4 text-black" />
                            ) : act.type === "graph" ? (
                              <Share2 className="h-4 w-4 text-black" />
                            ) : (
                              <RefreshCw className="h-4 w-4 text-black" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{act.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">{act.desc}</p>
                          </div>
                          <div className="text-right text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                            {act.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link href="/documents" className="text-xs font-semibold text-black hover:underline">
              View All Documents &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="border-t border-slate-100 pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Workspace Quick Shortcuts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link href="/chat" className="premium-card flex items-center justify-between p-5 hover:border-black transition-all group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 group-hover:text-black">Launch AI Chat</h4>
              <p className="text-xs text-slate-400">Ask questions across document repositories.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-black transition-colors" />
          </Link>
          <Link href="/documents" className="premium-card flex items-center justify-between p-5 hover:border-black transition-all group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 group-hover:text-black">Manage Documents</h4>
              <p className="text-xs text-slate-400">Upload and configure file parsing vectors.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-black transition-colors" />
          </Link>
          <Link href="/graph" className="premium-card flex items-center justify-between p-5 hover:border-black transition-all group">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 group-hover:text-black">Graph Explorer</h4>
              <p className="text-xs text-slate-400">Inspect visual connections and dependencies.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-black transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
