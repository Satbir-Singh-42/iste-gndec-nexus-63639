import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{ id: number; title: string; image: string; category: string; description: string } | null>(null);

  const galleryImages = [
    { id: 1, title: 'Workshop 2023', image: '/placeholder.svg', category: 'Events', description: 'Annual technical workshop featuring latest technologies and industry trends.' },
    { id: 2, title: 'Team Gathering', image: '/placeholder.svg', category: 'Team', description: 'Team bonding session and planning meet for upcoming semester activities.' },
    { id: 3, title: 'Competition Day', image: '/placeholder.svg', category: 'Events', description: 'Inter-college coding competition with participants from various institutions.' },
    { id: 4, title: 'Guest Lecture', image: '/placeholder.svg', category: 'Sessions', description: 'Industry expert session on emerging technologies and career opportunities.' },
    { id: 5, title: 'Project Exhibition', image: '/placeholder.svg', category: 'Projects', description: 'Showcase of innovative student projects and technical demonstrations.' },
    { id: 6, title: 'Annual Fest', image: '/placeholder.svg', category: 'Events', description: 'Annual technical fest celebrating innovation and technical excellence.' },
  ];

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
