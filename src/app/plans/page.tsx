"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Cpu, Zap, Sparkles, Shield, Rocket, ArrowRight, CreditCard, Activity } from "lucide-react";
import ElectricBorder from "@/components/ElectricBorder";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    description: "For individual sandbox testing",
    features: [
      "50 documents indexing",
      "100 queries/month",
      "Standard RAG Agent",
      "Community support",
      "Basic Graph Sandbox"
    ],
    icon: <Rocket className="h-6 w-6 text-slate-500" />,
    color: "bg-slate-50",
    border: "border-slate-200"
  },
  {
    id: "starter",
    name: "Starter",
    price: "₹999",
    description: "For growing small teams",
    features: [
      "1,000 documents indexing",
      "Unlimited queries",
      "Advanced RAG Agent",
      "Notion & Drive Sync",
      "Team Workspace",
      "Email support"
    ],
    icon: <Zap className="h-6 w-6 text-amber-500" />,
    color: "bg-amber-50",
    border: "border-amber-200"
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹4,999",
    description: "For advanced intelligence",
    features: [
      "10,000 documents indexing",
      "Multi-Agent Reasoning Chain",
      "Custom Knowledge Graph",
      "Expandable Trace Stack",
      "Confluence & Git Sync",
      "Priority support"
    ],
    icon: <Sparkles className="h-6 w-6 text-orange-500" />,
    color: "bg-orange-50",
    border: "border-orange-200",
    popular: true
  },
  {
    id: "business",
    name: "Business",
    price: "₹14,999+",
    description: "Full enterprise sync",
    features: [
      "Unlimited documents",
      "SSO & SAML integration",
      "Dedicated VPC Hosting",
      "Custom ML Model Fine-tuning",
      "Dedicated Account Manager",
      "24/7 Phone support"
    ],
    icon: <Shield className="h-6 w-6 text-indigo-500" />,
    color: "bg-indigo-50",
    border: "border-indigo-200"
  }
];

export default function PlanSelection() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("nexus_auth");
    if (!auth) {
      router.push("/login");
    }
    const savedPlan = localStorage.getItem("nexus_plan");
    if (savedPlan) {
      setTimeout(() => setCurrentPlan(savedPlan), 0);
    }
  }, [router]);

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) {
      router.push("/chat");
      return;
    }
    setSelectedPlan(planId);
    
    // Simulate payment/activation
    setTimeout(() => {
      localStorage.setItem("nexus_plan", planId);
      setCurrentPlan(planId);
      setSelectedPlan(null);
      // Small delay to show success
      setTimeout(() => {
        router.push("/chat");
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Billing Header */}
        <div className="mb-12 p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                    <CreditCard className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Billing & Subscription</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage your organizational intelligence plan</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">Current Plan</span>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-bold text-slate-900 capitalize">{currentPlan}</span>
                    </div>
                </div>
                <button 
                    onClick={() => router.push("/chat")}
                    className="px-6 py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    Back to Terminal
                    <ArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-bold mb-4"
          >
            <Activity className="h-4 w-4 text-emerald-500" />
            Nexus AI OS Intelligence Selection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight"
          >
            Select Your Intelligence Scale
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto"
          >
            Choose the processing power and agent depth required for your organizational memory.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -5 }}
              className="h-full flex"
            >
              <ElectricBorder
                color={plan.id === "pro" ? "#ff4500" : plan.id === "starter" ? "#f59e0b" : plan.id === "business" ? "#6366f1" : "#94a3b8"}
                speed={0.6}
                chaos={0.06}
                borderRadius={24}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div
                  className={`relative flex flex-col p-8 rounded-[24px] border h-full transition-all duration-300 ${
                    currentPlan === plan.id 
                      ? "border-transparent bg-white shadow-2xl" 
                      : `border-transparent ${plan.color}`
                  } ${selectedPlan === plan.id ? "opacity-70 scale-[0.98]" : ""}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg">
                      Recommended
                    </span>
                  )}

                  {currentPlan === plan.id && (
                    <span className="absolute -top-4 left-6 bg-emerald-500 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Check className="h-3 w-3" />
                      Active Plan
                    </span>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-white shadow-sm border ${plan.border}`}>
                      {plan.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-sm text-slate-500 mt-2 min-h-[40px] leading-relaxed">{plan.description}</p>
                  
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-1 text-sm font-medium">/month</span>
                  </div>

                  <ul className="mt-8 space-y-4 flex-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-1 h-4 w-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-emerald-600" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selectedPlan !== null}
                    className={`mt-10 w-full py-4 rounded-2xl font-bold transition-all shadow-sm ${
                      currentPlan === plan.id
                        ? "bg-slate-100 text-slate-400 cursor-default"
                        : selectedPlan === plan.id
                            ? "bg-emerald-500 text-white"
                            : "bg-black text-white hover:bg-slate-800 hover:shadow-lg active:scale-[0.98]"
                    } disabled:opacity-50`}
                  >
                    {currentPlan === plan.id 
                        ? "Current Plan" 
                        : selectedPlan === plan.id 
                            ? "Processing..." 
                            : `Switch to ${plan.name}`}
                  </button>
                </div>
              </ElectricBorder>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            All plans include end-to-end encryption and compliance with enterprise security standards.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
             <div className="flex items-center gap-1.5 grayscale opacity-50">
                <Shield className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">SOC2 Type II</span>
             </div>
             <div className="flex items-center gap-1.5 grayscale opacity-50">
                <Shield className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">GDPR Compliant</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
