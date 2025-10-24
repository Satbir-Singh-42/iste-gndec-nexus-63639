import TechHero from "@/components/TechHero";
import TechAbout from "@/components/TechAbout";
import TechNoticeBoard from "@/components/TechNoticeBoard";
import TechFooter from "@/components/TechFooter";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [showNoticeBoard, setShowNoticeBoard] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    fetchNoticeBoardSetting();
  }, []);

  const fetchNoticeBoardSetting = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("setting_key", "show_notice_board_on_home")
        .single();

      if (data) {
        setShowNoticeBoard(data.setting_value);
      }
    } catch (error) {
      console.error("Error fetching notice board setting:", error);
    }
  };

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
        {showNoticeBoard && <TechNoticeBoard />}
        <TechFooter />
      </main>
    </>
  );
};

export default Index;
