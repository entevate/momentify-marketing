"use client";

import { motion } from "framer-motion";

const clients = [
  {
    name: "Caterpillar Electric Power Division",
    outcome:
      "47% more qualified leads. 75 dealer assignments automated at DistribuTECH.",
  },
  {
    name: "Caterpillar Global Dealer Learning",
    outcome:
      "Unified recruiting data across SkillsUSA, FFA, and dealer network events.",
  },
  {
    name: "Mustang Cat",
    outcome:
      "Consistent engagement capture across dealer locations and recruiting activations.",
  },
  {
    name: "Thompson Tractor",
    outcome:
      "Field-level intelligence delivered to management without manual reporting.",
  },
];

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

export default function SocialProof() {
  return (
    <section className="bg-light-bg py-24 sm:py-32">
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
            className="text-deep-navy text-xs font-semibold uppercase tracking-[0.12em]"
          >
            TRUSTED BY
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-deep-navy tracking-[-0.025em]"
          >
            Real teams. Real results.
          </motion.h2>
        </motion.div>

        {/* Client grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={itemVariants}
              className="text-center group"
            >
              {/* ASSET NEEDED: Client logos at appropriate resolution for web. Use styled text placeholders in Deep Navy until available. */}
              <div className="h-16 flex items-center justify-center mb-4">
                <span className="text-deep-navy/40 group-hover:text-deep-navy font-bold text-sm tracking-wide uppercase transition-colors duration-300">
                  {client.name}
                </span>
              </div>
              <p className="text-deep-navy/70 text-sm leading-relaxed">
                {client.outcome}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA block */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mt-24 text-center"
          id="demo"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-deep-navy tracking-[-0.025em]"
          >
            What you do not measure is what you lose.
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className="mt-4 text-deep-navy/70 text-base sm:text-lg max-w-xl mx-auto"
          >
            Most teams walk away from events with a spreadsheet. You will walk
            away with intelligence.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8">
            <a
              href="#demo"
              className="inline-block bg-action-gradient text-midnight font-semibold py-4 px-10 rounded-full text-base hover:opacity-90 transition-opacity"
            >
              Schedule a Demo
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
