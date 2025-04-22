import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Automatically redirect based on role when accessing /dashboard
  if (location.pathname === "/dashboard") {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin-dashboard" replace />;
      case "client":
        return <Navigate to="/client-dashboard" replace />;
      case "technician":
        return <Navigate to="/technician-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Allow access to protected route
  return children;
};

export default ProtectedRoute;