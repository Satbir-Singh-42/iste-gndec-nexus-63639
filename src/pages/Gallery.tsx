import TechFooter from '@/components/TechFooter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
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
    <div className="min-h-screen w-full">
      
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
          <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-2xl md:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <span className="text-primary font-mono text-sm">{selectedImage?.category}</span>
                <span className="w-1 h-6 bg-primary" />
                {selectedImage?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img 
                    src={selectedImage?.images?.[currentImageIndex]} 
                    alt={`${selectedImage?.title} ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {selectedImage?.images && selectedImage.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === 0 ? selectedImage.images.length - 1 : prev - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full border border-border"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => 
                        prev === selectedImage.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full border border-border"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/80 text-sm font-mono border border-border rounded">
                      {currentImageIndex + 1} / {selectedImage.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {selectedImage?.images && selectedImage.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedImage.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary' : 'border-border opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              <p className="text-muted-foreground">{selectedImage?.description}</p>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <TechFooter />
    </div>
  );
};

export default Gallery;
