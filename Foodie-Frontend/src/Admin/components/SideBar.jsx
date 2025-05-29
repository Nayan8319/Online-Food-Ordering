import React from "react";
import { NavLink } from "react-router-dom";
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
      <ul className="list-unstyled p-0 m-0">
        <li className="mb-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsGrid1X2Fill size={24} className="me-2" />
            {!collapsed && "Dashboard"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/Product"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsFillArchiveFill size={24} className="me-2" />
            {!collapsed && "Products"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/Categories"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsFillGrid3X3GapFill size={24} className="me-2" />
            {!collapsed && "Categories"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/Users"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsPeopleFill size={24} className="me-2" />
            {!collapsed && "Users"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/Orders"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsListCheck size={24} className="me-2" />
            {!collapsed && "Orders"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/Reports"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsMenuButtonWideFill size={24} className="me-2" />
            {!collapsed && "Reports"}
          </NavLink>
        </li>
        <li className="mb-3">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              "d-flex align-items-center text-decoration-none text-white " + 
              (isActive ? "active" : "")
            }
          >
            <BsFillGearFill size={24} className="me-2" />
            {!collapsed && "Settings"}
          </NavLink>
        </li>
      </ul>

      {/* Add this CSS inside your global CSS or CSS module */}
      <style>{`
        .active {
          background-color: #1a73e8;
          border-radius: 4px;
        }
        .active svg {
          color: #fff;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
