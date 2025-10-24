import TechHero from '@/components/TechHero';
import TechAbout from '@/components/TechAbout';
import TechNoticeBoard from '@/components/TechNoticeBoard';
import TechFooter from '@/components/TechFooter';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <main className="min-h-screen w-full overflow-hidden relative">
      <TechHero />
      <TechAbout />
      <TechNoticeBoard />
      <TechFooter />
    </main>
  );
};

export default Index;
