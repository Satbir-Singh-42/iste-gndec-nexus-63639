import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Members', path: '/members' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact us', path: '/contact' },
];

const TechNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
      isScrolled 
        ? 'bg-background/80 backdrop-blur-lg border-border' 
        : 'bg-transparent border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            {isHomePage ? (
              <div className="relative">
                <img 
                  src="/Iste.webp" 
                  alt="ISTE Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="relative w-10 h-10 border-2 border-primary flex items-center justify-center">
                <span className="text-primary font-black text-xl">I</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-secondary" />
              </div>
            )}
            <span className={cn(
              "font-black text-xl tracking-tight group-hover:text-primary transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
            style={!isScrolled ? { textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)' } : undefined}
            >
              ISTE GNDEC
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-2 font-mono text-sm tracking-wider transition-all',
                    isActive
                      ? 'text-primary'
                      : isScrolled 
                        ? 'text-muted-foreground hover:text-foreground'
                        : 'text-white/95 hover:text-white'
                  )
                }
                style={!isScrolled ? { textShadow: '0 2px 6px rgba(0,0,0,0.8)' } : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 hover:text-primary transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}
            style={!isScrolled ? { filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' } : undefined}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-3 font-mono text-sm tracking-wider transition-all tech-border',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TechNavbar;
