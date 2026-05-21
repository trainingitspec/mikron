import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  phase: number;
}

interface LightColumn {
  x: number;
  speed: number;
  phase: number;
  width: number;
}

export default function CyberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    // Create light columns
    const columns: LightColumn[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * width,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      width: 0.5 + Math.random() * 1,
    }));

    // Create particles
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 1.5,
      speedY: 0.2 + Math.random() * 0.6,
      speedX: 0.1 + Math.random() * 0.3,
      alpha: 0.1 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resize);

    let time = 0;

    const animate = () => {
      time += 0.016;

      // Partial clear for motion trails
      ctx.fillStyle = "rgba(5, 5, 5, 0.15)";
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw light columns (Layer 1)
      columns.forEach((col) => {
        const yOffset = Math.sin(time * col.speed + col.phase) * height * 0.3;
        const gradient = ctx.createLinearGradient(
          col.x,
          height * 0.1 + yOffset,
          col.x,
          height * 0.9 + yOffset
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.3, "rgba(255, 196, 71, 0.15)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(0.7, "rgba(255, 196, 71, 0.15)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(col.x - col.width / 2, 0, col.width, height);
      });

      // Update and draw particles (Layer 2)
      particles.sort((a, b) => a.y - b.y);

      particles.forEach((p) => {
        // Upward drift
        p.y -= p.speedY;
        // Horizontal sine wave
        p.x += Math.sin(time * 0.5 + p.phase) * p.speedX;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 2;
          p.y += (dy / dist) * force * 2;
        }

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle
        ctx.fillStyle = `rgba(255, 196, 71, ${p.alpha})`;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
