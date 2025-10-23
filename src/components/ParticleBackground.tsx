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

    const staticParticleCount = 30; // A few ambient particles
    const staticParticles: Particle[] = [];

    console.log('✨ Clean mouse trail system initialized');

    // Create minimal ambient particles
    for (let i = 0; i < staticParticleCount; i++) {
      const particle = document.createElement('div');
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2.5 + 1.5;
      const opacity = Math.random() * 0.4 + 0.2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(100, 200, 255, ${opacity}) 0%, rgba(255, 255, 255, ${opacity * 0.5}) 40%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 3}px rgba(100, 200, 255, ${opacity * 0.4});
        animation: float ${15 + Math.random() * 10}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
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
      if (now - lastSpawnTime.current > 25) { // Spawn every 25ms
        const dx = mouseRef.current.x - mouseRef.current.prevX;
        const dy = mouseRef.current.y - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        if (speed > 1) { // Only spawn if mouse is moving
          // Spawn 1-3 particles based on speed
          const particlesToSpawn = Math.min(Math.ceil(speed / 15), 3);
          
          for (let i = 0; i < particlesToSpawn; i++) {
            trailParticlesRef.current.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 8,
              y: mouseRef.current.y + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 2 - dx * 0.04,
              vy: (Math.random() - 0.5) * 2 - dy * 0.04,
              life: 1,
              maxLife: Math.random() * 50 + 30, // 30-80 frames
              size: Math.random() * 4 + 3
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
      
      // Update and draw trail particles
      const trailParticles = trailParticlesRef.current;
      
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        
        // Update position with drift physics
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply gentle drift and gravity
        p.vy += 0.03; // Slight downward drift
        p.vx *= 0.97; // Air resistance
        p.vy *= 0.97;
        
        // Update life
        p.life = 1 - ((p.maxLife - p.life * p.maxLife + 1) / p.maxLife);
        
        // Remove dead particles
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }
        
        // Draw particle with glow
        const opacity = p.life * 0.7;
        const size = p.size * (0.5 + p.life * 0.5); // Shrink as it fades
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, `rgba(180, 230, 255, ${opacity})`);
        gradient.addColorStop(0.4, `rgba(100, 200, 255, ${opacity * 0.6})`);
        gradient.addColorStop(1, `rgba(100, 200, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Enhanced glow effect
        ctx.shadowBlur = size * 3;
        ctx.shadowColor = `rgba(100, 200, 255, ${opacity * 0.6})`;
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
        background: 'radial-gradient(ellipse at center, rgba(0, 25, 50, 0.25) 0%, rgba(0, 10, 20, 0.1) 50%, transparent 100%)'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
      
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% { 
            transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;
