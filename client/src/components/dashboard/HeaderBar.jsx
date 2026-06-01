import { FiBell, FiSearch } from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";
import "./HeaderBar.css";
const HeaderBar = ({ title }) => {
  const hideTitle = title === "Admin Dashboard";

  return (
    <header className="header-bar">
      <div className="header-left">
        <p className="eyebrow">Enterprise Library Workspace</p>

        {!hideTitle && <h1>{title}</h1>}
      </div>

      <div className="header-actions">
        <label className="search-shell">
          <FiSearch />

          <input placeholder="Search books, members, activity..." />
        </label>

        <button className="header-icon-btn">
          <FiBell />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default HeaderBar;
