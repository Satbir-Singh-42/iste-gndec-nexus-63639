import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tech-grid-404" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path 
                d="M 100 0 L 0 0 0 100" 
                fill="none" 
                stroke="hsl(173 80% 45% / 0.15)" 
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-grid-404)" />
        </svg>
      </div>

      {/* Corner Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-secondary" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary" />

      {/* Main Content */}
      <div className="text-center relative z-10 px-4">
        {/* Glitch Effect 404 */}
        <h1 
          data-text="404"
          className="glitch text-9xl md:text-[200px] font-black mb-6 text-foreground"
        >
          404
        </h1>

        {/* Tech Status Bar */}
        <div className="mb-8 flex items-center justify-center gap-4 text-sm font-mono text-destructive">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            ERROR: PAGE_NOT_FOUND
          </span>
        </div>

        {/* Message */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-primary" />
            <p className="text-sm font-mono text-muted-foreground tracking-wider">SYSTEM MESSAGE</p>
            <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-primary" />
          </div>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-4">
            The page you're looking for doesn't exist
          </p>
        </div>

        {/* CTA Button */}
        <Link 
          to="/"
          className="group relative inline-flex items-center gap-3 tech-border px-8 py-4 font-semibold text-foreground hover:text-primary transition-all overflow-hidden"
        >
          <span className="absolute inset-0 bg-primary/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <svg 
            className="relative z-10 w-5 h-5 transition-transform group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="relative z-10 font-mono text-sm tracking-wider">RETURN TO HOME</span>
        </Link>

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="w-2 h-2 border border-border" />
          <span>ISTE GNDEC</span>
          <span className="text-border">|</span>
          <span>ERROR CODE: 404</span>
          <span className="w-2 h-2 border border-border" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
