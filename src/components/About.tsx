import { SplitReveal, FadeUp } from "../lib/Reveal";

export function About() {
  return (
    <section id="about" className="relative flex min-h-screen items-center px-6 py-40 md:px-12">
      <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-12">
        <div className="lg:col-span-2">
          <FadeUp>
            <p className="eyebrow">The idea</p>
          </FadeUp>
        </div>

        <div className="lg:col-span-10">
          {/* manifesto — words brighten as you scroll through them, like a
              voiceover being spoken */}
          <SplitReveal
            as="p"
            by="words"
            scrub
            stagger={0.06}
            className="display display-md max-w-[26ch] !leading-[1.25]"
          >
            Software used to wait for instructions. Ours doesn't. Auralis
            builds systems that observe, reason and act — dissolving the
            distance between a decision and its execution.
          </SplitReveal>

          <div className="mt-20 grid gap-10 md:grid-cols-3">
            {[
              ["Observe", "Continuous perception across every process, ledger and pipeline you run."],
              ["Reason", "A private frontier model tuned to your domain, auditable to the token."],
              ["Act", "Autonomous execution with human-grade judgement and machine-grade patience."],
            ].map(([title, body], i) => (
              <FadeUp key={title} delay={i * 0.12}>
                <div className="border-t border-mist/10 pt-6">
                  <h3 className="display text-xl font-medium">{title}</h3>
                  <p className="caption mt-3">{body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
