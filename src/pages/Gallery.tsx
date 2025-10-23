import TechNavbar from '@/components/TechNavbar';
import TechFooter from '@/components/TechFooter';

const Gallery = () => {
  const galleryImages = [
    { id: 1, title: 'Workshop 2023', image: '/placeholder.svg', category: 'Events' },
    { id: 2, title: 'Team Gathering', image: '/placeholder.svg', category: 'Team' },
    { id: 3, title: 'Competition Day', image: '/placeholder.svg', category: 'Events' },
    { id: 4, title: 'Guest Lecture', image: '/placeholder.svg', category: 'Sessions' },
    { id: 5, title: 'Project Exhibition', image: '/placeholder.svg', category: 'Projects' },
    { id: 6, title: 'Annual Fest', image: '/placeholder.svg', category: 'Events' },
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
            <div key={item.id} className="group relative overflow-hidden tech-card p-0 cursor-pointer">
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
      </main>

      <TechFooter />
    </div>
  );
};

export default Gallery;
