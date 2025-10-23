import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Particle {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 50, y: 50 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 80; // Fewer particles for cleaner look
    const particles: Particle[] = [];

    console.log('🕸️ Network particle system initialized');

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 2; // Small particles (2-4px)
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        will-change: transform;
        box-shadow: 0 0 ${size * 2}px rgba(100, 200, 255, 0.3);
      `;
      
      container.appendChild(particle);
      
      particles.push({
        element: particle,
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y
      });
    }

    particlesRef.current = particles;

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const newX = ((event.clientX - rect.left) / rect.width) * 100;
      const newY = ((event.clientY - rect.top) / rect.height) * 100;
      
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      const mouse = mouseRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Convert percentage positions to pixel positions for line drawing
      const pixelPositions: { x: number; y: number }[] = [];
      
      particles.forEach((particle, index) => {
        // Calculate distance from particle to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction force
        const maxDistance = 35;
        const force = Math.max(0, maxDistance - distance) * 0.06;
        
        particle.vx += dx * force;
        particle.vy += dy * force;
        
        // Return to base position
        const returnForce = 0.01;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;
        
        // Apply damping
        particle.vx *= 0.88;
        particle.vy *= 0.88;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update DOM
        const offsetX = particle.x - particle.baseX;
        const offsetY = particle.y - particle.baseY;
        particle.element.style.transform = `translate(${offsetX}%, ${offsetY}%)`;
        
        // Store pixel position for line drawing
        pixelPositions.push({
          x: (particle.x / 100) * canvas.width,
          y: (particle.y / 100) * canvas.height
        });
      });
      
      // Draw connection lines
      const mousePixelX = (mouse.x / 100) * canvas.width;
      const mousePixelY = (mouse.y / 100) * canvas.height;
      
      for (let i = 0; i < pixelPositions.length; i++) {
        const p1 = pixelPositions[i];
        
        // Connect particles to each other if close
        for (let j = i + 1; j < pixelPositions.length; j++) {
          const p2 = pixelPositions[j];
          const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
          
          // Connection threshold
          const maxLineDistance = 150;
          
          if (dist < maxLineDistance) {
            const opacity = (1 - dist / maxLineDistance) * 0.3;
            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Connect particles near mouse
        const distToMouse = Math.sqrt(
          Math.pow(mousePixelX - p1.x, 2) + Math.pow(mousePixelY - p1.y, 2)
        );
        
        const maxMouseDistance = 200;
        
        if (distToMouse < maxMouseDistance) {
          const opacity = (1 - distToMouse / maxMouseDistance) * 0.5;
          ctx.strokeStyle = `rgba(150, 220, 255, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mousePixelX, mousePixelY);
          ctx.stroke();
        }
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
      
      particles.forEach(particle => {
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
        background: 'radial-gradient(ellipse at center, rgba(0, 20, 40, 0.3) 0%, rgba(0, 5, 15, 0.1) 50%, transparent 100%)'
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
