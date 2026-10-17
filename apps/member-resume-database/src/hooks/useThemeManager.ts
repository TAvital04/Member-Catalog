export type Theme = "light";

export function useThemeManager() {
  // Light mode only system
  const theme: Theme = "light";
  const toggleTheme = () => {
    // Light mode only; dark mode is permanently removed
  };

  return { theme, toggleTheme };
}
