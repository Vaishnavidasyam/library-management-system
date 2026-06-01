import { useState } from "react";
import { FiSliders, FiUser } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    dueReminders: true,
    digest: false,
  });

  const labelMap = {
    emailAlerts: "Email alerts",
    dueReminders: "Due date reminders",
    digest: "Weekly activity digest",
  };

  return (
    <div className="set-page">
      {/* ── Hero ── */}
      <div className="set-hero">
        <div className="set-hero-inner">
          <span className="set-hero-tag">Profile & Preferences</span>
          <h1 className="set-hero-title">Settings</h1>
          <p className="set-hero-desc">
            Personalize your experience, choose your theme, and control how you
            receive notifications from the library.
          </p>
        </div>

        <div className="set-hero-badge">
          <span className="set-hero-badge-dot" />
          <span className="set-hero-badge-text">
            Active theme:{" "}
            <strong>{theme === "dark" ? "Dark" : "Light"} mode</strong>
          </span>
        </div>
      </div>

      {/* ── Grid with two panels ── */}
      <div className="set-grid">
        {/* Theme & Interface */}
        <div className="set-card">
          <div className="set-card-header">
            <div className="set-card-title-row">
              <span className="set-card-icon set-ci--indigo">
                <FiSliders />
              </span>
              <div>
                <h2 className="set-card-title">Theme & Interface</h2>
                <p className="set-card-subtitle">
                  Switch between dark and light modes and tune the overall
                  experience.
                </p>
              </div>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-text">
              <span>Current theme</span>
              <p>
                Your interface is currently in{" "}
                <strong>{theme === "dark" ? "Dark" : "Light"}</strong> mode.
              </p>
            </div>
            <button className="primary-button" onClick={toggleTheme}>
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </button>
          </div>
        </div>

        {/* Notifications & Account */}
        <div className="set-card">
          <div className="set-card-header">
            <div className="set-card-title-row">
              <span className="set-card-icon set-ci--teal">
                <FiUser />
              </span>
              <div>
                <h2 className="set-card-title">Notifications & Account</h2>
                <p className="set-card-subtitle">
                  Control alert channels and how often we keep you informed.
                </p>
              </div>
            </div>
          </div>

          <div className="set-list">
            {Object.entries(settings).map(([key, value]) => (
              <label key={key} className="settings-row">
                <div className="settings-row-text">
                  <span>{labelMap[key] || key}</span>
                  <p>
                    {key === "emailAlerts" &&
                      "Receive important updates by email."}
                    {key === "dueReminders" &&
                      "Get reminders before items reach their due date."}
                    {key === "digest" &&
                      "Receive a weekly summary of your activity."}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() =>
                    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
