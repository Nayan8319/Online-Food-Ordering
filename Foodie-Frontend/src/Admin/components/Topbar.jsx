import React from "react";
import { Navbar } from "react-bootstrap";

const Topbar = ({ onEditProfileClick, onLogout, onToggleSidebar }) => {
  return (
    <Navbar
      expand="lg"
      className="px-3 shadow-sm justify-content-between"
      style={{
        backgroundColor: "#6c757d",
        color: "#fff",
        height: "60px",
      }}
      variant="dark"
    >
      {/* Toggle button for Sidebar (optional) */}
      <button
        className="btn btn-outline-light me-2 d-lg-none"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Brand */}
      <span className="text-warning fw-bold fs-4 me-auto">FoodieAdmin</span>

      {/* User Dropdown */}
      <div className="d-flex align-items-center">
        <div className="dropdown">
          <button
            className="btn text-white dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ background: "none", border: "none" }}
          >
            <i className="fas fa-user fa-fw"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <button className="dropdown-item" onClick={onEditProfileClick}>
                Edit Profile
              </button>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={onLogout}>
                <i className="fas fa-sign-out-alt me-2" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Navbar>
  );
};

export default Topbar;
