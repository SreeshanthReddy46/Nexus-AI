"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <FileText className="h-3.5 w-3.5 text-black" />
            Terms & Boundaries
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Read through the policies and user boundaries of using the Nexus platform.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 mt-12 space-y-8 text-slate-600 text-sm leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Terms and Service Boundaries</h2>
        <p>
          Welcome to Nexus AI OS. By deploying our indexes, workspace dashboards, or API routers, your company agrees to follow the terms below.
        </p>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">1. User License & Workspace Boundaries</h3>
          <p>
            Subscribers are granted a non-transferable, revocable license to access the reasoning models, knowledge graph visualizer, and dashboard panels based on their pricing subscription tiers (Free, Starter, Pro, Business).
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">2. Acceptable Model Querying</h3>
          <p>
            Nexus AI must not be used to process malicious payloads, scrape public systems in violation of copyright, or intentionally attempt to inject vectors into our system database engines. We maintain structural filters that automatically log security violations.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">3. Service SLA</h3>
          <p>
            Pro and Business plan clients receive dedicated vector routing nodes guaranteeing 99.9% indexing uptime. Under extreme loads, parsing pipelines may experience minor queue delay periods.
          </p>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <Link
            href="/"
            className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1"
          >
            Back to Homepage
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
