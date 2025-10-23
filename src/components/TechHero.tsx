import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechHero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
    })
    .from(subtitleRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
    }, '-=0.6')
    .from(linesRef.current, {
      scaleX: 0,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
    }, '-=0.4');

    // Parallax effect on scroll
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            y: self.progress * 150,
            opacity: 1 - self.progress * 0.8,
            duration: 0.1,
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Hex Pattern Overlay */}
      <div className="absolute inset-0 hex-pattern opacity-10" />

      {/* Corner Elements */}
      <div className="absolute top-20 left-8 w-16 h-16 border-l-2 border-t-2 border-primary opacity-50" />
      <div className="absolute top-20 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary opacity-50" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-secondary opacity-50" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary opacity-50" />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 
          ref={titleRef}
          className="mb-6 text-7xl md:text-9xl font-black tracking-tighter"
        >
          ISTE GNDEC
        </h1>

        <div ref={subtitleRef} className="space-y-4">
          {/* Decorative Lines */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div ref={(el) => linesRef.current[0] = el} className="h-0.5 w-24 bg-gradient-to-r from-transparent to-primary" />
            <div className="text-xs font-mono text-muted-foreground tracking-[0.3em]">STUDENT CHAPTER</div>
            <div ref={(el) => linesRef.current[1] = el} className="h-0.5 w-24 bg-gradient-to-l from-transparent to-primary" />
          </div>

          <p className="text-xl md:text-2xl font-light text-foreground/80 max-w-3xl mx-auto">
            Indian Society for Technical Education
          </p>
          <p className="text-lg md:text-xl font-mono text-primary">
            Guru Nanak Dev Engineering College
          </p>

          {/* CTA */}
          <div className="mt-12">
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative inline-flex items-center gap-3 tech-border px-8 py-4 font-semibold text-foreground hover:text-primary transition-all overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-mono text-sm tracking-wider">EXPLORE CHAPTER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Tech Elements */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span>SCROLL</span>
        <svg className="w-4 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span>DOWN</span>
      </div>
    </section>
  );
};

export default TechHero;
