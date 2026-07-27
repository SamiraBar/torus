import { useEffect, useState } from "react";

const sections = [
  { id: "top", label: "01" },
  { id: "about", label: "02" },
  { id: "features", label: "03" },
  { id: "dashboard", label: "04" },
  { id: "solutions", label: "05" },
  { id: "pricing", label: "06" },
];

/** The reference's left-hand progress rail — tiny ticks, one lit accent. */
export function ProgressRail() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-5 lg:flex">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={`Go to section ${s.label}`}
          className="group flex items-center gap-3"
        >
          <span
            className={`block h-px transition-all duration-700 ease-out ${
              active === s.id ? "w-7 bg-accent" : "w-3 bg-mist/25 group-hover:bg-mist/60"
            }`}
          />
          <span
            className={`text-[0.6rem] tracking-[0.2em] transition-all duration-500 ${
              active === s.id ? "text-mist opacity-100" : "opacity-0 group-hover:opacity-60"
            }`}
          >
            {s.label}
          </span>
        </a>
      ))}
    </div>
  );
}
