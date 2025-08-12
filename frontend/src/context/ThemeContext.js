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

  // Effect hook to apply the current theme preference to the document element.
  // This makes the theme globally effective across the entire webpage.
  useEffect(() => {
    // Determine the class to add based on the user's theme setting.
    const themeClass = user?.theme === "dark" ? "dark" : "light";
    // First, remove any existing theme classes to avoid conflicts.
    document.documentElement.classList.remove("dark", "light");
    // Then, add the current theme class.
    document.documentElement.classList.add(themeClass);
  }, [user?.theme]); // This effect depends on the user's theme setting.

  // Function to toggle between light and dark themes.
  const toggleTheme = () => {
    // Determine the new theme opposite to the current setting.
    const newTheme = user?.theme === 'light' ? 'dark' : 'light';
    // Update the user's theme preference using the updateUser function provided by UserContext.
    updateUser({ ...user, theme: newTheme });

    // Also update the theme class on the document element to immediately apply the new theme.
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
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
