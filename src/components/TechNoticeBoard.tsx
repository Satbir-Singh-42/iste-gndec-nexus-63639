import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  rich_description?: string;
  poster_url?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  external_link?: string;
  hidden?: boolean;
  display_order?: number;
}

const TechNoticeBoard = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotices, setExpandedNotices] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const extractUrl = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  const getTruncatedHTML = (html: string, maxLength: number = 150) => {
    // Strip HTML tags for length calculation
    const textContent = html.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return html;
    
    // Find a good breaking point
    const truncated = textContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const cutPoint = lastSpace > 0 ? lastSpace : maxLength;
    
    // Return truncated plain text
    return textContent.substring(0, cutPoint) + '...';
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
        .or('hidden.is.null,hidden.eq.false')
        .order('date', { ascending: false })
        .limit(3);

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

  const toggleNoticeExpansion = (noticeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNotices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noticeId)) {
        newSet.delete(noticeId);
      } else {
        newSet.add(noticeId);
      }
      return newSet;
    });
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
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
            
            <button
              onClick={() => navigate('/notices')}
              className="tech-border px-6 py-3 font-mono text-sm hover:text-primary transition-colors group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                SEE ALL NOTICES
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
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
            {notices.map((notice, index) => {
              const url = extractUrl(notice.description);
              const isExpanded = expandedNotices.has(notice.id);
              
              return (
                <div
                  key={notice.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  onClick={() => navigate(`/notices/${notice.id}`)}
                  className="tech-card hover:border-primary/50 transition-all duration-300 group bg-card/50 hover:bg-card/80 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
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

                  {/* Description - Rich HTML with truncation */}
                  <div className="relative mb-4">
                    {notice.rich_description ? (
                      <div 
                        className="text-sm text-foreground/70 leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2"
                        dangerouslySetInnerHTML={{ 
                          __html: isExpanded ? notice.rich_description : getTruncatedHTML(notice.rich_description, 150)
                        }}
                      />
                    ) : (
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {notice.description}
                      </p>
                    )}
                    {((notice.rich_description && notice.rich_description.replace(/<[^>]*>/g, '').length > 150) || notice.description.length > 120) && (
                      <button
                        onClick={(e) => toggleNoticeExpansion(notice.id, e)}
                        className="text-xs text-primary hover:underline mt-1 font-mono"
                      >
                        {isExpanded ? 'show less' : '...more'}
                      </button>
                    )}
                  </div>

                  {/* Attachments indicator */}
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 text-xs font-mono text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span>{notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* External Link indicator */}
                  {notice.external_link && (
                    <div className="flex items-center gap-2 mb-4">
                      <a
                        href={notice.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Register / View Link
                      </a>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-end pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-primary text-sm font-mono hover:underline cursor-pointer">
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-xs">View Notice</span>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-px h-64 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-1/3 w-px h-48 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
    </section>
  );
};

export default TechNoticeBoard;
