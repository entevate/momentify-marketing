"use client";

import { motion } from "framer-motion";

const solutions = [
  {
    name: "Trade Shows & Exhibits",
    color: "#6B21D4",
    description: "From branded space to outcome-driven experience. Capture who engaged and what they cared about, in real time.",
  },
  {
    name: "Technical Recruiting",
    color: "#5FD9C2",
    description: "Give your team the tools to capture, engage, and follow up with top technical talent. No clipboards. No spreadsheets.",
  },
  {
    name: "Field Sales Enablement",
    color: "#F2B33D",
    description: "Smart content delivery and real-time capture at the job site, facility, or customer's shop floor.",
  },
  {
    name: "Facilities",
    color: "#3A2073",
    description: "From showroom displays to training centers. Deliver brand-aligned content, capture intent, and understand what works.",
  },
  {
    name: "Events & Venues",
    color: "#F25E3D",
    description: "Go beyond ticket sales with interactive branded experiences designed to capture, engage, and measure ROX.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Platform() {
  return (
    <section id="platform" className="bg-light-bg py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="max-w-2xl"
        >
          <motion.p
            variants={itemVariants}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal"
          >
            One Platform
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="mt-5 text-[clamp(28px,4vw,44px)] font-light text-charcoal tracking-[-0.02em] leading-[1.15]"
          >
            Every moment. Measurable results.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-5 text-gray-body text-[16px] leading-[1.75] max-w-lg"
          >
            Momentify works across every context where engagement happens and
            measurement has been impossible. One platform. Five solutions. No
            fragmentation.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {solutions.map((sol) => (
            <motion.div
              key={sol.name}
              variants={itemVariants}
              className="group bg-white rounded-xl border border-black/[0.06] hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              {/* Color bar */}
              <div className="h-[3px]" style={{ backgroundColor: sol.color }} />

              <div className="p-6 lg:p-7">
                <h3 className="text-charcoal font-medium text-[16px] mb-2.5">
                  {sol.name}
                </h3>
                <p className="text-gray-body text-[14px] leading-[1.7] mb-5">
                  {sol.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-all group-hover:gap-2.5"
                  style={{ color: sol.color }}
                >
                  Learn more
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
