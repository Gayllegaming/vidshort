"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_24px_rgba(124,58,237,0.7)] transition-shadow duration-300">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Vid<span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Short</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
          {isSignedIn && (
            <li>
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 relative group"
              >
                Dashboard
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-white/5 text-sm"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 hover:opacity-90 hover:shadow-[0_0_24px_rgba(124,58,237,0.5)] transition-all duration-300 text-sm font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10">
                  Go to Dashboard
                </Button>
              </Link>
              <UserButton />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#111118]/95 backdrop-blur-xl border-b border-white/5`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-slate-300 hover:text-white transition-colors duration-200 text-sm py-1"
            >
              {link.label}
            </a>
          ))}
          {isSignedIn && (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="text-slate-300 hover:text-white transition-colors duration-200 text-sm py-1"
            >
              Dashboard
            </Link>
          )}
          
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            {!isSignedIn ? (
              <>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white text-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white border-0 text-sm font-semibold">
                    Get Started Free
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-slate-400">Account</span>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
