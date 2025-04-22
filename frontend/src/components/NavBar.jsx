import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm fixed-top"
      style={{ backgroundColor: "#365A82" }}
    >
      <div className="container-fluid px-4">
        {/* Logo + Brand */}
        <Link className="navbar-brand d-flex align-items-center text-light fw-bold" to="/">
          <img
            src="/logo.jpg"
            alt="FixFriend Logo"
            width="36"
            height="36"
            className="me-2 rounded-circle border border-light"
          />
          FixFriend
        </Link>

        {/* Hamburger Toggle */}
        <button
          className="navbar-toggler border-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-outline-light px-4 rounded-pill">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn px-4 rounded-pill fw-semibold" style={{ backgroundColor: "#DB854F", color: "white" }}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-light dropdown-toggle rounded-pill px-4"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end mt-2">
                  <li>
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin-dashboard"
                          : user.role === "technician"
                          ? "/technician-dashboard"
                          : "/client-dashboard"
                      }
                      className="dropdown-item"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
