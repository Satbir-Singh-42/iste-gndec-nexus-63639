import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trophy, Calendar, ArrowLeft, Maximize2, X } from "lucide-react";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error("Database connection not configured");
      return;
    }
    fetchAward();
  }, [id]);

  useEffect(() => {
    if (isFullscreen && fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.log("Fullscreen request failed:", err);
      });
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (!award || images.length <= 1) return;
      
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyNavigation);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [isFullscreen, award]);

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

  const enterFullscreen = () => {
    setIsFullscreen(true);
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
    setIsFullscreen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (imagesLength: number) => {
    if (imagesLength <= 1) return;

    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        setCurrentImageIndex((prev) =>
          prev === imagesLength - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentImageIndex((prev) =>
          prev === 0 ? imagesLength - 1 : prev - 1
        );
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
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

          <div className="md:col-span-2">
            <div className="rounded-lg border border-primary/20 bg-card/30 p-4 space-y-4">
              <div
                className="relative touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(images.length)}
              >
                <div className="w-full aspect-[16/9] bg-muted rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${award.award_title} ${currentImageIndex + 1}`}
                    className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                    loading="lazy"
                    draggable={false}
                  />
                </div>

                <button
                  onClick={enterFullscreen}
                  className="absolute top-2 right-2 bg-background/90 hover:bg-background p-2 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 sm:p-3 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <span className="text-lg sm:text-xl">←</span>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 sm:p-3 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <span className="text-lg sm:text-xl">→</span>
                    </button>
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-background/90 text-xs sm:text-sm font-mono border border-border rounded backdrop-blur-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-primary scale-105"
                          : "border-border opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isFullscreen && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 z-50 bg-black flex flex-col w-screen h-screen overflow-hidden"
        >
          <div className="flex-shrink-0 flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 bg-black/90 backdrop-blur-sm border-b border-white/10">
            <div className="flex-1 min-w-0 mr-2 sm:mr-3">
              <h2 className="text-xs sm:text-sm font-bold line-clamp-1 text-white">
                {award.award_title}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{award.year}</p>
            </div>
            <button
              onClick={exitFullscreen}
              className="flex-shrink-0 p-1.5 sm:p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <div
              className="w-full h-full flex items-center justify-center touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(images.length)}
            >
              <img
                src={images[currentImageIndex]}
                alt={`${award.award_title} ${currentImageIndex + 1}`}
                className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                loading="lazy"
                draggable={false}
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-full transition-all hover:scale-110 active:scale-95"
                  aria-label="Previous image"
                >
                  <span className="text-base sm:text-xl text-white">←</span>
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-full transition-all hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <span className="text-base sm:text-xl text-white">→</span>
                </button>
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs font-mono rounded text-white">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 border-t border-white/10">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto justify-start sm:justify-center scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-white ring-1 ring-white/50"
                        : "border-white/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <TechFooter />
    </div>
  );
};

export default ChapterAwardDetail;
