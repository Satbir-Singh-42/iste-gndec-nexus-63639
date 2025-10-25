import TechFooter from "@/components/TechFooter";
import { Github, ExternalLink, Code, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all" || !selectedCategory) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

  const fetchProjects = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("display_order", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(
    new Set(projects.map((p) => p.category))
  ).filter((cat) => cat && cat.toLowerCase() !== "web application");

  if (loading) {
    return (
      <div className="min-h-screen relative z-10">
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
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Our Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore innovative projects developed by our talented members
            </p>
          </div>

          {/* Category Filter */}
          <div
            className="flex flex-wrap gap-2 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "100ms" }}>
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="capitalize animate-in fade-in zoom-in-50 duration-300"
                style={{ animationDelay: `${200 + index * 50}ms` }}>
                {category}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in zoom-in-95 duration-500">
              <Code className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50 animate-in spin-in-180 duration-700" />
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">
                {!selectedCategory
                  ? "No projects available at the moment."
                  : `No projects in the ${selectedCategory} category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full animate-in fade-in slide-in-from-bottom-6 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/projects/${project.id}`)}>
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col flex-1">
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
                    <div className="flex gap-2 mt-auto">
                      {project.github_link && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.github_link, "_blank");
                          }}
                          className="flex-1">
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
                            window.open(project.demo_link, "_blank");
                          }}
                          className="flex-1">
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
