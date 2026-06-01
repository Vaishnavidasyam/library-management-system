import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiChevronLeft } from "react-icons/fi";
import "./Sidebar.css";
import { useAuth } from "../../contexts/AuthContext";
import libraryLogo from "/library.png"; // served from public/

const Sidebar = ({ menu, collapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If parent controls collapse, use props; otherwise use internal state
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isControlled = typeof collapsed === "boolean";
  const isCollapsed = isControlled ? collapsed : internalCollapsed;

  const toggleCollapse = () => {
    if (isControlled && setCollapsed) {
      setCollapsed((prev) => !prev);
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={libraryLogo} alt="Library logo" />
          </div>

          {!isCollapsed && (
            <div>
              <h2>Velora Library OS</h2>
              <span>Management System</span>
            </div>
          )}
        </div>

        <button
          className="collapse-btn"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FiMenu /> : <FiChevronLeft />}
        </button>
      </div>

      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          <FiLogOut />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
