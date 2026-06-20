"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Cpu } from "lucide-react";
import { decryptData } from "@/utils/crypto";
import CardNav from "@/components/CardNav";
import PillNav from "@/components/PillNav";

const APP_ROUTES = ["/dashboard", "/chat", "/documents", "/graph", "/plans"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide Navbar on login page
  if (pathname.startsWith("/login")) {
    return null;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userName, setUserName] = useState("User");

  // Sync auth state from localStorage
  useEffect(() => {
    const auth = localStorage.getItem("nexus_auth");
    const onboarded = localStorage.getItem("nexus_onboarded");

    setTimeout(() => {
      if (auth) {
        setIsLoggedIn(true);
        try {
          const decrypted = decryptData(auth);
          if (decrypted) {
            const parsed = JSON.parse(decrypted);
            if (parsed.name) setUserName(parsed.name);
          }
        } catch (e) {
          console.error("Auth sync error.");
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
    router.push("/");
  };

  const isAppRoute = useMemo(() => 
    APP_ROUTES.some(route => pathname.startsWith(route)), 
    [pathname]
  );

  const logo = (
    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight group pointer-events-auto">
      <span className="flex h-8 w-8 items-center justify-center rounded bg-black text-white group-hover:scale-110 transition-transform shadow-lg">
        <Cpu className="h-5 w-5" />
      </span>
      <span className="text-slate-900">Nexus AI</span>
    </Link>
  );

  const appLogo = (
    <Link href="/" className="flex items-center justify-center font-black text-xl text-slate-900 group pointer-events-auto select-none">
      N
    </Link>
  );

  // Dynamic Navigation Items
  const items = useMemo(() => {
    if (isAppRoute) {
      return [
        {
          label: "Workspace",
          bgColor: "#0f172a",
          textColor: "#ffffff",
          links: [
            { label: "AI Chat", href: "/chat", ariaLabel: "Open AI Chat" },
            { label: "Knowledge Graph", href: "/graph", ariaLabel: "Explore Knowledge Graph" },
          ]
        },
        {
          label: "Resources",
          bgColor: "#1e293b",
          textColor: "#ffffff",
          links: [
            { label: "Documents", href: "/documents", ariaLabel: "Workspace Documents" },
            { label: "AI Agents", href: "/chat?agents=true", ariaLabel: "Configure AI Agents" },
          ]
        },
        {
          label: "Account",
          bgColor: "#334155",
          textColor: "#ffffff",
          links: [
            { label: "Billing & Plans", href: "/plans", ariaLabel: "Pricing and Billing" },
            { label: "Admin Dashboard", href: "/dashboard", ariaLabel: "Admin Control Center" },
          ]
        }
      ];
    } else {
      return [
        {
          label: "Product",
          bgColor: "#0f172a",
          textColor: "#ffffff",
          links: [
            { label: "Features", href: "/#features", ariaLabel: "Product Features" },
            { label: "How It Works", href: "/#how-it-works", ariaLabel: "How It Works" },
          ]
        },
        {
          label: "Pricing",
          bgColor: "#1e293b",
          textColor: "#ffffff",
          links: [
            { label: "Our Plans", href: "/plans", ariaLabel: "Our pricing plans" },
            { label: "F.A.Q.", href: "/#faq", ariaLabel: "Frequently Asked Questions" },
          ]
        },
        {
          label: "Company",
          bgColor: "#334155",
          textColor: "#ffffff",
          links: isLoggedIn ? [
            { label: "Open Terminal", href: isOnboarded ? "/chat" : "/onboarding", ariaLabel: "Go to terminal" },
            { label: "Control Center", href: "/dashboard", ariaLabel: "Admin Dashboard" },
          ] : [
            { label: "Sign In", href: "/login", ariaLabel: "Log in to your account" },
            { label: "Sign Up", href: "/login?signup=true", ariaLabel: "Create a new account" },
          ]
        }
      ];
    }
  }, [isAppRoute, isLoggedIn, isOnboarded]);

  const pillItems = useMemo(() => {
    return [
      { label: "AI Chat", href: "/chat", ariaLabel: "Open AI Chat" },
      { label: "Knowledge Graph", href: "/graph", ariaLabel: "Explore Knowledge Graph" },
      { label: "Documents", href: "/documents", ariaLabel: "Workspace Documents" },
      { label: "Admin Center", href: "/dashboard", ariaLabel: "Admin Control Center" },
      { label: "Plans", href: "/plans", ariaLabel: "Pricing and Billing" },
      {
        label: "Sign Out",
        href: "#logout",
        ariaLabel: "Sign Out of your session",
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          handleLogout();
        }
      }
    ];
  }, []);

  // CTA button config
  const buttonText = isLoggedIn 
    ? (isAppRoute ? "Sign Out" : "Open Terminal") 
    : "Get Started";

  const handleButtonClick = () => {
    if (isLoggedIn) {
      if (isAppRoute) {
        handleLogout();
      } else {
        router.push(isOnboarded ? "/chat" : "/onboarding");
      }
    } else {
      router.push("/login?signup=true");
    }
  };

  return (
    <header 
      className="relative w-full z-50 pointer-events-none h-24 bg-white/40 border-b border-slate-100"
    >
      {isAppRoute ? (
        <PillNav
          logo={appLogo}
          logoAlt="Nexus AI Logo"
          items={pillItems}
          activeHref={pathname}
          baseColor="#ffffff"
          pillColor="#0f172a"
          hoveredPillTextColor="#0f172a"
          pillTextColor="#ffffff"
        />
      ) : (
        <CardNav
          logo={logo}
          logoAlt="Nexus AI Logo"
          items={items}
          baseColor="#ffffff"
          menuColor="#0f172a"
          buttonBgColor="#0f172a"
          buttonTextColor="#ffffff"
          buttonText={buttonText}
          onButtonClick={handleButtonClick}
          ease="power3.out"
        />
      )}
    </header>
  );
}
