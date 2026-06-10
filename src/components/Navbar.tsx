"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { 
  Cpu, 
  Menu, 
  X, 
  LogOut, 
  MessageSquare, 
  FileText, 
  Share2, 
  CreditCard, 
  Home, 
  Sparkles,
  ChevronRight
} from "lucide-react";

const APP_ROUTES = ["/dashboard", "/chat", "/documents", "/graph", "/plans"];

const NAV_LINKS = [
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/graph", label: "Graph", icon: Share2 },
  { href: "/documents", label: "Docs", icon: FileText },
  { href: "/chat?agents=true", label: "Agents", icon: Sparkles, iconColor: "text-blue-500" },
  { href: "/plans", label: "Billing", icon: CreditCard, iconColor: "text-orange-500" },
];

const LANDING_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userName, setUserName] = useState("User");

  // Sync auth state from localStorage
  useEffect(() => {
    const auth = localStorage.getItem("nexus_auth");
    const onboarded = localStorage.getItem("nexus_onboarded");

    // Use setTimeout to avoid 'cascading renders' lint warning during synchronous effect execution
    setTimeout(() => {
      if (auth) {
        setIsLoggedIn(true);
        try {
          const parsed = JSON.parse(auth);
          if (parsed.name) setUserName(parsed.name);
        } catch (e) {
          console.error("Auth sync error", e);
        }
      } else {
        setIsLoggedIn(false);
      }

      setIsOnboarded(onboarded === "true");
    }, 0);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("nexus_auth");
    setIsLoggedIn(false);
    setIsOpen(false);
    router.push("/");
  };

  const isAppRoute = useMemo(() => 
    APP_ROUTES.some(route => pathname.startsWith(route)), 
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight group">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-black text-white group-hover:scale-110 transition-transform shadow-lg">
                <Cpu className="h-5 w-5" />
              </span>
              <span>Nexus AI</span>
            </Link>

            {isAppRoute && (
              <div className="hidden sm:flex items-center gap-4">
                <div className="h-6 w-px bg-slate-200" />
                <Link href="/" className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 hover:text-black transition-colors uppercase tracking-[0.2em]">
                  <Home className="h-3.5 w-3.5" />
                  Website
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {!isAppRoute ? (
              <div className="flex items-center gap-8">
                {LANDING_LINKS.map(link => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="text-sm font-bold text-slate-500 hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
                      pathname === link.href 
                        ? "bg-white text-black shadow-sm ring-1 ring-slate-200/50" 
                        : "text-slate-500 hover:text-black hover:bg-white/50"
                    }`}
                  >
                    <link.icon className={`h-3.5 w-3.5 ${link.iconColor || ""}`} />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 p-1 pr-4 rounded-full bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-md transition-all group"
                >
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-900 leading-none">{userName}</span>
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Profile</span>
                  </div>
                </Link>

                {!isAppRoute && (
                  <Link href={isOnboarded ? "/chat" : "/onboarding"} className="premium-btn py-2.5 px-6 text-[11px] font-bold shadow-sm">
                    Open Terminal
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-black transition-colors">
                  Sign In
                </Link>
                <Link href="/login?signup=true" className="premium-btn py-2.5 px-8 text-sm font-bold shadow-sm active:scale-95">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-black transition-colors border border-slate-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-300">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4" />
              Website Home
            </div>
            <ChevronRight className="h-4 w-4 opacity-30" />
          </Link>

          {!isAppRoute ? (
            <div className="space-y-1 py-2">
              {LANDING_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-30" />
                </a>
              ))}
              
              <div className="border-t border-slate-100 mt-4 pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={isOnboarded ? "/chat" : "/onboarding"}
                      onClick={() => setIsOpen(false)}
                      className="block text-center rounded-xl py-4 text-sm font-extrabold text-white bg-black shadow-lg"
                    >
                      Open Terminal
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-red-500 bg-red-50/50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block text-center rounded-xl py-3 text-sm font-bold text-slate-600 border border-slate-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/login?signup=true"
                      onClick={() => setIsOpen(false)}
                      className="block text-center premium-btn w-full py-4 text-sm font-extrabold shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    pathname === link.href 
                      ? "bg-black text-white shadow-xl" 
                      : "text-slate-600 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className={`h-4 w-4 ${pathname === link.href ? "text-white" : (link.iconColor || "text-slate-400")}`} />
                    {link.label}
                  </div>
                  <ChevronRight className={`h-4 w-4 ${pathname === link.href ? "opacity-100" : "opacity-30"}`} />
                </Link>
              ))}

              <div className="border-t border-slate-100 mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-red-500 bg-red-50/50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
