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
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 150;
    const particles: Particle[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(100, 200, 255, ${opacity}) 0%, rgba(255, 255, 255, ${opacity * 0.5}) 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        will-change: transform;
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
      mouseRef.current.x = (event.clientX / window.innerWidth) * 100;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 100;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      const mouse = mouseRef.current;
      
      particles.forEach((particle) => {
        // Calculate distance from particle to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction force (particles move toward mouse)
        const maxDistance = 25; // Interaction radius
        const force = Math.max(0, maxDistance - distance) * 0.015;
        
        // Apply force
        particle.vx += dx * force;
        particle.vy += dy * force;
        
        // Return to base position (spring effect)
        const returnForce = 0.02;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;
        
        // Apply damping
        particle.vx *= 0.92;
        particle.vy *= 0.92;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update DOM with transform (better performance)
        const offsetX = particle.x - particle.baseX;
        const offsetY = particle.y - particle.baseY;
        particle.element.style.transform = `translate(${offsetX}%, ${offsetY}%)`;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation with GSAP fade in
    gsap.from(container, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    });

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
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
        background: 'radial-gradient(ellipse at center, rgba(0, 30, 60, 0.4) 0%, rgba(0, 10, 20, 0.2) 50%, transparent 100%)'
      }}
    />
  );
};

export default ParticleBackground;
