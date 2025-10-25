import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Award, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechFooter from "@/components/TechFooter";

interface PastConvenor {
  id: number;
  name: string;
  image: string;
  tenure_start: string;
  tenure_end: string;
  tenure_month?: number | null;
  description?: string;
  hidden?: boolean;
  display_order?: number;
}

const PastConvenorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convenor, setConvenor] = useState<PastConvenor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchConvenor();
  }, [id]);

  const fetchConvenor = async () => {
    if (!supabase || !id) return;

    try {
      const { data, error } = await supabase
        .from("past_convenors")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error("Convenor not found");
        navigate("/achievements");
        return;
      }

      setConvenor(data);
    } catch (error: any) {
      console.error("Error fetching convenor:", error);
      toast.error("Failed to load convenor details");
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
          <p className="text-muted-foreground">Loading convenor details...</p>
        </div>
      </div>
    );
  }

  if (!convenor) {
    return null;
  }

  const getMonthName = (month?: number | null) => {
    if (!month) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1] || "";
  };

  const tenureDisplay = convenor.tenure_month
    ? `${getMonthName(convenor.tenure_month)} ${convenor.tenure_start} - ${getMonthName(convenor.tenure_month)} ${convenor.tenure_end}`
    : `${convenor.tenure_start} - ${convenor.tenure_end}`;

  return (
    <div className="min-h-screen w-full relative z-10">
      <main className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/achievements")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 border border-primary/30 bg-primary/5">
            <Award className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider">
              PAST CONVENOR
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gradient">
            {convenor.name}
          </h1>
          <div className="flex items-center gap-2 text-primary font-mono text-sm">
            <Calendar className="w-4 h-4" />
            {tenureDisplay}
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-primary/20 bg-card">
            <img
              src={convenor.image}
              alt={convenor.name}
              className="w-full max-h-[400px] object-cover object-top"
            />
          </div>

          {convenor.description && (
            <div className="bg-card border border-primary/20 rounded-lg p-4">
              <h2 className="text-lg font-bold mb-2">About</h2>
              <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                {convenor.description}
              </p>
            </div>
          )}
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default PastConvenorDetail;
