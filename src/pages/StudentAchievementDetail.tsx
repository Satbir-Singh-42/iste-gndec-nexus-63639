import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Star, User, Trophy, Calendar, Building2, ArrowLeft, Linkedin, Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechFooter from "@/components/TechFooter";

interface StudentAchievement {
  id: number;
  student_name: string;
  event_name: string;
  position: string;
  date: string;
  organized_by: string;
  description: string;
  achievement_image?: string;
  achievement_images?: string[];
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

const StudentAchievementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState<StudentAchievement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchAchievement();
  }, [id]);

  const fetchAchievement = async () => {
    if (!supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from("student_achievements")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error("Achievement not found");
        navigate("/achievements");
        return;
      }

      setAchievement(data);
    } catch (error: any) {
      console.error("Error fetching achievement:", error);
      toast.error("Failed to load achievement details");
      navigate("/achievements");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading achievement details...</p>
        </div>
      </div>
    );
  }

  if (!achievement) {
    return null;
  }

  const images = achievement.achievement_images && achievement.achievement_images.length > 0
    ? achievement.achievement_images
    : achievement.achievement_image
    ? [achievement.achievement_image]
    : [];

  const hasLinks = achievement.linkedin || achievement.github || achievement.instagram;

  return (
    <div className="min-h-screen w-full relative z-10">
      <main className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/achievements")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Achievements
        </Button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-primary/30 bg-primary/5">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider">
              STUDENT ACHIEVEMENT
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient">
            {achievement.event_name}
          </h1>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-primary" />
              <span className="font-semibold">{achievement.student_name}</span>
            </div>
            <div className="flex items-center gap-2 text-lg text-primary font-mono">
              <Trophy className="w-5 h-5" />
              {achievement.position}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {images.length > 0 && (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border border-primary/20 bg-card">
                  <img
                    src={image}
                    alt={`${achievement.event_name} - Image ${index + 1}`}
                    className="w-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Date</span>
              </div>
              <p className="font-mono text-lg">{achievement.date}</p>
            </div>

            <div className="bg-card border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Organized By</span>
              </div>
              <p className="font-mono text-lg">{achievement.organized_by}</p>
            </div>
          </div>

          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {hasLinks && (
            <div className="bg-card border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Connect</h2>
              <div className="flex flex-wrap gap-3">
                {achievement.linkedin && (
                  <a
                    href={achievement.linkedin.startsWith('http') ? achievement.linkedin : `https://linkedin.com/in/${achievement.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-primary" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {achievement.github && (
                  <a
                    href={achievement.github.startsWith('http') ? achievement.github : `https://github.com/${achievement.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
                  >
                    <Github className="w-5 h-5 text-primary" />
                    <span>GitHub</span>
                  </a>
                )}
                {achievement.instagram && (
                  <a
                    href={achievement.instagram.startsWith('http') ? achievement.instagram : `https://instagram.com/${achievement.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-primary" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default StudentAchievementDetail;
