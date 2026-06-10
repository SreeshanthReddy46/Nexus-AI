"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Globe, Mail, Lock, ShieldCheck, CheckSquare, Square } from "lucide-react";

// Mock database for validation
const VALID_CREDENTIALS = {
  "admin@nexus-ai.com": "password123",
  "user@company.com": "nexus2026",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignupDefault = searchParams.get("signup") === "true";

  const [isSignup, setIsSignup] = useState(isSignupDefault);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if we should auto-redirect (already logged in and remembered)
    const auth = localStorage.getItem("nexus_auth");
    if (auth) {
        router.push("/chat");
        return;
    }
    setTimeout(() => setMounted(true), 0);
  }, [router]);

  const [isLoading, setIsLoading] = useState(false);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      // Basic validation
      if (!email || !password || (isSignup && !name)) {
        setError("Please fill in all fields.");
        setIsLoading(false);
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid work email address.");
        setIsLoading(false);
        return;
      }

      // Password length validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setIsLoading(false);
        return;
      }

      // Simulated credential check for login
      if (!isSignup) {
        const validPassword = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS];
        if (email !== "demo@nexus.com" && (!validPassword || validPassword !== password)) {
            setError("Invalid email or password. Try admin@nexus-ai.com / password123");
            setIsLoading(false);
            return;
        }
      }

      // Successful simulated auth
      const authData = JSON.stringify({ email, name: name || (email.split('@')[0]) });
      
      if (rememberMe) {
        localStorage.setItem("nexus_auth", authData);
      } else {
        sessionStorage.setItem("nexus_auth", authData);
      }

      setIsLoading(false);
      router.push("/onboarding");
    }, 800);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const authData = JSON.stringify({ email: "google.user@nexus-ai.com", name: "Sreeshanth" });
      localStorage.setItem("nexus_auth", authData);
      setIsLoading(false);
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white mb-4 shadow-xl"
          >
            <Cpu className="h-7 w-7" />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {isSignup ? "Create your Nexus workspace" : "Sign in to Nexus AI OS"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {isSignup ? "Get started with your company's AI Brain" : "Access company documents & agent workspaces"}
          </p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)]"
        >
          {error && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-6 text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-2"
            >
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-black focus:ring-0 transition-all duration-200 placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
                Work Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-black focus:ring-0 transition-all duration-200 placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-11 py-3 text-sm focus:outline-none focus:border-black focus:ring-0 transition-all duration-200 placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <button 
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-black transition-colors"
                >
                    {rememberMe ? (
                        <CheckSquare className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <Square className="h-4 w-4 text-slate-300" />
                    )}
                    Remember Me
                </button>
                {!isSignup && (
                  <button type="button" className="text-xs font-bold text-slate-400 hover:text-black transition-colors">
                    Forgot Password?
                  </button>
                )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Authenticating..." : isSignup ? "Create My Workspace" : "Sign In to Workspace"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="my-8 flex items-center justify-between">
            <span className="w-full border-t border-slate-100"></span>
            <span className="text-slate-300 text-[9px] uppercase tracking-[0.2em] px-4 font-black shrink-0">
              Identity Provider
            </span>
            <span className="w-full border-t border-slate-100"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm"
          >
            <Globe className="h-4 w-4 text-blue-500" />
            Continue with Google Workspace
          </button>
        </motion.div>

        <div className="text-center">
          {isSignup ? (
            <p className="text-sm text-slate-500 font-medium">
              Already a member?{" "}
              <button
                onClick={() => setIsSignup(false)}
                className="font-bold text-black hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-slate-500 font-medium">
              Need a new workspace?{" "}
              <button
                onClick={() => setIsSignup(true)}
                className="font-bold text-black hover:underline"
              >
                Register here
              </button>
            </p>
          )}
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-3xl text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3" />
            Demo Credentials
          </p>
          <div className="flex flex-col gap-1">
            <code className="text-[10px] text-slate-500 font-bold">admin@nexus-ai.com / password123</code>
            <code className="text-[10px] text-slate-500 font-bold">user@company.com / nexus2026</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
