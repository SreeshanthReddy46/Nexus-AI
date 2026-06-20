"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Database,
  Cpu,
  Share2,
  Lock,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  FileText,
  Compass,
  Check,
  BookOpen,
  CreditCard,
  Cloud,
  Terminal,
  MessageSquare
} from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";
import TextPressure from "@/components/TextPressure";

// Animation Variants for Scroll Reveals
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const cardRevealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 16
    }
  }
} as const;

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
} as const;



// Mock data for interactive demo
const DEMO_QUESTIONS = [
  {
    question: "Why is Project Phoenix delayed?",
    answer: "Project Phoenix is currently delayed by 2 weeks due to integration challenges between the Payment Service API and the core checkout infrastructure. The frontend team is waiting for API specifications from the core checkout platform team.",
    confidence: "94%",
    sources: ["checkout-api-v2.md", "phoenix-sprint-summary.docx"],
    nodes: ["Payment Service", "Checkout Team", "Project Phoenix"]
  },
  {
    question: "Who owns the payment service?",
    answer: "The Payment Service is owned by the Checkout Platform Team. The technical lead is Sarah Jenkins and the product manager is Marcus Chen. They manage all deployments to the payment-prod AWS environment.",
    confidence: "98%",
    sources: ["team-assignments-q3.pdf", "architecture-mapping.json"],
    nodes: ["Payment Service", "Checkout Team", "Sarah Jenkins"]
  },
  {
    question: "Explain our deployment process.",
    answer: "Our deployment process is fully automated. Code merged into 'main' is compiled via GitHub Actions, ran through unit tests, and deployed to Staging. Deployments to Production require a manual approval gate from the DevOps team and pass through a 10% canary release cycle in AWS ECS.",
    confidence: "91%",
    sources: ["ci-cd-playbook.txt", "infrastructure-rules.md"],
    nodes: ["AWS Infrastructure", "Engineering Team", "Deployment Policy"]
  }
];

