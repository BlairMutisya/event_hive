import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ isAuthenticated }) {
  console.log("Navbar is rendered"); // For debugging

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/" exact className="nav-link">
          Event Hive
        </NavLink>
      </div>

      <div className="navbar-links">
        <NavLink
          to="/"
          exact
          activeClassName="active-link"
          className="nav-link hover-effect"
        >
          Home
        </NavLink>
        <NavLink
          to="/events"
          activeClassName="active-link"
          className="nav-link hover-effect"
        >
          Explore Events
        </NavLink>
        <NavLink
          to="/contact"
          activeClassName="active-link"
          className="nav-link hover-effect"
        >
          Contact Us
        </NavLink>
        <NavLink
          to="/dashboard"
          activeClassName="active-link"
          className="nav-link hover-effect"
        >
          Dashboard
        </NavLink>
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <NavLink
              to="/login"
              activeClassName="active-link"
              className="nav-link hover-effect"
            >
              <FaUserCircle className="auth-icon" />
            </NavLink>
            <NavLink
              to="/register"
              activeClassName="active-link"
              className="nav-link hover-effect"
            >
              <FaUserPlus className="auth-icon" />
            </NavLink>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
