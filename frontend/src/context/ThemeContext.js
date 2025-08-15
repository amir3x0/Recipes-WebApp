import React, { createContext, useContext, useEffect } from "react";
import { useUser } from "./UserContext"; // Make sure this path accurately points to where your UserContext is defined.

// Creating a context for theme settings with a default toggle function.
// The toggle function is just a placeholder to avoid errors if called before being properly defined.
const ThemeContext = createContext({
  toggleTheme: () => {},
});

// ThemeProvider component that will wrap the part of our app where the theme context is needed.
export const ThemeProvider = ({ children }) => {
  // Using the user context to access and modify the user's theme preference.
  const { user, updateUser } = useUser(); // Assuming `updateUser` can update the user's theme

  // Effect: apply the current theme to <html> via classes.
  useEffect(() => {
    const theme = user?.theme || "light";
    const el = document.documentElement;
    el.classList.remove(
      "dark",
      "light",
      "theme-light",
      "theme-dark",
      "theme-ocean",
      "theme-forest",
      "theme-grape"
    );
    if (theme === "dark") {
      el.classList.add("dark", "theme-dark");
    } else if (["light", "ocean", "forest", "grape"].includes(theme)) {
      el.classList.add("light", `theme-${theme}`);
    } else {
      // Fallback
      el.classList.add("light", "theme-light");
    }
  }, [user?.theme]);

  // Function to toggle between light and dark themes.
  const toggleTheme = () => {
    const order = ["light", "dark", "ocean", "forest", "grape"];
    const current = user?.theme || "light";
    const idx = order.indexOf(current);
    const next = order[(idx + 1) % order.length];
    updateUser({ ...user, theme: next });
  };

  // The value passed to the provider includes only the toggleTheme function since the theme
  // itself is managed within the UserContext and not directly within this context.
  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      {children} {/* Render children components within the ThemeProvider */}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy use of the theme context within other components.
export const useTheme = () => useContext(ThemeContext);
