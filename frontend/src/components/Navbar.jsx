import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../api/auth";
import "./Navbar.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const displayName = user?.full_name || user?.username || "Workspace member";
  const initial = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="workspace-header">
      <div className="navbar-inner">
        <NavLink className="workspace-brand" to="/dashboard" aria-label="Taskflow home">
          <span className="workspace-brand-mark" aria-hidden="true">T</span>
          <span>Taskflow</span>
        </NavLink>

        <nav className="workspace-nav" aria-label="Main navigation">
          <NavLink to="/dashboard">Overview</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>

        <div className="workspace-account">
          <div className="account-identity">
            <span className="account-avatar" aria-hidden="true">{initial}</span>
            <span className="account-details">
              <span className="account-name">{displayName}</span>
              <span className="account-caption">Signed in</span>
            </span>
          </div>
          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Log out"}
          </button>
        </div>
      </div>
      {error && <p className="logout-error" role="alert">{error}</p>}
    </header>
  );
}

export default Navbar;