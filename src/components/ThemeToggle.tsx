import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  const toggleTheme = () => {
    gsap.to(document.documentElement, {
      opacity: 0.95,
      duration: 0.15,
      ease: "power2.inOut",
      onComplete: () => {
        setTheme(isDark ? "light" : "dark");
        gsap.to(document.documentElement, {
          opacity: 1,
          duration: 0.15,
          ease: "power2.inOut"
        });
      }
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-lg transition-all duration-300 hover:bg-primary/10 text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
          size={20}
        />
        <Moon
          className={cn(
            "absolute inset-0 transition-all duration-300",
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          )}
          size={20}
        />
      </div>
    </button>
  );
}
