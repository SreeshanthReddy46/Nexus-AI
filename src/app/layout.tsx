import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import InteractiveBackground from "@/components/InteractiveBackground";
import CommandPalette from "@/components/CommandPalette";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus AI OS - The Enterprise AI Employee Brain",
  description: "Connect company documents, projects, teams, and infrastructure to build an omniscient AI employee that answers questions instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans relative" suppressHydrationWarning>
        <InteractiveBackground />
        <Navbar />
        <CommandPalette />
        <main className="flex flex-col flex-1 w-full bg-transparent relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
