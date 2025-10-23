import TechNavbar from '@/components/TechNavbar';
import TechHero from '@/components/TechHero';
import TechAbout from '@/components/TechAbout';
import TechNoticeBoard from '@/components/TechNoticeBoard';
import TechFooter from '@/components/TechFooter';
import ParticleBackground from '@/components/ParticleBackground';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <main className="min-h-screen w-full overflow-hidden relative">
      {/* Global background - covers entire page */}
      <div className="fixed inset-0 -z-10">
        <ParticleBackground />
      </div>

      <TechNavbar />
      <TechHero />
      <TechAbout />
      <TechNoticeBoard />
      <TechFooter />
    </main>
  );
};

export default Index;