export default function Home() {
  const [activeDemoIdx, setActiveDemoIdx] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const activeDemo = DEMO_QUESTIONS[activeDemoIdx];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // We only access localStorage on mount to avoid SSR issues
    const auth = localStorage.getItem("nexus_auth");
    const onboarded = localStorage.getItem("nexus_onboarded");
    
    setTimeout(() => {
      if (auth) setIsLoggedIn(true);
      if (onboarded === "true") setIsOnboarded(true);
    }, 0);
  }, []);

  const getStartedHref = isLoggedIn ? (isOnboarded ? "/chat" : "/onboarding") : "/login?signup=true";

  // Scroll Progress Bar Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background Parallax Blobs Setup
  const { scrollY } = useScroll();
  const blobY1 = useTransform(scrollY, [0, 2000], [0, -180]);
  const blobY2 = useTransform(scrollY, [0, 2000], [0, 180]);
  const blobRotate = useTransform(scrollY, [0, 4000], [0, 240]);

  const features = [
    {
      icon: <Database className="h-6 w-6 text-black" />,
      title: "Omnipresent Indexing",
      description: "Connect to PDF, DOCX, Notion, Confluence, GitHub, and Google Drive. Nexus indexes and structures everything."
    },
    {
      icon: <Share2 className="h-6 w-6 text-black" />,
      title: "Automatic Knowledge Graph",
      description: "Entities and structural relationships are extracted automatically. It creates an explicit map of teams, projects, and tech."
    },
    {
      icon: <Cpu className="h-6 w-6 text-black" />,
      title: "Multi-Agent Reasoning",
      description: "Queries route through an agent chain (Planner -> Router -> Graph -> Critic) to aggregate verified answers."
    },
    {
      icon: <Lock className="h-6 w-6 text-black" />,
      title: "Enterprise Permissions",
      description: "Role-based access controls respect original document permission schemas. Admins maintain full visibility."
    },
    {
      icon: <Layers className="h-6 w-6 text-black" />,
      title: "Agent Execution Traces",
      description: "Inspect the step-by-step reasoning steps of the AI agents. Total transparency behind every citation."
    },
    {
      icon: <Zap className="h-6 w-6 text-black" />,
      title: "Instant API Gateway",
      description: "Expose your company's intelligence via secure webhooks and custom REST endpoints in seconds."
    }
  ];

  const faqs = [
    {
      q: "What are the document indexing and query limits for each plan?",
      a: "Our subscriptions scale based on your usage requirements: Free (₹0/mo) includes 50 documents and 100 queries/mo; Starter (₹999/mo) supports up to 1,000 documents; Pro (₹4,999/mo) unlocks advanced graph analytics and trace stack views; Business (₹14,999+/mo) handles unlimited users and dedicated VPC storage hosting."
    },
    {
      q: "Are there any hidden set-up fees or overage charges?",
      a: "No. There are no hidden set-up costs. If your workspace exceeds the query or document limits of the Free or Starter plan, the AI agents will notify you to upgrade. Overage policies for Business plans are specified in custom service level agreements."
    },
    {
      q: "Can we downgrade our plan or cancel our subscription?",
      a: "Yes. You can upgrade, downgrade, or cancel your active subscription plan at any time through the Billing tab in your Control Center dashboard. Downgrades or cancellations take effect at the end of the active monthly billing period."
    },
    {
      q: "Is GST included in the pricing, and what payment methods are accepted?",
      a: "The displayed prices do not include GST. Standard GST will be calculated and printed on invoices at checkout. We accept all major credit cards, corporate bank transfers, and common UPI gateways for transactions in Indian Rupees (INR)."
    }
  ];


  const COMPANIES = [
    { name: "Nexus AI", icon: <Cpu className="h-5 w-5 text-black animate-pulse" /> },
    { name: "Gemini", icon: <Sparkles className="h-5 w-5 text-orange-500" /> },
    { name: "Stripe", icon: <CreditCard className="h-5 w-5 text-black" /> },
    { name: "Slack", icon: <MessageSquare className="h-5 w-5 text-black" /> },
    { name: "GitHub", icon: <Terminal className="h-5 w-5 text-black" /> },
    { name: "Figma", icon: <Layers className="h-5 w-5 text-black" /> },
    { name: "Notion", icon: <BookOpen className="h-5 w-5 text-black" /> },
    { name: "Vercel", icon: <Zap className="h-5 w-5 text-black" /> },
    { name: "AWS", icon: <Cloud className="h-5 w-5 text-black" /> }
  ];


  return (
    <div className="flex flex-col w-full bg-transparent relative overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-[9999]"
      />

      {/* Floating Decorative Parallax Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ y: blobY1, rotate: blobRotate }}
          className="absolute top-[12%] left-[3%] w-[380px] h-[380px] rounded-full bg-orange-100/40 blur-[110px]"
        />
        <motion.div
          style={{ y: blobY2, rotate: blobRotate }}
          className="absolute top-[50%] right-[3%] w-[450px] h-[450px] rounded-full bg-slate-100/50 blur-[120px]"
        />
        <motion.div
          style={{ y: blobY1, rotate: blobRotate }}
          className="absolute top-[78%] left-[6%] w-[420px] h-[420px] rounded-full bg-orange-50/40 blur-[110px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-transparent pt-20 pb-28 md:pt-32 md:pb-40 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 subtle-border mb-6">
              <Sparkles className="h-3 w-3 text-black" />
              Introducing Nexus AI OS v1.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-none"
          >
            Your Company&apos;s AI Brain
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-500 leading-relaxed"
          >
            Ask questions across documents, projects, teams, and knowledge.
            Nexus maps your organizational intelligence automatically.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href={getStartedHref} className="premium-btn py-3 px-8 text-base">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#demo" className="premium-btn-secondary py-3 px-8 text-base">
              Watch Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* Company Marquee Ticker */}
      <div className="border-t border-b border-slate-100 bg-white/40 py-10 backdrop-blur-sm relative z-10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Trusted by fast-growing engineering teams worldwide
          </p>
        </div>
        <div className="animate-marquee-container flex overflow-hidden w-full">
          {/* First sequence */}
          <div className="animate-marquee flex gap-10 items-center py-6 pr-10 shrink-0">
            {COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="animate-wave flex items-center gap-3 bg-white/80 hover:bg-white backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-105 hover:border-slate-300 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${idx * 0.35}s` }}
              >
                {company.icon}
                <span className="font-bold text-slate-800 tracking-tight text-sm">{company.name}</span>
              </div>
            ))}
          </div>
          {/* Duplicated sequence for infinite scrolling flow */}
          <div className="animate-marquee flex gap-10 items-center py-6 pr-10 shrink-0">
            {COMPANIES.map((company, idx) => (
              <div
                key={`dup-${idx}`}
                className="animate-wave flex items-center gap-3 bg-white/80 hover:bg-white backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-105 hover:border-slate-300 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${(idx + COMPANIES.length) * 0.35}s` }}
              >
                {company.icon}
                <span className="font-bold text-slate-800 tracking-tight text-sm">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <motion.section
        id="demo"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="border-t border-b border-slate-200 bg-slate-50/50 py-24 z-10 relative"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              See the Brain in Action
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
              Select a question below to see how Nexus retrieves and synthesizes information across fragmented systems.
            </p>
          </div>

          {/* Browser Window Wrapper */}
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200">
            {/* Top Mac Window Control Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 rounded-t-2xl border-b border-slate-200/80">
              {/* Window Controls */}
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              </div>
              {/* Terminal Title */}
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono">
                nexus-brain-terminal
              </span>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] font-mono font-bold tracking-wider">LIVE</span>
              </div>
            </div>

            {/* Inner Dashboard Layout */}
            <div className="bg-white rounded-b-2xl overflow-hidden flex flex-col md:grid md:grid-cols-3">
              {/* Question Selector Sidebar */}
              <div className="border-b md:border-b-0 md:border-r border-slate-200/80 p-6 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Example Inquiries
                  </span>
                  <span className="bg-black/5 text-slate-600 text-[9px] font-mono px-2 py-0.5 rounded font-bold">
                    3 Queries
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {DEMO_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDemoIdx(idx)}
                      className={`w-full text-left p-4 rounded-xl text-xs font-semibold transition-all relative ${
                        activeDemoIdx === idx
                          ? "bg-white border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] text-black pl-5"
                          : "border border-transparent text-slate-500 hover:text-black hover:bg-white/40 pl-4"
                      }`}
                    >
                      {/* Left Indicator Slider */}
                      {activeDemoIdx === idx && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-black rounded-r"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {q.question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Answer Display Workspace */}
              <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-between min-h-[380px] bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDemoIdx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    {/* User Query Block */}
                    <div className="flex gap-3 items-start">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200/60 shadow-sm">
                        USR
                      </span>
                      <div className="bg-slate-50 border border-slate-200/40 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {activeDemo.question}
                      </div>
                    </div>

                    {/* AI Response Block */}
                    <div className="flex gap-3 items-start">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white text-[10px] font-bold shadow-md">
                        NXS
                      </span>
                      <div className="space-y-4 flex-1">
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {activeDemo.answer}
                        </p>

                        {/* Sources and Confidence Score */}
                        <div className="flex flex-wrap gap-6 pt-5 border-t border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block mb-1">Confidence Score</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                                  style={{ width: activeDemo.confidence }} 
                                />
                              </div>
                              <span className="font-bold font-mono text-emerald-600 text-[11px]">{activeDemo.confidence}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block mb-1.5">References Citations</span>
                            <div className="flex flex-wrap gap-2">
                              {activeDemo.sources.map((src, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-md text-slate-700 subtle-border text-[10px] font-medium transition-colors cursor-pointer"
                                >
                                  <FileText className="h-3 w-3 text-slate-400" />
                                  {src}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dynamic visual graph context */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-black shrink-0" />
                    <span className="font-semibold text-slate-700">Relations map:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activeDemo.nodes.map((node, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1">
                          {idx > 0 && <span className="text-slate-300">→</span>}
                          <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded font-mono text-[10px] text-slate-600 font-semibold">
                            {node}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/login"
                    className="font-bold text-black hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    Open Workspace
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 bg-transparent relative z-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={headerVariants} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              An Engine Purpose-Built for Corporate Memory
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Nexus bridges the gap between siloed communication tools, unstructured files, and engineering repositories.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feat, idx) => (
              <motion.div 
                variants={cardRevealVariants}
                key={idx} 
                className="flex flex-col items-start space-y-4 bg-white/40 p-6 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-white/80 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 border-t border-slate-200 bg-slate-50/40 relative z-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={headerVariants} className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Streamlined Integration
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              From connection to cognitive query interface, the process takes less than five minutes.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={cardRevealVariants} className="premium-card relative bg-white/80 backdrop-blur-sm">
              <span className="absolute top-4 right-4 font-mono text-3xl font-bold text-slate-200">01</span>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Sync Sources</h3>
              <p className="text-sm text-slate-500">
                Connect your cloud storage or drag-and-drop local manuals, engineering specifications, and organization files.
              </p>
            </motion.div>
            <motion.div variants={cardRevealVariants} className="premium-card relative bg-white/80 backdrop-blur-sm">
              <span className="absolute top-4 right-4 font-mono text-3xl font-bold text-slate-200">02</span>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Automap Graph</h3>
              <p className="text-sm text-slate-500">
                Nexus structures semantic relationships between people, codes, servers, and documents, bypassing keyword lookup issues.
              </p>
            </motion.div>
            <motion.div variants={cardRevealVariants} className="premium-card relative bg-white/80 backdrop-blur-sm">
              <span className="absolute top-4 right-4 font-mono text-3xl font-bold text-slate-200">03</span>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Query Intelligently</h3>
              <p className="text-sm text-slate-500">
                Submit questions in chat. Watch agents trace document citations and relation nodes to draft accurate, source-backed answers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 bg-transparent relative z-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={headerVariants} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Transparent Pricing Plans
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Select the intelligence scale that matches your organization size.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {/* Plan 1: Free */}
            <motion.div 
              variants={cardRevealVariants}
              whileHover={{ y: -8 }}
              className="h-full flex"
            >
              <ElectricBorder
                color="#94a3b8"
                speed={0.6}
                chaos={0.06}
                borderRadius={24}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="premium-card border-transparent flex flex-col justify-between bg-white/80 backdrop-blur-sm h-full rounded-[24px]">
                  <div>
                    <h3 className="text-lg font-bold">Free</h3>
                    <p className="text-sm text-slate-400 mt-1">For sandbox testing</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">₹0</span>
                      <span className="text-slate-400 ml-1 text-sm">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-slate-500">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> 50 documents</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> 100 queries/month</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Standard AI Chat agent</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Graph sandbox</li>
                    </ul>
                  </div>
                  <Link href={getStartedHref} className="premium-btn-secondary w-full text-center mt-8 py-2">
                    Get Started
                  </Link>
                </div>
              </ElectricBorder>
            </motion.div>

            {/* Plan 2: Starter */}
            <motion.div 
              variants={cardRevealVariants}
              whileHover={{ y: -8 }}
              className="h-full flex"
            >
              <ElectricBorder
                color="#f59e0b"
                speed={0.6}
                chaos={0.06}
                borderRadius={24}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="premium-card border-transparent flex flex-col justify-between bg-white/80 backdrop-blur-sm h-full rounded-[24px]">
                  <div>
                    <h3 className="text-lg font-bold">Starter</h3>
                    <p className="text-sm text-slate-400 mt-1">For growing teams</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">₹999</span>
                      <span className="text-slate-400 ml-1 text-sm">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-slate-500">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> 1,000 documents</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Team workspace</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Notion & Drive sync</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Standard API access</li>
                    </ul>
                  </div>
                  <Link href={getStartedHref} className="premium-btn-secondary w-full text-center mt-8 py-2">
                    Get Started
                  </Link>
                </div>
              </ElectricBorder>
            </motion.div>

            {/* Plan 3: Pro */}
            <motion.div 
              variants={cardRevealVariants}
              whileHover={{ y: -12 }}
              className="h-full flex"
            >
              <ElectricBorder
                color="#ff4500"
                speed={0.6}
                chaos={0.06}
                borderRadius={24}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="premium-card border-transparent flex flex-col justify-between bg-white/90 backdrop-blur-md h-full rounded-[24px] relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm z-30">
                    Most Popular
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">Pro</h3>
                    <p className="text-sm text-slate-400 mt-1">For advanced intelligence</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">₹4,999</span>
                      <span className="text-slate-400 ml-1 text-sm">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-slate-500">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Graph analytics</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Advanced agents</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Expandable trace stack</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Confluence & Git sync</li>
                    </ul>
                  </div>
                  <Link href={getStartedHref} className="premium-btn w-full text-center mt-8 py-2">
                    Get Started
                  </Link>
                </div>
              </ElectricBorder>
            </motion.div>

            {/* Plan 4: Business */}
            <motion.div 
              variants={cardRevealVariants}
              whileHover={{ y: -8 }}
              className="h-full flex"
            >
              <ElectricBorder
                color="#6366f1"
                speed={0.6}
                chaos={0.06}
                borderRadius={24}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div className="premium-card border-transparent flex flex-col justify-between bg-white/80 backdrop-blur-sm h-full rounded-[24px]">
                  <div>
                    <h3 className="text-lg font-bold">Business</h3>
                    <p className="text-sm text-slate-400 mt-1">For full enterprise sync</p>
                    <div className="mt-6 flex items-baseline">
                      <span className="text-4xl font-extrabold tracking-tight">₹14,999+</span>
                      <span className="text-slate-400 ml-1 text-sm">/month</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-slate-500">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> SSO integration</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Unlimited users</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Priority support SLA</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-black shrink-0" /> Dedicated VPC hosting</li>
                    </ul>
                  </div>
                  <Link href={getStartedHref} className="premium-btn-secondary w-full text-center mt-8 py-2">
                    Contact Sales
                  </Link>
                </div>
              </ElectricBorder>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 border-t border-slate-200 bg-slate-50/40 relative z-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={headerVariants} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Trusted by Technical Leaders
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            <motion.div variants={cardRevealVariants} className="premium-card bg-white/80 backdrop-blur-sm">
              <p className="text-slate-600 text-sm leading-relaxed italic">
                &ldquo;Before Nexus, onboarding a new engineer took weeks. Now, they can ask our AI agent about our deployment cycles and microservice dependencies, and get source-backed answers in real-time.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">AM</span>
                <div>
                  <h4 className="text-sm font-bold">Andrew Mercer</h4>
                  <p className="text-xs text-slate-400">VP of Engineering, CloudStream</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={cardRevealVariants} className="premium-card bg-white/80 backdrop-blur-sm">
              <p className="text-slate-600 text-sm leading-relaxed italic">
                &ldquo;Combining vector databases with an explicit knowledge graph is the key. Nexus gets details correct that normal RAG tools hallucinate. Highly recommended for compliance operations.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">EL</span>
                <div>
                  <h4 className="text-sm font-bold">Elena Rostova</h4>
                  <p className="text-xs text-slate-400">Chief Information Security Officer, Apex Finance</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-transparent border-t border-slate-200"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="border-t border-slate-200 divide-y divide-slate-200">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-base"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`h-5 w-5 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm leading-relaxed text-slate-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 pt-24 pb-12 text-slate-500 text-xs relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Row: Brand & Multi-Column Links */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-16">
            {/* Logo Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-black text-white text-xs font-bold shadow-sm">
                  <Cpu className="h-4 w-4" />
                </span>
                <span className="font-bold text-slate-900 text-base">Nexus AI OS</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs">
                Building the omniscient operating brain for enterprise memory, documents, and agent-driven workflows.
              </p>
            </div>
            
            {/* Column 1: Product */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-black transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-black transition-colors">Live Demo</a></li>
                <li><a href="#pricing" className="hover:text-black transition-colors">Pricing Plans</a></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/resources/docs" className="hover:text-black transition-colors">Documentation</Link></li>
                <li><Link href="/resources/api" className="hover:text-black transition-colors">API Guide</Link></li>
                <li><Link href="/resources/status" className="hover:text-black transition-colors">System Status</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/company/about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="/company/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/company/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Huge Typography Divider & Brand Signature */}
          <div className="border-t border-slate-200/80 pt-16 pb-8 text-center select-none overflow-hidden">
            <div className="w-full max-w-7xl mx-auto h-24 sm:h-36 md:h-52 lg:h-64 relative">
              <TextPressure
                text="NEXUS"
                flex={false}
                alpha={false}
                stroke={false}
                width={true}
                weight={true}
                italic={false}
                textColor="#000000"
                minFontSize={64}
                maxFontSize={224}
                className="nexus-footer-pressure font-sans font-black tracking-tighter"
              />
            </div>
          </div>

          {/* Bottom Row: Copyright and Legal */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 text-[11px] text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Nexus AI Technologies, Inc. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black transition-colors">Security Audit</a>
              <a href="#" className="hover:text-black transition-colors">GDPR Compliance</a>
              <a href="#" className="hover:text-black transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
