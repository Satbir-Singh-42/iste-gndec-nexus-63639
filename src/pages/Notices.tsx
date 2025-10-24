import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { supabase } from '@/lib/supabase';

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
}

const Notices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotices, setExpandedNotices] = useState<Set<number>>(new Set());

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
        .order('date', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen w-full relative">
      <TechNavbar />

      <main className="relative pt-24 pb-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-0.5 w-12 bg-secondary" />
              <span className="font-mono text-xs text-secondary tracking-[0.3em]">UPDATES</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-4">
              NOTICE BOARD
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-secondary to-primary mb-6" />
            <p className="text-muted-foreground font-mono text-sm">
              STAY_UPDATED // LATEST_EVENTS // ANNOUNCEMENTS
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground text-lg">Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="tech-card p-12 text-center">
              <p className="text-muted-foreground text-lg">No notices available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((notice) => {
                const url = extractUrl(notice.description);
                const isExpanded = expandedNotices.has(notice.id);
                
                return (
                  <div
                    key={notice.id}
                    onClick={() => navigate(`/notices/${notice.id}`)}
                    className="tech-card p-6 hover:border-primary/50 transition-all duration-300 group bg-card/50 hover:bg-card/80 cursor-pointer"
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

                    {/* Description - Fixed height with expand/collapse */}
                    <div className="relative mb-4">
                      <p className={`text-sm text-foreground/70 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {renderDescriptionWithLinks(notice.description)}
                      </p>
                      {notice.description.length > 120 && (
                        <button
                          onClick={(e) => toggleNoticeExpansion(notice.id, e)}
                          className="text-xs text-primary hover:underline mt-1 font-mono"
                        >
                          {isExpanded ? 'show less' : '...more'}
                        </button>
                      )}
                    </div>

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
                );
              })}
            </div>
          )}
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 right-1/4 w-px h-64 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute bottom-20 left-1/3 w-px h-48 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      </main>

      <TechFooter />
    </div>
  );
};

export default Notices;
