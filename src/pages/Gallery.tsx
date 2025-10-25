import TechFooter from "@/components/TechFooter";
import { Maximize2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface GalleryImage {
  id: number;
  title: string;
  images: string[];
  category: string;
  description: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchGallery();
  }, []);

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
      if (!selectedImage || selectedImage.images.length <= 1) return;
      
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => prev === 0 ? selectedImage.images.length - 1 : prev - 1);
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => prev === selectedImage.images.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyNavigation);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyNavigation);
    };
  }, [isFullscreen, selectedImage]);

  const fetchGallery = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .or("hidden.is.null,hidden.eq.false")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("id", { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error: any) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!selectedImage || selectedImage.images.length <= 1) return;

    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        setCurrentImageIndex((prev) =>
          prev === selectedImage.images.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentImageIndex((prev) =>
          prev === 0 ? selectedImage.images.length - 1 : prev - 1
        );
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
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

  const closeViewer = () => {
    setSelectedImage(null);
    setIsFullscreen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading gallery...</p>
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
              GALLERY PORTAL
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capturing moments of innovation, collaboration, and achievement
          </p>
        </div>

        {galleryImages.length === 0 ? (
          <div className="tech-card p-8 text-center">
            <p className="text-muted-foreground">
              No gallery images available yet.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
              {galleryImages.map((item) => (
                <div
                  key={item.id}
                  className="tech-card overflow-hidden group hover:border-accent/50 transition-all flex-shrink-0 w-64 snap-start cursor-pointer"
                  onClick={() => {
                    setSelectedImage(item);
                    setCurrentImageIndex(0);
                  }}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.images?.[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {item.images?.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm text-foreground border border-border rounded">
                        {item.images.length} images
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <span className="text-xs font-mono text-primary mb-1 block uppercase">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-foreground line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedImage && !isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-primary/20 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between p-3 sm:p-4 border-b border-primary/20">
              <div className="flex-1 min-w-0 mr-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-mono text-primary uppercase">
                    {selectedImage.category}
                  </span>
                  <span className="hidden sm:block w-1 h-4 bg-primary" />
                  <h2 className="text-sm sm:text-lg font-bold line-clamp-1">{selectedImage.title}</h2>
                </div>
              </div>
              <button
                onClick={closeViewer}
                className="flex-shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                className="relative touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full aspect-[16/9] bg-muted rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedImage.images[currentImageIndex]}
                    alt={`${selectedImage.title} ${currentImageIndex + 1}`}
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

                {selectedImage.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? selectedImage.images.length - 1 : prev - 1
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
                          prev === selectedImage.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 sm:p-3 rounded-full border border-border backdrop-blur-sm transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <span className="text-lg sm:text-xl">→</span>
                    </button>
                    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-background/90 text-xs sm:text-sm font-mono border border-border rounded backdrop-blur-sm">
                      {currentImageIndex + 1} / {selectedImage.images.length}
                    </div>
                  </>
                )}
              </div>

              {selectedImage.images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedImage.images.map((img, idx) => (
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

              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFullscreen && selectedImage && (
        <div 
          ref={fullscreenRef}
          className="fixed inset-0 z-50 bg-black flex flex-col w-screen h-screen overflow-hidden"
        >
          <div className="flex-shrink-0 flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 bg-black/90 backdrop-blur-sm border-b border-white/10">
            <div className="flex-1 min-w-0 mr-2 sm:mr-3">
              <h2 className="text-xs sm:text-sm font-bold line-clamp-1 text-white">
                {selectedImage.title}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">{selectedImage.category}</p>
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
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={selectedImage.images[currentImageIndex]}
                alt={`${selectedImage.title} ${currentImageIndex + 1}`}
                className="max-h-full max-w-full w-auto h-auto object-contain select-none"
                loading="lazy"
                draggable={false}
              />
            </div>

            {selectedImage.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? selectedImage.images.length - 1 : prev - 1
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
                      prev === selectedImage.images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1.5 sm:p-2 md:p-3 rounded-full transition-all hover:scale-110 active:scale-95"
                  aria-label="Next image"
                >
                  <span className="text-base sm:text-xl text-white">→</span>
                </button>
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs font-mono rounded text-white">
                  {currentImageIndex + 1} / {selectedImage.images.length}
                </div>
              </>
            )}
          </div>

          {selectedImage.images.length > 1 && (
            <div className="flex-shrink-0 bg-black/90 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 border-t border-white/10">
              <div className="flex gap-1.5 sm:gap-2 overflow-x-auto justify-start sm:justify-center scrollbar-hide">
                {selectedImage.images.map((img, idx) => (
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

export default Gallery;
