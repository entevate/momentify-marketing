"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ROX() {
  return (
    <section id="rox" className="bg-depth-gradient-reversed py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center"
        >
          <motion.p
            variants={itemVariants}
            className="text-cyan text-xs font-semibold uppercase tracking-[0.12em]"
          >
            RETURN ON EXPERIENCE
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.025em] leading-[1.1]"
          >
            Others measure ROI.
            <br />
            We prove ROX.
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            ROI tells you what something cost. ROX tells you what it was worth.
            Momentify captures intent, engagement depth, and behavior at the
            moment it happens, so you can connect real interactions to real
            outcomes.
          </motion.p>
        </motion.div>

        {/* Case study cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Card 1 */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-8"
          >
            <p className="text-cyan text-xs font-semibold uppercase tracking-[0.12em] mb-4">
              TRADE SHOWS
            </p>
            <p className="text-white font-semibold text-lg">
              Caterpillar Electric Power Division
            </p>
            <p className="text-white/60 text-sm mt-1">DistribuTECH</p>

            <p className="text-white text-6xl sm:text-7xl font-extrabold mt-6">
              47%
            </p>
            <p className="text-white/70 text-base mt-2">
              increase in qualified leads
            </p>

            <p className="text-white/60 text-sm mt-4">
              878 sessions · 518 companies · 75 dealer assignments routed
              automatically
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-8"
          >
            <p className="text-cyan text-xs font-semibold uppercase tracking-[0.12em] mb-4">
              TECHNICAL RECRUITING
            </p>
            <p className="text-white font-semibold text-lg">
              Caterpillar Global Dealer Learning
            </p>
            <p className="text-white/60 text-sm mt-1">
              SkillsUSA / FFA Events
            </p>

            <p className="text-white text-6xl sm:text-7xl font-extrabold mt-6">
              1 Platform
            </p>
            <p className="text-white/70 text-base mt-2">
              across all recruiting events
            </p>

            <p className="text-white/60 text-sm mt-4">
              Unified recruiting across SkillsUSA, FFA, and dealer pilot events.
              One consistent experience. One comparable data set.
            </p>
          </motion.div>
        </motion.div>

        {/* ROX Dashboard placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          {/* ASSET NEEDED: ROX dashboard screenshot showing real-time engagement, lead temperature scoring (hot/warm/cold), and outcome summary. Place centered below the two cards at full width in a laptop/monitor mockup. */}
          <div className="relative w-full max-w-5xl mx-auto">
            {/* Monitor frame */}
            <div className="rounded-t-xl overflow-hidden border border-white/10">
              <div className="bg-white/5 backdrop-blur-sm px-4 py-2 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-white/20 text-xs">
                    ROX Dashboard
                  </span>
                </div>
              </div>

              <div className="bg-midnight/60 backdrop-blur p-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Total Sessions",
                      val: "878",
                      color: "text-cyan",
                    },
                    {
                      label: "Hot Leads",
                      val: "147",
                      color: "text-crimson",
                    },
                    {
                      label: "Warm Leads",
                      val: "293",
                      color: "text-amber",
                    },
                    {
                      label: "Companies",
                      val: "518",
                      color: "text-sol-teal",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-white/5 rounded-lg p-3 text-center"
                    >
                      <p className="text-white/40 text-[10px] uppercase tracking-wider">
                        {s.label}
                      </p>
                      <p className={`${s.color} text-2xl font-bold mt-1`}>
                        {s.val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Chart bars */}
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/40 text-xs mb-3">
                    Lead Temperature Distribution
                  </p>
                  <div className="space-y-2">
                    {[
                      { label: "Hot", pct: 17, color: "#F25E3D" },
                      { label: "Warm", pct: 33, color: "#F2B33D" },
                      { label: "Cold", pct: 50, color: "#1A2E73" },
                    ].map((bar) => (
                      <div key={bar.label} className="flex items-center gap-3">
                        <span className="text-white/50 text-xs w-10">
                          {bar.label}
                        </span>
                        <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${bar.pct}%`,
                              backgroundColor: bar.color,
                            }}
                          />
                        </div>
                        <span className="text-white/40 text-xs w-8 text-right">
                          {bar.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Monitor stand */}
            <div className="flex justify-center">
              <div className="w-24 h-4 bg-white/5 rounded-b-lg" />
            </div>
            <div className="flex justify-center">
              <div className="w-40 h-2 bg-white/5 rounded-b-lg" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
