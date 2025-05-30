import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../Admin/components/Topbar";
import Sidebar from "../Admin/components/SideBar";
import { isAdmin, getToken } from "../utils/auth"; // ⬅️ Commented out

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !isAdmin()) {
      navigate("/login"); // redirect if not logged in or not admin
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="admin-layout">
      <Topbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex" style={{ height: "calc(100vh - 60px)" }}>
        <Sidebar collapsed={collapsed} />
        <div className="flex-grow-1 p-3 bg-light" style={{ overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
