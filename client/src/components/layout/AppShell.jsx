import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import HeaderBar from "../dashboard/HeaderBar";
import "./AppShell.css";

const AppShell = ({ menu, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  const hideHeaderTitle = title === "Member Dashboard";

  return (
    <div className="app-shell">
      <Sidebar menu={menu} collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="main-panel">
        <HeaderBar title={hideHeaderTitle ? "" : title} />

        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
