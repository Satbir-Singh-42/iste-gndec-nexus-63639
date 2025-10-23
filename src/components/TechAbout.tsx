import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechAbout = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
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
      className="relative py-32 px-4 md:px-8 lg:px-16"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-0.5 w-12 bg-primary" />
          <span className="font-mono text-xs text-primary tracking-[0.3em]">ABOUT_US</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-4">
          WHO WE ARE
        </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* National Legacy */}
        <div ref={(el) => cardsRef.current[0] = el} className="tech-card p-8 hover:border-primary/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-primary flex items-center justify-center">
                <span className="font-mono text-primary font-bold">01</span>
              </div>
              <h3 className="text-2xl font-bold">NATIONAL LEGACY</h3>
            </div>
            <div className="w-3 h-3 bg-primary group-hover:bg-secondary transition-colors" />
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">
            The Indian Society for Technical Education (ISTE) is a national, non-profit organization 
            committed to advancing technical education and professional growth.
          </p>
          <p className="text-foreground/70 leading-relaxed">
            Originally established in 1941 as APTI and restructured in 1968, ISTE has played a vital 
            role in shaping India's engineering and technology education landscape.
          </p>
          <div className="mt-6 flex gap-2">
            <div className="h-1 w-16 bg-primary" />
            <div className="h-1 w-8 bg-secondary" />
            <div className="h-1 w-4 bg-primary/50" />
          </div>
        </div>

        {/* GNDEC Chapter */}
        <div ref={(el) => cardsRef.current[1] = el} className="tech-card p-8 hover:border-secondary/50 transition-all duration-300 group">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-secondary flex items-center justify-center">
                <span className="font-mono text-secondary font-bold">02</span>
              </div>
              <h3 className="text-2xl font-bold">GNDEC CHAPTER</h3>
            </div>
            <div className="w-3 h-3 bg-secondary group-hover:bg-primary transition-colors" />
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">
            The ISTE GNDEC Chapter promotes technical excellence through workshops, seminars, and 
            competitions — enabling students to enhance their skills, apply practical knowledge.
          </p>
          <p className="text-foreground/70 leading-relaxed">
            We prepare students for successful careers in the ever-evolving tech industry through 
            hands-on learning and industry connections.
          </p>
          <div className="mt-6 flex gap-2">
            <div className="h-1 w-16 bg-secondary" />
            <div className="h-1 w-8 bg-primary" />
            <div className="h-1 w-4 bg-secondary/50" />
          </div>
        </div>

        {/* Vision */}
        <div ref={(el) => cardsRef.current[2] = el} className="tech-card p-8 bg-primary/5 hover:border-primary/50 transition-all duration-300">
          <div className="mb-6">
            <span className="font-mono text-xs text-primary/70 block mb-2">VISION</span>
            <h4 className="text-2xl font-bold">OUR FORESIGHT</h4>
            <div className="h-1 w-20 bg-primary mt-3" />
          </div>
          <p className="text-foreground/80 leading-relaxed border-l-2 border-primary pl-4">
            Empowering educators to leverage technology for innovation in teaching and learning, 
            inspiring every learner to reach their highest potential.
          </p>
        </div>

        {/* Mission */}
        <div ref={(el) => cardsRef.current[3] = el} className="tech-card p-8 bg-secondary/5 hover:border-secondary/50 transition-all duration-300">
          <div className="mb-6">
            <span className="font-mono text-xs text-secondary/70 block mb-2">MISSION</span>
            <h4 className="text-2xl font-bold">OUR PURPOSE</h4>
            <div className="h-1 w-20 bg-secondary mt-3" />
          </div>
          <p className="text-foreground/80 leading-relaxed border-l-2 border-secondary pl-4">
            To inspire educators worldwide to innovate through technology, foster best practices, 
            and tackle challenges in education by providing a collaborative community, valuable 
            knowledge resources, and the ISTE Standards — a framework for reimagining education 
            and empowering learners.
          </p>
        </div>
      </div>

      {/* Background Tech Elements */}
      <div className="absolute top-20 right-0 w-64 h-64 border border-primary/10 rotate-45" />
      <div className="absolute bottom-20 left-0 w-48 h-48 border border-secondary/10 -rotate-12" />
    </section>
  );
};

export default TechAbout;
