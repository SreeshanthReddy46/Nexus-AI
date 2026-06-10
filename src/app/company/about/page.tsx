"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, Heart, Award, ArrowRight, Cpu } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <Users className="h-3.5 w-3.5 text-black" />
            Our Corporate Mission
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            About Nexus AI OS
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Learn more about Nexus AI, our corporate values, and our engineering mission to construct enterprise memory.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Mission Statement */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            At Nexus AI Technologies, we believe that corporate tribal knowledge should be accessible, structured, and queryable in a secure environment. We build advanced cognitive graph architectures that map disjointed document libraries, Slack threads, Confluence databases, and GitHub repositories into a single, unified &quot;Company Brain.&quot;
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            Our products enable engineering and compliance teams to drastically reduce onboarding cycles, bypass redundant code audits, and query organizational metadata instantly with source-backed citations.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Corporate Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50"
            >
              <ShieldCheck className="h-6 w-6 text-black animate-pulse" />
              <h3 className="font-bold text-slate-900 text-sm">Security-First</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Vector embeddings and relational nodes are kept isolated in secure VPC subnets with explicit ACL rule sets.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50"
            >
              <Heart className="h-6 w-6 text-black" />
              <h3 className="font-bold text-slate-900 text-sm">Transparency</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We show step-by-step reasoning logs behind all multi-agent answers. Hallucinations are audited.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50"
            >
              <Award className="h-6 w-6 text-black" />
              <h3 className="font-bold text-slate-900 text-sm">Technical Rigor</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                We overlay vector models with explicit semantic database graphs to ensure strict validation of relations.
              </p>
            </motion.div>
          </div>
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
