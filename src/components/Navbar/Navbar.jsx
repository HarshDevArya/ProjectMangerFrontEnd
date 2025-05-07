import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => logout().then(() => navigate("/"));

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand text-decoration-none" to="/">
          <span className="brand-icon text-white px-2 py-1 rounded me-1">
            P
          </span>
          <span className="brand-text">Portfolio Hub</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active fw-bold" : ""}`
                }
                to="/">
                Home
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-3 ${isActive ? "active fw-bold" : ""}`
                  }
                  to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active fw-bold" : ""}`
                }
                to="/explore">
                Explore
              </NavLink>
            </li>
          </ul>

          <form
            className="d-flex me-3 position-relative"
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.q.value;
              navigate(`/search?q=${encodeURIComponent(q)}`);
            }}>
            <input
              name="q"
              className="form-control rounded-pill ps-4 pe-5"
              type="search"
              placeholder="Search users or projects"
              aria-label="Search"
            />
            <button
              className="btn position-absolute end-0 top-0 bottom-0"
              type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </button>
          </form>

          {user ? (
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button
                  className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <div
                    className="heroCard text-white rounded-circle me-2 d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="d-none brand-text d-md-inline">
                    {user.name || "User"}
                  </span>
                </button>
                <ul
                  className="dropdown-menu  dropdown-menu-end"
                  aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/projects/new">
                      New Project
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn heroBtn-outline px-3" to="/login">
                Login
              </Link>
              <Link className="btn heroBtn text-light px-3" to="/signup">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
