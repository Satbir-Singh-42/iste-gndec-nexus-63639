import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface GalleryImage {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
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
        .order('created_at', { ascending: false });

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
      <TechNavbar />
      
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

        {/* Gallery Grid */}
        {galleryImages.length === 0 ? (
          <div className="tech-card p-8 text-center">
            <p className="text-muted-foreground">No gallery images available yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((item) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden tech-card p-0 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-xs font-mono text-primary mb-2">{item.category}</span>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                </div>
                
                <div className="absolute top-4 right-4 px-3 py-1 text-xs font-mono bg-primary/20 text-primary border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  VIEW
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image View Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <span className="text-primary font-mono text-sm">{selectedImage?.category}</span>
                <span className="w-1 h-6 bg-primary" />
                {selectedImage?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden bg-muted">
                <img 
                  src={selectedImage?.image} 
                  alt={selectedImage?.title}
                  className="w-full h-full object-cover"
                />
              </div>
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
