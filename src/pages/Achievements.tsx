import TechFooter from "@/components/TechFooter";
import { Trophy, Award, Star, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChapterAward {
  id: number;
  award_title: string;
  year: string;
  description: string;
  certificate_image: string;
  hidden?: boolean;
  display_order?: number;
}

interface PastConvenor {
  id: number;
  name: string;
  image: string;
  tenure_start: string;
  tenure_end: string;
  description?: string;
  hidden?: boolean;
  display_order?: number;
}

interface StudentAchievement {
  id: number;
  student_name: string;
  event_name: string;
  position: string;
  date: string;
  organized_by: string;
  description: string;
  achievement_image: string;
  hidden?: boolean;
  display_order?: number;
}

const Achievements = () => {
  const [chapterAwards, setChapterAwards] = useState<ChapterAward[]>([]);
  const [pastConvenors, setPastConvenors] = useState<PastConvenor[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAward, setSelectedAward] = useState<ChapterAward | null>(null);
  const [selectedConvenor, setSelectedConvenor] = useState<PastConvenor | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<StudentAchievement | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchChapterAwards(),
        fetchPastConvenors(),
        fetchStudentAchievements(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterAwards = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("chapter_awards")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("year", { ascending: false })
        .order("display_order", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setChapterAwards(data || []);
    } catch (error: any) {
      console.error("Error fetching chapter awards:", error);
      toast.error("Failed to load chapter awards");
    }
  };

  const fetchPastConvenors = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("past_convenors")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("tenure_start", { ascending: false })
        .order("display_order", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setPastConvenors(data || []);
    } catch (error: any) {
      console.error("Error fetching past convenors:", error);
      toast.error("Failed to load past convenors");
    }
  };

  const fetchStudentAchievements = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from("student_achievements")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("date", { ascending: false })
        .order("display_order", { ascending: false, nullsFirst: false });

      if (error) throw error;
      setStudentAchievements(data || []);
    } catch (error: any) {
      console.error("Error fetching student achievements:", error);
      toast.error("Failed to load student achievements");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative z-10">
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">
              ACHIEVEMENTS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Our Achievements
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating excellence and recognizing the achievements of ISTE GNDEC
          </p>
        </div>

        {chapterAwards.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-secondary" />
              Chapter Awards
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {chapterAwards.map((award) => (
                <div
                  key={award.id}
                  onClick={() => setSelectedAward(award)}
                  className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 p-4 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 mb-3 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold mb-1 line-clamp-2">{award.award_title}</h3>
                  <p className="text-xs text-primary font-mono">{award.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {pastConvenors.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-secondary" />
              Past Convenors
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pastConvenors.map((convenor) => (
                <div
                  key={convenor.id}
                  onClick={() => setSelectedConvenor(convenor)}
                  className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={convenor.image}
                      alt={convenor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold mb-1 line-clamp-1">{convenor.name}</h3>
                    <p className="text-xs text-primary font-mono">
                      {convenor.tenure_start} - {convenor.tenure_end}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {studentAchievements.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-secondary" />
              Student Achievements
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {studentAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  onClick={() => setSelectedAchievement(achievement)}
                  className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={achievement.achievement_image}
                      alt={achievement.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold mb-1 line-clamp-1">{achievement.student_name}</h3>
                    <p className="text-xs text-primary font-mono mb-1">{achievement.position}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{achievement.event_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {chapterAwards.length === 0 && pastConvenors.length === 0 && studentAchievements.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Achievements Yet</h3>
            <p className="text-muted-foreground">
              Check back soon for updates on our achievements!
            </p>
          </div>
        )}
      </main>
      <TechFooter />

      <Dialog open={!!selectedAward} onOpenChange={() => setSelectedAward(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              {selectedAward?.award_title}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-primary font-mono">
              <Calendar className="w-4 h-4" />
              {selectedAward?.year}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <img
                src={selectedAward?.certificate_image}
                alt={selectedAward?.award_title}
                className="w-full object-contain"
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {selectedAward?.description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedConvenor} onOpenChange={() => setSelectedConvenor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              {selectedConvenor?.name}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-primary font-mono">
              <Calendar className="w-4 h-4" />
              Tenure: {selectedConvenor?.tenure_start} - {selectedConvenor?.tenure_end}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <img
                src={selectedConvenor?.image}
                alt={selectedConvenor?.name}
                className="w-full max-h-96 object-cover"
              />
            </div>
            {selectedConvenor?.description && (
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedConvenor.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-primary" />
              {selectedAchievement?.event_name}
            </DialogTitle>
            <DialogDescription className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-mono">
                <User className="w-4 h-4" />
                {selectedAchievement?.student_name}
              </div>
              <div className="flex items-center gap-2 text-primary font-mono">
                <Trophy className="w-4 h-4" />
                {selectedAchievement?.position}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <img
                src={selectedAchievement?.achievement_image}
                alt={selectedAchievement?.event_name}
                className="w-full object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-mono text-sm">{selectedAchievement?.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Organized By</p>
                <p className="font-mono text-sm">{selectedAchievement?.organized_by}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Details</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {selectedAchievement?.description}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Achievements;
