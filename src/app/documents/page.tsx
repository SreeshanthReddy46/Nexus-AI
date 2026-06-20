"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { encryptData, decryptData } from "@/utils/crypto";
import {
  FileText,
  UploadCloud,
  Loader2,
  Trash2,
  Calendar,
  Layers,
  Tag,
  Search,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  source: string;
  uploadDate: string;
  status: "Parsing" | "Vectorizing" | "Active";
  chunks: number;
  entities: string[];
}

const DEFAULT_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    name: "checkout-api-v2.md",
    source: "Notion",
    uploadDate: "2026-06-08",
    status: "Active",
    chunks: 12,
    entities: ["Checkout Team", "Sarah Jenkins", "Payment Service"]
  },
  {
    id: "doc-2",
    name: "phoenix-sprint-summary.docx",
    source: "Confluence",
    uploadDate: "2026-06-05",
    status: "Active",
    chunks: 45,
    entities: ["Project Phoenix", "Marcus Chen", "Checkout Team"]
  },
  {
    id: "doc-3",
    name: "ci-cd-playbook.txt",
    source: "GitHub",
    uploadDate: "2026-06-01",
    status: "Active",
    chunks: 28,
    entities: ["AWS Infrastructure", "DevOps Team", "ECS Canary"]
  },
  {
    id: "doc-4",
    name: "infrastructure-rules.md",
    source: "Google Drive",
    uploadDate: "2026-05-28",
    status: "Active",
    chunks: 15,
    entities: ["AWS Infrastructure", "DevOps Team", "Security Compliance"]
  }
];

