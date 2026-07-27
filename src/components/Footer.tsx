import { SplitReveal } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";

export function Footer() {
  return (
    <footer className="relative flex min-h-screen flex-col justify-between px-6 pt-48 md:px-12">
      <div className="mx-auto w-full max-w-6xl text-center">
        <p className="eyebrow mb-10">Final transmission</p>
        <SplitReveal as="h2" by="chars" stagger={0.03} className="display display-xl">
          Think slower.
        </SplitReveal>
        <SplitReveal as="h2" by="chars" stagger={0.03} delay={0.2} className="display display-xl text-stroke">
          Ship faster.
        </SplitReveal>

        <div className="mt-16 flex justify-center">
          <Magnetic strength={0.4}>
            <a
              href="mailto:hello@auralis.systems"
              data-cursor
              className="glass inline-block rounded-full px-12 py-5 text-[0.75rem] font-medium uppercase tracking-[0.3em] transition-colors duration-300 hover:text-accent"
            >
              hello@auralis.systems
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="mx-auto mt-40 w-full max-w-6xl border-t border-mist/10 py-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <span className="display text-sm tracking-[0.28em] font-semibold">AURALIS</span>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {["Platform", "Solutions", "Cases", "Careers", "Research", "X", "LinkedIn"].map((l) => (
              <a
                key={l}
                href="#top"
                className="link-line text-[0.65rem] uppercase tracking-[0.25em] text-fog hover:text-mist"
              >
                {l}
              </a>
            ))}
          </nav>

          <span className="text-[0.65rem] tracking-[0.2em] text-fog/70">
            © 2026 Auralis Systems — deployed at the speed of thought
          </span>
        </div>
      </div>
    </footer>
  );
}
