import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Members from "./pages/Members";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Notices from "./pages/Notices";
import NoticeDetail from "./pages/NoticeDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";
import ParticleBackground from "./components/ParticleBackground";
import TechNavbar from "./components/TechNavbar";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem={false}
        storageKey="iste-theme"
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />

            {/* Global background */}
            <div className="fixed inset-0 -z-10">
              <ParticleBackground />
            </div>

            {/* Conditional Navbar */}
            <RouteBasedNavbar />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/members" element={<Members />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/notices/:id" element={<NoticeDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/admin" element={<Admin />} />
              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Separate component to handle conditional navbar
const RouteBasedNavbar = () => {
  const { pathname } = useLocation();

  // Hide navbar on 404 page
  const hideNavbarPaths = ["admin"]; // you can add more routes if needed
  const shouldHideNavbar = pathname === "/404" || pathname === "/admin";

  return !shouldHideNavbar ? <TechNavbar /> : null;
};


export default App;
