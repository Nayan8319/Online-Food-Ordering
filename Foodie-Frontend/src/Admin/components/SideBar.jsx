import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsChevronDown,
  BsChevronUp,
  BsBoxArrowRight,
} from "react-icons/bs";

const Sidebar = ({ collapsed: initialCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(initialCollapsed || false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const isProductSection = location.pathname.toLowerCase().startsWith("/admin/menu");
  const isCategorySection = location.pathname.toLowerCase().startsWith("/admin/categories");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setProductDropdownOpen(isProductSection);
    setCategoryDropdownOpen(isCategorySection);
  }, [location.pathname]);

  const toggleProductDropdown = () => {
    setProductDropdownOpen((prev) => {
      const newState = !prev;
      if (newState) navigate("/admin/Menu");
      return newState;
    });
  };

  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen((prev) => {
      const newState = !prev;
      if (newState) navigate("/admin/Categories");
      return newState;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        width: collapsed ? "80px" : "250px",
        backgroundColor: "#adb5bd",
        color: "#000",
        height: "calc(100vh - 60px)",
        padding: "1rem 0.5rem",
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflowY: "auto",
        alignItems: collapsed ? "center" : "flex-start",
      }}
    >
      <ul className="list-unstyled p-0 m-0 w-100">
        <li className="mb-3 w-100">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none text-dark px-2 py-1 w-100 ${
                isActive ? "active" : ""
              }`
            }
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <BsGrid1X2Fill size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && "Dashboard"}
          </NavLink>
        </li>

        {/* Products */}
        <li className="mb-2 w-100">
          <div
            className={`d-flex align-items-center text-dark px-2 py-1 w-100 ${
              isProductSection ? "active" : ""
            }`}
            style={{ cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}
            onClick={toggleProductDropdown}
          >
            <BsFillArchiveFill size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && (
              <>
                <span>Menus</span>
                <span className="ms-auto">{productDropdownOpen ? <BsChevronUp /> : <BsChevronDown />}</span>
              </>
            )}
          </div>
          {!collapsed && productDropdownOpen && (
            <ul className="list-unstyled ps-4 pt-2">
              <li>
                <NavLink
                  to="/admin/Menu"
                  end
                  className={({ isActive }) =>
                    `text-decoration-none text-dark d-block py-1 px-2 ${isActive ? "active" : ""}`
                  }
                >
                  List Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/menu/add-menu-item"
                  className={({ isActive }) =>
                    `text-decoration-none text-dark d-block py-1 px-2 ${isActive ? "active" : ""}`
                  }
                >
                  Add Menu
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Categories */}
        <li className="mb-2 w-100">
          <div
            className={`d-flex align-items-center text-dark px-2 py-1 w-100 ${
              isCategorySection ? "active" : ""
            }`}
            style={{ cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}
            onClick={toggleCategoryDropdown}
          >
            <BsFillGrid3X3GapFill size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && (
              <>
                <span>Categories</span>
                <span className="ms-auto">{categoryDropdownOpen ? <BsChevronUp /> : <BsChevronDown />}</span>
              </>
            )}
          </div>
          {!collapsed && categoryDropdownOpen && (
            <ul className="list-unstyled ps-4 pt-2">
              <li>
                <NavLink
                  to="/admin/Categories"
                  end
                  className={({ isActive }) =>
                    `text-decoration-none text-dark d-block py-1 px-2 ${isActive ? "active" : ""}`
                  }
                >
                  List Category
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/Categories/add-category"
                  className={({ isActive }) =>
                    `text-decoration-none text-dark d-block py-1 px-2 ${isActive ? "active" : ""}`
                  }
                >
                  Add Category
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="mb-3 w-100">
          <NavLink
            to="/admin/Users"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none text-dark px-2 py-1 w-100 ${
                isActive ? "active" : ""
              }`
            }
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <BsPeopleFill size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && "Users"}
          </NavLink>
        </li>

        <li className="mb-3 w-100">
          <NavLink
            to="/admin/Orders"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none text-dark px-2 py-1 w-100 ${
                isActive ? "active" : ""
              }`
            }
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <BsListCheck size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && "Orders"}
          </NavLink>
        </li>

        <li className="mb-3 w-100">
          <NavLink
            to="/admin/Reports"
            className={({ isActive }) =>
              `d-flex align-items-center text-decoration-none text-dark px-2 py-1 w-100 ${
                isActive ? "active" : ""
              }`
            }
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}
          >
            <BsMenuButtonWideFill size={24} className={collapsed ? "" : "me-2"} />
            {!collapsed && "Reports"}
          </NavLink>
        </li>

      </ul>

      <ul className="list-unstyled p-0 m-0 w-100">
        <li className="w-100">
          <div
            className="d-flex align-items-center text-danger px-2 py-1 w-100"
            style={{ cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start" }}
            onClick={handleLogout}
          >
            <BsBoxArrowRight size={24} className={collapsed ? "text-danger" : "me-2 text-danger"} />
            {!collapsed && <span>Logout</span>}
          </div>
        </li>
      </ul>

      <style>{`
        .active {
          background-color: #ffc107 !important;
          color: #000 !important;
          border-radius: 4px;
        }
        .active svg {
          color: #000 !important;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
