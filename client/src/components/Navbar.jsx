import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "./Navbar.css";
import libraryLogo from "/library.png";

const getInitialTheme = () => {
  // 1) Check saved theme
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;

  // 2) Otherwise check system preference
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light"; // but default in UI will be light if nothing saved
};

const Navbar = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    // Apply theme to <html> (or body)
    document.documentElement.setAttribute("data-theme", theme);
    // Persist
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const darkMode = theme === "dark";

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="logo-box">
            <img src={libraryLogo} alt="Library logo" />
          </div>

          <div className="logo-text">
            <h2>Library Management System</h2>
            <span>Smart Library Platform</span>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#benefits">Benefits</a>
          <a href="#statistics">Statistics</a>
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
