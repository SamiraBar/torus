import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitReveal } from "../lib/Reveal";

const faqs = [
  {
    q: "Where does our data live?",
    a: "Inside your perimeter. Cores deploy into your cloud or on-prem hardware; weights and data never transit our infrastructure. The Sovereign tier is fully air-gapped.",
  },
  {
    q: "How do you keep autonomous systems safe?",
    a: "Every deployment carries a safety envelope: irreversible actions require human counter-signature, agents verify each other's work, and every decision is auditable to the token — replayable, inspectable, attributable.",
  },
  {
    q: "How long does deployment take?",
    a: "First agent in production in three weeks. Full operational coverage typically lands between the second and fourth month, depending on the number of systems we integrate.",
  },
  {
    q: "Does this replace our team?",
    a: "It replaces their busywork. Our longest-running customers redeployed their operations teams toward exceptions, strategy and oversight — the work that actually needed them all along.",
  },
  {
    q: "What happens if the model is uncertain?",
    a: "It abstains, and says so. Abstention is a first-class outcome in the reasoning core — uncertainty is routed to humans with full context rather than papered over with a confident guess.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">Questions</p>
          <SplitReveal as="h2" by="chars" className="display display-lg max-w-[9ch]">
            Asked, answered.
          </SplitReveal>
        </div>

        <div className="lg:col-span-7">
          {faqs.map((f, i) => (
            <div key={f.q} className="border-t border-mist/10 last:border-b">
              <button
                data-cursor
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-7 text-left"
              >
                <span className="display text-lg font-medium md:text-xl">{f.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative block h-4 w-4 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full bg-mist/60" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-mist/60" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="caption max-w-xl pb-8 !text-[0.85rem]">{f.a}</p>
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
