import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../../styles/Navbar.css";

const HIDDEN_ROUTES = ["/login", "/register"];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHidden = HIDDEN_ROUTES.includes(location.pathname.toLowerCase());

  const isAuthenticated = useMemo(() => {
    const token = AuthService.getToken();
    return !!token;
  }, []);

  useEffect(() => {
    const publicRoutes = ["/", "/login"];
    if (publicRoutes.includes(location.pathname.toLowerCase())) {
      localStorage.clear();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    AuthService.logOut();
    navigate("/login");
  };

  if (isHidden) return null;

  return (
    <div className="navbar-wrapper">
      <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-container">
        <ul className="navbar-links">
          <li>
            <Link to="/list">Employee List</Link>
          </li>
          <li>
            <Link to="/AddRole">Add Role</Link>
          </li>
          <li>
            <Link to="/register" state={{ from: location.pathname }}>
              New User
            </Link>
          </li>
        </ul>

        {isAuthenticated && (
          <ul className="navbar-actions">
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
    </div>
    
  );
};

export default React.memo(Navbar);
