import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitReveal } from "../lib/Reveal";

const rows = [
  { title: "Finance", body: "Reconciliation, risk and reporting that close themselves. Auditable to the token." },
  { title: "Healthcare", body: "Clinical operations orchestrated end-to-end, with a human hand on every irreversible act." },
  { title: "Manufacturing", body: "Lines that predict their own failures and negotiate their own maintenance windows." },
  { title: "Retail", body: "Demand sensed at the shelf, priced at the edge, replenished before the gap appears." },
  { title: "Logistics", body: "Every container, lane and customs form reasoned about, continuously, in one model." },
];

/** Awwwards-style index rows: oversized outlined titles that fill on hover
 *  and unfold a one-line thesis. */
export function Solutions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="solutions" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Solutions</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[14ch]">
          Made for gravity-bound industries.
        </SplitReveal>

        <div className="mt-24">
          {rows.map((r, i) => (
            <div
              key={r.title}
              data-cursor
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen(null)}
              onClick={() => setOpen(open === i ? null : i)}
              className="group border-t border-mist/10 last:border-b"
            >
              <div className="flex items-baseline justify-between py-8 md:py-10">
                <h3
                  className={`display text-5xl font-medium transition-all duration-500 md:text-7xl ${
                    open === i ? "translate-x-4 text-mist" : "text-stroke"
                  }`}
                >
                  {r.title}
                </h3>
                <span className="text-[0.65rem] tracking-[0.3em] text-fog">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="caption max-w-xl pb-10 pl-1 md:pl-5">{r.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
