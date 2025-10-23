import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Linkedin, Github } from 'lucide-react';

const Members = () => {
  const coreTeam = [
    {
      id: 1,
      name: 'John Doe',
      position: 'President',
      image: '/placeholder.svg',
      email: 'john@example.com',
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Vice President',
      image: '/placeholder.svg',
      email: 'jane@example.com',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Technical Head',
      image: '/placeholder.svg',
      email: 'mike@example.com',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      position: 'Events Coordinator',
      image: '/placeholder.svg',
      email: 'sarah@example.com',
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
            <span className="text-xs font-mono text-primary tracking-wider">TEAM PORTAL</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated team members driving innovation and excellence
          </p>
        </div>

        {/* Core Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary" />
            Core Team
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreTeam.map((member) => (
              <div key={member.id} className="tech-card p-6 hover:border-primary/50 transition-all group">
                <div className="aspect-square mb-4 overflow-hidden bg-muted relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm font-mono text-primary mb-4">{member.position}</p>
                
                <div className="flex items-center gap-3">
                  <a 
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 border border-border hover:border-primary flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a 
                    href="#"
                    className="w-8 h-8 border border-border hover:border-primary flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href="#"
                    className="w-8 h-8 border border-border hover:border-primary flex items-center justify-center transition-colors"
                  >
                    <Github className="w-4 h-4" />
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

export default Members;
