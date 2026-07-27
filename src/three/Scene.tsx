import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { pointerState, scrollState } from "../lib/state";

/* ------------------------------------------------------------------ */
/* Camera journey — keyframes across the whole scroll, catmull-rom     */
/* interpolated so section changes read as one continuous camera move. */
/* ------------------------------------------------------------------ */

const positions = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.0, 0.0, 7.2), // hero — frontal, subject centre-right
    new THREE.Vector3(-2.6, 0.7, 6.8), // about — drift left
    new THREE.Vector3(3.0, -0.5, 7.0), // features — swing right, low
    new THREE.Vector3(0.4, 2.6, 9.8), // dashboard — pull up and back
    new THREE.Vector3(-3.8, -1.0, 7.6), // stats — low left orbit
    new THREE.Vector3(3.6, 1.4, 7.2), // timeline — high right
    new THREE.Vector3(-0.6, -1.8, 8.4), // solutions / cases — under the form
    new THREE.Vector3(-2.0, 1.0, 9.0), // testimonials / pricing — retreat
    new THREE.Vector3(0.0, 0.3, 5.2), // footer — intimate close-up
  ],
  false,
  "catmullrom",
  0.5
);

const lookTargets = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.4, 0.1, 0),
    new THREE.Vector3(0.9, 0.0, 0),
    new THREE.Vector3(-0.5, 0.3, 0),
    new THREE.Vector3(0.0, 0.2, 0),
    new THREE.Vector3(0.5, -0.2, 0),
    new THREE.Vector3(-0.4, 0.4, 0),
    new THREE.Vector3(0.0, -0.3, 0),
    new THREE.Vector3(0.3, 0.2, 0),
    new THREE.Vector3(0.0, 0.0, 0),
  ],
  false,
  "catmullrom",
  0.5
);

function CameraRig() {
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useMemo(() => new THREE.Vector3(0, 0, 7.2), []);
  const smoothedLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, dt) => {
    const p = THREE.MathUtils.clamp(scrollState.progress, 0, 1);
    positions.getPoint(p, pos);
    lookTargets.getPoint(p, look);

    // portrait viewports crop the horizontal FOV — retreat to compensate
    const aspect = (camera as THREE.PerspectiveCamera).aspect;
    pos.z += THREE.MathUtils.clamp((1 - aspect) * 3, 0, 2.6);

    // mouse parallax — small, damped, disabled influence at coarse pointers (stays 0)
    pos.x += pointerState.x * 0.35;
    pos.y += -pointerState.y * 0.22;

    const k = 1 - Math.pow(0.0018, dt); // frame-rate independent damping
    smoothed.lerp(pos, k);
    smoothedLook.lerp(look, k);

    camera.position.copy(smoothed);
    camera.lookAt(smoothedLook);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/* The sculptural core — a liquid-chrome knot that slowly breathes.    */
/* ------------------------------------------------------------------ */

function CoreForm() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.elapsedTime;
    m.rotation.x = t * 0.06 + scrollState.progress * Math.PI * 1.35;
    m.rotation.y = t * 0.09 + scrollState.progress * Math.PI * 0.8;
    const breathe = 1 + Math.sin(t * 0.5) * 0.02;
    m.scale.setScalar(breathe);
    m.position.y = Math.sin(t * 0.35) * 0.12;
  });

  return (
    <mesh ref={mesh} position={[0.4, 0, 0]}>
      <torusKnotGeometry args={[1.02, 0.3, 320, 48, 2, 3]} />
      <meshPhysicalMaterial
        color="#d4d4da"
        metalness={0.96}
        roughness={0.16}
        envMapIntensity={1.6}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Halo — the rim-light ring behind the form. Emissive torus plus an   */
/* additive radial sprite reads as bloom without postprocessing.       */
/* ------------------------------------------------------------------ */

function useGlowTexture() {
  return useMemo(() => {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(0.35, "rgba(220,228,255,0.16)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Halo() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const glow = useGlowTexture();

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.rotation.z = t * 0.04;
    g.rotation.x = Math.sin(t * 0.2) * 0.08;
    const mat = ring.current?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) mat.emissiveIntensity = 2.2 + Math.sin(t * 0.8) * 0.45;
  });

  return (
    <group ref={group} position={[0.4, 0.2, -2.4]}>
      <mesh ref={ring} rotation={[0.12, 0, 0]}>
        <torusGeometry args={[2.7, 0.022, 16, 200]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f4f2ec"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <sprite scale={[9.5, 9.5, 1]} position={[0, 0, -0.5]}>
        <spriteMaterial
          map={glow}
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Dust — almost invisible drifting particles for depth.               */
/* ------------------------------------------------------------------ */

function Dust({ count = 260 }) {
  const points = useRef<THREE.Points>(null);
  const glow = useGlowTexture();

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);

  useFrame(({ clock }) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y = clock.elapsedTime * 0.008;
    p.position.y = Math.sin(clock.elapsedTime * 0.1) * 0.3;
  });

  return (
    <points ref={points} geometry={geo}>
      <pointsMaterial
        map={glow}
        size={0.05}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */

export function Scene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 7.2], fov: 42, near: 0.1, far: 60 }}
      >
        <color attach="background" args={["#08090b"]} />
        <fog attach="fog" args={["#08090b", 7, 18]} />

        <Suspense fallback={null}>
          <CameraRig />
          <Halo />
          <CoreForm />
          <Dust />

          {/* Studio lighting baked into an env map — zero network fetches. */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              intensity={4}
              position={[0, 3, -4]}
              scale={[7, 1.6, 1]}
              form="ring"
              color="#fdfbf5"
            />
            <Lightformer intensity={1.1} position={[-6, 1, 2]} scale={[2, 6, 1]} color="#c9d4ff" />
            <Lightformer intensity={0.7} position={[6, -2, 3]} scale={[2.5, 5, 1]} color="#fff4e0" />
            <Lightformer intensity={0.4} position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} color="#20222a" />
          </Environment>

          <ambientLight intensity={0.12} />
          <pointLight position={[0.4, 0.2, -2.4]} intensity={9} color="#f0ecdf" distance={12} decay={2} />
        </Suspense>
      </Canvas>

      {/* vignette + floor falloff keeps edges cinematic */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,9,11,0.75)_100%)]" />
    </div>
  );
}
