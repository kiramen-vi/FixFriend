import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
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

  
  return children;
};

export default ProtectedRoute;