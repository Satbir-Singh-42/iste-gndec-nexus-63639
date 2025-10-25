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
  certificate_images?: string[];
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

  const images = award.certificate_images && award.certificate_images.length > 0
    ? award.certificate_images
    : [award.certificate_image];

  return (
    <div className="min-h-screen w-full relative z-10">
      <main className="pt-16 pb-8 px-4 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/achievements")}
          className="mb-3"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1 space-y-3">
            <div className="bg-card border border-primary/20 rounded-lg p-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2 border border-primary/30 bg-primary/5">
                <Trophy className="w-3 h-3 text-primary" />
                <span className="text-xs font-mono text-primary tracking-wider">
                  CHAPTER AWARD
                </span>
              </div>
              <h1 className="text-lg font-bold mb-2 text-gradient">
                {award.award_title}
              </h1>
              <div className="flex items-center gap-2 text-primary font-mono text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {award.year}
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-lg p-3">
              <h2 className="text-base font-bold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {award.description}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            {images.map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg border border-primary/20 bg-card">
                <img
                  src={image}
                  alt={`${award.award_title} - Certificate ${index + 1}`}
                  className="w-full object-contain object-top"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default ChapterAwardDetail;
