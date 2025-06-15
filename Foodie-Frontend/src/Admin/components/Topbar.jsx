import React, { useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import axios from "axios";

const Topbar = ({ onEditProfileClick, onLogout, onToggleSidebar }) => {
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // or sessionStorage
        const res = await axios.get("http://localhost:5110/api/Auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const imageUrl = res.data.imageUrl;
        setProfileImage(imageUrl);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
      {/* Sidebar Toggle Button */}
      <button
        className="btn btn-outline-light me-2 d-lg-none"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Brand */}
      <span className="text-warning fw-bold fs-4 me-auto">FoodieAdmin</span>

      {/* Profile Dropdown */}
      <div className="d-flex align-items-center">
        <div className="dropdown">
          <button
            className="btn dropdown-toggle p-0 border-0"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ background: "none" }}
          >
            <img
              src={
                profileImage?.startsWith("/UserImages")
                  ? `http://localhost:5110${profileImage}`
                  : profileImage || "/default-user.png"
              }
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
              style={{ objectFit: "cover" }}
            />
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
