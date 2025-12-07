"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';

const PARTICLE_COUNT = 150;
const GRAVITY = 0.5;
const TERMINAL_VELOCITY = 5;

type Particle = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  color: string;
  angle: number;
  dAngle: number;
  opacity: number;
};

export function Confetti({ isCelebrating, image }: { isCelebrating: boolean, image?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particles = useRef<Particle[]>([]);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  const themeColors = ['#FFC629', '#FFFFFF', '#333333']; // Bumble yellow, white, dark gray

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => setLogoImage(img);
    } else {
      setLogoImage(null);
    }
  }, [image]);

  const resetParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particles.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.current.push({
        x: canvas.width * 0.5,
        y: canvas.height * 0.7,
        w: image ? Math.random() * 20 + 20 : Math.random() * 8 + 5,
        h: image ? Math.random() * 20 + 20 : Math.random() * 8 + 5,
        vx: (Math.random() - 0.5) * 25,
        vy: (Math.random() - 0.5) * 25 - 20,
        color: themeColors[Math.floor(Math.random() * themeColors.length)],
        angle: Math.random() * 360,
        dAngle: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }
  }, [themeColors, image]);
  
  const onResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach(p => {
      p.vy += GRAVITY;
      if (p.vy > TERMINAL_VELOCITY) {
        p.vy = TERMINAL_VELOCITY;
      }
      p.vx *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.dAngle;
      p.opacity = Math.max(0, p.opacity - 0.005);
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.globalAlpha = p.opacity;

      if (logoImage) {
        ctx.drawImage(logoImage, -p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      
      ctx.restore();
    });

    particles.current = particles.current.filter(p => p.y < canvas.height && p.opacity > 0);

    if (particles.current.length > 0) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [logoImage]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    
    if (isCelebrating) {
      resetParticles();
      if (particles.current.length > 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    } else {
        particles.current = [];
    }
    
    return () => {
      window.removeEventListener('resize', onResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isCelebrating, animate, resetParticles, onResize]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}
