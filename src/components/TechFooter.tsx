import { useLocation, Link } from 'react-router-dom';

const TechFooter = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className="relative border-t-2 border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-8 md:mb-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 md:mb-6">
              <h3 className="text-2xl md:text-3xl font-black mb-2">ISTE GNDEC</h3>
              <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-primary to-secondary mb-3 md:mb-4" />
              <p className="font-mono text-xs text-muted-foreground tracking-wider">
                INDIAN SOCIETY FOR TECHNICAL EDUCATION
              </p>
            </div>
            <p className="text-xs md:text-sm text-foreground/70 leading-relaxed">
              Guru Nanak Dev Engineering College Student Chapter - Empowering students through 
              technical education and innovation.
            </p>
            
            {/* Logos - Only on home page */}
            {isHomePage && (
              <div className="mt-4 md:mt-8 flex items-center gap-3 md:gap-6">
                <div className="p-2 md:p-3 bg-background/50 border border-border/50 rounded">
                  <img 
                    src="/Iste.webp" 
                    alt="ISTE Logo" 
                    className="h-10 md:h-16 w-auto object-contain"
                  />
                </div>
                <div className="p-2 md:p-3 bg-background/50 border border-border/50 rounded">
                  <img 
                    src="/gne new logo.png" 
                    alt="GNDEC Logo" 
                    className="h-10 md:h-16 w-auto object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Links Column */}
          <div>
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-0.5 w-6 md:w-8 bg-primary" />
              <h4 className="font-mono text-xs md:text-sm tracking-wider">QUICK_LINKS</h4>
            </div>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  HOME
                </Link>
              </li>
              <li>
                <Link 
                  to="/events" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  EVENTS
                </Link>
              </li>
              <li>
                <Link 
                  to="/notices" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  NOTICES
                </Link>
              </li>
              <li>
                <Link 
                  to="/members" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  MEMBERS
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  GALLERY
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="group flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-primary transition-all duration-300" />
                  CONTACT
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.isteonline.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-secondary transition-all duration-300" />
                  ISTE_OFFICIAL
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gndec.ac.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors font-mono text-xs md:text-sm"
                >
                  <span className="w-0 group-hover:w-3 h-0.5 bg-secondary transition-all duration-300" />
                  GNDEC_OFFICIAL
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="h-0.5 w-6 md:w-8 bg-secondary" />
              <h4 className="font-mono text-xs md:text-sm tracking-wider">CONNECT</h4>
            </div>
            
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="tech-border p-2 md:p-3 bg-card/50">
                <div className="flex items-start gap-2 md:gap-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-foreground/70">GNDEC, Ludhiana, Punjab, India</span>
                </div>
              </div>
              
              <div className="tech-border p-2 md:p-3 bg-card/50">
                <div className="flex items-start gap-2 md:gap-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-foreground/70 break-all">istegndec.original@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs font-mono text-foreground/70">FOLLOW US:</span>
              <a
                href="https://www.instagram.com/iste_gndec_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 border border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10 group"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-foreground/70 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 md:pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary animate-pulse" />
              <span>© {currentYear} ISTE_GNDEC_STUDENT_CHAPTER</span>
            </div>
            <div className="font-mono text-[10px] md:text-xs text-muted-foreground text-center">
              ALL_RIGHTS_RESERVED // EMPOWERING_FUTURE_TECHNOLOGISTS
            </div>
          </div>
        </div>
      </div>

      {/* Corner Tech Elements */}
      <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-r-2 border-t-2 border-secondary/30" />
    </footer>
  );
};

export default TechFooter;
