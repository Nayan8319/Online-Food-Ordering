import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ bgcolor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleScroll = () => {
    setIsHeaderActive(window.scrollY > 20);
  };

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await axios.get("http://localhost:5110/api/CartOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalItems = response.data.items.length;
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0); // Reset on error
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchCartCount();

    window.addEventListener("scroll", handleScroll);

    // Custom event listener for cart updates
    const onCartUpdated = () => {
      const token = localStorage.getItem("token");
      if (token) fetchCartCount();
    };
    window.addEventListener("cartUpdated", onCartUpdated);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", onCartUpdated);
    };
  }, []);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <header
      className={`header_section fixed-top ${isHeaderActive ? "headeractive" : ""}`}
      style={{ backgroundColor: bgcolor }}
    >
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          <Link className="navbar-brand" to="/">
            <span>Feane</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <i className="fa fa-times text-white"></i>
            ) : (
              <i className="fa fa-bars text-white"></i>
            )}
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/menu" className="nav-link">
                  Menu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link">
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="user_option d-flex align-items-center gap-2">
              {isLoggedIn && (
                <Link to="/profile" className="user_link">
                  <i className="fa fa-user"></i>
                </Link>
              )}

              <Link to="/cart" className="cart_link user_link position-relative">
                <i className="fa fa-shopping-cart"></i>
                {cartCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <button className="btn cart_link nav_search-btn" type="button">
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="btn btn-danger text-white mx-2"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-light mx-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-warning text-dark">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
