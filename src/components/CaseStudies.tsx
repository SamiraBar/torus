import { SplitReveal, FadeUp } from "../lib/Reveal";

const cases = [
  {
    client: "Meridian Freight",
    sector: "Global logistics",
    quoteStat: "−38%",
    statLabel: "operational cost, year one",
    body: "Forty-one thousand shipping decisions a day moved from spreadsheets to the reasoning core. The operations team now supervises exceptions, not processes.",
  },
  {
    client: "Halcyon Health",
    sector: "Hospital network",
    quoteStat: "2.4h",
    statLabel: "returned to clinicians, daily",
    body: "Scheduling, coding and prior-authorisation run autonomously across 62 sites. Every irreversible action still passes through a human hand — by design.",
  },
];

export function CaseStudies() {
  return (
    <section id="cases" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-6">Field notes</p>
        <SplitReveal as="h2" by="chars" className="display display-lg max-w-[12ch]">
          Proof, in production.
        </SplitReveal>

        <div className="mt-24 space-y-10">
          {cases.map((c, i) => (
            <FadeUp key={c.client} delay={i * 0.12}>
              <article className="glass grid gap-10 p-8 md:grid-cols-12 md:p-14">
                <div className="md:col-span-4">
                  <p className="eyebrow !tracking-[0.3em]">{c.sector}</p>
                  <h3 className="display mt-4 text-3xl font-medium md:text-4xl">{c.client}</h3>
                </div>
                <div className="md:col-span-4">
                  <div className="display font-medium leading-none text-accent" style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}>
                    {c.quoteStat}
                  </div>
                  <p className="caption mt-3">{c.statLabel}</p>
                </div>
                <div className="md:col-span-4">
                  <p className="caption !max-w-none">{c.body}</p>
                  <a
                    href="#pricing"
                    className="link-line mt-8 inline-block text-[0.7rem] uppercase tracking-[0.3em] text-mist"
                  >
                    Read the study
                  </a>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
