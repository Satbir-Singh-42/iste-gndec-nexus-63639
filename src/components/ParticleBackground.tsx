import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<BinaryStream[]>([]);
  const trailParticlesRef = useRef<TrailParticle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const techNodesRef = useRef<TechNode[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const lastSpawnTime = useRef(0);
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    console.log('✨ Clean tech background initialized');

    const starCount = 60;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2.5 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      
      const starColor = `rgba(255, 255, 255, ${opacity}), rgba(200, 220, 255, ${opacity * 0.7})`;
      const shadowColor = `rgba(255, 255, 255, ${opacity * 0.4})`;
      
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
        z-index: 2;
      `;
      
      container.appendChild(star);
      stars.push({ element: star, x, y });
    }

    starsRef.current = stars;

    const streams: BinaryStream[] = [];
    
    if (isHomePage) {
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
    techNodesRef.current = [];

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      
      const now = Date.now();
      const spawnInterval = 20;
      const particleCount = 3;
      
      if (now - lastSpawnTime.current > spawnInterval) {
        const dx = mouseRef.current.x - mouseRef.current.prevX;
        const dy = mouseRef.current.y - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        if (speed > 0.5) {
          for (let i = 0; i < particleCount; i++) {
            trailParticlesRef.current.push({
              x: mouseRef.current.x + (Math.random() - 0.5) * 5,
              y: mouseRef.current.y + (Math.random() - 0.5) * 5,
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              life: 1,
              maxLife: Math.random() * 40 + 30,
              size: Math.random() * 3 + 2.5
            });
          }
          
          lastSpawnTime.current = now;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fontSize = 11;
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textAlign = 'center';

      if (isHomePage) {
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
            const baseOpacity = stream.opacity[index] * 0.06;
            const finalOpacity = baseOpacity + mouseInfluence * 0.08;

            const r = 60 + mouseInfluence * 50;
            const g = 160 + mouseInfluence * 30;
            const b = 210;

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity})`;
            ctx.shadowBlur = 0;
            ctx.fillText(digit, stream.x, digitY);
          }
        });

          if (Math.random() < 0.008) {
            const randomIndex = Math.floor(Math.random() * stream.digits.length);
            stream.digits[randomIndex] = stream.digits[randomIndex] === '1' ? '0' : '1';
          }
        });
      }

      const trailParticles = trailParticlesRef.current;
      
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        p.life = 1 - ((p.maxLife - p.life * p.maxLife + 1) / p.maxLife);
        
        if (p.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }
        
        const opacity = p.life * 0.75;
        const size = p.size * p.life;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
        gradient.addColorStop(0, `rgba(200, 230, 255, ${opacity})`);
        gradient.addColorStop(0.6, `rgba(100, 180, 255, ${opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(100, 180, 255, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.shadowBlur = size * 1.5;
        ctx.shadowColor = `rgba(100, 180, 255, ${opacity * 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.shadowBlur = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    gsap.from(canvas, {
      opacity: 0,
      duration: 2,
      ease: 'power2.out'
    });

    animate();

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
  }, [isHomePage]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden"
      style={{ 
        zIndex: -10,
        background: 'radial-gradient(ellipse at center, rgba(8, 12, 25, 0.15) 0%, rgba(4, 6, 15, 0.08) 50%, transparent 100%)'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          pointerEvents: 'none',
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(4, 6, 15, 1) 0%, rgba(6, 10, 20, 1) 50%, rgba(4, 6, 15, 1) 100%)'
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
