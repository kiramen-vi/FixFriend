import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import PrivateRoute from "./components/ProtectedRoutes";
import ClientIntro from "./pages/ClientIntro";


function RoleBasedRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    case "client":
      return <Navigate to="/client-intro" replace />; 
    case "technician":
      return <Navigate to="/technician-dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}


function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/" className="btn btn-primary">
        Go Home
      </a>
    </Container>
  );
}

function App() {
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Routes>
         
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

         
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/client-intro"
            element={
              <PrivateRoute>
                <ClientIntro />
              </PrivateRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <PrivateRoute>
                <ClientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/technician-dashboard"
            element={
              <PrivateRoute>
                <TechnicianDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <RoleBasedRedirect />
              </PrivateRoute>
            }
          />

        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>

     
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
