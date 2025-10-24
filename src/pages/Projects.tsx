import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Github, ExternalLink, Code, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  hidden?: boolean;
  display_order?: number;
}

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error('Database connection not configured');
      return;
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const fetchProjects = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .or('hidden.is.null,hidden.eq.false')
        .order('display_order', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TechNavbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
        <TechFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TechNavbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore innovative projects developed by our talented members
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                {selectedCategory === 'all' 
                  ? 'No projects available at the moment.'
                  : `No projects in the ${selectedCategory} category.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {project.featured && (
                      <Badge className="absolute top-3 right-3 bg-primary">
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      className="absolute top-3 left-3"
                      variant={project.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-2">
                      {project.github_link && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.github_link, '_blank');
                          }}
                          className="flex-1"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                      )}
                      {project.demo_link && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.demo_link, '_blank');
                          }}
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <TechFooter />
    </div>
  );
};

export default Projects;
