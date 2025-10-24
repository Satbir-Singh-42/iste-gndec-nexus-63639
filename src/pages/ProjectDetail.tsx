import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechFooter from '@/components/TechFooter';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Github, ExternalLink, Tag, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_link?: string;
  demo_link?: string;
  status: string;
  category: string;
  featured?: boolean;
  created_at?: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      console.warn('Supabase not configured');
      return;
    }
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!supabase || !id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      console.error('Error fetching project:', error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.title || 'Project',
          text: project?.description || '',
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading project...</p>
          </div>
        </div>
        <TechFooter />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <Code className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
            <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
        <TechFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-6 group animate-in fade-in slide-in-from-left-4 duration-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </Button>

          {/* Project Image */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-lg animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: '100ms' }}>
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Project Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {project.title}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.github_link && (
                <Button
                  onClick={() => window.open(project.github_link, '_blank')}
                  className="flex-1 sm:flex-none animate-in fade-in slide-in-from-left-4 duration-500 hover:scale-105 transition-transform"
                  style={{ animationDelay: '300ms' }}
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              )}
              {project.demo_link && (
                <Button
                  variant="outline"
                  onClick={() => window.open(project.demo_link, '_blank')}
                  className="flex-1 sm:flex-none animate-in fade-in slide-in-from-left-4 duration-500 hover:scale-105 transition-transform"
                  style={{ animationDelay: '350ms' }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 sm:flex-none animate-in fade-in slide-in-from-left-4 duration-500 hover:scale-105 transition-transform"
                style={{ animationDelay: '400ms' }}
              >
                Share
              </Button>
            </div>
          </div>

          {/* Technologies */}
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-6 duration-700 hover:shadow-lg hover:shadow-primary/10 transition-all" style={{ animationDelay: '450ms' }}>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-sm py-1 px-3 animate-in fade-in zoom-in-50 duration-300 hover:scale-110 transition-transform cursor-default"
                    style={{ animationDelay: `${500 + idx * 50}ms` }}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 animate-in fade-in slide-in-from-bottom-6 duration-700 hover:shadow-lg hover:shadow-primary/10 transition-all" style={{ animationDelay: `${550 + project.technologies.length * 50}ms` }}>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">About This Project</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TechFooter />
    </div>
  );
};

export default ProjectDetail;
