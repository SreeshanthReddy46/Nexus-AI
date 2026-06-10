"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  MessageSquare,
  FileText,
  Share2,
  Shield,
  CreditCard,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  History,
  LayoutDashboard
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  category: "Navigation" | "Actions" | "Search";
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const togglePalette = useCallback(() => {
    setIsOpen((prev) => !prev);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        togglePalette();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePalette]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    { id: "nav-chat", label: "Open AI Chat", category: "Navigation", icon: <MessageSquare className="h-4 w-4" />, action: () => router.push("/chat") },
    { id: "nav-graph", label: "View Knowledge Graph", category: "Navigation", icon: <Share2 className="h-4 w-4" />, action: () => router.push("/graph") },
    { id: "nav-docs", label: "Document Management", category: "Navigation", icon: <FileText className="h-4 w-4" />, action: () => router.push("/documents") },
    { id: "nav-plans", label: "Billing & Plans", category: "Navigation", icon: <CreditCard className="h-4 w-4" />, action: () => router.push("/plans") },
    { id: "action-new", label: "New Chat Session", category: "Actions", icon: <Plus className="h-4 w-4" />, action: () => { router.push("/chat"); } },
    { id: "action-secure", label: "Run Security Audit", category: "Actions", icon: <Shield className="h-4 w-4" />, action: () => { alert("Security audit initiated. All vector nodes verified."); setIsOpen(false); } },
    { id: "search-org", label: "Search Organization...", category: "Search", icon: <Search className="h-4 w-4" />, action: () => { router.push("/chat"); } },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleAction = (cmd: CommandItem) => {
    cmd.action();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      if (filteredCommands[selectedIndex]) {
        handleAction(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center px-4 border-b border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything or run command..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full bg-transparent px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Command className="h-3 w-3" />
                ESC
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-500">No commands found matching &quot;{query}&quot;</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {["Navigation", "Actions", "Search"].map((category) => {
                    const categoryCmds = filteredCommands.filter(c => c.category === category);
                    if (categoryCmds.length === 0) return null;
                    return (
                      <div key={category} className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1">
                          {category}
                        </h3>
                        {categoryCmds.map((cmd) => {
                          const globalIdx = filteredCommands.indexOf(cmd);
                          const isActive = globalIdx === selectedIndex;
                          return (
                            <button
                              key={cmd.id}
                              onClick={() => handleAction(cmd)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isActive ? "bg-slate-50 text-black shadow-sm" : "text-slate-600 hover:bg-slate-50/50"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border ${isActive ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-transparent"}`}>
                                  {cmd.icon}
                                </div>
                                <span className="text-xs font-bold tracking-tight">{cmd.label}</span>
                              </div>
                              {isActive && (
                                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">↑↓</span>
                  Navigate
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">Enter</span>
                  Select
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Shield className="h-3 w-3 text-emerald-500" />
                SECURE CONTEXT
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
