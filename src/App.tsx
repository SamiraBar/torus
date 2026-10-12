import { lazy, Suspense, useEffect } from "react";
import { useSmoothScroll } from "./lib/useSmoothScroll";
import { listenPointer } from "./lib/state";

import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Works } from "./components/Works";
import { Features } from "./components/Features";
import { Dashboard } from "./components/Dashboard";
import { Stats } from "./components/Stats";
import { Timeline } from "./components/Timeline";
import { Solutions } from "./components/Solutions";
import { Testimonials } from "./components/Testimonials";
import { Pricing } from "./components/Pricing";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";

// WebGL is the heaviest asset — split it out and let content paint first.
const Scene = lazy(() => import("./three/Scene").then((m) => ({ default: m.Scene })));

export default function App() {
  useSmoothScroll();
  useEffect(() => listenPointer(), []);

  return (
    <>
      {/* layer 0 — the continuous 3D journey */}
      <Suspense fallback={<div className="fixed inset-0 bg-ink" />}>
        <Scene />
      </Suspense>

      {/* layer 1 — atmosphere */}
      <div className="grid-lines" aria-hidden>
        <i /><i /><i /><i /><i /><i />
      </div>

      {/* layer 2 — chrome */}
      <Nav />

      {/* layer 3 — the story */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Works />
        <Features />
        <Dashboard />
        <Stats />
        <Timeline />
        <Solutions />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}
