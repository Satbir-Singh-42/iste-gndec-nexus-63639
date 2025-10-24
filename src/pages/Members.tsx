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
  email?: string;
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
  const [faculty, setFaculty] = useState<Faculty[]>([]);
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
        supabase.from('members_faculty').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from('members_core_team').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from('members_post_holders').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
        supabase.from('members_executive').select('*').or('hidden.is.null,hidden.eq.false').order('display_order', { ascending: true, nullsFirst: false }).order('id', { ascending: true }),
      ]);

      if (facultyRes.error) console.error('Faculty error:', facultyRes.error);
      else setFaculty(facultyRes.data || []);

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
        {faculty.length > 0 && (
          <section className="mb-12 max-w-7xl mx-auto">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 border border-primary/30 bg-primary/5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-mono text-primary tracking-wider">
                  {faculty.length === 1 ? 'FACULTY ADVISOR' : 'FACULTY ADVISORS'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gradient">
                {faculty.length === 1 ? 'Our Faculty Advisor' : 'Our Faculty Advisors'}
              </h2>
            </div>
            
            <div className="space-y-10">
              {faculty.map((facultyMember, index) => (
                <div 
                  key={facultyMember.id} 
                  className={`group relative ${
                    index % 2 === 0 ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
                    {/* Image Section with Decorative Elements */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                      <div className="relative aspect-square max-w-xs mx-auto">
                        {/* Decorative corner accents */}
                        <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-primary/50" />
                        <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-primary/50" />
                        
                        {/* Main Image */}
                        <div className="relative w-full h-full overflow-hidden border-4 border-border bg-muted group-hover:border-primary/50 transition-all duration-500">
                          <img 
                            src={facultyMember.image || '/default-avatar.png'} 
                            alt={facultyMember.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/default-avatar.png';
                            }}
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4">
                      {/* Title Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30">
                        <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                        <span className="text-xs font-mono text-primary tracking-wide uppercase">
                          {facultyMember.title}
                        </span>
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-2xl md:text-3xl font-black text-foreground leading-tight">
                        {facultyMember.name}
                      </h3>
                      
                      {/* Decorative Line */}
                      <div className="flex items-center gap-3">
                        <div className="h-0.5 w-16 bg-primary" />
                        <div className="h-0.5 w-8 bg-primary/50" />
                        <div className="h-0.5 w-4 bg-primary/30" />
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {facultyMember.description}
                      </p>

                      {/* Social Links */}
                      {(facultyMember.linkedin || facultyMember.github || facultyMember.instagram) && (
                        <div className="flex items-center gap-3 pt-2">
                          {facultyMember.linkedin && (
                            <a 
                              href={facultyMember.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link flex items-center gap-2 px-3 py-1.5 border border-border hover:border-primary hover:bg-primary/5 transition-all"
                              title="LinkedIn"
                            >
                              <Linkedin className="w-4 h-4 group-hover/link:text-primary transition-colors" />
                              <span className="text-xs font-medium">LinkedIn</span>
                            </a>
                          )}
                          {facultyMember.github && (
                            <a 
                              href={facultyMember.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link flex items-center gap-2 px-3 py-1.5 border border-border hover:border-primary hover:bg-primary/5 transition-all"
                              title="GitHub"
                            >
                              <Github className="w-4 h-4 group-hover/link:text-primary transition-colors" />
                              <span className="text-xs font-medium">GitHub</span>
                            </a>
                          )}
                          {facultyMember.instagram && (
                            <a 
                              href={facultyMember.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link flex items-center gap-2 px-3 py-1.5 border border-border hover:border-primary hover:bg-primary/5 transition-all"
                              title="Instagram"
                            >
                              <Instagram className="w-4 h-4 group-hover/link:text-primary transition-colors" />
                              <span className="text-xs font-medium">Instagram</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                      src={member.image || '/default-avatar.png'} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
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
