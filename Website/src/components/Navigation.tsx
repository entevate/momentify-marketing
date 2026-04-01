"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const solutions = [
  { name: "Trade Shows & Exhibits", color: "#6B21D4", href: "/solutions/trade-shows", description: "Turn booth traffic into qualified, scored leads" },
  { name: "Technical Recruiting", color: "#5FD9C2", href: "/solutions/technical-recruiting", description: "Capture top talent and measure hiring events" },
  { name: "Field Sales Enablement", color: "#F2B33D", href: "/solutions/field-sales", description: "Equip reps with smart content at the job site" },
  { name: "Facilities", color: "#3A2073", href: "/solutions/facilities", description: "Measure engagement across tours and centers" },
  { name: "Venues & Events", color: "#F25E3D", href: "/solutions/venues", description: "Attribute sponsor value to real guest outcomes" },
];

const platformLinks = [
  { name: "How It Works", href: "/platform/how-it-works", description: "The four-step Momentify workflow", isRoute: true, icon: "workflow" as const },
  { name: "Integrations", href: "/platform/integrations", description: "Connect with your existing tools", isRoute: true, icon: "integrations" as const },
  { name: "Security", href: "/platform/security", description: "Enterprise-grade data protection", isRoute: true, icon: "security" as const },
  { name: "Help Center", href: "https://intercom.help/momentifyapp/en/", description: "Guides, FAQs, and support resources", isRoute: false, icon: "help" as const },
  { name: "System Status", href: "https://status.momentifyapp.com/", description: "Real-time platform availability", isRoute: false, icon: "status" as const },
  { name: "Social Toolkit", href: "/social-toolkit", description: "Create branded social graphics", isRoute: true, icon: "toolkit" as const },
];

const ICON_COLOR = "rgba(6,19,65,0.45)";

/** Web app sign-in */
const APP_LOGIN_URL = "https://web.momentifyapp.com/";

const platformIcons: Record<string, React.ReactNode> = {
  workflow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h4M2 8h4M2 12h4M10 4h4M10 8h4M10 12h4M6 4l4 4M6 12l4-4" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  integrations: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2v2.5a1.5 1.5 0 003 0V2M2 6h2.5a1.5 1.5 0 000 3H2M14 6h-2.5a1.5 1.5 0 000 3H14M6 14v-2.5a1.5 1.5 0 013 0V14" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  security: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5L3 4v3.5c0 3.5 2.1 5.8 5 6.5 2.9-.7 5-3 5-6.5V4L8 1.5z" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 8l1.5 1.5L10 7" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  help: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke={ICON_COLOR} strokeWidth="1.3" />
      <path d="M6.5 6.5a1.5 1.5 0 012.8.8c0 1-1.3 1.2-1.3 2.2M8 12h.01" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  status: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8h3l1.5-4 3 8L10 6l1.5 2H15" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  toolkit: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="10" rx="1.5" stroke={ICON_COLOR} strokeWidth="1.3" />
      <path d="M2 5h12M5 5v7M11 5v7" stroke={ICON_COLOR} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
};

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
                          <div className="mt-0.5 flex-shrink-0">{platformIcons[link.icon]}</div>
                          <div>
                            <div className="text-charcoal text-[13px] font-medium">{link.name}</div>
                            <div className="text-charcoal/40 text-[11px] mt-0.5 leading-snug">{link.description}</div>
                          </div>
                        </Link>
                      ) : (
                        <a key={link.name} href={link.href} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-start gap-3 rounded-lg p-3 hover:bg-light-bg transition-colors">
                          <div className="mt-0.5 flex-shrink-0">{platformIcons[link.icon]}</div>
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
            <a href="/what-is-rox" className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>What is ROX?</a>
            <a href="/case-studies" className={`text-[13px] font-medium transition-colors duration-300 leading-none ${linkColor}`}>Case Studies</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={APP_LOGIN_URL}
              className={`text-[13px] font-medium px-5 py-2 rounded-md transition-all duration-300 bg-white text-charcoal hover:bg-white/95 ${
                scrolled ? "border border-charcoal/12 shadow-sm" : "border border-white/30"
              }`}
            >
              Log in
            </a>
            <a
              href="/demo"
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
                      <div className="flex-shrink-0">{platformIcons[link.icon]}</div>
                      {link.name}
                    </Link>
                  ) : (
                    <a key={link.name} href={link.href} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-3 py-2 text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>
                      <div className="flex-shrink-0">{platformIcons[link.icon]}</div>
                      {link.name}
                    </a>
                  )
                )}
              </div>
              <div className="border-t border-black/[0.06] pt-4 space-y-3">
                <a href="/what-is-rox" className="block text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>What is ROX?</a>
                <a href="/case-studies" className="block text-charcoal/70 text-sm" onClick={() => setMobileOpen(false)}>Case Studies</a>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={APP_LOGIN_URL}
                  className="block text-center bg-white text-charcoal text-sm font-medium px-6 py-3 rounded-md border border-charcoal/12"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </a>
                <a href="/demo" className="block text-center bg-charcoal text-white text-sm font-medium px-6 py-3 rounded-md">
                  Schedule a Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
