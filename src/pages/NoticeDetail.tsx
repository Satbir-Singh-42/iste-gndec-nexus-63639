import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechFooter from '@/components/TechFooter';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  description: string;
  created_at?: string;
}

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

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
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            {part}
            <ExternalLink className="w-4 h-4" />
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      console.warn('Supabase not configured');
      return;
    }
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setNotice(data);
    } catch (error: any) {
      console.error('Error fetching notice:', error);
      setNotice(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-primary/10 text-primary border-primary';
      case 'REGISTRATION':
        return 'bg-secondary/10 text-secondary border-secondary';
      case 'SCHEDULED':
        return 'bg-foreground/5 text-foreground/50 border-foreground/50';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted';
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: notice?.title || 'Notice',
          text: notice?.description || '',
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen w-full relative">
        <main className="relative pt-32 pb-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Notice Not Found</h1>
            <p className="text-muted-foreground mb-8">The notice you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/notices')}
              className="tech-border px-6 py-3 font-mono text-sm hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </button>
          </div>
        </main>
        <TechFooter />
      </div>
    );
  }

  const url = extractUrl(notice.description);

  return (
    <div className="min-h-screen w-full relative">

      <main className="relative pt-24 pb-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/notices')}
            className="mb-8 text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all notices
          </button>

          {/* Notice Card */}
          <div className="tech-card p-8 md:p-12 bg-card/50">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary animate-pulse rounded-full" />
                <span className={`font-mono text-sm ${getStatusColor(notice.status)} border-2 px-4 py-1.5 rounded`}>
                  {notice.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span className="font-mono text-sm">{notice.type}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              {notice.title}
            </h1>

            {/* Date & Time */}
            <div className="flex items-center gap-6 mb-8 flex-wrap">
              <div className="flex items-center gap-3 text-foreground/80">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-mono">{notice.date}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="font-mono">{notice.time}</span>
              </div>
            </div>

            {/* Creation Date */}
            {notice.created_at && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono">Posted on {new Date(notice.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {renderDescriptionWithLinks(notice.description)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/50 flex-wrap">
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-border px-6 py-3 font-mono text-sm hover:text-primary transition-colors inline-flex items-center gap-2 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <ExternalLink className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Visit Link</span>
                </a>
              )}
              
              <button
                onClick={handleShare}
                className="tech-border px-6 py-3 font-mono text-sm hover:text-secondary transition-colors inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-secondary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="relative z-10">Share Notice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 right-1/4 w-px h-64 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="absolute bottom-20 left-1/4 w-px h-48 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      </main>

      <TechFooter />
    </div>
  );
};

export default NoticeDetail;
