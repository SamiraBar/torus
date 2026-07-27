import { useRef, type ReactNode } from "react";
import gsap from "gsap";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/** Wraps children in a magnetic field: the element leans toward the cursor
 *  and snaps back with soft elastic inertia on leave. */
export function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.35)",
    });
  };

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
