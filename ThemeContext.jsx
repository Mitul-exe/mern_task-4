import React, { createContext, useState, useEffect } from "react";

// Create context
export const ThemeContext = createContext();
const THEME_KEY = "vite-ui";

// Provide context
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("THEME_KEY") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
