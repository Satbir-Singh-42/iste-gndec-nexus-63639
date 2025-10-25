import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trophy, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechFooter from "@/components/TechFooter";

interface ChapterAward {
  id: number;
  award_title: string;
  year: string;
  description: string;
  certificate_image: string;
  hidden?: boolean;
  display_order?: number;
}

const ChapterAwardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState<ChapterAward | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchAward();
  }, [id]);

  const fetchAward = async () => {
    if (!supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from("chapter_awards")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error("Award not found");
        navigate("/achievements");
        return;
      }

      setAward(data);
    } catch (error: any) {
      console.error("Error fetching award:", error);
      toast.error("Failed to load award details");
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
          <p className="text-muted-foreground">Loading award details...</p>
        </div>
      </div>
    );
  }

  if (!award) {
    return null;
  }

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
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider">
              CHAPTER AWARD
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient">
            {award.award_title}
          </h1>
          <div className="flex items-center gap-2 text-primary font-mono text-lg">
            <Calendar className="w-5 h-5" />
            {award.year}
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-primary/20 bg-card">
            <img
              src={award.certificate_image}
              alt={award.award_title}
              className="w-full object-contain"
            />
          </div>

          <div className="bg-card border border-primary/20 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {award.description}
            </p>
          </div>
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default ChapterAwardDetail;
