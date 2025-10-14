import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number };

export function Starfield({ count = 180 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;

    function resize() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    // init stars
    const depth = 900;
    stars.current = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * c.width,
      y: (Math.random() - 0.5) * c.height,
      z: Math.random() * depth + 1,
    }));

    function tick() {
      const { width: w, height: h } = c;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars.current) {
        s.z -= 2; // speed
        if (s.z <= 1) s.z = depth;

        const k = 200 / s.z; // perspective
        const px = s.x * k + w / 2;
        const py = s.y * k + h / 2;
        const size = Math.max(0.6, 1.8 - s.z / 600);

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, size * 4);
          grd.addColorStop(0, "rgba(180, 200, 255, 0.9)");
          grd.addColorStop(1, "rgba(30, 40, 80, 0.0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
