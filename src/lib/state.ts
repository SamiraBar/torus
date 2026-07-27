// Shared mutable state read every frame by the WebGL scene.
// Kept outside React to avoid re-renders on scroll/mouse.

export const scrollState = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** lenis velocity, px/frame */
  velocity: 0,
};

export const pointerState = {
  /** -1 → 1, viewport-normalised */
  x: 0,
  y: 0,
};

export function listenPointer() {
  const onMove = (e: MouseEvent) => {
    pointerState.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointerState.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  return () => window.removeEventListener("mousemove", onMove);
}
