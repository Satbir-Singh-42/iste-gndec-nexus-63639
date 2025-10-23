import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Calendar, MapPin, Clock, Users, Instagram, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof upcomingEvents[0] | null>(null);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Workshop 2024',
      date: 'March 15, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Seminar Hall',
      description: 'Hands-on workshop on emerging technologies and innovations.',
      status: 'upcoming',
      capacity: '100 participants',
      organizer: 'Technical Society',
      details: 'Join us for an intensive hands-on workshop covering the latest trends in AI, Machine Learning, and Web Development. Industry experts will guide you through practical sessions with real-world applications.',
      agenda: ['Registration & Welcome', 'Session 1: AI Fundamentals', 'Lunch Break', 'Session 2: ML Practical', 'Session 3: Web Dev Workshop', 'Q&A & Networking'],
    },
    {
      id: 2,
      title: 'Coding Competition',
      date: 'March 22, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Computer Lab',
      description: 'Test your coding skills in this exciting competition.',
      status: 'upcoming',
      capacity: '50 participants',
      organizer: 'Technical Society',
      details: 'An intense coding competition featuring algorithmic challenges and problem-solving tasks. Compete with peers and win exciting prizes!',
      agenda: ['Registration', 'Round 1: Warm-up Problems', 'Round 2: Advanced Challenges', 'Final Round', 'Prize Distribution'],
    },
  ];

  const highlights = [
    {
      id: 1,
      title: 'Annual Tech Fest 2023',
      date: 'December 20, 2023',
      location: 'Main Auditorium',
      description: 'A three-day extravaganza featuring workshops, competitions, and tech talks by industry experts.',
      poster: '/placeholder.svg',
      instagramLink: 'https://instagram.com/p/example1',
      attendees: '500+ participants',
      highlights: ['10+ Workshops', '5 Tech Competitions', 'Industry Expert Sessions', 'Networking Opportunities'],
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      date: 'November 10, 2023',
      location: 'Computer Lab',
      description: 'Intensive bootcamp covering modern web development frameworks and best practices.',
      poster: '/placeholder.svg',
      instagramLink: 'https://instagram.com/p/example2',
      attendees: '80 participants',
      highlights: ['React & Next.js', 'Backend Development', 'Deployment & DevOps', 'Project Building'],
    },
    {
      id: 3,
      title: 'AI/ML Workshop Series',
      date: 'October 5, 2023',
      location: 'Seminar Hall',
      description: 'Comprehensive workshop series on artificial intelligence and machine learning fundamentals.',
      poster: '/placeholder.svg',
      instagramLink: 'https://instagram.com/p/example3',
      attendees: '120 participants',
      highlights: ['Python for AI', 'Neural Networks', 'Real-world Projects', 'Certification'],
    },
  ];

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
                
                <p className="text-muted-foreground mb-6">{event.description}</p>
                
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
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event.capacity}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="text-xs font-mono text-primary">CLICK FOR DETAILS</span>
                </div>
              </div>
            ))}
          </div>

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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-mono bg-primary/20 text-primary border border-primary/30">
                    {selectedEvent?.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-muted-foreground">Organized by {selectedEvent?.organizer}</span>
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
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">CAPACITY</div>
                      <div className="font-semibold">{selectedEvent?.capacity}</div>
                    </div>
                  </div>
                </div>

                <div className="tech-card p-4">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary" />
                    About
                  </h4>
                  <p className="text-muted-foreground">{selectedEvent?.details}</p>
                </div>

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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((highlight) => (
              <div 
                key={highlight.id} 
                className="tech-card overflow-hidden group hover:border-secondary/50 transition-all"
              >
                {/* Event Poster */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img 
                    src={highlight.poster} 
                    alt={highlight.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Instagram Link Overlay */}
                  <a
                    href={highlight.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-secondary transition-colors">
                    {highlight.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>{highlight.date}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>{highlight.attendees}</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                    {highlight.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 mb-4">
                    {highlight.highlights.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <span className="w-1 h-1 bg-secondary rounded-full" />
                        <span className="text-foreground/60">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* View on Instagram Link */}
                  <a
                    href={highlight.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-secondary hover:text-secondary/80 transition-colors group/link"
                  >
                    <span>VIEW ON INSTAGRAM</span>
                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <TechFooter />
    </div>
  );
};

export default Events;
