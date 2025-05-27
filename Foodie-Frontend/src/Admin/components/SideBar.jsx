import React from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from "react-icons/bs";

const Sidebar = ({ collapsed }) => {
  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#000",
        color: "#fff",
        height: "calc(100vh - 60px)",
        padding: "1rem",
        transition: "width 0.3s",
      }}
    >
      {/* <div
        className="sidebar-brand d-flex align-items-center mb-4"
        style={{ fontSize: "1.25rem", fontWeight: "bold" }}
      >
        <BsCart3 className="me-2" />
        {!collapsed && <span>SHOP</span>}
      </div> */}

      <ul className="list-unstyled">
        <li className="mb-3">
          <a href="/admin/dashboard" className="text-white d-flex align-items-center text-decoration-none">
            <BsGrid1X2Fill className="me-2" />
            {!collapsed && "Dashboard"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/Product" className="text-white d-flex align-items-center text-decoration-none">
            <BsFillArchiveFill className="me-2" />
            {!collapsed && "Products"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/Categories" className="text-white d-flex align-items-center text-decoration-none">
            <BsFillGrid3X3GapFill className="me-2" />
            {!collapsed && "Categories"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/Users" className="text-white d-flex align-items-center text-decoration-none">
            <BsPeopleFill className="me-2" />
            {!collapsed && "Users"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/Orders" className="text-white d-flex align-items-center text-decoration-none">
            <BsListCheck className="me-2" />
            {!collapsed && "Orders"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/Reports" className="text-white d-flex align-items-center text-decoration-none">
            <BsMenuButtonWideFill className="me-2" />
            {!collapsed && "Reports"}
          </a>
        </li>
        <li className="mb-3">
          <a href="/admin/settings" className="text-white d-flex align-items-center text-decoration-none">
            <BsFillGearFill className="me-2" />
            {!collapsed && "Settings"}
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
