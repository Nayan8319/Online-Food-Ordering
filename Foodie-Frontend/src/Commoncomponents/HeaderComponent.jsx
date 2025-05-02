import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Header = ({ bgcolor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHeaderActive, setIsHeaderActive] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Scroll effect
    const handleScroll = () => {
        setIsHeaderActive(window.scrollY > 20);
    };

    // Check login status on load
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleCollapse = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header
            className={`header_section fixed-top ${isHeaderActive ? 'headeractive' : ''}`}
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
                        {isOpen ? <i className="fa fa-times text-white"></i> : <i className="fa fa-bars text-white"></i>}
                    </button>

                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/menu" className="nav-link">Menu</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/contact" className="nav-link">Contact</NavLink>
                            </li>
                        </ul>
                        <div className="user_option d-flex align-items-center gap-2">
                            {/* Only show user icon if logged in */}
                            {isLoggedIn && (
                                <Link to="/profile" className="user_link">
                                    <i className="fa fa-user"></i>
                                </Link>
                            )}

                            <Link to="/cart" className="cart_link user_link">
                                <i className="fa fa-shopping-cart"></i>
                            </Link>

                            <button className="btn cart_link nav_search-btn" type="button">
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </button>

                            {/* Conditionally render buttons */}
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-danger text-white mx-2"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline-light mx-2">Login</Link>
                                    <Link to="/register" className="btn btn-warning text-dark">Register</Link>
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
