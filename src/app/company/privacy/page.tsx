"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-black" />
            Security & Governance
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Privacy Guidelines
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            How we protect, store, and isolate your organization&apos;s confidential vectors.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 mt-12 space-y-8 text-slate-600 text-sm leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy & Data Governance</h2>
        <p>
          Nexus AI Technologies, Inc. is committed to protecting your company&apos;s proprietary data. This Privacy Policy details how we vector-index, host, and retrieve content from connected sources.
        </p>
        
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">1. Vector Embeddings & Isolation</h3>
          <p>
            Any documents uploaded via the user dashboard or synced through cloud storage APIs are converted locally into high-dimensional vector floating arrays. These are indexed in dedicated, single-tenant databases. Content from Team A is never mixed with indexes from Team B.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">2. Integration Permissions</h3>
          <p>
            Nexus maps document credentials directly from Google Workspace OAuth tokens. If a user does not have permission to view a specific folder or Confluence article, our reasoning agents filter those sources out automatically from their search context.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">3. GDPR & SOC 2 Compliance</h3>
          <p>
            Nexus operates under SOC 2 Type II regulations. We maintain secure VPC deployments on AWS/GCP, full encryption of rest and transit database paths, and support instant vector index wipeouts upon client termination.
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
