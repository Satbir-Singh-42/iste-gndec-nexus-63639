import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Workshop 2024',
      date: 'March 15, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Seminar Hall',
      description: 'Hands-on workshop on emerging technologies and innovations.',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Coding Competition',
      date: 'March 22, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Computer Lab',
      description: 'Test your coding skills in this exciting competition.',
      status: 'upcoming',
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
              <div key={event.id} className="tech-card p-6 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{event.title}</h3>
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
