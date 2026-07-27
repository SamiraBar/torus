import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX - 3);
      dotY(e.clientY - 3);
      ringX(e.clientX);
      ringY(e.clientY);

      const interactive = (e.target as HTMLElement).closest(
        "a, button, [data-cursor]"
      );
      ring.current?.classList.toggle("is-active", !!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring -translate-x-1/2 -translate-y-1/2" />
    </>
  );
}
