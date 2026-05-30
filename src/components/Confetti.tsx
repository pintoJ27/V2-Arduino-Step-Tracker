"use client";

import { useEffect, useState, useRef } from "react";

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
}

const COLORS = ["#818cf8", "#a78bfa", "#f472b6", "#34d399", "#fbbf24", "#fb923c", "#60a5fa"];
const PARTICLE_COUNT = 60;
const DURATION = 3000;

export default function Confetti({ active }: ConfettiProps) {
  const [show, setShow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (active && !hasTriggered.current) {
      hasTriggered.current = true;
      setShow(true);
      const timer = setTimeout(() => setShow(false), DURATION);
      return () => clearTimeout(timer);
    }
    if (!active) {
      hasTriggered.current = false;
    }
  }, [active]);

  useEffect(() => {
    if (!show || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 40,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 6 + 4,
      opacity: 1,
    }));

    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / DURATION;

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.1;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - progress);

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [show]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}
