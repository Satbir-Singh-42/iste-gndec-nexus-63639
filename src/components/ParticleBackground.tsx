import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import gsap from 'gsap';

interface BinaryStream {
  x: number;
  y: number;
  speed: number;
  digits: string[];
  opacity: number[];
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

interface Star {
  element: HTMLDivElement;
  x: number;
  y: number;
}

interface TechNode {
  x: number;
  y: number;
  pulse: number;
  pulseSpeed: number;
  connections: number[];
}

const ParticleBackground = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<BinaryStream[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const techNodesRef = useRef<TechNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const lastSpawnTime = useRef(0);
  
  // Only show binary streams on home page
  const isHomePage = location.pathname === '/';
  const isLightMode = theme === 'light';
  
  console.log('🎨 Current theme:', theme, 'isLightMode:', isLightMode);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log('✨ Clean tech background initialized');

    // Create stars
    const starCount = 60;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2.5 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      
      const starColor = isLightMode 
        ? `rgba(91, 144, 247, ${opacity * 0.6}), rgba(52, 211, 253, ${opacity * 0.4})` 
        : `rgba(255, 255, 255, ${opacity}), rgba(200, 220, 255, ${opacity * 0.7})`;
      const shadowColor = isLightMode
        ? `rgba(91, 144, 247, ${opacity * 0.3})`
        : `rgba(255, 255, 255, ${opacity * 0.4})`;
      
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${starColor} 50%, transparent 100%);
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 3}px ${shadowColor};
        animation: twinkle ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
      `;
      
      container.appendChild(star);
      stars.push({ element: star, x, y });
    }

    starsRef.current = stars;

    // Create binary streams (very subtle) - only on home page and only in dark mode
    const streams: BinaryStream[] = [];
    
    if (isHomePage && !isLightMode) {
      const streamCount = Math.floor(window.innerWidth / 60);

      for (let i = 0; i < streamCount; i++) {
        const streamLength = Math.floor(Math.random() * 8) + 5;
        const digits: string[] = [];
        const opacity: number[] = [];

        for (let j = 0; j < streamLength; j++) {
          digits.push(Math.random() > 0.5 ? '1' : '0');
          opacity.push(1 - (j / streamLength));
        }

        streams.push({
          x: i * 60 + Math.random() * 40,
          y: Math.random() * -canvas.height,
          speed: Math.random() * 0.8 + 0.2,
          digits,
          opacity
        });
      }
    }

    streamsRef.current = streams;

    // No technical nodes in light mode - keep it clean
    techNodesRef.current = [];

    // Mouse tracking for cleaner trail
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      
      // Spawn cleaner trail particles - MORE particles for better visibility
      const now = Date.now();
      const spawnInterval = isLightMode ? 15 : 20;
      const particleCount = isLightMode ? 4 : 3;
      
      if (now - lastSpawnTime.current > spawnInterval) {
        const dx = mouseRef.current.x - mouseRef.current.prevX;
        const dy = mouseRef.current.y - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        if (speed > 0.5) { // Spawn even with slow movement
          // Spawn more particles for better visibility
          for (let i = 0; i < particleCount; i++) {
            trailParticlesRef.current.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 5,
              y: mouseRef.current.y + (Math.random() - 0.5) * 5,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              life: 1,
              maxLife: isLightMode ? Math.random() * 50 + 40 : Math.random() * 40 + 30,
              size: isLightMode ? Math.random() * 4 + 3 : Math.random() * 3 + 2.5
            });
          }
          
          lastSpawnTime.current = now;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      // Clear canvas with stronger fade for cleaner trail
      ctx.fillStyle = isLightMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(4, 6, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 11;
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textAlign = 'center';

      // Draw binary streams (extremely translucent) - only on home page and only in dark mode
      if (isHomePage && !isLightMode) {
        streams.forEach((stream) => {
        stream.y += stream.speed;

        if (stream.y > canvas.height + stream.digits.length * fontSize) {
          stream.y = -stream.digits.length * fontSize;
          stream.x = Math.random() * canvas.width;
          stream.speed = Math.random() * 0.8 + 0.2;
          stream.digits = stream.digits.map(() => Math.random() > 0.5 ? '1' : '0');
        }

        const distToMouse = Math.sqrt(
          Math.pow(mouseRef.current.x - stream.x, 2) + 
          Math.pow(mouseRef.current.y - stream.y, 2)
        );
        const mouseInfluence = Math.max(0, 1 - distToMouse / 300);

        stream.digits.forEach((digit, index) => {
          const digitY = stream.y + index * fontSize;
          
          if (digitY > -fontSize && digitY < canvas.height + fontSize) {
            // Extremely translucent: only 6% base opacity
            const baseOpacity = stream.opacity[index] * (isLightMode ? 0.08 : 0.06);
            const finalOpacity = baseOpacity + mouseInfluence * (isLightMode ? 0.1 : 0.08);

            let r, g, b;
            if (isLightMode) {
              r = 40 + mouseInfluence * 30;
              g = 90 + mouseInfluence * 40;
              b = 150;
            } else {
              r = 60 + mouseInfluence * 50;
              g = 160 + mouseInfluence * 30;
              b = 210;
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
            ctx.shadowBlur = 0; // No glow for cleaner look
            ctx.fillText(digit, stream.x, digitY);
          }
        });

          if (Math.random() < 0.008) {
            const randomIndex = Math.floor(Math.random() * stream.digits.length);
            stream.digits[randomIndex] = stream.digits[randomIndex] === '1' ? '0' : '1';
          }
        });
      }


      // Draw clean mouse trail particles
      const trailParticles = trailParticlesRef.current;
      
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // Minimal drift
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        p.life = 1 - ((p.maxLife - p.life * p.maxLife + 1) / p.maxLife);
        
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }
        
        // Cleaner, sharper particles with enhanced visibility
        const opacity = isLightMode ? p.life * 0.95 : p.life * 0.75;
        const size = p.size * p.life;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        if (isLightMode) {
          gradient.addColorStop(0, `rgba(91, 144, 247, ${opacity * 0.9})`);
          gradient.addColorStop(0.5, `rgba(52, 211, 253, ${opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(147, 51, 234, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(200, 230, 255, ${opacity})`);
          gradient.addColorStop(0.6, `rgba(100, 180, 255, ${opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(100, 180, 255, 0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Enhanced glow for better visibility in light mode
        ctx.shadowBlur = isLightMode ? size * 2.5 : size * 1.5;
        ctx.shadowColor = isLightMode 
          ? `rgba(91, 144, 247, ${opacity * 0.6})` 
          : `rgba(100, 180, 255, ${opacity * 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.shadowBlur = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    gsap.from(canvas, {
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
      
      stars.forEach(star => {
        if (star.element.parentNode) {
          star.element.parentNode.removeChild(star.element);
        }
      });
    };
  }, [isHomePage, isLightMode]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{ 
        background: isLightMode 
          ? 'linear-gradient(135deg, #E8F4FF 0%, #F0F8FF 25%, #FFFFFF 50%, #EFF6FF 75%, #E0F0FF 100%)'
          : 'radial-gradient(ellipse at center, rgba(8, 12, 25, 0.15) 0%, rgba(4, 6, 15, 0.08) 50%, transparent 100%)'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          pointerEvents: 'none',
          background: isLightMode
            ? 'transparent'
            : 'linear-gradient(to bottom, rgba(4, 6, 15, 1) 0%, rgba(6, 10, 20, 1) 50%, rgba(4, 6, 15, 1) 100%)'
        }}
      />
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;
