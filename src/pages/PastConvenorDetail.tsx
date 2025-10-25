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
                <Award className="w-3 h-3 text-primary" />
                <span className="text-xs font-mono text-primary tracking-wider">
                  PAST CONVENOR
                </span>
              </div>
              <h1 className="text-lg font-bold mb-2 text-gradient">
                {convenor.name}
              </h1>
              <div className="flex items-center gap-2 text-primary font-mono text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {tenureDisplay}
              </div>
            </div>

            {convenor.description && (
              <div className="bg-card border border-primary/20 rounded-lg p-3">
                <h2 className="text-base font-bold mb-2">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                  {convenor.description}
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-lg border border-primary/20 bg-card">
              <img
                src={convenor.image}
                alt={convenor.name}
                className="w-full max-h-[500px] object-cover object-top"
              />
            </div>
          </div>
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default PastConvenorDetail;
