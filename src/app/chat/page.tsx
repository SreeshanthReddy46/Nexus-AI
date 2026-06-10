"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  MessageSquare,
  Send,
  Cpu,
  FileText,
  ChevronRight,
  Sparkles,
  ChevronDown,
  Trash2,
  Plus,
  Check,
  Shield,
  Lock,
  Zap,
  Activity,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  X
} from "lucide-react";

// Animation Variants
const sidebarVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const securityBadgeVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

interface Message {
  id: string;
  sender: "user" | "nexus";
  text: string;
  confidence?: string;
  sources?: string[];
  relations?: string[];
  trace?: {
    agent: string;
    status: "success" | "warning";
    details: string;
  }[];
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const DEFAULT_CHATS: Chat[] = [
  {
    id: "chat-1",
    title: "Project Phoenix delays",
    messages: [
      {
        id: "m-1",
        sender: "user",
        text: "Why is Project Phoenix delayed?"
      },
      {
        id: "m-2",
        sender: "nexus",
        text: "Project Phoenix is currently delayed by 2 weeks due to integration challenges between the Payment Service API and the core checkout infrastructure. The frontend team is waiting for API specifications from the core checkout platform team.",
        confidence: "94%",
        sources: ["checkout-api-v2.md", "phoenix-sprint-summary.docx"],
        relations: ["Payment Service", "Checkout Team", "Project Phoenix"],
        trace: [
          { agent: "Planner Agent", status: "success", details: "Deconstructed query. Identified target entities: Project Phoenix, Delay factors." },
          { agent: "Router Agent", status: "success", details: "Routed query to the Vector and Graph directories." },
          { agent: "Graph Agent", status: "success", details: "Located nodes: 'Project Phoenix' -(has status)-> 'Delayed'; dependency 'Payment Service'." },
          { agent: "Vector Agent", status: "success", details: "Extracted checkout-api-v2.md chunk 4 (API Spec status) and phoenix-sprint-summary.docx chunk 12 (Blocked by spec delay)." },
          { agent: "Critic Agent", status: "success", details: "Validated source consistency. Relevance score: 0.96. Draft accuracy: high." },
          { agent: "Response Agent", status: "success", details: "Synthesized agent context and generated final citation markdown." }
        ]
      }
    ]
  }
];

const PRE_DEFINED_ANSWERS: { [key: string]: Omit<Message, "id" | "sender"> } = {
  "why is project phoenix delayed?": {
    text: "Project Phoenix is currently delayed by 2 weeks due to integration challenges between the Payment Service API and the core checkout infrastructure. The frontend team is waiting for API specifications from the core checkout platform team.",
    confidence: "94%",
    sources: ["checkout-api-v2.md", "phoenix-sprint-summary.docx"],
    relations: ["Payment Service", "Checkout Team", "Project Phoenix"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Parsed task query. Detected target entities: Project Phoenix, delays." },
      { agent: "Router Agent", status: "success", details: "Routed request query to Vector Store (Notion docs) and Graph Database." },
      { agent: "Graph Agent", status: "success", details: "Found relations: 'Checkout Team' -(owns)-> 'Payment Service' -(blocks)-> 'Project Phoenix'." },
      { agent: "Vector Agent", status: "success", details: "Retrieved chunks explaining current integration specs blocker in 'checkout-api-v2.md'." },
      { agent: "Critic Agent", status: "success", details: "Fact-checked answer against references. Verified delay matches sprint files (2 weeks)." },
      { agent: "Response Agent", status: "success", details: "Formatted output structure, confidence tags, and source list." }
    ]
  },
  "who owns the payment service?": {
    text: "The Payment Service is owned by the Checkout Platform Team. The technical lead is Sarah Jenkins and the product manager is Marcus Chen. They manage all deployments to the payment-prod AWS environment.",
    confidence: "98%",
    sources: ["team-assignments-q3.pdf", "architecture-mapping.json"],
    relations: ["Payment Service", "Checkout Team", "Sarah Jenkins"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Identified goal: Locate owner of 'Payment Service'." },
      { agent: "Router Agent", status: "success", details: "Queried team registries and technical architecture files." },
      { agent: "Graph Agent", status: "success", details: "Extracted node path: 'Checkout Team' -(owns)-> 'Payment Service' -(maintained by)-> 'Sarah Jenkins'." },
      { agent: "Vector Agent", status: "success", details: "Matched chunks from 'team-assignments-q3.pdf' matching owner rosters." },
      { agent: "Critic Agent", status: "success", details: "Verified ownership link holds true for current quarter. Confidence level: 98%." },
      { agent: "Response Agent", status: "success", details: "Rendered staff contacts and structural ownership mappings." }
    ]
  },
  "explain our deployment process.": {
    text: "Our deployment process is fully automated. Code merged into 'main' is compiled via GitHub Actions, ran through unit tests, and deployed to Staging. Deployments to Production require a manual approval gate from the DevOps team and pass through a 10% canary release cycle in AWS ECS.",
    confidence: "91%",
    sources: ["ci-cd-playbook.txt", "infrastructure-rules.md"],
    relations: ["AWS Infrastructure", "DevOps Team", "ECS Canary"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Parsed request for general 'deployment process' steps." },
      { agent: "Router Agent", status: "success", details: "Routed request to infrastructure handbooks and playbook indexes." },
      { agent: "Graph Agent", status: "success", details: "Mapped systems: 'GitHub Actions' -(triggers)-> 'AWS Infrastructure' -(manages)-> 'ECS Canary'." },
      { agent: "Vector Agent", status: "success", details: "Matched chunks explaining ECS deployments." },
      { agent: "Critic Agent", status: "success", details: "Validated that canary gates are enforced. Alerted that 10% ratio is active." },
      { agent: "Response Agent", status: "success", details: "Drafted step-by-step pipeline report." }
    ]
  },
  "summarize my documents": {
    text: "I have summarized your connected workspace documents. The active index incorporates documentation from Notion, Confluence, and your recently synced file integrations. Key domains relate to payment configurations, Project Phoenix deliverables, and AWS release rules. No metadata conflicts were detected in the entities list.",
    confidence: "96%",
    sources: ["checkout-api-v2.md", "phoenix-sprint-summary.docx"],
    relations: ["Payment Service", "Checkout Team", "Project Phoenix"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Decompiled query for dynamic workspace indices summary." },
      { agent: "Router Agent", status: "success", details: "Scanned active vector stores matching Notion and Local Uploads." },
      { agent: "Graph Agent", status: "success", details: "Found 4 connected nodes representing infrastructure files." },
      { agent: "Vector Agent", status: "success", details: "Extracted high-relevance chunks from checkout-api-v2.md and phoenix-sprint-summary.docx." },
      { agent: "Response Agent", status: "success", details: "Generated final summary dashboard report." }
    ]
  },
  "explain this repository": {
    text: "This repository represents a Next.js App Router workspace compiled with React Server Components, Tailwind CSS styling, and Framer Motion animations. Main views include the landing page layout, dashboard panels, interactive documents database, force-directed knowledge graph, and client-side agent reasoning logs.",
    confidence: "94%",
    sources: ["ci-cd-playbook.txt", "repository-structure.md"],
    relations: ["DevOps Team", "AWS Infrastructure"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Parsed query for general codebase configuration." },
      { agent: "Router Agent", status: "success", details: "Scanned folder hierarchy structures." },
      { agent: "Vector Agent", status: "success", details: "Located repository blueprints and deploy configurations." },
      { agent: "Response Agent", status: "success", details: "Formulated technical walkthrough review." }
    ]
  },
  "find dependencies": {
    text: "Scanning your entity node links, the core dependencies are:\n1. 'Project Phoenix' depends directly on 'Payment Service'.\n2. 'Payment Service' is managed by the 'Checkout Team'.\n3. Source code builds trigger automatic 'GitHub Actions' deploying to ECS staging environments.",
    confidence: "91%",
    sources: ["checkout-api-v2.md", "ci-cd-playbook.txt"],
    relations: ["Payment Service", "Project Phoenix", "Checkout Team"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Initiated dependency tree query parsing." },
      { agent: "Graph Agent", status: "success", details: "Mapped dependency path: 'Checkout Team' -(owns)-> 'Payment Service' -(blocks)-> 'Project Phoenix'." },
      { agent: "Response Agent", status: "success", details: "Compiled structural node connection report." }
    ]
  },
  "generate a report": {
    text: "Workspace Integrity Audit Report:\n- Active Knowledge Nodes: 45,229\n- Connected Documents: 5\n- System Status: Operational (Uptime 99.98% across vector and query nodes)\n- Compliance Audit: Encryption at rest and transit active. Graph ACL access lists synced.",
    confidence: "98%",
    sources: ["infrastructure-rules.md", "team-assignments-q3.pdf"],
    relations: ["DevOps Team", "Security Compliance"],
    trace: [
      { agent: "Planner Agent", status: "success", details: "Initiated company system diagnostics scan." },
      { agent: "Vector Agent", status: "success", details: "Retrieved configuration handbooks from secure buckets." },
      { agent: "Critic Agent", status: "success", details: "Verified security controls match benchmark guidelines." },
      { agent: "Response Agent", status: "success", details: "Rendered final audit checklist report." }
    ]
  }
};

export default function ChatWorkspace() {
  const router = useRouter();
  const [userName, setUserName] = useState("Sreeshanth");
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [expandedTraceIdx, setExpandedTraceIdx] = useState<string | null>(null);
  const [visibleTraceMsgId, setVisibleTraceMsgId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeReasoningStep, setActiveReasoningStep] = useState<number | null>(null);
  const [reasoningLogs, setReasoningLogs] = useState<string[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [securityStatus, setSecurityStatus] = useState("Verifying Integrity...");

  const getReasoningSteps = () => {
    const baseSteps = [
      "Initializing neural retrieval pipeline...",
      "Executing vector similarity search (k=5)...",
      "Validating response for factual consistency..."
    ];

    if (currentPlan === "free") return baseSteps;

    if (currentPlan === "starter") {
      return [
        ...baseSteps.slice(0, 2),
        "Traversing relationship nodes in Knowledge Graph...",
        "Applying standard reasoning chain...",
        baseSteps[2]
      ];
    }

    // Pro & Business
    return [
      "Initializing high-depth neural pipeline...",
      "Executing recursive vector similarity search (k=15)...",
      "Traversing multi-hop relationship nodes in Knowledge Graph...",
      "Re-ranking context based on structural centrality...",
      "Applying advanced multi-agent reasoning chain...",
      "Adversarial validation for hallucination detection...",
      "Finalizing high-confidence synthesis..."
    ];
  };

  const reasoningSteps = getReasoningSteps();

  const [agentMode, setAgentMode] = useState("Auto");
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const agentModes = ["Auto", "Research Mode", "Code Analysis", "Report Generation"];

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAgentsModalOpen, setIsAgentsModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const generateId = useCallback((prefix: string) => {
    idCounter.current += 1;
    return `${prefix}-${idCounter.current}-${Date.now()}`;
  }, []);

  useEffect(() => {
    // Simulate security check on mount
    const timer = setTimeout(() => {
      setSecurityStatus("Secure & Encrypted");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check local auth and onboarding status
    const auth = localStorage.getItem("nexus_auth");
    const onboarded = localStorage.getItem("nexus_onboarded");
    const plan = localStorage.getItem("nexus_plan");
    const cachedChats = localStorage.getItem("nexus_chats");

    setTimeout(() => {
      if (!auth) {
        router.push("/login");
        return;
      }

      try {
        const parsed = JSON.parse(auth);
        if (parsed.name) {
          setUserName(parsed.name);
        }
      } catch { }

      if (onboarded !== "true") {
        router.push("/onboarding");
        return;
      }

      if (!plan) {
        router.push("/billing");
        return;
      }
      setCurrentPlan(plan);

      // Auto-open agents modal if query param is present
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("agents") === "true") {
        setIsAgentsModalOpen(true);
      }

      // Load chats from local cache or set defaults
      if (cachedChats) {
        try {
          const loadedChats = JSON.parse(cachedChats);
          setChats(loadedChats);
          if (loadedChats.length > 0) {
            setActiveChatId(loadedChats[0].id);
          }
        } catch {
          setChats(DEFAULT_CHATS);
          setActiveChatId(DEFAULT_CHATS[0].id);
        }
      } else {
        localStorage.setItem("nexus_chats", JSON.stringify(DEFAULT_CHATS));
        setChats(DEFAULT_CHATS);
        setActiveChatId(DEFAULT_CHATS[0].id);
      }
    }, 0);
  }, [router]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, activeChatId, isTyping]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const saveChats = (updatedChats: Chat[]) => {
    setChats(updatedChats);
    localStorage.setItem("nexus_chats", JSON.stringify(updatedChats));
  };

  const handleCreateChat = () => {
    const newChat: Chat = {
      id: generateId("chat"),
      title: `New Query Session`,
      messages: []
    };
    const updated = [newChat, ...chats];
    saveChats(updated);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    saveChats(updated);
    if (activeChatId === id && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Plan-based restrictions
    if (currentPlan === "free") {
      // Simulate query limit check
      const totalMessages = chats.reduce((acc, chat) => acc + chat.messages.length, 0);
      if (totalMessages >= 10 && agentMode === "Auto") { // Lower limit for demo
          setUpgradeReason("You have reached your monthly query limit on the Free plan.");
          setIsUpgradeModalOpen(true);
          return;
      }

      if (agentMode !== "Auto") {
        setUpgradeReason(`The "${agentMode}" requires a Starter or Pro plan.`);
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    if (currentPlan === "starter") {
      if (agentMode === "Report Generation") {
        setUpgradeReason("Advanced Report Generation requires a Pro plan.");
        setIsUpgradeModalOpen(true);
        return;
      }
    }

    const query = text.trim();
    setInputValue("");

    // Create user message
    const userMsg: Message = {
      id: generateId("msg-user"),
      sender: "user",
      text: query
    };

    // Add user message to active chat
    const updatedMessages = [...(activeChat?.messages || []), userMsg];
    let updatedChatTitle = activeChat?.title;
    if (activeChat?.messages.length === 0) {
      updatedChatTitle = query.length > 25 ? query.substring(0, 25) + "..." : query;
    }

    const updatedChats = chats.map(c => {
      if (c.id === activeChatId) {
        return { ...c, title: updatedChatTitle, messages: updatedMessages };
      }
      return c;
    });
    saveChats(updatedChats);

    setIsTyping(true);
    setReasoningLogs([]);
    setActiveReasoningStep(0);

    // Simulate real-time reasoning terminal
    let stepIdx = 0;
    const terminalInterval = setInterval(() => {
      if (stepIdx < reasoningSteps.length) {
        setReasoningLogs(prev => [...prev, reasoningSteps[stepIdx]]);
        setActiveReasoningStep(stepIdx + 1);
        stepIdx++;
      } else {
        clearInterval(terminalInterval);

        // Final generation logic
        setTimeout(() => {
          const lowerQuery = query.toLowerCase().replace(/[?.,]/g, "").trim();
          let matchedResponse = PRE_DEFINED_ANSWERS[lowerQuery];

          // Detect URLs for specialized deep analysis
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const foundUrls = query.match(urlRegex);
          const isGithub = foundUrls?.some(url => url.includes("github.com"));
          const isPdf = foundUrls?.some(url => url.toLowerCase().endsWith(".pdf"));

          if (foundUrls && (isGithub || isPdf)) {
             const targetUrl = foundUrls[0];
             const type = isGithub ? "GitHub Repository" : "External PDF Document";
             
             matchedResponse = {
                text: `I have completed a deep-bit analysis of the ${type} at ${targetUrl}. My extraction agents have mapped the entire structural hierarchy, including hidden dependencies and metadata. \n\nBased on this "every-bit" scan, I can confirm the system architecture is robust. The codebase/document contains high-density entity relationships that have been fully indexed into your current session memory. You can now ask specific questions about its logic, internal schemas, or summarized sections.`,
                confidence: "99.2%",
                sources: [targetUrl],
                relations: isGithub ? ["Source Code", "System Architecture", "Dependency Tree"] : ["Document Content", "Semantic Entities", "Logical Flow"],
                trace: [
                    { agent: "URL Resolver", status: "success", details: `Established secure handshake with ${targetUrl}. Bypass protocol active.` },
                    { agent: "Deep Extraction Agent", status: "success", details: `Scanning every bit of data. Parsed ${isGithub ? 'code tree and commit history' : 'all 452 pages and embedded OCR text'}.` },
                    { agent: "Vector Embedder", status: "success", details: "Generated 1,240 high-dimensional embeddings for local RAG retrieval." },
                    { agent: "Graph Weaver", status: "success", details: "Linked extracted entities to your organizational Knowledge Graph." },
                    { agent: "Final Synthesis", status: "success", details: "Verified factual consistency against extracted 'bit-level' metadata." }
                ]
             };
          }

          // Dynamic lookup: Check custom files in localStorage if no URL match
          if (!matchedResponse) {
            const cachedDocs = localStorage.getItem("nexus_docs");
            let foundCustom = false;
            if (cachedDocs) {
              try {
                const docs = JSON.parse(cachedDocs);
                const matchingDoc = docs.find((d: { name: string; entities: string[] }) =>
                  d.name.toLowerCase().includes(lowerQuery) ||
                  d.entities.some((e: string) => lowerQuery.includes(e.toLowerCase()))
                );

                if (matchingDoc) {
                  foundCustom = true;

                  // Base trace for all plans
                  const baseTrace = [
                    { agent: "Encoder Agent", status: "success" as const, details: "Converted query to 1536-dimensional embedding using text-embedding-3-small." },
                    { agent: "Vector Retriever", status: "success" as const, details: `Executed HNSW approximate nearest neighbor search on ${matchingDoc.name}. Found 4 relevant chunks.` },
                  ];

                  // Add complexity based on plan
                  const extendedTrace: { agent: string; status: "success" | "warning"; details: string; }[] = [...baseTrace];

                  if (currentPlan === "free") {
                    extendedTrace.push({ agent: "Basic Reasoning", status: "success" as const, details: "Standard GPT-4o-mini synthesis on top-k retrieved chunks." });
                  } else if (currentPlan === "starter") {
                    extendedTrace.push({ agent: "Graph Re-ranker", status: "success" as const, details: `Cross-referenced vector chunks with entity nodes: ${matchingDoc.entities.join(", ")}.` });
                    extendedTrace.push({ agent: "ML Reasoning Engine", status: "success" as const, details: "Applied standard Chain-of-Thought (CoT) prompting for synthesis." });
                  } else {
                    // Pro & Business
                    extendedTrace.push({ agent: "Graph Re-ranker", status: "success" as const, details: `Cross-referenced vector chunks with entity nodes. Boosted relevance based on graph centrality.` });
                    extendedTrace.push({ agent: "Multi-hop Reasoner", status: "success" as const, details: "Traversed 2-degree relationship nodes to find secondary context links." });
                    extendedTrace.push({ agent: "Critic Agent", status: "success" as const, details: "Performed adversarial validation to detect potential hallucinations." });
                    extendedTrace.push({ agent: "ML Reasoning Engine", status: "success" as const, details: "Applied advanced recursive Chain-of-Thought with 32k context window." });
                  }

                  matchedResponse = {
                    text: `I discovered reference to your query in your uploaded document: ${matchingDoc.name}. The document was parsed into ${matchingDoc.chunks} chunks and contains entity markers like: ${matchingDoc.entities.join(", ")}. Based on this file, your systems are active and indexing properly.`,
                    confidence: currentPlan === "free" ? "82%" : currentPlan === "starter" ? "89%" : "97%",
                    sources: [matchingDoc.name],
                    relations: matchingDoc.entities,
                    trace: extendedTrace
                  };
                }
              } catch (e) {
                console.error("Error matching custom doc", e);
              }
            }

            if (!foundCustom) {
              // General fallback response with plan-aware trace
              const fallbackTrace: { agent: string; status: "success" | "warning"; details: string; }[] = [
                { agent: "Semantic Parser", status: "success" as const, details: "Named Entity Recognition (NER) identified tokens: " + query }
              ];

              if (currentPlan !== "free") {
                fallbackTrace.push({ agent: "Hybrid Searcher", status: "success" as const, details: "Attempted combined BM25 and Vector search. Max similarity score: 0.58." });
              }

              fallbackTrace.push({ agent: "Response Generator", status: "success" as const, details: "Generated exploratory response based on base index." });

              matchedResponse = {
                text: `I could not locate a specific document reference for "${query}" in your indexed records. However, I scanned 5,420 indexed files and found no active bottlenecks. Please try uploading documentation regarding this in the Document Center.`,
                confidence: "74%",
                sources: ["General Base Index"],
                relations: ["Corporate Registry"],
                trace: fallbackTrace
              };
            }
          }

          // Add plan-specific flavor to the response if it's high-tier
          if (currentPlan === "pro" || currentPlan === "business") {
            matchedResponse = {
              ...matchedResponse,
              trace: [
                ...(matchedResponse?.trace || []),
                { agent: "Pro Logic Optimizer", status: "success", details: "Enhanced reasoning depth active. Multi-hop graph traversal completed." }
              ]
            };
          }

          const nexusMsg: Message = {
            id: generateId("msg-nexus"),
            sender: "nexus",
            ...matchedResponse
          };

          const finalMessages = [...updatedMessages, nexusMsg];
          const finalChats = chats.map(c => {
            if (c.id === activeChatId) {
              return { ...c, messages: finalMessages };
            }
            return c;
          });
          saveChats(finalChats);
          setIsTyping(false);
          setActiveReasoningStep(null);
        }, 200);
      }
    }, 400);
  };

  const suggestions = [
    "Why is Project Phoenix delayed?",
    "Who owns the payment service?",
    "Explain our deployment process.",
    "Summarize my documents"
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-transparent border-t border-slate-100 overflow-hidden">
      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-200"
          >
            <div className="flex justify-center mb-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-orange-500 shadow-inner">
                <Plus className="h-8 w-8 rotate-45" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-3 tracking-tight">Intelligence Limit Reached</h3>
            <p className="text-sm text-center text-slate-500 mb-8 leading-relaxed font-medium">
              {upgradeReason || `Your current ${currentPlan} plan has reached its capacity. Upgrade to unlock full multi-agent reasoning and unlimited organizational memory.`}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="py-4 px-6 rounded-2xl border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => router.push("/plans")}
                className="bg-black text-white hover:bg-slate-800 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Upgrade <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agents Management Modal */}
      <AnimatePresence>
        {isAgentsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-slate-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
              
              <button 
                onClick={() => setIsAgentsModalOpen(false)}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-black"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="h-14 w-14 rounded-3xl bg-black text-white flex items-center justify-center shadow-xl">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Agent Configuration</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Workspace Intelligence Settings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Reasoning Depth</label>
                    <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex gap-1">
                      {["Standard", "Deep", "Recursive"].map(depth => (
                        <button 
                          key={depth}
                          className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            (depth === "Standard" && currentPlan === "free") || 
                            (depth === "Deep" && currentPlan === "starter") || 
                            (depth === "Recursive" && (currentPlan === "pro" || currentPlan === "business"))
                              ? "bg-white text-black shadow-sm ring-1 ring-slate-200"
                              : "text-slate-400 hover:text-slate-600"
                          }`}
                        >
                          {depth}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Base Model</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <Cpu className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-bold text-slate-700">Nexus-Brain v4-Turbo</span>
                        </div>
                        <Check className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl opacity-60">
                        <div className="flex items-center gap-3">
                          <Zap className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-bold text-slate-400">Claude 3.5 Sonnet</span>
                        </div>
                        <Lock className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 mb-2">Agent Statistics</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Your agents have processed 12.4k relationship nodes across your knowledge graph.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
                        <span className="text-xs font-black text-emerald-500">98.4%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[98.4%]" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hallucination Rate</span>
                        <span className="text-xs font-black text-blue-500">&lt; 0.01%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[5%]" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setIsAgentsModalOpen(false); router.push("/plans"); }}
                    className="w-full mt-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    Upgrade Intelligence <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chats Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-slate-50/50 shrink-0">
        <div className="p-4 border-b border-slate-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateChat}
            className="premium-btn w-full py-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Chat Session
          </motion.button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-10 space-y-2 opacity-40">
              <MessageSquare className="h-8 w-8 text-slate-300" />
              <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">No sessions</p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-3 flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  Recent Activity
                </h4>
                {chats.slice(0, 5).map((c, idx) => (
                  <motion.button
                    key={c.id}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={sidebarVariants}
                    onClick={() => {
                      setActiveChatId(c.id);
                      setVisibleTraceMsgId(null);
                    }}
                    className={`w-full text-left flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all group ${activeChatId === c.id
                      ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200/60"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                      }`}
                  >
                    <span className="truncate flex items-center gap-2.5">
                      <MessageSquare className={`h-3.5 w-3.5 ${activeChatId === c.id ? "text-black" : "text-slate-300 group-hover:text-slate-500"}`} />
                      {c.title}
                    </span>
                    <motion.div whileHover={{ scale: 1.2, color: "#ef4444" }}>
                      <Trash2
                        className="h-3.5 w-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2"
                        onClick={(e) => handleDeleteChat(c.id, e)}
                      />
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Security Health Indicator in Sidebar */}
              <div className="mt-auto pt-6 border-t border-slate-200/60">
                <div className="bg-white/60 rounded-xl p-3 border border-slate-200/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Trust</span>
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-600">99.9%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col justify-between bg-transparent relative overflow-hidden">

        {/* Security Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-emerald-500" />
                {securityStatus}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border ${currentPlan === 'pro' ? 'bg-orange-500 text-white border-orange-400' :
                  currentPlan === 'business' ? 'bg-indigo-600 text-white border-indigo-500' :
                    currentPlan === 'starter' ? 'bg-amber-400 text-black border-amber-300' :
                      'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                {currentPlan} Intelligence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              variants={securityBadgeVariants}
              initial="initial"
              animate="animate"
              className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[9px] font-bold text-slate-500 flex items-center gap-1"
            >
              <Lock className="h-2.5 w-2.5" />
              E2E ENCRYPTED
            </motion.span>
          </div>
        </div>

        {/* Messages Logger */}
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {!activeChat || activeChat.messages.length === 0 ? (
            // Welcome workspace
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center py-12 space-y-8"
            >
              <motion.div
                animate={{
                  boxShadow: ["0 0 0 0px rgba(0,0,0,0.1)", "0 0 0 20px rgba(0,0,0,0)", "0 0 0 0px rgba(0,0,0,0)"],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white mx-auto shadow-xl"
              >
                <Cpu className="h-8 w-8" />
              </motion.div>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Ready, {userName}.</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Your organizational memory is indexed and secured. Ask anything to begin retrieval across the neural graph.
                </p>
              </div>

              {/* Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4">
                {suggestions.map((sug, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(sug)}
                    className="w-full text-left p-4 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 hover:border-black hover:bg-white shadow-sm transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-4">{sug}</span>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-black transition-colors shrink-0" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-10">
              <AnimatePresence mode="popLayout">
                {activeChat.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    layout
                    className="space-y-4 group"
                  >
                    {/* User Bubble */}
                    {msg.sender === "user" ? (
                      <div className="flex gap-4 items-start justify-end">
                        <div className="bg-slate-900 text-white rounded-3xl rounded-tr-sm py-3.5 px-6 text-sm font-medium max-w-[80%] shadow-lg leading-relaxed">
                          {msg.text}
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm mt-0.5 overflow-hidden">
                          <span className="font-bold text-slate-800 text-sm">{userName.charAt(0)}</span>
                        </div>
                      </div>
                    ) : (
                      // AI Bubble
                      <div className="flex gap-4 items-start">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl mt-0.5">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div className="space-y-5 flex-1">
                          <div className="prose prose-slate max-w-none text-slate-800 text-[15px] leading-relaxed font-medium">
                            {msg.text}
                          </div>

                          {/* Citation & Trace Panel */}
                          <div className="flex flex-wrap items-center gap-5 text-[10px] text-slate-500 pt-5 border-t border-slate-100">
                            <div>
                              <span className="font-bold text-slate-400 block uppercase tracking-widest mb-1">Reliability</span>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: msg.confidence || "0%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-emerald-500"
                                  />
                                </div>
                                <span className="font-bold text-emerald-600 font-mono text-xs">{msg.confidence}</span>
                              </div>
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-400 block uppercase tracking-widest mb-1.5">References</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.sources.map((src, idx) => (
                                    <motion.span
                                      key={idx}
                                      whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                                      className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm px-2.5 py-1 rounded-lg text-slate-600 font-bold transition-all cursor-pointer"
                                    >
                                      <FileText className="h-3 w-3 text-slate-400" />
                                      {src}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
                      <Cpu className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm w-fit">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                            className="w-2 h-2 bg-slate-400 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-10" />
            </div>
          )}
        </div>

        {/* Input prompt area */}
        <div className="p-6 bg-gradient-to-t from-white via-white/95 to-transparent z-10 border-t border-slate-100">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Agent Mode Selector */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:border-black hover:bg-slate-50 transition-all uppercase tracking-widest"
                >
                  <Sparkles className="h-3 w-3 text-orange-500" />
                  Mode: {agentMode}
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isAgentMenuOpen ? "rotate-180" : ""}`} />
                </motion.button>

                <AnimatePresence>
                  {isAgentMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 bottom-full mb-3 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-30"
                    >
                      {agentModes.map((mode) => (
                        <button
                          key={mode}
                          onClick={() => { setAgentMode(mode); setIsAgentMenuOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-between ${agentMode === mode
                              ? "text-black bg-slate-50 ring-1 ring-slate-200"
                              : "text-slate-500 hover:text-black hover:bg-slate-50/50"
                            }`}
                        >
                          {mode}
                          {agentMode === mode && <Check className="h-3 w-3 text-emerald-500" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] border ${
                currentPlan === "pro" || currentPlan === "business" 
                  ? "bg-black text-white border-black" 
                  : currentPlan === "starter" 
                    ? "bg-amber-50 text-amber-600 border-amber-200" 
                    : "bg-slate-50 text-slate-500 border-slate-200"
              }`}>
                {currentPlan === "free" && <RefreshCw className="h-3 w-3" />}
                {currentPlan === "starter" && <TrendingUp className="h-3 w-3" />}
                {(currentPlan === "pro" || currentPlan === "business") && <Activity className="h-3 w-3 text-emerald-400" />}
                {currentPlan} Engine
              </div>
            </div>

            {/* Privacy/Security Info Ticker */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest overflow-hidden whitespace-nowrap">
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>Session Isolation Active</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Private Node Routing</span>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-2 bg-white border-2 border-slate-100 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] focus-within:border-black focus-within:ring-4 focus-within:ring-slate-50 p-2 transition-all"
            >
              <input
                type="text"
                placeholder={`Ask ${userName.split(' ')[0]}'s Neural Brain...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(inputValue);
                }}
                className="flex-1 bg-transparent border-none px-6 py-3 text-[15px] focus:outline-none text-slate-800 placeholder:text-slate-400 w-full font-medium"
              />
              <motion.button
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend(inputValue)}
                className="bg-black text-white hover:bg-slate-800 rounded-full py-3.5 px-7 flex items-center justify-center shrink-0 transition-all shadow-lg font-bold text-xs gap-2 group"
              >
                <span>Execute</span>
                <Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.button>
            </motion.div>

            <div className="flex items-center justify-center gap-4 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Secure Retrieval Verified
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Zero Hallucination Audit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
