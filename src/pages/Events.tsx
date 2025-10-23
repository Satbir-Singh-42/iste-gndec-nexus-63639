import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
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
      </main>

      <TechFooter />
    </div>
  );
};

export default Events;
