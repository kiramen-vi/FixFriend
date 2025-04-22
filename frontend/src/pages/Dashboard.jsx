import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <p className="text-center mt-5 text-muted fs-5">Loading dashboard...</p>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 mb-4">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-primary">🔧 ServicePro</span>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-none d-md-flex">
              <li className="nav-item">
                <span className="nav-link text-secondary" role="button">Dashboard</span>
              </li>
              <li className="nav-item">
                <span className="nav-link text-secondary" role="button">Services</span>
              </li>
              <li className="nav-item">
                <span className="nav-link text-secondary" role="button">Settings</span>
              </li>
            </ul>
            <button className="btn btn-warning ms-3">Go to Panel →</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Left Text */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="display-5 fw-bold mb-3">
              Welcome, {user.name}! 👋<br />
              Let’s manage your dashboard
            </h1>
            <p className="lead text-muted mb-4">
              You are logged in as <strong>{user.role}</strong>. You can now manage your services, track requests, and more.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-warning px-4">
                Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel
              </button>
              <button className="btn btn-outline-secondary px-4">Edit Profile</button>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-md-6 text-center">
            <img
              src="https://www.svgrepo.com/show/331470/horse-mail.svg"
              alt="Illustration"
              className="img-fluid"
              style={{ maxWidth: "300px" }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <div className="d-flex justify-content-center flex-wrap gap-4 text-muted fw-semibold">
          <span>🔧 Eureka</span>
          <span>⚙️ QuickFix</span>
          <span>🔩 RepairMax</span>
          <span>🛠️ FixIt</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
