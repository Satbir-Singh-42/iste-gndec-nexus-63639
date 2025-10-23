import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';

gsap.registerPlugin(ScrollTrigger);

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
}

const TechNoticeBoard = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const extractUrl = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  const renderDescriptionWithLinks = (description: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = description.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      console.warn('Supabase not configured, notices will not load');
      return;
    }
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('date', { ascending: true })
        .limit(6);

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: 'power3.out',
        });
      }

      // Floating elements animation
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: '+=25',
            x: i % 2 === 0 ? '+=15' : '-=15',
            rotation: i % 2 === 0 ? '+=8' : '-=8',
            duration: 3.5 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (notices.length === 0) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          // Advanced card entrance with 3D transform
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });

          tl.from(card, {
            y: 80,
            x: index % 2 === 0 ? -40 : 40,
            opacity: 0,
            scale: 0.85,
            rotationY: index % 2 === 0 ? -25 : 25,
            rotationX: 15,
            duration: 1,
            delay: (index % 3) * 0.12,
            ease: 'power3.out',
          })
          .from(card.querySelector('.notice-header'), {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          }, '-=0.6')
          .from(card.querySelector('.notice-content'), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          }, '-=0.5')
          .from(card.querySelector('.notice-footer'), {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          }, '-=0.4');

          // 3D hover effect
          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -12,
              scale: 1.03,
              rotationX: 5,
              rotationY: index % 2 === 0 ? 3 : -3,
              duration: 0.5,
              ease: 'power2.out',
            });
          });

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: 'power2.out',
            });
          });
        }
      });
    });

    return () => ctx.revert();
  }, [notices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'text-primary border-primary bg-primary/10';
      case 'REGISTRATION':
        return 'text-secondary border-secondary bg-secondary/10';
      case 'SCHEDULED':
        return 'text-accent border-accent bg-accent/10';
      default:
        return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  return (
    <section 
      id="notices" 
      ref={sectionRef}
      className="relative py-32 px-4 md:px-8 lg:px-16 border-t border-border/50 overflow-hidden perspective-container"
    >
      {/* Floating glass decorative elements */}
      <div 
        ref={(el) => floatingElementsRef.current[0] = el}
        className="absolute top-20 right-32 w-36 h-36 glass-card-light rounded-lg opacity-25 transform-3d"
        style={{ transform: 'rotate(25deg)' }}
      />
      <div 
        ref={(el) => floatingElementsRef.current[1] = el}
        className="absolute bottom-40 left-20 w-28 h-28 glass-card-light rounded-lg opacity-20 transform-3d"
        style={{ transform: 'rotate(-35deg)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Enhanced Section Header */}
        <div ref={headerRef} className="mb-20">
          <div className="inline-flex items-center gap-4 mb-6 glass-card-light px-6 py-3 rounded-full">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-secondary shimmer" />
            <span className="font-mono text-xs text-secondary tracking-[0.3em] uppercase">Updates</span>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-secondary shimmer" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 depth-layer">
            <span className="text-gradient">NOTICE BOARD</span>
          </h2>
          <div className="h-1.5 w-32 bg-gradient-to-r from-secondary via-primary to-secondary rounded-full glow-cyan" />
          <p className="mt-6 text-muted-foreground font-mono text-sm glass-card-light inline-block px-4 py-2 rounded-lg">
            STAY_UPDATED // LATEST_EVENTS // ANNOUNCEMENTS
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-full">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-mono">Loading notices...</p>
            </div>
          </div>
        ) : notices.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-xl">
            <p className="text-muted-foreground font-mono">No notices available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice, index) => {
              const url = extractUrl(notice.description);
              
              return (
                <div
                  key={notice.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all duration-500 group depth-card transform-3d relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Header */}
                  <div className="notice-header relative z-10 flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse glow-blue" />
                      <span className={`font-mono text-xs ${getStatusColor(notice.status)} border px-3 py-1 rounded-full depth-layer`}>
                        {notice.status}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground glass-card-light px-2 py-1 rounded">{notice.type}</span>
                  </div>

                  {/* Title */}
                  <div className="notice-content relative z-10">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-gradient transition-all depth-layer">
                      {notice.title}
                    </h3>

                    {/* Date & Time */}
                    <div className="flex items-center gap-4 mb-4 font-mono text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 glass-card-light px-2 py-1 rounded">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {notice.date}
                      </div>
                      <div className="flex items-center gap-2 glass-card-light px-2 py-1 rounded">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {notice.time}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {renderDescriptionWithLinks(notice.description)}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="notice-footer relative z-10 flex items-center justify-end pt-4 border-t border-border/30">
                    {url && (
                      <div className="flex items-center gap-2 text-primary text-sm font-mono glass-card-light px-3 py-1.5 rounded-full glow-blue">
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-xs">Link</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Enhanced Background Elements with depth */}
      <div className="absolute top-0 right-1/4 w-px h-64 bg-gradient-to-b from-transparent via-primary/40 to-transparent glow-blue" />
      <div className="absolute bottom-0 left-1/3 w-px h-48 bg-gradient-to-b from-transparent via-secondary/40 to-transparent glow-cyan" />
      
      {/* Corner accent lines */}
      <div className="absolute top-32 left-0 w-24 h-24 border-l-2 border-t-2 border-primary/20 glass-card-light" />
      <div className="absolute bottom-32 right-0 w-24 h-24 border-r-2 border-b-2 border-secondary/20 glass-card-light" />
    </section>
  );
};

export default TechNoticeBoard;
