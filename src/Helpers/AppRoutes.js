import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../components/main/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "../components/auth/SignIn";
import SignUp from "../components/auth/Signup";

/**
 * @desc Route configuration with protected and public routes
 * @param {boolean} isAuthenticated - Auth flag passed from parent (App)
 */
const AppRoutes = ({ isAuthenticated }) => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      {/* Redirect Root */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/Dashboard" : "/login"} replace />
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* Add future protected routes here */}
      </Route>

      {/* Catch-All Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
