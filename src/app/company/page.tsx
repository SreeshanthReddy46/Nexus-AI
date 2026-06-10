"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompanyIndexPage() {
  const companyCards = [
    {
      title: "About Us",
      description: "Learn more about Nexus AI, our corporate values, and our engineering mission to construct enterprise memory.",
      href: "/company/about",
      icon: <Users className="h-6 w-6 text-black" />,
      actionText: "Read Our Story"
    },
    {
      title: "Privacy Policy",
      description: "Governance blueprints outlining vector safety, isolated single-tenant database partitions, and GDPR rules.",
      href: "/company/privacy",
      icon: <ShieldCheck className="h-6 w-6 text-black" />,
      actionText: "View Privacy Rules"
    },
    {
      title: "Terms of Service",
      description: "Terms and service boundaries outlining user licensing scopes, acceptable queries, and system SLAs.",
      href: "/company/terms",
      icon: <FileText className="h-6 w-6 text-black" />,
      actionText: "Read Service Terms"
    }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Company Info & Governance
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Find details explaining our corporate vision, vector privacy frameworks, and terms of service guidelines.
          </p>
        </div>
      </section>

      {/* Grid Layout Cards */}
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companyCards.map((card, idx) => (
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
