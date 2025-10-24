import { useState, useEffect, useMemo, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from './ThemeToggle';

const staticNavItems = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Members', path: '/members' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact us', path: '/contact' },
];

const TechNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = useMemo(() => {
    return showProjects 
      ? [...staticNavItems.slice(0, 2), { name: 'Projects', path: '/projects' }, ...staticNavItems.slice(2)]
      : staticNavItems;
  }, [showProjects]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  useEffect(() => {
    if (isOpen) {
      handleClose();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    fetchNavbarSettings();
  }, []);

  const fetchNavbarSettings = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'show_projects_in_navbar')
        .single();
      
      if (!error && data) {
        setShowProjects(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching navbar settings:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClassName = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
    isScrolled
      ? 'bg-background/80 backdrop-blur-lg border-border' 
      : 'bg-transparent border-transparent'
  );

  return (
    <nav className={navbarClassName} ref={mobileMenuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/Iste.webp" 
                alt="ISTE Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <span className="font-black text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              ISTE GNDEC
            </span>
          </NavLink>

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
                      : 'text-muted-foreground hover:text-foreground'
                  )
                }
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
            <ThemeToggle />
          </div>

          <button
            onClick={() => isOpen ? handleClose() : setIsOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className={cn(
          "md:hidden border-t border-border bg-card/95 backdrop-blur-lg",
          isClosing ? "animate-slideUp" : "animate-slideDown"
        )}>
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={handleClose}
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
            <div className="flex items-center justify-between px-4 py-3 tech-border bg-muted/50 min-h-[46px]">
              <span className="font-mono text-sm tracking-wider text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TechNavbar;
