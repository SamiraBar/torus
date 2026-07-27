import { SplitReveal, FadeUp } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";

const tiers = [
  {
    name: "Studio",
    price: "2,400",
    cadence: "/mo",
    tagline: "For teams proving the thesis",
    points: ["3 autonomous agents", "One domain core", "Shared reasoning capacity", "Business-hours humans"],
    featured: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    tagline: "For companies that run on us",
    points: ["Unbounded agent fleets", "Private frontier core", "Dedicated capacity, on-prem option", "24/7 mission team", "Token-level audit trail"],
    featured: true,
  },
  {
    name: "Sovereign",
    price: "Let's talk",
    cadence: "",
    tagline: "For institutions and states",
    points: ["Air-gapped deployment", "Sovereign weights & data", "Custom safety envelope", "Named research liaison"],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Access</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[13ch]">
          Priced like infrastructure.
        </SplitReveal>

        <div className="mt-24 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.12} className="h-full">
              <div
                className={`glass flex h-full flex-col p-9 transition-transform duration-500 hover:-translate-y-2 ${
                  t.featured ? "outline outline-1 outline-accent/40" : ""
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="display text-xl font-medium">{t.name}</h3>
                  {t.featured && (
                    <span className="text-[0.55rem] uppercase tracking-[0.3em] text-accent">Most deployed</span>
                  )}
                </div>
                <p className="caption mt-2">{t.tagline}</p>

                <div className="display mt-10 text-5xl font-medium">
                  {t.price !== "Custom" && t.price !== "Let's talk" && (
                    <span className="mr-1 align-top text-xl text-fog">$</span>
                  )}
                  {t.price}
                  <span className="text-base text-fog">{t.cadence}</span>
                </div>

                <ul className="mt-10 flex-1 space-y-4">
                  {t.points.map((p) => (
                    <li key={p} className="caption flex !max-w-none items-center gap-3">
                      <span className={`h-px w-4 ${t.featured ? "bg-accent" : "bg-mist/30"}`} />
                      {p}
                    </li>
                  ))}
                </ul>

                <Magnetic strength={0.25} className="mt-12">
                  <a
                    href="#faq"
                    data-cursor
                    className={`block rounded-full border py-3.5 text-center text-[0.68rem] font-medium uppercase tracking-[0.28em] transition-colors duration-400 ${
                      t.featured
                        ? "border-accent/60 text-mist hover:bg-accent/10"
                        : "border-mist/20 text-fog hover:border-mist/50 hover:text-mist"
                    }`}
                  >
                    Begin the conversation
                  </a>
                </Magnetic>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
