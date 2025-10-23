import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechAbout = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Advanced header animation with split text effect
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
          y: 80,
          opacity: 0,
          scale: 0.95,
          rotationX: -15,
          duration: 1.2,
          ease: 'power4.out',
        });
      }

      // Advanced card animations with 3D transforms and stagger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          });

          tl.from(card, {
            y: 100,
            opacity: 0,
            scale: 0.9,
            rotationY: index % 2 === 0 ? -20 : 20,
            rotationX: 10,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out',
          })
          .from(card.querySelector('.card-content'), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          }, '-=0.6')
          .from(card.querySelector('.card-number'), {
            scale: 0,
            rotation: 180,
            duration: 0.6,
            ease: 'back.out(1.7)',
          }, '-=0.8')
          .from(card.querySelector('.decorative-line'), {
            scaleX: 0,
            duration: 0.6,
            ease: 'power2.out',
          }, '-=0.4');

          // Hover animation with 3D tilt
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              rotationX: 5,
              duration: 0.4,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.4,
              ease: 'power2.out',
            });
          });
        }
      });

      // Floating elements animation
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: '+=30',
            x: i % 2 === 0 ? '+=20' : '-=20',
            rotation: '+=10',
            duration: 4 + i,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-32 px-4 md:px-8 lg:px-16 overflow-hidden perspective-container"
    >
      {/* Floating glass decorative elements */}
      <div 
        ref={(el) => floatingElementsRef.current[0] = el}
        className="absolute top-40 right-20 w-40 h-40 glass-card-light rounded-lg opacity-30 transform-3d"
        style={{ transform: 'rotate(30deg)' }}
      />
      <div 
        ref={(el) => floatingElementsRef.current[1] = el}
        className="absolute bottom-60 left-10 w-32 h-32 glass-card-light rounded-lg opacity-20 transform-3d"
        style={{ transform: 'rotate(-20deg)' }}
      />

      {/* Section Header with glass effect */}
      <div ref={headerRef} className="max-w-7xl mx-auto mb-20 transform-3d">
        <div className="inline-flex items-center gap-4 mb-6 glass-card-light px-6 py-3 rounded-full">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-primary shimmer" />
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">About Us</span>
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-primary shimmer" />
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-6 depth-layer">
          <span className="text-gradient">WHO WE ARE</span>
        </h2>
        <div className="h-1.5 w-32 bg-gradient-to-r from-primary via-secondary to-primary rounded-full glow-blue" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* National Legacy */}
        <div 
          ref={(el) => cardsRef.current[0] = el} 
          className="glass-card p-8 rounded-xl hover:border-primary/50 transition-all duration-500 group depth-card transform-3d relative overflow-hidden"
        >
          <div className="card-content relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="card-number w-12 h-12 border-2 border-primary flex items-center justify-center rounded-lg glow-blue bg-primary/10">
                  <span className="font-mono text-primary font-bold">01</span>
                </div>
                <h3 className="text-2xl font-bold depth-layer">NATIONAL LEGACY</h3>
              </div>
              <div className="w-3 h-3 bg-primary group-hover:bg-secondary transition-colors rounded-sm glow-blue" />
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The Indian Society for Technical Education (ISTE) is a national, non-profit organization 
              committed to advancing technical education and professional growth.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              Originally established in 1941 as APTI and restructured in 1968, ISTE has played a vital 
              role in shaping India's engineering and technology education landscape.
            </p>
            <div className="decorative-line mt-6 flex gap-2">
              <div className="h-1 w-16 bg-primary rounded-full" />
              <div className="h-1 w-8 bg-secondary rounded-full" />
              <div className="h-1 w-4 bg-primary/50 rounded-full" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* GNDEC Chapter */}
        <div 
          ref={(el) => cardsRef.current[1] = el} 
          className="glass-card p-8 rounded-xl hover:border-secondary/50 transition-all duration-500 group depth-card transform-3d relative overflow-hidden"
        >
          <div className="card-content relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="card-number w-12 h-12 border-2 border-secondary flex items-center justify-center rounded-lg glow-cyan bg-secondary/10">
                  <span className="font-mono text-secondary font-bold">02</span>
                </div>
                <h3 className="text-2xl font-bold depth-layer">GNDEC CHAPTER</h3>
              </div>
              <div className="w-3 h-3 bg-secondary group-hover:bg-primary transition-colors rounded-sm glow-cyan" />
            </div>
            <p className="text-foreground/80 leading-relaxed mb-4">
              The ISTE GNDEC Chapter promotes technical excellence through workshops, seminars, and 
              competitions — enabling students to enhance their skills, apply practical knowledge.
            </p>
            <p className="text-foreground/70 leading-relaxed">
              We prepare students for successful careers in the ever-evolving tech industry through 
              hands-on learning and industry connections.
            </p>
            <div className="decorative-line mt-6 flex gap-2">
              <div className="h-1 w-16 bg-secondary rounded-full" />
              <div className="h-1 w-8 bg-primary rounded-full" />
              <div className="h-1 w-4 bg-secondary/50 rounded-full" />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Vision */}
        <div 
          ref={(el) => cardsRef.current[2] = el} 
          className="glass-card p-8 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 hover:border-primary/50 transition-all duration-500 depth-card transform-3d relative overflow-hidden shimmer"
        >
          <div className="card-content relative z-10">
            <div className="mb-6">
              <span className="card-number font-mono text-xs text-primary/70 block mb-2 uppercase tracking-wider">Vision</span>
              <h4 className="text-2xl font-bold depth-layer">OUR FORESIGHT</h4>
              <div className="decorative-line h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded-full mt-3 glow-blue" />
            </div>
            <p className="text-foreground/85 leading-relaxed border-l-2 border-primary pl-4 glow-blue">
              Empowering educators to leverage technology for innovation in teaching and learning, 
              inspiring every learner to reach their highest potential.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div 
          ref={(el) => cardsRef.current[3] = el} 
          className="glass-card p-8 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 hover:border-secondary/50 transition-all duration-500 depth-card transform-3d relative overflow-hidden shimmer"
        >
          <div className="card-content relative z-10">
            <div className="mb-6">
              <span className="card-number font-mono text-xs text-secondary/70 block mb-2 uppercase tracking-wider">Mission</span>
              <h4 className="text-2xl font-bold depth-layer">OUR PURPOSE</h4>
              <div className="decorative-line h-1 w-20 bg-gradient-to-r from-secondary to-transparent rounded-full mt-3 glow-cyan" />
            </div>
            <p className="text-foreground/85 leading-relaxed border-l-2 border-secondary pl-4 glow-cyan">
              To inspire educators worldwide to innovate through technology, foster best practices, 
              and tackle challenges in education by providing a collaborative community, valuable 
              knowledge resources, and the ISTE Standards — a framework for reimagining education 
              and empowering learners.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Background Tech Elements with 3D depth */}
      <div className="absolute top-20 right-0 w-64 h-64 border border-primary/20 rotate-45 glass-card-light rounded-lg transform-3d" style={{ transform: 'rotateX(30deg) rotateY(45deg)' }} />
      <div className="absolute bottom-20 left-0 w-48 h-48 border border-secondary/20 -rotate-12 glass-card-light rounded-lg transform-3d" style={{ transform: 'rotateX(-20deg) rotateY(-30deg)' }} />
    </section>
  );
};

export default TechAbout;