export default function Documents() {
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>([]);
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [currentPlan, setCurrentPlan] = useState("free");
  const [userRole, setUserRole] = useState("Viewer");
  const [userWorkspace, setUserWorkspace] = useState("NEXUS-HQ");
  const [permissionError, setPermissionError] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    // Check local auth and onboarding status
    const encryptedAuth = localStorage.getItem("nexus_auth");
    if (!encryptedAuth) {
      router.push("/login");
      return;
    }
    
    let activeWorkspace = "NEXUS-HQ";
    try {
      const decrypted = decryptData(encryptedAuth);
      const parsed = JSON.parse(decrypted);
      if (parsed.role) setUserRole(parsed.role);
      if (parsed.workspace) {
        activeWorkspace = parsed.workspace;
        setUserWorkspace(parsed.workspace);
      }
    } catch(e) {}

    const onboarded = localStorage.getItem("nexus_onboarded");
    if (onboarded !== "true") {
      router.push("/onboarding");
      return;
    }

    const plan = localStorage.getItem("nexus_plan");
    if (plan) {
      setTimeout(() => setCurrentPlan(plan), 0);
    }

    // Load from localStorage or set defaults
    const cachedDocsEncrypted = localStorage.getItem("nexus_docs");
    let allDocs = [];
    if (cachedDocsEncrypted) {
      try {
        const decrypted = decryptData(cachedDocsEncrypted);
        if (decrypted) allDocs = JSON.parse(decrypted);
      } catch (e) {
        allDocs = [];
      }
    }

    // Filter defaults if no docs at all in cache
    if (allDocs.length === 0) {
      const defaultDocs = DEFAULT_DOCUMENTS.map(doc => ({ ...doc, workspace: activeWorkspace }));
      allDocs = [...defaultDocs];
      localStorage.setItem("nexus_docs", encryptData(JSON.stringify(allDocs)));
    }

    const workspaceDocs = allDocs.filter((d: any) => d.workspace === activeWorkspace);
    setTimeout(() => setDocs(workspaceDocs), 0);
  }, [router]);

  const saveDocs = (newWorkspaceDocs: Document[]) => {
    setDocs(newWorkspaceDocs);
    const cachedDocsEncrypted = localStorage.getItem("nexus_docs");
    let allDocs = [];
    if (cachedDocsEncrypted) {
      try {
        const decrypted = decryptData(cachedDocsEncrypted);
        if (decrypted) allDocs = JSON.parse(decrypted);
      } catch (e) {}
    }
    const otherWorkspacesDocs = allDocs.filter((d: any) => d.workspace !== userWorkspace);
    const combined = [...otherWorkspacesDocs, ...newWorkspaceDocs];
    localStorage.setItem("nexus_docs", encryptData(JSON.stringify(combined)));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      triggerSimulatedUpload(file.name);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      triggerSimulatedUpload(file.name);
    }
  };

  const triggerSimulatedUpload = (filename: string) => {
    // File security validation
    const lastDotIndex = filename.lastIndexOf('.');
    const ext = lastDotIndex !== -1 ? filename.substring(lastDotIndex).toLowerCase() : "";
    const allowedExts = ['.pdf', '.docx', '.txt', '.md'];
    const blockedExts = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.js', '.ts', '.py', '.php', '.jar', '.vbs', '.com'];

    if (blockedExts.includes(ext) || !allowedExts.includes(ext)) {
      setPermissionError("File Blocked: Executable/Script elements detected. Only PDF, DOCX, TXT, and Markdown files are permitted.");
      setTimeout(() => setPermissionError(""), 5000);
      return;
    }

    // RBAC check
    if (userRole === "Viewer") {
      setPermissionError("Permission Denied: Viewers cannot upload workspace documents.");
      setTimeout(() => setPermissionError(""), 4000);
      return;
    }

    // Plan restrictions
    const docLimit = currentPlan === "free" ? 5 : currentPlan === "starter" ? 10 : 10000; // Simulated lower limits for demo
    if (docs.length >= docLimit && currentPlan !== "pro" && currentPlan !== "business") {
      setIsUpgradeModalOpen(true);
      return;
    }

    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    const extName = ext.substring(1).toUpperCase();
    setCurrentStep(`Reading ${extName} file stream...`);

    const steps = [
      { p: 25, label: "Extracting text contents..." },
      { p: 50, label: "Running semantic sentence chunker..." },
      { p: 75, label: "Analyzing entity links and dependencies..." },
      { p: 90, label: "Generating embeddings and indexing graph nodes..." },
      { p: 100, label: "Writing index to vector store..." }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const next = steps[currentStepIdx];
        setUploadProgress(next.p);
        setCurrentStep(next.label);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Generate realistic entities based on name
          let entities = ["General Team", "Local Sync"];
          if (filename.toLowerCase().includes("pay") || filename.toLowerCase().includes("invoice")) {
            entities = ["Payment Service", "Finance Team", "Sarah Jenkins"];
          } else if (filename.toLowerCase().includes("phoenix") || filename.toLowerCase().includes("sprint")) {
            entities = ["Project Phoenix", "Marcus Chen", "Checkout Team"];
          } else if (filename.toLowerCase().includes("aws") || filename.toLowerCase().includes("docker") || filename.toLowerCase().includes("cloud")) {
            entities = ["AWS Infrastructure", "DevOps Team", "ECS Canary"];
          }

          const newDoc: any = {
            id: `doc-${Date.now()}`,
            name: filename,
            source: "Local Upload",
            uploadDate: new Date().toISOString().split("T")[0],
            status: "Active",
            chunks: Math.floor(Math.random() * 40) + 8,
            entities,
            workspace: userWorkspace
          };

          const updatedDocs = [newDoc, ...docs];
          saveDocs(updatedDocs);
          setIsUploading(false);
          setUploadProgress(0);
          setCurrentStep("");
        }, 500);
      }
    }, 1000);
  };

  const handleDelete = (id: string) => {
    // RBAC check
    if (userRole === "Viewer") {
      setPermissionError("Permission Denied: Viewers cannot delete workspace documents.");
      setTimeout(() => setPermissionError(""), 4000);
      return;
    }
    const updated = docs.filter(doc => doc.id !== id);
    saveDocs(updated);
  };

  const filteredDocs = docs.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.source.toLowerCase().includes(search.toLowerCase()) ||
    doc.entities.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-transparent">
      {permissionError && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-[11px] font-bold text-red-500 flex items-center gap-2 animate-pulse">
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
          {permissionError}
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Center</h1>
            <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              currentPlan === "pro" || currentPlan === "business" 
                ? "bg-black text-white" 
                : currentPlan === "starter" 
                  ? "bg-amber-100 text-amber-700" 
                  : "bg-slate-100 text-slate-500"
            }`}>
              {currentPlan} Plan
            </div>
          </div>
          <p className="text-slate-500 text-sm">
            Upload and index organization materials. These files feed directly into the AI agent workspace memory.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storage Status</div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
             <div className="text-xs font-bold text-slate-700">
                {docs.length} / {currentPlan === "free" ? "5" : currentPlan === "starter" ? "10" : "∞"}
             </div>
             <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${docs.length / (currentPlan === "free" ? 5 : currentPlan === "starter" ? 10 : 10000) > 0.8 ? "bg-orange-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(100, (docs.length / (currentPlan === "free" ? 5 : currentPlan === "starter" ? 10 : 10000)) * 100)}%` }}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <div className="flex justify-center mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <Plus className="h-6 w-6 rotate-45" />
              </span>
            </div>
            <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Limit Reached</h3>
            <p className="text-sm text-center text-slate-500 mb-6">
              Your current {currentPlan} plan allows up to {currentPlan === "free" ? "5" : "10"} document indices. Upgrade to Pro for unlimited organizational memory.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Maybe later
              </button>
              <button 
                onClick={() => router.push("/plans")}
                className="flex-1 bg-black text-white hover:bg-slate-800 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Add Data Sources</h3>

          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`premium-card border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all ${
              userRole === "Viewer" ? "border-slate-100 bg-slate-50/20" : dragActive ? "border-black bg-slate-50" : "border-slate-200"
            }`}
          >
            {userRole === "Viewer" ? (
              <div className="space-y-4 py-4">
                <AlertCircle className="h-10 w-10 text-orange-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Viewer Mode Active</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto font-semibold leading-relaxed">
                  Your role does not have permission to upload or synchronize company materials.
                </p>
              </div>
            ) : isUploading ? (
              <div className="space-y-4 w-full relative overflow-hidden py-2">
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
                  <p className="text-[11px] font-bold text-slate-800">{currentStep}</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-black h-1.5 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold font-mono">Progress: {uploadProgress}%</p>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
                <h4 className="text-sm font-bold text-slate-900">Drag & drop company files</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Supports PDF, DOCX, TXT, or Markdown. Max file size: 50MB.
                </p>
                <div className="mt-4">
                  <label className="premium-btn py-1.5 px-4 text-xs cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileInput}
                      accept=".pdf,.docx,.txt,.md"
                    />
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Quick sync options */}
          <div className="premium-card space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Integrated Connections</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                <span className="font-semibold">Notion Workspace</span>
                <span className="text-[10px] text-slate-500 bg-slate-50 border px-1.5 py-0.5 rounded">Connected</span>
              </div>
              <div className="flex items-center justify-between p-2 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                <span className="font-semibold">GitHub Repo Sync</span>
                <span className="text-[10px] text-slate-500 bg-slate-50 border px-1.5 py-0.5 rounded">Active</span>
              </div>
              <div className="flex items-center justify-between p-2 border border-slate-100 rounded hover:border-slate-200 transition-colors">
                <span className="font-semibold">Google Drive</span>
                <span className="text-[10px] text-slate-400 hover:text-black cursor-pointer font-bold flex items-center gap-0.5">
                  <Plus className="h-3 w-3" /> Connect
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Index Table Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 self-start sm:self-center">
              Active Documents Library ({filteredDocs.length})
            </h3>
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search index or entity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-9 py-1.5 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white/70 backdrop-blur-md shadow-sm">
            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                No matching documents in vector storage.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-slate-500">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th scope="col" className="px-6 py-4">Name</th>
                      <th scope="col" className="px-6 py-4">Source</th>
                      <th scope="col" className="px-6 py-4">Upload Date</th>
                      <th scope="col" className="px-6 py-4">Chunks</th>
                      <th scope="col" className="px-6 py-4">Entities Extracted</th>
                      <th scope="col" className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[150px]">{doc.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-slate-100 border px-1.5 py-0.5 rounded text-slate-600">
                            {doc.source}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {doc.uploadDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Layers className="h-3.5 w-3.5 text-slate-400" />
                            {doc.chunks}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {doc.entities.map((ent, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-0.5 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-medium"
                              >
                                <Tag className="h-2 w-2 text-slate-400" />
                                {ent}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className={`p-1.5 rounded transition-colors ${
                              userRole === "Viewer" 
                                ? "text-slate-200 cursor-not-allowed" 
                                : "text-slate-400 hover:text-red-600 cursor-pointer"
                            }`}
                            title={userRole === "Viewer" ? "Viewer cannot delete" : "Delete index document"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
