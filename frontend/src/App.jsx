import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

import ProtectedRoute
  from "./components/ProtectedRoute";


function App() {

  return (

    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tasks"
          element={<Tasks />}
        />

      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
          />
        }
      />

    </Routes>

  );

}

export default App;