"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const DEEP_NAVY = "#061341";
const TEAL = "#00BBA5";
const mainMinimal = "linear-gradient(135deg, #7C316D 0%, #0B0B3C 55%, #1A2E73 100%)";

const MainMinimalOverlay = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 600 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMaxYMax slice"
    aria-hidden="true"
  >
    <path d="M600 500 L600 180 L420 0 L220 0 L440 220 L440 500 Z" fill="white" fillOpacity="0.05" />
    <path d="M600 500 L600 300 L380 80 L180 80 L380 280 L380 500 Z" fill="white" fillOpacity="0.04" />
  </svg>
);

const teamMembers = [
  {
    name: "Jake Hamann",
    title: "Founder & CEO",
    location: "Dallas",
    photo: "/about/jake.png",
  },
  {
    name: "Harsh Shah",
    title: "Co-Founder & COO",
    location: "New York City",
    photo: "/about/harsh.jpg",
  },
  {
    name: "Grant Lonie",
    title: "Dir. of Engineering",
    location: "Edmonton",
    photo: "/about/grant.jpg",
  },
  {
    name: "Hanah Zachariah",
    title: "Front-End Developer",
    location: "Dallas",
    photo: "/about/hanah.jpg",
  },
  {
    name: "Sam Thibault",
    title: "Designer",
    location: "Colorado Springs",
    photo: "/about/sam.jpeg",
  },
  {
    name: "Steven Shaffer",
    title: "Industry Advisor",
    location: "Dallas",
    photo: "/about/steven.jpeg",
  },
];

export default function AboutContent() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{
            backgroundSize: "200% 200%",
            animation: "bgShift 16s ease-in-out infinite",
            backgroundImage: mainMinimal,
            minHeight: "440px",
          }}
        >
          <MainMinimalOverlay />
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[120px]" style={{ background: "radial-gradient(circle, #3A2073, transparent 70%)", top: "10%", left: "55%", animation: "ambientFloat1 12s ease-in-out infinite" }} />
            <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]" style={{ background: "radial-gradient(circle, #00BBA5, transparent 70%)", bottom: "0%", left: "10%", animation: "ambientFloat2 15s ease-in-out infinite" }} />
            <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] blur-[80px]" style={{ background: "radial-gradient(circle, #1A56DB, transparent 70%)", top: "40%", right: "5%", animation: "ambientFloat3 18s ease-in-out infinite" }} />
          </div>
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 flex items-center" style={{ minHeight: "440px" }}>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 600, fontSize: "11px", color: TEAL, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: "16px" }}
              >
                About Momentify
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="leading-[1.05]"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(34px, 5vw, 52px)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "24px" }}
              >
                Meet The Team
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255, 255, 255, 0.55)", lineHeight: 1.5, maxWidth: "680px" }}
              >
                With 70+ years of combined experience working with Fortune 100 companies across various industries and verticals, we know how to navigate complexity and drive real results.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section style={{ padding: "80px 0" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-5">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div
                    className="aspect-square overflow-hidden rounded-lg"
                    style={{ marginBottom: "16px" }}
                  >
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "18px", color: DEEP_NAVY, marginBottom: "4px" }}>
                    {member.name}
                  </h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "14px", color: "rgba(6,19,65,0.55)", marginBottom: "6px" }}>
                    {member.title}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill={TEAL} fillOpacity="0.8" />
                      <circle cx="12" cy="10" r="3" fill="white" />
                    </svg>
                    <span style={{ fontFamily: "var(--font-inter)", fontWeight: 400, fontSize: "13px", color: "rgba(6,19,65,0.45)" }}>
                      {member.location}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule a Demo CTA */}
        <section style={{ padding: "0 0 80px" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(135deg, #0B0B3C 0%, #1A2E73 100%)",
                borderRadius: "20px",
                padding: "56px 48px",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: "clamp(24px, 3.5vw, 36px)", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "16px" }}>
                Ready to see Momentify in action?
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontWeight: 300, fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 32px" }}>
                Schedule a personalized demo and learn how ROX scoring can transform your in-person interactions into measurable outcomes.
              </p>
              <a
                href="/demo?source=about"
                className="inline-flex items-center justify-center text-[14px] py-3.5 px-8 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 600,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #00BBA5, #1A56DB)",
                  borderRadius: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                Schedule a Demo
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
