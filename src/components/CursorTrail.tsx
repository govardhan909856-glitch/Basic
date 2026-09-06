import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  glowColor: string;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = 160;

    // Studio color palette for particles
    const colors = [
      { fill: '#c8ff00', glow: 'rgba(200, 255, 0, 0.8)' }, // Neon Lime
      { fill: '#ffffff', glow: 'rgba(255, 255, 255, 0.7)' }, // White Spark
      { fill: '#00ffa3', glow: 'rgba(0, 255, 163, 0.6)' }, // Cyan Mint
      { fill: '#ff1a35', glow: 'rgba(255, 26, 53, 0.7)' }, // Crimson Accent
    ];

    let lastMouseX = -100;
    let lastMouseY = -100;
    let mouseX = -100;
    let mouseY = -100;
    let isMoving = false;
    let moveTimeout: number;

    // Smooth cursor follower ring coordinates
    let ringX = -100;
    let ringY = -100;
    let ringRadius = 5;
    let targetRadius = 5;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawnParticle = (x: number, y: number, speed: number) => {
      if (particles.length >= maxParticles) {
        particles.shift(); // Remove oldest to maintain performance
      }

      const colObj = colors[Math.random() < 0.65 ? 0 : Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 1.5 + 0.5) * Math.min(speed * 0.15 + 0.8, 4);

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 0.5,
        vy: Math.sin(angle) * velocity + (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1.2,
        alpha: 0.95,
        decay: Math.random() * 0.02 + 0.015,
        color: colObj.fill,
        glowColor: colObj.glow,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (lastMouseX > 0 && lastMouseY > 0) {
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.min(Math.ceil(dist / 6), 8);

        // Interpolate along the path so fast movement produces a continuous particle stream
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const px = lastMouseX + dx * t + (Math.random() - 0.5) * 4;
          const py = lastMouseY + dy * t + (Math.random() - 0.5) * 4;
          spawnParticle(px, py, dist);
        }
      } else {
        spawnParticle(mouseX, mouseY, 1);
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
      isMoving = true;
      window.clearTimeout(moveTimeout);
      moveTimeout = window.setTimeout(() => {
        isMoving = false;
      }, 100);

      // Check if hovering over clickable elements to scale central ring
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('[data-interactive]'))) {
        targetRadius = 14;
      } else {
        targetRadius = 5;
      }
    };

    // Burst particles on click
    const handleMouseDown = (e: MouseEvent) => {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 4 + 2;
        const colObj = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.8,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.02,
          color: colObj.fill,
          glowColor: colObj.glow,
        });
      }
      targetRadius = 22;
      setTimeout(() => {
        targetRadius = 5;
      }, 150);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        if (lastMouseX > 0 && lastMouseY > 0) {
          const dx = mouseX - lastMouseX;
          const dy = mouseY - lastMouseY;
          const dist = Math.hypot(dx, dy);
          const steps = Math.min(Math.ceil(dist / 8), 5);
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            spawnParticle(lastMouseX + dx * t, lastMouseY + dy * t, dist);
          }
        } else {
          spawnParticle(mouseX, mouseY, 1);
        }

        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    };

    const handleMouseLeave = () => {
      lastMouseX = -100;
      lastMouseY = -100;
      mouseX = -100;
      mouseY = -100;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Lerp custom cursor halo towards actual mouse
      if (mouseX > 0 && mouseY > 0) {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;
        ringRadius += (targetRadius - ringRadius) * 0.2;

        // Draw glowing follower core
        ctx.save();
        ctx.beginPath();
        ctx.arc(ringX, ringY, ringRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 255, 0, 0.35)';
        ctx.shadowColor = '#c8ff00';
        ctx.shadowBlur = 12;
        ctx.fill();

        // Inner sharp dot
        ctx.beginPath();
        ctx.arc(ringX, ringY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      // Update & Render Trail Particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95; // Drag
        p.vy *= 0.95;
        p.alpha -= p.decay;
        p.size *= 0.985; // Slight shrink

        if (p.alpha <= 0.01 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.clearTimeout(moveTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cursorTrailCanvas"
      className="pointer-events-none fixed inset-0 z-[95] block h-full w-full"
    />
  );
}
