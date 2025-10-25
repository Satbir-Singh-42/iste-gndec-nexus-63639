import TechFooter from "@/components/TechFooter";
import { Calendar, MapPin, Clock, Users, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  hidden?: boolean;
  display_order?: number;
}

interface EventHighlight {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  poster: string;
  instagram_link: string;
  highlights: string[];
  hidden?: boolean;
  display_order?: number;
}

const Events = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);
  const [completedEvents, setCompletedEvents] = useState<Event[]>([]);
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
            onClick={(e) => e.stopPropagation()}>
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
      toast.error("Database connection not configured");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchEvents(), fetchHighlights()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("display_order", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false });

      if (error) throw error;

      const allEvents = data || [];

      setUpcomingEvents(
        allEvents.filter((event) => event.status?.toUpperCase() === "UPCOMING")
      );
      setOngoingEvents(
        allEvents.filter((event) => event.status?.toUpperCase() === "ONGOING")
      );
      setCompletedEvents(
        allEvents.filter((event) => event.status?.toUpperCase() === "COMPLETED")
      );
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    }
  };

  const fetchHighlights = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("event_highlights")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("display_order", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false });

      if (error) throw error;
      setHighlights(data || []);
    } catch (error: any) {
      console.error("Error fetching highlights:", error);
      toast.error("Failed to load event highlights");
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
    <div className="min-h-screen w-full relative z-10">
        <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-wider">
                EVENTS PORTAL
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
              Our Events
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with upcoming workshops, competitions, and technical
              sessions
            </p>
          </div>

          {/* Ongoing Events */}
          {ongoingEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-secondary" />
                Ongoing Events
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {ongoingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="tech-card p-6 hover:border-secondary/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-secondary transition-colors">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-mono bg-secondary/20 text-secondary border border-secondary/30">
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {renderTextWithLinks(event.description)}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/80">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center gap-3 text-foreground/80">
                          <Users className="w-4 h-4 text-secondary" />
                          <span>{event.capacity}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs font-mono text-secondary">
                        CLICK FOR DETAILS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-primary" />
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <div className="tech-card p-8 text-center">
                <p className="text-muted-foreground">
                  No upcoming events at the moment. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="tech-card p-6 hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-mono bg-primary/20 text-primary border border-primary/30">
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {renderTextWithLinks(event.description)}
                    </p>

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
                      <span className="text-xs font-mono text-primary">
                        CLICK FOR DETAILS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Completed Events */}
          {completedEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-muted-foreground" />
                Past Events
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {completedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="tech-card p-6 hover:border-muted-foreground/50 transition-all cursor-pointer group opacity-75"
                    onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-foreground/80 group-hover:text-muted-foreground transition-colors">
                        {event.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-mono bg-muted/20 text-muted-foreground border border-muted">
                        {event.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-6">
                      {renderTextWithLinks(event.description)}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-foreground/60">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-foreground/60">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-xs font-mono text-muted-foreground">
                        CLICK FOR DETAILS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Highlights Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-accent" />
              Event Highlights
            </h2>

            {highlights.length === 0 ? (
              <div className="tech-card p-8 text-center">
                <p className="text-muted-foreground">
                  No event highlights available yet.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="tech-card overflow-hidden group hover:border-accent/50 transition-all flex-shrink-0 w-64 snap-start">
                      {/* Event Poster */}
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {highlight.instagram_link ? (
                          <a
                            href={highlight.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0">
                            <img
                              src={highlight.poster}
                              alt={highlight.title}
                              className="w-full h-full object-cover cursor-pointer"
                              loading="lazy"
                            />
                          </a>
                        ) : (
                          <img
                            src={highlight.poster}
                            alt={highlight.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}

                        {/* Instagram Link Overlay */}
                        {highlight.instagram_link && (
                          <a
                            href={highlight.instagram_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100 z-10"
                            onClick={(e) => e.stopPropagation()}>
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {/* Event Details */}
                      <div className="p-3">
                        <h3 className="text-sm font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {highlight.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 text-accent" />
                          <span>{highlight.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>

        <TechFooter />
      </div>
  );
};

export default Events;
