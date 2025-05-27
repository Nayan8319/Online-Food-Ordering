import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";


const Topbar = ({ onToggleSidebar }) => {
  return (
    <Navbar
      expand="lg"
      className="px-3 shadow-sm"
      style={{ backgroundColor: "#000", color: "#fff", height: "60px" }}
      variant="dark"
    >
      <button
        className="btn btn-link text-white me-3"
        onClick={onToggleSidebar}
      >
        <i className="fas fa-bars" />
      </button>

      <span className="text-warning fw-bold fs-4 me-auto">FoodieAdmin</span>

            {/* Right-side icons */}
      <Nav className="ms-auto">
        <Nav.Link href="/admin/dashboard" className="text-white">
          <i className="fas fa-external-link-alt me-1" /> Home
        </Nav.Link>

        <NavDropdown
          title={<i className="fas fa-user fa-fw text-white"></i>}
          id="user-dropdown"
          align="end"
        >
          <NavDropdown.Item href="#">Edit Profile</NavDropdown.Item>
          <NavDropdown.Item href="#">Change Password</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#">Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>

    </Navbar>
  );
};

export default Topbar;


