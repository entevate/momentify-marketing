"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Different tool at every event",
    body: "Your team uses five platforms across your annual event calendar. No unified view. No comparable data. Just disconnected spreadsheets after every show.",
  },
  {
    title: "You know who showed up. Not who showed interest.",
    body: "Badge scans tell you someone stopped by. They do not tell you what they cared about, how long they stayed, or whether they are worth a follow-up call.",
  },
  {
    title: "Events cost real money. Proof is guesswork.",
    body: "You invested in the booth, the team, the travel. Leadership wants ROI. You have a lead count and a gut feeling.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Problem() {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40">
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
            The Problem
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="mt-5 text-[clamp(28px,4vw,44px)] font-light text-charcoal tracking-[-0.02em] leading-[1.15]"
          >
            You are doing the work.
            <br />
            You just cannot see the return.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {cards.map((card, i) => (
            <motion.div key={card.title} variants={itemVariants} className="group">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-light-blue flex items-center justify-center text-[13px] font-medium text-deep-blue">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-charcoal font-medium text-[17px] leading-snug mb-3">
                {card.title}
              </h3>
              <p className="text-gray-body text-[15px] leading-[1.7]">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-charcoal/40 italic text-[15px]"
        >
          The problem is not effort. It is visibility.
        </motion.p>
      </div>
    </section>
  );
}
