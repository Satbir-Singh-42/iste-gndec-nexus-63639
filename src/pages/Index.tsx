import TechHero from "@/components/TechHero";
import TechAbout from "@/components/TechAbout";
import TechNoticeBoard from "@/components/TechNoticeBoard";
import TechFooter from "@/components/TechFooter";
import { useEffect, useState } from "react";
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
    <main className="min-h-screen w-full overflow-hidden relative z-10">
        <TechHero />
        <TechAbout />
        {showNoticeBoard && <TechNoticeBoard />}
        <TechFooter />
      </main>
  );
};

export default Index;
