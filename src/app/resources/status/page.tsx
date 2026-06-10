"use client";

import { motion } from "framer-motion";
import { Activity, Check, ArrowRight, HelpCircle, HardDrive, RefreshCw } from "lucide-react";

export default function StatusPage() {
  const systemServices = [
    { name: "Cognitive Vector Engine", status: "Operational", ping: "14ms", uptime: "99.99%" },
    { name: "Knowledge Graph Engine", status: "Operational", ping: "22ms", uptime: "99.98%" },
    { name: "Multi-Agent Planning Router", status: "Operational", ping: "8ms", uptime: "100.0%" },
    { name: "Document Parsing Pipeline", status: "Operational", ping: "45ms", uptime: "99.95%" },
    { name: "API Gateway", status: "Operational", ping: "12ms", uptime: "99.99%" }
  ];

  const historicalIncidents = [
    { date: "June 08, 2026", event: "Standard Database Index Optimization Maintenance", impact: "No Service Interruption", duration: "12 mins" },
    { date: "May 24, 2026", event: "Confluence Connector Rate Limiting Adjustment", impact: "Partial Latency Increase", duration: "4 mins" }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white text-slate-900 pb-24">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 mb-4">
            <Activity className="h-3.5 w-3.5 text-black" />
            Live System Metrics
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            System Status Panel
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 text-sm md:text-base">
            Track live cloud operational states, engine response speeds, and historical patch updates.
          </p>
        </div>
      </section>

      {/* Main Status Indicators */}
      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        
        {/* Core status summary card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm"
        >
          <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Service Status</h3>
              <p className="text-slate-400 text-xs mt-0.5">Real-time indicators across cloud networks</p>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>

          {/* Service status rows */}
          <div className="divide-y divide-slate-100 p-6">
            {systemServices.map((service, idx) => (
              <div key={idx} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <HardDrive className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-sm block">{service.name}</span>
                    <div className="flex gap-3 text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                      <span>Latency: {service.ping}</span>
                      <span className="text-slate-300">|</span>
                      <span>Uptime SLA: {service.uptime}</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded text-emerald-600 border border-slate-200 text-[10px] font-bold">
                  <Check className="h-3 w-3 text-emerald-500" />
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Historical Updates */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <RefreshCw className="h-4.5 w-4.5 text-black" />
            Recent Updates & Maintenance
          </h2>
          <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden bg-white shadow-sm">
            {historicalIncidents.map((inc, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">{inc.date}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{inc.event}</h4>
                  <p className="text-slate-500 text-xs">{inc.impact} • Complete duration: {inc.duration}</p>
                </div>
                <span className="bg-slate-50 text-slate-600 border border-slate-200 font-bold text-[10px] px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0">
                  Closed
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
