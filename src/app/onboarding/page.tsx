"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { encryptData, decryptData } from "@/utils/crypto";
import {
  Users,
  Code,
  Compass,
  FileText,
  UploadCloud,
  Check,
  ChevronRight,
  Database,
  BookOpen,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  Terminal
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("Sreeshanth");

  // Step 1 State: Role Selection
  const [selectedRole, setSelectedRole] = useState("");
  const roles = [
    { id: "student", label: "Student", desc: "Learning core systems and AI structures" },
    { id: "developer", label: "Developer", desc: "Connecting APIs and auditing code bases" },
    { id: "founder", label: "Founder", desc: "Setting up company knowledge brains" },
    { id: "pm", label: "Product Manager", desc: "Tracking specs, teams, and timelines" },
    { id: "researcher", label: "Researcher", desc: "Analyzing deep document libraries" },
    { id: "enterprise", label: "Enterprise Team", desc: "Scaling company-wide workspace search" }
  ];

  // Step 2 State: Data Sources
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const sourcesList = [
    { id: "PDFs", label: "PDFs", desc: "Local documents and reports", icon: <FileText className="h-4 w-4" /> },
    { id: "GitHub", label: "GitHub", desc: "Code repositories and readmes", icon: <Code className="h-4 w-4" /> },
    { id: "Notion", label: "Notion", desc: "Team wikis and meeting notes", icon: <Database className="h-4 w-4" /> },
    { id: "Confluence", label: "Confluence", desc: "Product requirements docs", icon: <Layers className="h-4 w-4" /> },
    { id: "Google Drive", label: "Google Drive", desc: "Cloud files and spreadsheets", icon: <BookOpen className="h-4 w-4" /> },
    { id: "Websites", label: "Websites", desc: "Public API docs and blogs", icon: <Compass className="h-4 w-4" /> }
  ];

  // Step 3 State: Goal
  const [selectedGoal, setSelectedGoal] = useState("");
  const goals = [
    { id: "search", label: "Search Documents", desc: "Retrieve information across fragmented files" },
    { id: "code", label: "Analyze Codebases", desc: "Explain repositories and find dependencies" },
    { id: "assistant", label: "Team Knowledge Assistant", desc: "Onboard employees and search tribal knowledge" },
    { id: "research", label: "Research Assistant", desc: "Synthesize findings and generate custom reports" },
    { id: "workflow", label: "Custom Workflow", desc: "Configure custom cognitive agent triggers" }
  ];

  // Step 4 State: First Document
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState("");

  // Step 5 State: Generating base loading
  const [generationStep, setGenerationStep] = useState(0);
  const generationLogs = [
    "Reading files and repository configuration...",
    "Extracting semantic entities and context tokens...",
    "Formulating nodes for the cognitive relationship graph...",
    "Indexing vector database chunks & configuring planner agent traces..."
  ];

  // Check login
  useEffect(() => {
    const encryptedAuth = localStorage.getItem("nexus_auth");
    if (!encryptedAuth) {
      router.push("/login");
    } else {
      try {
        const decrypted = decryptData(encryptedAuth);
        const parsed = JSON.parse(decrypted);
        if (parsed.name) {
          setTimeout(() => setUserName(parsed.name), 0);
        }
      } catch (e) { }
    }
  }, [router]);

  const handleSourceToggle = (id: string) => {
    if (selectedSources.includes(id)) {
      setSelectedSources(selectedSources.filter(s => s !== id));
    } else {
      setSelectedSources([...selectedSources, id]);
    }
  };

  const startGeneration = () => {
    setStep(5);
    let currentLog = 0;
    const interval = setInterval(() => {
      currentLog += 1;
      if (currentLog < generationLogs.length) {
        setGenerationStep(currentLog);
      } else {
        clearInterval(interval);
        completeOnboarding();
      }
    }, 1000);
  };

  const completeOnboarding = () => {
    let userWorkspace = "NEXUS-HQ";
    const encryptedAuth = localStorage.getItem("nexus_auth");
    if (encryptedAuth) {
      try {
        const decrypted = decryptData(encryptedAuth);
        const parsed = JSON.parse(decrypted);
        userWorkspace = parsed.workspace || "NEXUS-HQ";
      } catch (e) {}
    }

    // Generate a custom document based on user input to save in localstorage
    const newDocId = `doc-onboard-${Date.now()}`;
    const dateStr = new Date().toISOString().split("T")[0];

    let docName = "business-memory-q4.pdf";
    let docSource = "Local Upload";
    let docEntities = ["Financial Targets", "Marketing Budget", "Q4 Roadmap"];
    let docChunks = 18;

    if (repoUrl) {
      const parts = repoUrl.replace(/https?:\/\/github\.com\//, "").split("/");
      docName = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : "github-repo-main";
      docSource = "GitHub";
      docEntities = ["Codebase structure", "Package configuration", "API routes"];
      docChunks = 48;
    } else if (file) {
      docName = file.name;
      docSource = "Local Upload";
      docEntities = ["Uploaded Document", "System Config", "User Knowledge"];
      docChunks = 24;
    }

    const newDoc = {
      id: newDocId,
      name: docName,
      source: docSource,
      uploadDate: dateStr,
      status: "Active" as const,
      chunks: docChunks,
      entities: docEntities,
      workspace: userWorkspace
    };

    // Load existing docs or defaults
    const cachedDocsEncrypted = localStorage.getItem("nexus_docs");
    let docs = [];
    if (cachedDocsEncrypted) {
      try {
        const decrypted = decryptData(cachedDocsEncrypted);
        if (decrypted) {
          docs = JSON.parse(decrypted);
        }
      } catch (e) {
        docs = [];
      }
    }

    // Check if defaults are loaded. If docs is empty, we should populate defaults
    if (docs.length === 0) {
      const defaultDocs = [
        {
          id: "doc-1",
          name: "checkout-api-v2.md",
          source: "Notion",
          uploadDate: "2026-06-08",
          status: "Active" as const,
          chunks: 12,
          entities: ["Checkout Team", "Sarah Jenkins", "Payment Service"],
          workspace: userWorkspace
        },
        {
          id: "doc-2",
          name: "phoenix-sprint-summary.docx",
          source: "Confluence",
          uploadDate: "2026-06-05",
          status: "Active" as const,
          chunks: 45,
          entities: ["Project Phoenix", "Marcus Chen", "Checkout Team"],
          workspace: userWorkspace
        },
        {
          id: "doc-3",
          name: "ci-cd-playbook.txt",
          source: "GitHub",
          uploadDate: "2026-06-01",
          status: "Active" as const,
          chunks: 28,
          entities: ["AWS Infrastructure", "DevOps Team", "ECS Canary"],
          workspace: userWorkspace
        },
        {
          id: "doc-4",
          name: "infrastructure-rules.md",
          source: "Google Drive",
          uploadDate: "2026-05-28",
          status: "Active" as const,
          chunks: 15,
          entities: ["AWS Infrastructure", "DevOps Team", "Security Compliance"],
          workspace: userWorkspace
        }
      ];
      docs = [...defaultDocs, newDoc];
    } else {
      docs.push(newDoc);
    }

    const encryptedDocs = encryptData(JSON.stringify(docs));
    localStorage.setItem("nexus_docs", encryptedDocs);
    localStorage.setItem("nexus_onboarded", "true");
    localStorage.setItem("nexus_plan", "free"); // Initialize default plan

    // Redirect directly to the AI chat
    router.push("/chat");
  };

  const handleFileSelect = (selectedFile: File) => {
    const lastDotIndex = selectedFile.name.lastIndexOf('.');
    const ext = lastDotIndex !== -1 ? selectedFile.name.substring(lastDotIndex).toLowerCase() : "";
    const allowedExts = ['.pdf', '.docx', '.txt', '.md'];
    
    if (!allowedExts.includes(ext)) {
      setGithubError("Invalid File: Only PDF, DOCX, TXT, and Markdown files are permitted.");
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setUploadProgress(0);
    const extName = ext.substring(1).toUpperCase();
    setUploadStep(`Reading ${extName} stream...`);
    setGithubError("");
    
    const uploadSteps = [
      { p: 25, label: "Extracting metadata and layout structures..." },
      { p: 55, label: "Running semantic sentence chunker..." },
      { p: 80, label: "Analyzing entity links and keywords..." },
      { p: 100, label: "Preparing staging cache upload..." }
    ];
    
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < uploadSteps.length) {
        setUploadProgress(uploadSteps[stepIdx].p);
        setUploadStep(uploadSteps[stepIdx].label);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsUploading(false);
        setUploadStep("");
      }
    }, 600);
  };

  const handleCreateKnowledgeBase = async () => {
    if (repoUrl) {
      setGithubError("");
      const cleanUrl = repoUrl.trim().replace(/https?:\/\/github\.com\//, "");
      const parts = cleanUrl.split("/").filter(Boolean);
      if (parts.length < 2) {
        setGithubError("Please enter a valid format, e.g., owner/repo or https://github.com/owner/repo");
        return;
      }
      
      const owner = parts[0];
      const repo = parts[1].replace(/\.git$/, "");
      
      setIsValidatingGithub(true);
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) {
          setGithubError("This GitHub repository does not exist or is private. Please verify the owner and repository names.");
          setIsValidatingGithub(false);
          return;
        }
      } catch (err) {
        setGithubError("Failed to connect to GitHub API. Please check your internet connection.");
        setIsValidatingGithub(false);
        return;
      }
      setIsValidatingGithub(false);
    }
    
    startGeneration();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent z-10 relative">
      <div className="w-full max-w-lg space-y-6">

        {/* Progress bar */}
        {step < 5 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Setup Profile</span>
              <span>Step {step} of 4</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black"
                initial={{ width: "25%" }}
                animate={{ width: `${step * 25}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* Step 1: Who are you? */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white mb-2">
                    <Users className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Who are you?</h2>
                  <p className="text-xs text-slate-500">
                    What best describes your daily focus? This helps personalize recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-4 text-left border rounded-xl transition-all duration-300 cursor-pointer ${selectedRole === r.id
                          ? "border-black bg-slate-50 shadow-sm transform -translate-y-0.5"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/55 bg-white hover:-translate-y-1 hover:shadow-sm"
                        }`}
                    >
                      <h3 className="font-bold text-xs text-slate-900">{r.label}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    disabled={!selectedRole}
                    onClick={() => setStep(2)}
                    className="premium-btn py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: What do you want to connect? */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white mb-2">
                    <Database className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Connect Data Sources</h2>
                  <p className="text-xs text-slate-500">
                    Select the data points you plan to feed your corporate brain.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {sourcesList.map((src) => {
                    const isSelected = selectedSources.includes(src.id);
                    return (
                      <button
                        key={src.id}
                        onClick={() => handleSourceToggle(src.id)}
                        className={`p-4 text-left border rounded-xl transition-all duration-300 flex items-start gap-3 cursor-pointer ${isSelected
                            ? "border-black bg-slate-50 shadow-sm transform -translate-y-0.5"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/55 bg-white hover:-translate-y-1 hover:shadow-sm"
                          }`}
                      >
                        <span className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${isSelected ? "bg-black text-white border-black" : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>
                          {src.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-xs text-slate-900">{src.label}</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{src.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="premium-btn-secondary py-2 px-4 text-xs"
                  >
                    Back
                  </button>
                  <button
                    disabled={selectedSources.length === 0}
                    onClick={() => setStep(3)}
                    className="premium-btn py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: What is your goal? */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white mb-2">
                    <Compass className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">What is your goal?</h2>
                  <p className="text-xs text-slate-500">
                    What is the primary objective you want Nexus AI to achieve?
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`w-full p-4 text-left border rounded-xl transition-all duration-300 flex items-center justify-between cursor-pointer ${selectedGoal === g.id
                          ? "border-black bg-slate-50 shadow-sm transform -translate-y-0.5"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/55 bg-white hover:-translate-y-1 hover:shadow-sm"
                        }`}
                    >
                      <div className="space-y-0.5 max-w-[90%]">
                        <h3 className="font-bold text-xs text-slate-900">{g.label}</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{g.desc}</p>
                      </div>
                      {selectedGoal === g.id && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white shrink-0">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="premium-btn-secondary py-2 px-4 text-xs"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedGoal}
                    onClick={() => setStep(4)}
                    className="premium-btn py-2 px-4 text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Upload First Document */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-black text-white mb-2">
                    <UploadCloud className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">Upload First Document</h2>
                  <p className="text-xs text-slate-500">
                    Connect a workspace file or repository to test the indexing engine immediately.
                  </p>
                </div>

                {/* Dropzone Container */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
                    isDragActive ? "border-black bg-slate-50/80 scale-[1.01]" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30 hover:scale-[1.005]"
                  }`}
                >
                  {isUploading ? (
                    <div className="space-y-4 w-full py-2">
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent animate-[pulse_1s_infinite] top-1/2" />
                      <div className="flex justify-center">
                        <div className="relative flex items-center justify-center h-12 w-12 rounded-xl bg-slate-50 border border-slate-100">
                          <FileText className="h-6 w-6 text-black animate-pulse" />
                          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span>
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 max-w-[280px] mx-auto">
                        <p className="text-[11px] font-bold text-slate-800">{uploadStep}</p>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-black h-1.5 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold font-mono">Progress: {uploadProgress}%</p>
                      </div>
                    </div>
                  ) : file ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">{file.name}</p>
                      <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                      <button
                        onClick={() => setFile(null)}
                        className="text-[10px] text-red-500 font-semibold hover:underline mt-1"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="h-8 w-8 text-slate-400 mb-2 mx-auto" />
                      <p className="text-xs font-semibold text-slate-600">Drag & Drop files (PDF, DOCX, TXT, MD) here</p>
                      <p className="text-[10px] text-slate-400">or</p>
                      <label className="premium-btn py-1.5 px-3 text-[10px] cursor-pointer inline-block">
                        Browse Files
                        <input
                          type="file"
                          accept=".pdf,.md,.txt,.docx"
                          className="hidden"
                          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                {/* Git url connection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                    Connect GitHub Repository
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Terminal className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        placeholder="https://github.com/org/repo"
                        value={repoUrl}
                        onChange={(e) => {
                          setRepoUrl(e.target.value);
                          if (githubError) setGithubError("");
                        }}
                        disabled={!!file || isValidatingGithub}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-xs outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-200 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  {githubError && (
                    <p className="text-[10px] text-red-500 font-semibold mt-1">⚠️ {githubError}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    disabled={isValidatingGithub}
                    className="premium-btn-secondary py-2 px-4 text-xs disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateKnowledgeBase}
                    disabled={isValidatingGithub}
                    className="premium-btn py-2 px-4 text-xs flex items-center gap-1.5 font-bold disabled:opacity-50"
                  >
                    {isValidatingGithub ? "Validating Repository..." : "Create Knowledge Base"}
                    {isValidatingGithub ? (
                      <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Generative pipeline loader */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <span className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <motion.span
                    className="absolute inset-0 rounded-full border-4 border-black border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Cpu className="h-8 w-8 text-black animate-pulse" />
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900">AI Generating Knowledge Base...</h2>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Nexus is structuring relational nodes and compiling your company metadata.
                  </p>
                </div>

                {/* Progression steps */}
                <div className="max-w-xs mx-auto text-left border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-3">
                  {generationLogs.map((log, idx) => {
                    const isActive = idx === generationStep;
                    const isCompleted = idx < generationStep;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs transition-opacity duration-300 ${isActive ? "opacity-100 font-bold" : isCompleted ? "opacity-60" : "opacity-30"
                          }`}
                      >
                        <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${isCompleted
                            ? "bg-black text-white border-black"
                            : isActive
                              ? "border-black text-black animate-pulse"
                              : "border-slate-300 text-slate-300"
                          }`}>
                          {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                        </span>
                        <span className="leading-relaxed text-[11px]">{log}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
