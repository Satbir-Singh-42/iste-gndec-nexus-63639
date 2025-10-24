import TechFooter from '@/components/TechFooter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      toast.error('Database connection not configured');
      return;
    }
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .or('hidden.is.null,hidden.eq.false')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('id', { ascending: true });

      if (error) throw error;
      setGalleryImages(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery images');
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
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">GALLERY PORTAL</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-gradient">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Capturing moments of innovation, collaboration, and achievement
          </p>
        </div>

        {/* Gallery Highlights */}
        {galleryImages.length === 0 ? (
          <div className="tech-card p-8 text-center">
            <p className="text-muted-foreground">No gallery images available yet.</p>
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
                  }}
                >
                  {/* Gallery Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={item.images?.[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Count Indicator */}
                    {item.images?.length > 1 && (
                      <div className="absolute top-2 right-2 px-2 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm text-foreground border border-border rounded">
                        {item.images.length} images
                      </div>
                    )}
                  </div>

                  {/* Gallery Details */}
                  <div className="p-3">
                    <span className="text-xs font-mono text-primary mb-1 block uppercase">{item.category}</span>
                    <h3 className="text-base font-bold text-foreground line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image View Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl md:max-w-3xl max-h-[80vh] sm:max-h-[85vh] overflow-y-auto p-2 sm:p-6">
            <DialogHeader className="pb-2 flex-shrink-0">
              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                <span className="text-primary font-mono text-xs sm:text-sm">{selectedImage?.category}</span>
                <span className="hidden sm:block w-1 h-6 bg-primary" />
                <span className="line-clamp-2">{selectedImage?.title}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 sm:space-y-4 pb-4">
              <div 
                className="relative touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="h-[40vh] sm:min-h-0 sm:aspect-video overflow-hidden bg-muted rounded flex items-center justify-center">
                  <img 
                    src={selectedImage?.images?.[currentImageIndex]} 
                    alt={`${selectedImage?.title} ${currentImageIndex + 1}`}
                    className="max-h-[40vh] sm:max-h-full w-auto max-w-full h-auto object-contain select-none"
                    draggable={false}
                  />
                </div>
                
                {selectedImage?.images && selectedImage.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? selectedImage.images.length - 1 : prev - 1
                      )}
                      className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 sm:p-3 rounded-full border border-border backdrop-blur-sm"
                    >
                      <span className="text-lg sm:text-xl">←</span>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === selectedImage.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background p-2 sm:p-3 rounded-full border border-border backdrop-blur-sm"
                    >
                      <span className="text-lg sm:text-xl">→</span>
                    </button>
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-2 sm:px-3 py-1 bg-background/90 text-xs sm:text-sm font-mono border border-border rounded backdrop-blur-sm">
                      {currentImageIndex + 1} / {selectedImage.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {selectedImage?.images && selectedImage.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedImage.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary' : 'border-border opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="pb-2">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{selectedImage?.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <TechFooter />
    </div>
  );
};

export default Gallery;
