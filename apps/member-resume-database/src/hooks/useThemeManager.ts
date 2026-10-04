import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export function useThemeManager() {
  // Always default to "dark" initially to prevent SSR hydration mismatch with client HTML
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Read theme from document attribute, localStorage, or system preference post-hydration
    const activeThemeAttr = document.documentElement.getAttribute("data-theme") as Theme | null;
    const savedTheme = localStorage.getItem("ieee_resume_database_theme_v2") as Theme | null;
    const initialTheme: Theme =
      activeThemeAttr ||
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("ieee_resume_database_theme_v2")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("ieee_resume_database_theme_v2", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  return { theme, toggleTheme };
}
