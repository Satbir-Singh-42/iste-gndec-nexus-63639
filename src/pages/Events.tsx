import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Calendar, MapPin, Clock, Users, Instagram, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
}

interface EventHighlight {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  poster: string;
  instagram_link: string;
  attendees: string;
  highlights: string[];
}

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [highlights, setHighlights] = useState<EventHighlight[]>([]);
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
      toast.error('Database connection not configured');
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchEvents(), fetchHighlights()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setUpcomingEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const fetchHighlights = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('event_highlights')
        .select('*')
        .order('date', { ascending: false});

      if (error) throw error;
      setHighlights(data || []);
    } catch (error: any) {
      console.error('Error fetching highlights:', error);
      toast.error('Failed to load event highlights');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <TechNavbar />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">EVENTS PORTAL</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with upcoming workshops, competitions, and technical sessions
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary" />
            Upcoming Events
          </h2>
          
          {upcomingEvents.length === 0 ? (
            <div className="tech-card p-8 text-center">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="tech-card p-6 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                    <span className="px-3 py-1 text-xs font-mono bg-primary/20 text-primary border border-primary/30">
                      {event.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">{renderTextWithLinks(event.description)}</p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-foreground/80">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground/80">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground/80">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.capacity}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-xs font-mono text-primary">CLICK FOR DETAILS</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Event Details Dialog */}
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                  <span className="w-1 h-8 bg-primary" />
                  {selectedEvent?.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 text-xs font-mono bg-primary/20 text-primary border border-primary/30">
                    {selectedEvent?.status.toUpperCase()}
                  </span>
                  {selectedEvent?.organizer && (
                    <span className="text-sm text-muted-foreground">Organized by {selectedEvent?.organizer}</span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">DATE</div>
                      <div className="font-semibold">{selectedEvent?.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">TIME</div>
                      <div className="font-semibold">{selectedEvent?.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">LOCATION</div>
                      <div className="font-semibold">{selectedEvent?.location}</div>
                    </div>
                  </div>
                  {selectedEvent?.capacity && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">CAPACITY</div>
                        <div className="font-semibold">{selectedEvent?.capacity}</div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedEvent?.details && (
                  <div className="tech-card p-4">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="w-1 h-5 bg-primary" />
                      About
                    </h4>
                    <p className="text-muted-foreground">{renderTextWithLinks(selectedEvent?.details)}</p>
                  </div>
                )}

                {selectedEvent?.agenda && selectedEvent.agenda.length > 0 && (
                  <div className="tech-card p-4">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-primary" />
                      Agenda
                    </h4>
                    <div className="space-y-2">
                      {selectedEvent?.agenda.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="font-mono text-xs text-primary mt-1">{String(index + 1).padStart(2, '0')}</span>
                          <span className="text-sm text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </section>

        {/* Highlights Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-secondary" />
            Event Highlights
          </h2>
          
          {highlights.length === 0 ? (
            <div className="tech-card p-8 text-center">
              <p className="text-muted-foreground">No event highlights available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {highlights.map((highlight) => (
                <div 
                  key={highlight.id} 
                  className="tech-card overflow-hidden group hover:border-secondary/50 transition-all"
                >
                  {/* Event Poster */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={highlight.poster} 
                      alt={highlight.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Instagram Link Overlay */}
                    {highlight.instagram_link && (
                      <a
                        href={highlight.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-3">
                    <h3 className="text-sm font-bold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                      {highlight.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3 text-secondary" />
                        <span>{highlight.date}</span>
                      </div>
                      
                      {highlight.instagram_link && (
                        <a
                          href={highlight.instagram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-secondary hover:text-secondary/80 transition-colors"
                        >
                          <Instagram className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <TechFooter />
    </div>
  );
};

export default Events;
