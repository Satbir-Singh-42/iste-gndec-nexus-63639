import { useState } from 'react';
import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Linkedin } from 'lucide-react';

const Members = () => {
  const [activeTab, setActiveTab] = useState('core');

  const faculty = {
    name: 'Dr. Arvind Dhingra, Ph.D',
    title: 'Associate Professor, Department of Electrical Engineering',
    image: '/placeholder.svg',
    description: 'Dr. Arvind Dhingra is current executive director of STEP. He does research in Curriculum Theory, Educational Leadership and Educational Management.',
    achievements: 'He has 12 Journal and 68 Conference publications with more than 25 years of experience and honored by IESA award, National Cement Educator Award.',
  };

  const coreTeam = [
    { id: 1, name: 'Satbir Singh', position: 'Convenor', image: '/placeholder.svg', email: 'satbir@gne.edu.in' },
    { id: 2, name: 'Harmandeep Singh', position: 'Co Convenor', image: '/placeholder.svg', email: 'harman@gne.edu.in' },
    { id: 3, name: 'Palak Batra', position: 'Secretary', image: '/placeholder.svg', email: 'palak@gne.edu.in' },
    { id: 4, name: 'Kanwarpartap Singh', position: 'Secretary', image: '/placeholder.svg', email: 'kanwar@gne.edu.in' },
    { id: 5, name: 'Tanveer Kaur', position: 'PR Advisor', image: '/placeholder.svg', email: 'tanveer@gne.edu.in' },
    { id: 6, name: 'Sakshi', position: 'Co Convenor', image: '/placeholder.svg', email: 'sakshi@gne.edu.in' },
    { id: 7, name: 'Vivek Kumar', position: 'Publicity Officer', image: '/placeholder.svg', email: 'vivek@gne.edu.in' },
  ];

  const postHolders = [
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

  const getCurrentMembers = () => {
    switch (activeTab) {
      case 'core':
        return coreTeam;
      case 'post':
        return postHolders;
      case 'executive':
        return executiveTeam;
      default:
        return coreTeam;
    }
  };

  const members = getCurrentMembers();

  return (
    <div className="min-h-screen w-full">
      <TechNavbar />
      
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Faculty Advisor Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Our Faculty Advisor
          </h2>
          
          <div className="grid md:grid-cols-[300px,1fr] gap-8 items-start max-w-5xl mx-auto">
            {/* Circular Image */}
            <div className="mx-auto">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden bg-muted border-4 border-border">
                <img 
                  src={faculty.image} 
                  alt={faculty.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Faculty Details Card */}
            <div className="bg-card border border-border p-8 rounded-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {faculty.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 font-medium">
                {faculty.title}
              </p>
              
              <p className="text-foreground/90 mb-4 leading-relaxed">
                {faculty.description}
              </p>
              
              <p className="text-foreground/90 leading-relaxed">
                {faculty.achievements}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0 border-b border-border">
            <button
              onClick={() => setActiveTab('core')}
              className={`px-8 py-4 font-semibold transition-all relative ${
                activeTab === 'core'
                  ? 'text-foreground bg-background'
                  : 'text-muted-foreground hover:text-foreground bg-muted/30'
              }`}
            >
              Core Team
              {activeTab === 'core' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`px-8 py-4 font-semibold transition-all relative ${
                activeTab === 'post'
                  ? 'text-foreground bg-background'
                  : 'text-muted-foreground hover:text-foreground bg-muted/30'
              }`}
            >
              Post Holders
              {activeTab === 'post' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('executive')}
              className={`px-8 py-4 font-semibold transition-all relative ${
                activeTab === 'executive'
                  ? 'text-foreground bg-background'
                  : 'text-muted-foreground hover:text-foreground bg-muted/30'
              }`}
            >
              Executive Team
              {activeTab === 'executive' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Member Cards */}
        <section>
          <div className={`grid gap-6 ${
            activeTab === 'executive' 
              ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' 
              : 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {members.map((member) => (
              <div 
                key={member.id} 
                className="bg-card border border-border p-6 hover:border-primary/50 transition-all group"
              >
                <div className="aspect-square mb-4 overflow-hidden bg-muted">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                
                <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">
                  {member.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  {member.position}
                </p>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={`mailto:${member.email}`}
                    className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <a 
                    href="#"
                    className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
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
