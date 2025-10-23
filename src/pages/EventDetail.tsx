import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, Tag } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  status: string;
  capacity?: string;
  organizer?: string;
  details?: string;
  agenda?: string[];
  created_at?: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
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
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error: any) {
      console.error('Error fetching event:', error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return 'bg-primary/10 text-primary border-primary';
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title || 'Event',
          text: event?.description || '',
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
        <TechNavbar />
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen w-full relative">
        <TechNavbar />
        <main className="relative pt-32 pb-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/events')}
              className="tech-border px-6 py-3 font-mono text-sm hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>
        </main>
        <TechFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      <TechNavbar />

      <main className="relative pt-24 pb-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/events')}
            className="mb-8 text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all events
          </button>

          {/* Event Card */}
          <div className="tech-card p-8 md:p-12 bg-card/50">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary animate-pulse rounded-full" />
                <span className={`font-mono text-sm ${getStatusColor(event.status)} border-2 px-4 py-1.5 rounded`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
              {event.organizer && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="w-4 h-4" />
                  <span className="font-mono text-sm">Organized by {event.organizer}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              {event.title}
            </h1>

            {/* Event Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3 text-foreground/80">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-mono text-xs text-muted-foreground">DATE</div>
                  <div className="font-semibold">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-mono text-xs text-muted-foreground">TIME</div>
                  <div className="font-semibold">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-mono text-xs text-muted-foreground">LOCATION</div>
                  <div className="font-semibold">{event.location}</div>
                </div>
              </div>
              {event.capacity && (
                <div className="flex items-center gap-3 text-foreground/80">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">CAPACITY</div>
                    <div className="font-semibold">{event.capacity}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

            {/* Description */}
            <div className="mb-8">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90">
                  {renderTextWithLinks(event.description)}
                </p>
              </div>
            </div>

            {/* Details Section */}
            {event.details && (
              <div className="mb-8">
                <div className="tech-card p-6 bg-card/30">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary" />
                    Event Details
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {renderTextWithLinks(event.details)}
                  </p>
                </div>
              </div>
            )}

            {/* Agenda Section */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="mb-8">
                <div className="tech-card p-6 bg-card/30">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary" />
                    Agenda
                  </h3>
                  <div className="space-y-3">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="font-mono text-xs text-primary mt-1 bg-primary/10 px-2 py-1 rounded">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm text-foreground flex-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-10 pt-8 border-t border-border/50 flex-wrap">
              <button
                onClick={handleShare}
                className="tech-border px-6 py-3 font-mono text-sm hover:text-primary transition-colors inline-flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="relative z-10">Share Event</span>
              </button>
            </div>
          </div>
        </div>

      </main>

      <TechFooter />
    </div>
  );
};

export default EventDetail;
