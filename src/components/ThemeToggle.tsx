import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  isScrolled?: boolean;
  isHomePage?: boolean;
}

export function ThemeToggle({ className, isScrolled = false, isHomePage = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  const buttonColor = (!isScrolled && isHomePage) 
    ? "text-white/95 hover:text-white" 
    : "text-muted-foreground hover:text-foreground";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-lg transition-all duration-300 hover:bg-primary/10",
        buttonColor,
        className
      )}
      style={(!isScrolled && isHomePage) ? { filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' } : undefined}
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
