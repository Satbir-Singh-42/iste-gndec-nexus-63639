import { useState, useEffect } from 'react';
import TechFooter from '@/components/TechFooter';
import { Mail, Linkedin, Github, Instagram } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { normalizeUrl } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

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
  const [showExecutiveTeam, setShowExecutiveTeam] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error('Database connection not configured');
      return;
    }
    fetchMembers();
    fetchExecutiveTeamSetting();
  }, []);

  const fetchExecutiveTeamSetting = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'show_executive_team')
        .single();
      
      if (!error && data) {
        setShowExecutiveTeam(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching executive team setting:', error);
    }
  };

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
    <>
      <Helmet>
        <title>Team Members & Faculty | ISTE GNDEC Student Chapter</title>
        <meta name="description" content="Meet the dedicated team behind ISTE GNDEC - our faculty advisors, core team, post holders, and executive members driving technical excellence at Guru Nanak Dev Engineering College." />
        <meta property="og:title" content="Team Members & Faculty | ISTE GNDEC Student Chapter" />
        <meta property="og:description" content="Meet the dedicated team behind ISTE GNDEC - our faculty advisors, core team, post holders, and executive members." />
        <meta property="og:url" content="https://iste-gndec.vercel.app/members" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Team Members & Faculty | ISTE GNDEC Student Chapter" />
        <meta name="twitter:description" content="Meet the dedicated team behind ISTE GNDEC - our faculty advisors, core team, post holders, and executive members." />
        <link rel="canonical" href="https://iste-gndec.vercel.app/members" />
      </Helmet>
      <div className="min-h-screen w-full relative z-10">
        <main className="pt-24 pb-16 px-4">
          {/* Faculty Advisor Section */}
        {faculty.length > 0 && (
          <section className="mb-12 max-w-7xl mx-auto">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 border border-primary/30 bg-primary/5">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-mono text-primary tracking-wider">
                  OUR TEAM
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gradient">
                {faculty.length === 1 ? 'Meet Our Mentor' : 'Meet Our Mentors'}
              </h2>
            </div>
            
            <div className={`${faculty.length === 1 ? 'max-w-5xl mx-auto' : 'grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto'}`}>
              {faculty.map((facultyMember, index) => (
                <div 
                  key={facultyMember.id} 
                  className={`group relative overflow-hidden ${
                    faculty.length === 1 ? 'grid md:grid-cols-[300px,1fr] gap-6 items-center bg-card border border-border hover:border-primary/50 transition-all duration-500' : ''
                  }`}
                >
                  {faculty.length === 1 ? (
                    <>
                      {/* Single Mentor Layout - Horizontal */}
                      <div className="relative md:block p-6 md:p-0">
                        <div className="relative w-full aspect-square md:w-full">
                          <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 border-t-2 border-l-2 border-primary/50 z-10" />
                          <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-b-2 border-r-2 border-primary/50 z-10" />
                          <div className="absolute inset-3 sm:inset-4 overflow-hidden bg-muted">
                            <img 
                              src={facultyMember.image || '/default-avatar.png'} 
                              alt={facultyMember.name}
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/default-avatar.png';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent" />

                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30">
                          <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
                          <span className="text-xs font-mono text-primary tracking-wide uppercase">{facultyMember.title}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{facultyMember.name}</h3>
                        <div className="flex items-center gap-3">
                          <div className="h-0.5 w-16 bg-primary" />
                          <div className="h-0.5 w-8 bg-primary/50" />
                          <div className="h-0.5 w-4 bg-primary/30" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{facultyMember.description}</p>
                        {(facultyMember.linkedin || facultyMember.github || facultyMember.instagram) && (
                          <div className="flex items-center gap-2 pt-2">
                            {facultyMember.linkedin && (
                              <a href={normalizeUrl(facultyMember.linkedin)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="LinkedIn">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                            {facultyMember.github && (
                              <a href={normalizeUrl(facultyMember.github)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="GitHub">
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {facultyMember.instagram && (
                              <a href={normalizeUrl(facultyMember.instagram)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="Instagram">
                                <Instagram className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Multiple Mentors Layout - Vertical Cards */}
                      <div className="bg-card border border-border hover:border-primary/50 transition-all duration-500 flex flex-col h-full">
                        <div className="relative flex-shrink-0">
                          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto mt-6 rounded-full overflow-hidden border-4 border-border bg-muted group-hover:border-primary/50 transition-all duration-500">
                            <img 
                              src={facultyMember.image || '/default-avatar.png'} 
                              alt={facultyMember.name}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/default-avatar.png';
                              }}
                            />
                          </div>
                        </div>
                        <div className="p-5 space-y-2 text-center flex-1 flex flex-col">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/30 mx-auto">
                            <div className="w-1 h-1 bg-primary animate-pulse" />
                            <span className="text-[10px] font-mono text-primary tracking-wide uppercase">{facultyMember.title}</span>
                          </div>
                          <h3 className="text-lg font-black text-foreground leading-tight pt-1">{facultyMember.name}</h3>
                          <div className="flex items-center gap-1.5 justify-center py-1">
                            <div className="h-0.5 w-8 bg-primary" />
                            <div className="h-0.5 w-4 bg-primary/50" />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">{facultyMember.description}</p>
                          {(facultyMember.linkedin || facultyMember.github || facultyMember.instagram) && (
                            <div className="flex items-center gap-2 pt-2 justify-center">
                              {facultyMember.linkedin && (
                                <a href={normalizeUrl(facultyMember.linkedin)} target="_blank" rel="noopener noreferrer" className="w-7 h-7 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="LinkedIn">
                                  <Linkedin className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {facultyMember.github && (
                                <a href={normalizeUrl(facultyMember.github)} target="_blank" rel="noopener noreferrer" className="w-7 h-7 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="GitHub">
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {facultyMember.instagram && (
                                <a href={normalizeUrl(facultyMember.instagram)} target="_blank" rel="noopener noreferrer" className="w-7 h-7 border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all" title="Instagram">
                                  <Instagram className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
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
            {showExecutiveTeam && (
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
            )}
          </div>
        </div>

        {/* Member Cards */}
        <section className="md:px-8 lg:px-12">
          {members.length === 0 ? (
            <div className="tech-card p-8 text-center animate-in fade-in duration-500 mx-4">
              <p className="text-muted-foreground">No members found in this category.</p>
            </div>
          ) : (
            <div 
              key={activeTab}
              className={`
                grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500
                ${activeTab === 'executive' 
                  ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' 
                  : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }
              `}
            >
              {members.map((member, index) => (
                <div 
                  key={member.id} 
                  className="bg-card border border-border p-6 hover:border-primary/50 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square mb-4 overflow-hidden bg-muted">
                    <img 
                      src={member.image || '/default-avatar.png'} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                  
                  <h3 className="font-bold text-foreground mb-1 text-sm md:text-base">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base font-semibold text-primary mb-4">
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
                        href={normalizeUrl(member.linkedin)}
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
                        href={normalizeUrl(member.github)}
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
                        href={normalizeUrl(member.instagram)}
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
    </>
  );
};

export default Members;
