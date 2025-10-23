import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
    if (notices.length === 0) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            x: index % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 0.6,
            delay: (index % 3) * 0.1,
          });
        }
      });
    });

    return () => ctx.revert();
  }, [notices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'text-primary border-primary';
      case 'REGISTRATION':
        return 'text-secondary border-secondary';
      case 'SCHEDULED':
        return 'text-foreground/50 border-foreground/50';
      default:
        return 'text-muted-foreground border-muted';
    }
  };

  return (
    <section 
      id="notices" 
      ref={sectionRef}
      className="relative py-32 px-4 md:px-8 lg:px-16 border-t border-border/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-0.5 w-12 bg-secondary" />
            <span className="font-mono text-xs text-secondary tracking-[0.3em]">UPDATES</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            NOTICE BOARD
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-secondary to-primary" />
          <p className="mt-4 text-muted-foreground font-mono text-sm">
            STAY_UPDATED // LATEST_EVENTS // ANNOUNCEMENTS
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading notices...</p>
          </div>
        ) : notices.length === 0 ? (
          <div className="tech-card p-8 text-center">
            <p className="text-muted-foreground">No notices available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice, index) => (
              <div
                key={notice.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="tech-card p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer bg-card/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary animate-pulse" />
                    <span className={`font-mono text-xs ${getStatusColor(notice.status)} border px-2 py-0.5`}>
                      {notice.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{notice.type}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
                  {notice.title}
                </h3>

                {/* Date & Time */}
                <div className="flex items-center gap-4 mb-4 font-mono text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {notice.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {notice.time}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                  {notice.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="font-mono text-xs text-muted-foreground">ID: {notice.id.toString().padStart(3, '0')}</span>
                  <svg 
                    className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-px h-64 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-1/3 w-px h-48 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
    </section>
  );
};

export default TechNoticeBoard;
