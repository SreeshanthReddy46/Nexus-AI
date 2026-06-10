"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";


export default function InteractiveBackground() {
  const pathname = usePathname();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
      setIsHovered(true);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Ensure background animations only render on allowed public pages
  if (pathname !== "/" && pathname !== "/login" && pathname !== "/onboarding") {
    return null;
  }

  // Render ambient background for login and onboarding
  if (pathname === "/login" || pathname === "/onboarding") {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white">
        {/* Slow breathing background blur blobs */}
        <div
          className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-orange-50/50 blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute -bottom-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-slate-100/60 blur-[120px] animate-pulse"
          style={{ animationDuration: "15s" }}
        />
        {/* Subtle interactive hover highlight */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            backgroundImage: `radial-gradient(
              circle 280px at ${coords.x}px ${coords.y}px,
              rgba(249, 115, 22, 0.045),
              transparent 85%
            )`
          }}
        />
      </div>
    );
  }

  // Fade out stripes completely as we scroll past the Hero section (above 450px scroll height)
  const opacityMultiplier = Math.max(0, 1 - scrollY / 450);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        opacity: isHovered ? opacityMultiplier : 0,
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          rgba(249, 115, 22, 0.55) 0px,
          rgba(249, 115, 22, 0.55) 60px,
          rgba(15, 23, 42, 0.15) 60px,
          rgba(15, 23, 42, 0.15) 70px,
          transparent 70px,
          transparent 85px
        )`,
        maskImage: `radial-gradient(
          circle 350px at ${coords.x}px ${coords.y}px,
          rgba(0, 0, 0, 1) 10%,
          rgba(0, 0, 0, 0.1) 70%,
          transparent 100%
        )`,
        WebkitMaskImage: `radial-gradient(
          circle 350px at ${coords.x}px ${coords.y}px,
          rgba(0, 0, 0, 1) 10%,
          rgba(0, 0, 0, 0.1) 70%,
          transparent 100%
        )`,
      }}
    />
  );
}

