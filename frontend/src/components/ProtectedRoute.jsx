import {
  Navigate,
  Outlet
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  getCurrentUser
} from "../api/auth";
import Navbar from "./Navbar";


function ProtectedRoute() {

  const [loading, setLoading] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {

    async function checkAuth() {

      try {

        const currentUser = await getCurrentUser();

        setUser(currentUser);
        setAuthenticated(true);

      } catch {

        setAuthenticated(false);

      } finally {

        setLoading(false);

      }
    }

    checkAuth();

  }, []);

  if (loading) {

    return <div>Loading...</div>;

  }

  if (!authenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return (
    <div className="workspace-layout">
      <Navbar user={user} />
      <main className="workspace-content">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedRoute;