import React from "react";
import { Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      {/* Brand / Title */}
      <span className="text-warning fw-bold fs-4 me-auto">FoodieAdmin</span>

      {/* Home + User dropdown (desktop only) */}
      <div className="d-none d-lg-flex align-items-center">
        <a href="/admin/dashboard" className="nav-link text-white me-3">
          <i className="fas fa-home me-1"></i> Home
        </a>

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
              <a className="dropdown-item" href="#">
                Edit Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Change Password
              </a>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger" onClick={handleLogout}>
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
