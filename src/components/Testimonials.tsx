import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  {
    text: "It's the first system we've deployed that we describe in the language of colleagues, not tools.",
    name: "Elena Vasquez",
    role: "COO, Meridian Freight",
  },
  {
    text: "Auralis didn't automate our process. It made the process unnecessary.",
    name: "Tomas Lindqvist",
    role: "CIO, Halcyon Health",
  },
  {
    text: "The remarkable thing is what you stop noticing. Decisions simply arrive, already made well.",
    name: "Priya Raman",
    role: "VP Operations, Northwind Retail",
  },
];

const HOLD = 6000;

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % quotes.length), HOLD);
    return () => clearInterval(t);
  }, []);

  const q = quotes[i];

  return (
    <section className="relative flex min-h-[80vh] items-center px-6 py-40 md:px-12">
      <div className="mx-auto w-full max-w-5xl text-center">
        <p className="eyebrow mb-14">What they say</p>

        <div className="relative min-h-[16rem] md:min-h-[14rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="display display-md mx-auto max-w-[24ch] !leading-[1.2]">
                “{q.text}”
              </blockquote>
              <figcaption className="mt-10">
                <div className="text-sm font-medium">{q.name}</div>
                <div className="caption mx-auto mt-1">{q.role}</div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* progress hairlines */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Quote ${idx + 1}`}
              className="relative h-6 w-10"
              data-cursor
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-mist/20" />
              {idx === i && (
                <motion.span
                  key={`fill-${i}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: HOLD / 1000, ease: "linear" }}
                  className="absolute inset-x-0 top-1/2 h-px origin-left bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
