import { useEffect, useRef, useState } from 'react';
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
  const mouseRef = useRef({ x: 50, y: 50 });
  const animationFrameRef = useRef<number | null>(null);
  const cursorIndicatorRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 200;
    const particles: Particle[] = [];

    console.log('🎨 Particle background initialized with enhanced visibility');

    // Create particles with enhanced visibility
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 4 + 3; // BIGGER particles (3-7px)
      const opacity = Math.random() * 0.7 + 0.5; // BRIGHTER (0.5-1.2)
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(150, 220, 255, ${opacity}) 0%, rgba(255, 255, 255, ${opacity * 0.9}) 30%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        will-change: transform;
        box-shadow: 
          0 0 ${size * 3}px rgba(100, 200, 255, ${opacity * 0.7}),
          0 0 ${size * 5}px rgba(100, 200, 255, ${opacity * 0.4});
        transition: box-shadow 0.3s ease;
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

    let hasMouseMoved = false;

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      if (!hasMouseMoved) {
        console.log('✨ Mouse interaction active!');
        hasMouseMoved = true;
        setIsInteracting(true);
      }

      const rect = container.getBoundingClientRect();
      const newX = ((event.clientX - rect.left) / rect.width) * 100;
      const newY = ((event.clientY - rect.top) / rect.height) * 100;
      
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      
      // Update cursor indicator
      if (cursorIndicatorRef.current) {
        cursorIndicatorRef.current.style.left = `${event.clientX}px`;
        cursorIndicatorRef.current.style.top = `${event.clientY}px`;
        cursorIndicatorRef.current.style.opacity = '0.6';
      }
    };

    const handleMouseLeave = () => {
      if (cursorIndicatorRef.current) {
        cursorIndicatorRef.current.style.opacity = '0';
      }
    };

    // Add listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      const mouse = mouseRef.current;
      
      particles.forEach((particle, index) => {
        // Calculate distance from particle to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // MUCH STRONGER attraction force
        const maxDistance = 40; // Huge interaction radius
        const force = Math.max(0, maxDistance - distance) * 0.08; // Very strong force
        
        // Apply force
        particle.vx += dx * force;
        particle.vy += dy * force;
        
        // Return to base position (spring effect)
        const returnForce = 0.008;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;
        
        // Apply damping
        particle.vx *= 0.85; // Less damping = more movement
        particle.vy *= 0.85;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update DOM with transform
        const offsetX = particle.x - particle.baseX;
        const offsetY = particle.y - particle.baseY;
        const offset = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        
        // Enhanced glow when moving
        if (offset > 5) {
          const glowIntensity = Math.min(offset / 20, 1);
          particle.element.style.filter = `brightness(${1 + glowIntensity * 0.5})`;
        } else {
          particle.element.style.filter = 'brightness(1)';
        }
        
        particle.element.style.transform = `translate(${offsetX}%, ${offsetY}%)`;
      });
      
      frameCount++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    gsap.from(container, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out'
    });

    animate();

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
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
    <>
      <div 
        ref={containerRef} 
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(0, 30, 60, 0.5) 0%, rgba(0, 10, 20, 0.3) 50%, transparent 100%)'
        }}
      />
      
      {/* Interactive cursor indicator */}
      <div
        ref={cursorIndicatorRef}
        className="fixed pointer-events-none transition-all duration-200 z-50"
        style={{
          width: '120px',
          height: '120px',
          border: '3px solid rgba(100, 200, 255, 0.6)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          background: 'radial-gradient(circle, rgba(100, 200, 255, 0.15) 0%, transparent 70%)',
          boxShadow: '0 0 30px rgba(100, 200, 255, 0.3), inset 0 0 20px rgba(100, 200, 255, 0.2)',
        }}
      />
    </>
  );
};

export default ParticleBackground;
