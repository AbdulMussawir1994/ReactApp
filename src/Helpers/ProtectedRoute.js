import { Navigate, Outlet } from "react-router-dom";

/**
 * @desc Reusable ProtectedRoute for guarding private routes
 * @param {boolean} isAuthenticated - User authentication status
 */
const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
