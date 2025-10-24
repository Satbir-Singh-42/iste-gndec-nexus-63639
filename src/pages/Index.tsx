import TechHero from "@/components/TechHero";
import TechAbout from "@/components/TechAbout";
import TechNoticeBoard from "@/components/TechNoticeBoard";
import TechFooter from "@/components/TechFooter";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const Index = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  return (
    <>
      <Helmet>
        <title>
          ISTE GNDEC Student Chapter | Technical Education & Innovation Hub
        </title>
        <meta
          name="description"
          content="Official ISTE Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. Join us for technical workshops, hackathons, seminars, competitions, and innovation programs. Empowering engineering students."
        />
        <meta
          property="og:title"
          content="ISTE GNDEC Student Chapter | Technical Education & Innovation Hub"
        />
        <meta
          property="og:description"
          content="Official ISTE Student Chapter at Guru Nanak Dev Engineering College, Ludhiana. Join us for technical workshops, hackathons, seminars, and innovation programs."
        />
        <meta property="og:url" content="https://iste-gndec.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ISTE GNDEC Student Chapter | Technical Education & Innovation Hub"
        />
        <meta
          name="twitter:description"
          content="Official ISTE Student Chapter at GNDEC Ludhiana. Join us for technical workshops, hackathons, and innovation programs."
        />
        <link rel="canonical" href="https://iste-gndec.vercel.app/" />
      </Helmet>
      <main className="min-h-screen w-full overflow-hidden relative z-10">
        <TechHero />
        <TechAbout />
        <TechNoticeBoard />
        <TechFooter />
      </main>
    </>
  );
};

export default Index;
