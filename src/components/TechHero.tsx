import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechHero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const glassCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Advanced entrance timeline with 3D transforms
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.from(gridRef.current, {
      opacity: 0,
      scale: 1.2,
      duration: 1.5,
    })
    .from(titleRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotationX: -90,
      transformOrigin: 'center bottom',
      duration: 1.2,
    }, '-=0.8')
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 1,
    }, '-=0.8')
    .from(linesRef.current, {
      scaleX: 0,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.6')
    .from(floatingElementsRef.current, {
      y: 100,
      opacity: 0,
      scale: 0,
      rotation: 180,
      stagger: 0.1,
      duration: 1,
      ease: 'back.out(1.7)',
    }, '-=0.8')
    .from(glassCardRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.4)',
    }, '-=0.6');

    // Animate SVG grid lines
    const lines = document.querySelectorAll('.animated-line');
    lines.forEach((line, i) => {
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 2.5,
        delay: i * 0.15,
        repeat: -1,
        repeatDelay: 4,
        ease: 'none',
      });
    });

    // Advanced parallax with 3D transforms on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        
        if (gridRef.current) {
          gsap.to(gridRef.current, {
            y: progress * 300,
            opacity: 1 - progress * 0.6,
            scale: 1 + progress * 0.2,
            duration: 0.1,
          });
        }
        
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            y: progress * 200,
            opacity: 1 - progress * 1.2,
            rotationX: progress * -30,
            scale: 1 - progress * 0.2,
            duration: 0.1,
          });
        }
        
        if (subtitleRef.current) {
          gsap.to(subtitleRef.current, {
            y: progress * 150,
            opacity: 1 - progress * 1,
            duration: 0.1,
          });
        }

        // Parallax floating elements
        floatingElementsRef.current.forEach((el, i) => {
          if (el) {
            gsap.to(el, {
              y: progress * (100 + i * 50),
              rotation: progress * (i % 2 === 0 ? 45 : -45),
              opacity: 1 - progress * 0.8,
              duration: 0.1,
            });
          }
        });
      },
    });

    // Floating animation for decorative elements
    floatingElementsRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          y: '+=20',
          rotation: i % 2 === 0 ? '+=5' : '-=5',
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    });

    // Glowing pulse animation for status indicators
    const statusDots = document.querySelectorAll('.status-dot');
    statusDots.forEach((dot, i) => {
      gsap.to(dot, {
        scale: 1.3,
        opacity: 0.6,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
        ease: 'power2.inOut',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center perspective-container">
      {/* Animated Grid Background with enhanced parallax */}
      <div ref={gridRef} className="absolute inset-0 grid-bg opacity-40 -z-10">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M 100 0 L 0 0 0 100" 
                fill="none" 
                stroke="hsl(210 100% 55% / 0.12)" 
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(210 100% 55% / 0)" />
              <stop offset="50%" stopColor="hsl(210 100% 55% / 0.6)" />
              <stop offset="100%" stopColor="hsl(210 100% 55% / 0)" />
            </linearGradient>
            <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(195 85% 50% / 0)" />
              <stop offset="50%" stopColor="hsl(195 85% 50% / 0.6)" />
              <stop offset="100%" stopColor="hsl(195 85% 50% / 0)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid)" />
          
          {/* Animated glowing lines */}
          <line 
            className="animated-line"
            x1="0" y1="20%" x2="100%" y2="20%" 
            stroke="url(#line-gradient-1)" 
            strokeWidth="2"
            strokeDasharray="20 20"
            strokeDashoffset="100"
          />
          <line 
            className="animated-line"
            x1="30%" y1="0" x2="30%" y2="100%" 
            stroke="url(#line-gradient-2)" 
            strokeWidth="2"
            strokeDasharray="20 20"
            strokeDashoffset="100"
          />
          <line 
            className="animated-line"
            x1="100%" y1="60%" x2="0" y2="60%" 
            stroke="url(#line-gradient-1)" 
            strokeWidth="2"
            strokeDasharray="20 20"
            strokeDashoffset="100"
          />
          <line 
            className="animated-line"
            x1="70%" y1="100%" x2="70%" y2="0" 
            stroke="url(#line-gradient-2)" 
            strokeWidth="2"
            strokeDasharray="20 20"
            strokeDashoffset="100"
          />
        </svg>
      </div>

      {/* Hex Pattern Overlay */}
      <div className="absolute inset-0 hex-pattern opacity-15" />

      {/* Floating Glass Elements with 3D depth */}
      <div 
        ref={(el) => floatingElementsRef.current[0] = el}
        className="absolute top-32 left-16 w-32 h-32 glass-card-light rounded-lg transform-3d glow-blue"
        style={{ transform: 'rotateX(20deg) rotateY(-20deg)' }}
      />
      <div 
        ref={(el) => floatingElementsRef.current[1] = el}
        className="absolute top-48 right-24 w-24 h-24 glass-card-light rounded-lg transform-3d glow-cyan"
        style={{ transform: 'rotateX(-15deg) rotateY(25deg)' }}
      />
      <div 
        ref={(el) => floatingElementsRef.current[2] = el}
        className="absolute bottom-40 left-32 w-20 h-20 glass-card-light rounded-lg transform-3d glow-blue"
        style={{ transform: 'rotateX(25deg) rotateY(15deg)' }}
      />
      <div 
        ref={(el) => floatingElementsRef.current[3] = el}
        className="absolute bottom-32 right-40 w-28 h-28 glass-card-light rounded-lg transform-3d glow-cyan"
        style={{ transform: 'rotateX(-20deg) rotateY(-30deg)' }}
      />

      {/* Enhanced Corner Elements with glow */}
      <div className="absolute top-20 left-8 w-16 h-16 border-l-2 border-t-2 border-primary glow-blue" />
      <div className="absolute top-20 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary glow-cyan" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-secondary glow-cyan" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary glow-blue" />

      {/* Main Content with perspective */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center transform-3d">
        {/* Tech Status Bar with glass effect */}
        <div 
          ref={glassCardRef}
          className="mb-8 inline-flex items-center justify-center gap-6 px-6 py-3 glass-card rounded-full backdrop-blur-md"
        >
          <span className="flex items-center gap-2 text-sm font-mono text-primary">
            <span className="status-dot w-2 h-2 bg-primary rounded-full" />
            SYSTEM: ONLINE
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-2 text-sm font-mono text-secondary">
            <span className="status-dot w-2 h-2 bg-secondary rounded-full" />
            STATUS: ACTIVE
          </span>
        </div>

        <h1 
          ref={titleRef}
          data-text="ISTE GNDEC"
          className="glitch mb-6 text-7xl md:text-9xl font-black tracking-tighter depth-layer"
        >
          ISTE GNDEC
        </h1>

        <div ref={subtitleRef} className="space-y-4">
          {/* Decorative Lines with shimmer effect */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div ref={(el) => linesRef.current[0] = el} className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent shimmer" />
            <div className="text-xs font-mono text-muted-foreground tracking-[0.3em] uppercase">Student Chapter</div>
            <div ref={(el) => linesRef.current[1] = el} className="h-0.5 w-24 bg-gradient-to-l from-transparent via-primary to-transparent shimmer" />
          </div>

          <p className="text-xl md:text-2xl font-light text-foreground/90 max-w-3xl mx-auto">
            Indian Society for Technical Education
          </p>
          <p className="text-lg md:text-xl font-mono text-gradient font-semibold">
            Guru Nanak Dev Engineering College
          </p>

          {/* CTA with enhanced glass effect */}
          <div className="mt-12">
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative inline-flex items-center gap-3 glass-card px-8 py-4 rounded-lg font-semibold text-foreground hover:text-primary transition-all overflow-hidden cursor-pointer depth-card hover:glow-blue"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 font-mono text-sm tracking-wider uppercase depth-layer">Explore Chapter</span>
              <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator with glass effect */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground tracking-wider">SCROLL</span>
        <div className="w-6 h-10 glass-card-light rounded-full p-1.5">
          <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto animate-bounce" />
        </div>
        <span className="text-xs font-mono text-muted-foreground tracking-wider">DOWN</span>
      </div>
    </section>
  );
};

export default TechHero;
