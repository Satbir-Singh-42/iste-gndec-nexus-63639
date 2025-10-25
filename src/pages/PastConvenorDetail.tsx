import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Award, Calendar, ArrowLeft, Mail, Linkedin, Github, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import TechFooter from "@/components/TechFooter";

interface PastConvenor {
  id: number;
  name: string;
  image: string;
  tenure_start: string;
  tenure_end: string;
  start_month?: number | null;
  end_month?: number | null;
  description?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
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

  const tenureDisplay = (() => {
    const startPart = convenor.start_month 
      ? `${getMonthName(convenor.start_month)} ${convenor.tenure_start}`
      : convenor.tenure_start;
    
    const endPart = convenor.end_month
      ? `${getMonthName(convenor.end_month)} ${convenor.tenure_end}`
      : convenor.tenure_end;
    
    return `${startPart} - ${endPart}`;
  })();

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

            {(convenor.email || convenor.linkedin || convenor.github || convenor.instagram) && (
              <div className="bg-card border border-primary/20 rounded-lg p-3">
                <h2 className="text-base font-bold mb-2">Connect</h2>
                <div className="flex flex-wrap gap-2">
                  {convenor.email && (
                    <a
                      href={`mailto:${convenor.email}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors text-sm"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>Email</span>
                    </a>
                  )}
                  {convenor.linkedin && (
                    <a
                      href={convenor.linkedin.startsWith('http') ? convenor.linkedin : `https://linkedin.com/in/${convenor.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors text-sm"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-primary" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {convenor.github && (
                    <a
                      href={convenor.github.startsWith('http') ? convenor.github : `https://github.com/${convenor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors text-sm"
                    >
                      <Github className="w-3.5 h-3.5 text-primary" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {convenor.instagram && (
                    <a
                      href={convenor.instagram.startsWith('http') ? convenor.instagram : `https://instagram.com/${convenor.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-colors text-sm"
                    >
                      <Instagram className="w-3.5 h-3.5 text-primary" />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="rounded-lg border border-primary/20 bg-card p-4 sm:p-6">
              <div className="w-full max-h-[300px] sm:max-h-[400px] md:max-h-[500px] flex items-center justify-center bg-muted/30 rounded overflow-hidden">
                <img
                  src={convenor.image}
                  alt={convenor.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <TechFooter />
    </div>
  );
};

export default PastConvenorDetail;
