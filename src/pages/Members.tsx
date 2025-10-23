import { useState, useEffect } from 'react';
import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Member {
  id: number;
  name: string;
  position: string;
  image: string;
  email: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

interface Faculty {
  id: number;
  name: string;
  title: string;
  image: string;
  description: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

const Members = () => {
  const [activeTab, setActiveTab] = useState('core');
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [coreTeam, setCoreTeam] = useState<Member[]>([]);
  const [postHolders, setPostHolders] = useState<Member[]>([]);
  const [executiveTeam, setExecutiveTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error('Database connection not configured');
      return;
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const [facultyRes, coreRes, postRes, execRes] = await Promise.all([
        supabase.from('members_faculty').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }).limit(1).single(),
        supabase.from('members_core_team').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from('members_post_holders').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from('members_executive').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
      ]);

      if (facultyRes.error) console.error('Faculty error:', facultyRes.error);
      else setFaculty(facultyRes.data);

      if (coreRes.error) console.error('Core team error:', coreRes.error);
      else setCoreTeam(coreRes.data || []);

      if (postRes.error) console.error('Post holders error:', postRes.error);
      else setPostHolders(postRes.data || []);

      if (execRes.error) console.error('Executive team error:', execRes.error);
      else setExecutiveTeam(execRes.data || []);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <TechNavbar />
      
      <main className="pt-24 pb-16 px-4">
        {/* Faculty Advisor Section */}
        {faculty && (
          <section className="mb-16 max-w-7xl mx-auto">
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
                
                <p className="text-foreground/90 leading-relaxed mb-6">
                  {faculty.description}
                </p>

                {/* Social Links */}
                {(faculty.linkedin || faculty.github || faculty.instagram) && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {faculty.linkedin && (
                      <a 
                        href={faculty.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {faculty.github && (
                      <a 
                        href={faculty.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {faculty.instagram && (
                      <a 
                        href={faculty.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0 border-b border-border">
            <button
              onClick={() => setActiveTab('core')}
              className={`flex-1 px-8 py-4 font-semibold transition-all relative ${
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
              className={`flex-1 px-8 py-4 font-semibold transition-all relative ${
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
              className={`flex-1 px-8 py-4 font-semibold transition-all relative ${
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
        <section className="px-4 md:px-8 lg:px-12">
          {members.length === 0 ? (
            <div className="tech-card p-8 text-center">
              <p className="text-muted-foreground">No members found in this category.</p>
            </div>
          ) : (
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
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.github && (
                      <a 
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.instagram && (
                      <a 
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 border border-border hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
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

export default Members;
