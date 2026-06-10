"use client";

import { motion } from "framer-motion";
import { BookOpen, Code, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ResourcesIndexPage() {
  const resourceCards = [
    {
      title: "Documentation",
      description: "Step-by-step product guides, cloud connection tutorials, and mapping specs for the Knowledge Graph.",
      href: "/resources/docs",
      icon: <BookOpen className="h-6 w-6 text-black" />,
      actionText: "Browse Documentation"
    },
    {
      title: "API Reference Guide",
      description: "Expose your corporate intelligence graph via standard REST queries, webhooks, and sandbox tests.",
      href: "/resources/api",
      icon: <Code className="h-6 w-6 text-black" />,
      actionText: "View API Specs"
    },
    {
      title: "System Status Board",
      description: "Real-time service checks monitoring planning routers, document parsers, and node gateway latencies.",
      href: "/resources/status",
      icon: <Activity className="h-6 w-6 text-black" />,
      actionText: "Check Performance"
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Resources & Documentation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Select an area below to access setup manuals, API credentials reference pages, or review real-time uptime parameters.
          </p>
        </div>
      </section>

      {/* Grid Layout Cards */}
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resourceCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{card.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{card.description}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  href={card.href}
                  className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
                >
                  {card.actionText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
