import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Linkedin } from 'lucide-react';

const Members = () => {
  const faculty = [
    {
      id: 1,
      name: 'Faculty Coordinator',
      position: 'Faculty Coordinator',
      image: '/placeholder.svg',
      email: 'faculty@gne.edu.in',
    },
  ];

  const coreTeam = [
    { id: 1, name: 'Satbir Singh', position: 'Convenor', image: '/placeholder.svg', email: 'satbir@gne.edu.in' },
    { id: 2, name: 'Harmandeep Singh', position: 'Co Convenor', image: '/placeholder.svg', email: 'harman@gne.edu.in' },
    { id: 3, name: 'Palak Batra', position: 'Secretary', image: '/placeholder.svg', email: 'palak@gne.edu.in' },
    { id: 4, name: 'Kanwarpartap Singh', position: 'Secretary', image: '/placeholder.svg', email: 'kanwar@gne.edu.in' },
    { id: 5, name: 'Tanveer Kaur', position: 'PR Advisor', image: '/placeholder.svg', email: 'tanveer@gne.edu.in' },
    { id: 6, name: 'Sakshi', position: 'Co Convenor', image: '/placeholder.svg', email: 'sakshi@gne.edu.in' },
    { id: 7, name: 'Vivek Kumar', position: 'Publicity Officer', image: '/placeholder.svg', email: 'vivek@gne.edu.in' },
  ];

  const heads = [
    { id: 1, name: 'Malika', position: 'Promotion Head', image: '/placeholder.svg', email: 'malika@gne.edu.in' },
    { id: 2, name: 'Gurkamal', position: 'Content Head', image: '/placeholder.svg', email: 'gurkamal@gne.edu.in' },
    { id: 3, name: 'Shruti Verma', position: 'Promotion Head', image: '/placeholder.svg', email: 'shruti@gne.edu.in' },
    { id: 4, name: 'Manjot Kaur', position: 'Content Head', image: '/placeholder.svg', email: 'manjot@gne.edu.in' },
    { id: 5, name: 'Jaskaran Singh Sokhal', position: 'Event Management Head', image: '/placeholder.svg', email: 'jaskaran@gne.edu.in' },
    { id: 6, name: 'Raman Tiwari', position: 'Discipline Head', image: '/placeholder.svg', email: 'raman@gne.edu.in' },
    { id: 7, name: 'Aryan Pandey', position: 'Database Head', image: '/placeholder.svg', email: 'aryan@gne.edu.in' },
    { id: 8, name: 'Arshdeep Singh', position: 'Event Management Head', image: '/placeholder.svg', email: 'arshdeep@gne.edu.in' },
    { id: 9, name: 'Navneet Saini', position: 'Creative Head', image: '/placeholder.svg', email: 'navneet@gne.edu.in' },
    { id: 10, name: 'Anjali Kumari', position: 'Database Head', image: '/placeholder.svg', email: 'anjali@gne.edu.in' },
    { id: 11, name: 'Kanika Mittal', position: 'Creative Head', image: '/placeholder.svg', email: 'kanika@gne.edu.in' },
    { id: 12, name: 'Gurpreet Kaur', position: 'Event Management Head', image: '/placeholder.svg', email: 'gurpreet@gne.edu.in' },
    { id: 13, name: 'Jeeya Thapar', position: 'Creative Head', image: '/placeholder.svg', email: 'jeeya@gne.edu.in' },
  ];

  const executiveTeam = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Executive Member ${i + 1}`,
    position: 'Executive Member',
    image: '/placeholder.svg',
    email: `exec${i + 1}@gne.edu.in`,
  }));

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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Meet the dedicated team members driving innovation and excellence
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#faculty"
              className="group relative inline-flex items-center gap-2 tech-border px-6 py-3 font-semibold text-foreground hover:text-primary transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-mono text-xs tracking-wider">FACULTY</span>
            </a>
            <a 
              href="#core"
              className="group relative inline-flex items-center gap-2 tech-border px-6 py-3 font-semibold text-foreground hover:text-primary transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-mono text-xs tracking-wider">CORE</span>
            </a>
            <a 
              href="#heads"
              className="group relative inline-flex items-center gap-2 tech-border px-6 py-3 font-semibold text-foreground hover:text-primary transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-mono text-xs tracking-wider">HEADS</span>
            </a>
            <a 
              href="#executives"
              className="group relative inline-flex items-center gap-2 tech-border px-6 py-3 font-semibold text-foreground hover:text-primary transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 font-mono text-xs tracking-wider">EXECUTIVES</span>
            </a>
          </div>
        </div>

        {/* Faculty */}
        <section id="faculty" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary" />
            Faculty Coordinator
          </h2>
          
          <div className="max-w-sm mx-auto">
            {faculty.map((member) => (
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
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Team */}
        <section id="core" className="mb-16 scroll-mt-24">
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
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Department Heads */}
        <section id="heads" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary" />
            Department Heads
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {heads.map((member) => (
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
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Team */}
        <section id="executives" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-primary" />
            Executive Team
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {executiveTeam.map((member) => (
              <div key={member.id} className="tech-card p-4 hover:border-primary/50 transition-all group">
                <div className="aspect-square mb-3 overflow-hidden bg-muted relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-sm font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-xs font-mono text-primary">{member.position}</p>
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
