"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

export function useThemeManager() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("rso-theme") || localStorage.getItem("ieee-theme")) as Theme | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        // Default to clean minimalist light mode
        setTheme("light");
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("rso-theme", "light");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("rso-theme", nextTheme);
      } catch {
        // ignore localStorage errors in private browsing
      }
      document.documentElement.setAttribute("data-theme", nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
