import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticParticlesRef = useRef<Particle[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const animationFrameRef = useRef<number | null>(null);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const staticParticleCount = 25; // Just a few for aesthetic
    const staticParticles: Particle[] = [];

    console.log('✨ Mouse trail particle system initialized');

    // Create minimal static particles
    for (let i = 0; i < staticParticleCount; i++) {
      const particle = document.createElement('div');
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1.5;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(100, 200, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px rgba(100, 200, 255, 0.2);
      `;
      
      container.appendChild(particle);
      
      staticParticles.push({
        element: particle,
        x,
        y
      });
    }

    staticParticlesRef.current = staticParticles;

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      
      // Spawn trail particles (throttled)
      const now = Date.now();
      if (now - lastSpawnTime.current > 30) { // Spawn every 30ms
        const dx = mouseRef.current.x - mouseRef.current.prevX;
        const dy = mouseRef.current.y - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        if (speed > 1) { // Only spawn if mouse is moving
          // Spawn 1-2 particles based on speed
          const particlesToSpawn = Math.min(Math.ceil(speed / 20), 2);
          
          for (let i = 0; i < particlesToSpawn; i++) {
            trailParticlesRef.current.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 5,
              y: mouseRef.current.y + (Math.random() - 0.5) * 5,
              vx: (Math.random() - 0.5) * 1.5 - dx * 0.05,
              vy: (Math.random() - 0.5) * 1.5 - dy * 0.05,
              life: 1,
              maxLife: Math.random() * 60 + 40, // 40-100 frames
              size: Math.random() * 3 + 2
            });
          }
          
          lastSpawnTime.current = now;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const staticPixelPositions: { x: number; y: number }[] = [];
      
      // Convert static particles to pixel positions
      staticParticles.forEach(particle => {
        staticPixelPositions.push({
          x: (particle.x / 100) * canvas.width,
          y: (particle.y / 100) * canvas.height
        });
      });
      
      // Draw connection lines between static particles only
      for (let i = 0; i < staticPixelPositions.length; i++) {
        const p1 = staticPixelPositions[i];
        
        for (let j = i + 1; j < staticPixelPositions.length; j++) {
          const p2 = staticPixelPositions[j];
          const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
          
          const maxLineDistance = 200;
          
          if (dist < maxLineDistance) {
            const opacity = (1 - dist / maxLineDistance) * 0.25;
            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw trail particles
      const trailParticles = trailParticlesRef.current;
      
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        
        // Update position with drift physics
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply gentle drift and gravity
        p.vy += 0.02; // Slight downward drift
        p.vx *= 0.98; // Air resistance
        p.vy *= 0.98;
        
        // Update life
        p.life = 1 - ((p.maxLife - p.life * p.maxLife + 1) / p.maxLife);
        
        // Remove dead particles
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }
        
        // Draw particle
        const opacity = p.life * 0.6;
        const size = p.size * p.life;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, `rgba(150, 220, 255, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(100, 200, 255, ${opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Subtle glow
        ctx.shadowBlur = size * 2;
        ctx.shadowColor = `rgba(100, 200, 255, ${opacity * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    gsap.from(container, {
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
    });

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      staticParticles.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(0, 20, 40, 0.2) 0%, rgba(0, 5, 15, 0.05) 50%, transparent 100%)'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ParticleBackground;
