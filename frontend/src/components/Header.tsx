import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './Header.css'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("jwt_token"));
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem("username") || ""); // Ha nincs username, üres string
    } else {
      setIsAuthenticated(false);
      setUsername(null);
    }
  }, [location.pathname]); // Útvonalváltozáskor frissítjük az állapotot

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Todo App</Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <span className="navbar-text">Welcome, {username}!</span>
              </li>
            )}

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/todos">Todos</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
