import TechFooter from "@/components/TechFooter";
import { Trophy, Award, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChapterAward {
  id: number;
  award_title: string;
  year: string;
  description: string;
  certificate_image: string;
  certificate_images?: string[];
  hidden?: boolean;
  display_order?: number;
}

interface PastConvenor {
  id: number;
  name: string;
  image: string;
  tenure_start: string;
  tenure_end: string;
  start_month?: number;
  end_month?: number;
  description?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
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
  achievement_image?: string;
  achievement_images?: string[];
  linkedin?: string;
  github?: string;
  instagram?: string;
  hidden?: boolean;
  display_order?: number;
}

const Achievements = () => {
  const navigate = useNavigate();
  const [chapterAwards, setChapterAwards] = useState<ChapterAward[]>([]);
  const [pastConvenors, setPastConvenors] = useState<PastConvenor[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideChapterAwards, setHideChapterAwards] = useState(false);
  const [hidePastConvenors, setHidePastConvenors] = useState(false);
  const [hideStudentAchievements, setHideStudentAchievements] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchVisibilitySettings();
  }, []);

  const fetchVisibilitySettings = async () => {
    if (!supabase) return;

    try {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["hide_chapter_awards", "hide_past_convenors", "hide_student_achievements"]);

      if (data) {
        data.forEach((setting) => {
          if (setting.setting_key === "hide_chapter_awards") {
            setHideChapterAwards(setting.setting_value === true);
          } else if (setting.setting_key === "hide_past_convenors") {
            setHidePastConvenors(setting.setting_value === true);
          } else if (setting.setting_key === "hide_student_achievements") {
            setHideStudentAchievements(setting.setting_value === true);
          }
        });
      }

      await fetchAllData();
    } catch (error) {
      console.error("Error fetching visibility settings:", error);
      await fetchAllData();
    }
  };

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
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">
              ACHIEVEMENTS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 text-gradient px-2">
            Our Achievements
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Celebrating excellence and recognizing the achievements of ISTE GNDEC
          </p>
        </div>

        {!hideChapterAwards && chapterAwards.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 px-1">
              <span className="w-1 h-6 sm:h-8 bg-secondary" />
              Chapter Awards
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {chapterAwards.map((award) => (
                <div
                  key={award.id}
                  onClick={() => navigate(`/achievements/awards/${award.id}`)}
                  className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 p-3 sm:p-4 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold mb-1 line-clamp-2">{award.award_title}</h3>
                  <p className="text-xs text-primary font-mono">{award.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidePastConvenors && pastConvenors.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 px-1">
              <span className="w-1 h-6 sm:h-8 bg-secondary" />
              Past Convenors
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {pastConvenors.map((convenor) => {
                const getMonthName = (month?: number) => {
                  if (!month) return "";
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  return months[month - 1] || "";
                };

                const tenureDisplay = convenor.start_month && convenor.end_month
                  ? `${getMonthName(convenor.start_month)} ${convenor.tenure_start} - ${getMonthName(convenor.end_month)} ${convenor.tenure_end}`
                  : `${convenor.tenure_start} - ${convenor.tenure_end}`;

                return (
                  <div
                    key={convenor.id}
                    onClick={() => navigate(`/achievements/convenors/${convenor.id}`)}
                    className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={convenor.image}
                        alt={convenor.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <h3 className="text-xs sm:text-sm font-bold mb-1 line-clamp-1">{convenor.name}</h3>
                      <p className="text-[10px] sm:text-xs text-primary font-mono line-clamp-2">
                        {tenureDisplay}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {!hideStudentAchievements && studentAchievements.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 px-1">
              <span className="w-1 h-6 sm:h-8 bg-secondary" />
              Student Achievements
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {studentAchievements.map((achievement) => {
                const firstImage = achievement.achievement_images && achievement.achievement_images.length > 0
                  ? achievement.achievement_images[0]
                  : achievement.achievement_image;
                
                return (
                  <div
                    key={achievement.id}
                    onClick={() => navigate(`/achievements/students/${achievement.id}`)}
                    className="group cursor-pointer border border-primary/20 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden bg-muted">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={achievement.event_name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-2.5 sm:p-3">
                      <h3 className="text-xs sm:text-sm font-bold mb-1 line-clamp-1">{achievement.student_name}</h3>
                      <p className="text-[10px] sm:text-xs text-primary font-mono mb-1">{achievement.position}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{achievement.event_name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(() => {
          const noVisibleSections = 
            (hideChapterAwards || chapterAwards.length === 0) && 
            (hidePastConvenors || pastConvenors.length === 0) && 
            (hideStudentAchievements || studentAchievements.length === 0);
          
          return noVisibleSections && (
            <div className="text-center py-12 sm:py-16 px-4">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Achievements Present</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Check back soon for updates on our achievements!
              </p>
            </div>
          );
        })()}
      </main>
      <TechFooter />
    </div>
  );
};

export default Achievements;
