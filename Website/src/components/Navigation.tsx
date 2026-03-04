"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const solutions = [
  { name: "Trade Shows & Exhibits", color: "#6B21D4", href: "/solutions/trade-shows", description: "Outcome-driven booth experiences" },
  { name: "Technical Recruiting", color: "#5FD9C2", href: "#", description: "Capture and engage top talent" },
  { name: "Field Sales Enablement", color: "#F2B33D", href: "#", description: "Smart content at the job site" },
  { name: "Facilities", color: "#3A2073", href: "#", description: "Showrooms, training centers, and more" },
  { name: "Events & Venues", color: "#F25E3D", href: "#", description: "Interactive branded experiences" },
];

const platformLinks = [
  { name: "How It Works", href: "/platform/how-it-works", description: "The three-step Momentify workflow", color: "#0CF4DF", isRoute: true },
  { name: "Integrations", href: "/platform/integrations", description: "Connect with your existing tools", color: "#5BA8F5", isRoute: true },
  { name: "Security", href: "#", description: "Enterprise-grade data protection", color: "#F2B33D", isRoute: false },
  { name: "Help Center", href: "/platform/help-center", description: "Guides, FAQs, and support resources", color: "#00BBA5", isRoute: true },
  { name: "System Status", href: "/platform/system-status", description: "Real-time platform availability", color: "#5FD9C2", isRoute: true },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Colors flip when scrolled: transparent+white text → white bg+dark text
  const linkColor = scrolled ? "text-charcoal/50 hover:text-charcoal" : "text-white/60 hover:text-white";
  const hamburgerColor = scrolled ? "text-charcoal" : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img
              src={scrolled ? "/Momentify-Logo.svg" : "/Momentify-Logo_Reverse.svg"}
              alt="Momentify"
              className="h-6 w-auto transition-opacity duration-300"
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-baseline gap-8">
            <div className="relative" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <button className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>Solutions</button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[480px] rounded-xl bg-white border border-black/[0.06] p-4 shadow-xl shadow-black/[0.04]"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      {solutions.map((sol) => (
                        <a key={sol.name} href={sol.href} className="flex items-start gap-3 rounded-lg p-3 hover:bg-light-bg transition-colors">
                          <div className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: sol.color }} />
                          <div>
                            <div className="text-charcoal text-[13px] font-medium">{sol.name}</div>
                            <div className="text-charcoal/40 text-[11px] mt-0.5 leading-snug">{sol.description}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative" onMouseEnter={() => setPlatformOpen(true)} onMouseLeave={() => setPlatformOpen(false)}>
              <button className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>Platform</button>
              <AnimatePresence>
                {platformOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[300px] rounded-xl bg-white border border-black/[0.06] p-3 shadow-xl shadow-black/[0.04]"
                  >
                    {platformLinks.map((link) =>
                      link.isRoute ? (
                        <Link key={link.name} href={link.href} className="flex items-start gap-3 rounded-lg p-3 hover:bg-light-bg transition-colors">
                          <div className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: link.color }} />
                          <div>
                            <div className="text-charcoal text-[13px] font-medium">{link.name}</div>
                            <div className="text-charcoal/40 text-[11px] mt-0.5 leading-snug">{link.description}</div>
                          </div>
                        </Link>
                      ) : (
                        <a key={link.name} href={link.href} className="flex items-start gap-3 rounded-lg p-3 hover:bg-light-bg transition-colors">
                          <div className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: link.color }} />
                          <div>
                            <div className="text-charcoal text-[13px] font-medium">{link.name}</div>
                            <div className="text-charcoal/40 text-[11px] mt-0.5 leading-snug">{link.description}</div>
                          </div>
                        </a>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a href="#rox" className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>What is ROX?</a>
            <a href="#rox" className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>Case Studies</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href="#demo"
              className={`text-[13px] font-medium px-5 py-2 rounded-md transition-all duration-300 ${
                scrolled
                  ? "bg-charcoal text-white hover:bg-charcoal/85"
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              Schedule a Demo
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className={`md:hidden p-2 transition-colors duration-300 ${hamburgerColor}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/[0.06]"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-1">
                <p className="text-charcoal/30 text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Solutions</p>
                {solutions.map((sol) => (
                  <a key={sol.name} href={sol.href} className="flex items-center gap-3 py-2 text-charcoal/70 text-sm">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: sol.color }} />
                    {sol.name}
                  </a>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-charcoal/30 text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Platform</p>
                {platformLinks.map((link) =>
                  link.isRoute ? (
                    <Link key={link.name} href={link.href} className="flex items-center gap-3 py-2 text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: link.color }} />
                      {link.name}
                    </Link>
                  ) : (
                    <a key={link.name} href={link.href} className="flex items-center gap-3 py-2 text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: link.color }} />
                      {link.name}
                    </a>
                  )
                )}
              </div>
              <div className="border-t border-black/[0.06] pt-4 space-y-3">
                <a href="#rox" className="block text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>What is ROX?</a>
                <a href="#rox" className="block text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>Case Studies</a>
              </div>
              <a href="#demo" className="block text-center bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-md">
                Schedule a Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
