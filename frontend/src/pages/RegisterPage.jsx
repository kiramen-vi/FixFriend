import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (userData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const API = import.meta.env.VITE_API_URL;
      await axios.post(`${API}/api/auth/register`, userData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/17543705_1911.i126.029_video_bloggers_set-09[1].jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "2rem",
      }}
    >
      <div
        className="p-5 shadow-lg rounded-4 w-100"
        style={{
          maxWidth: "420px",
          backgroundColor: "rgba(2, 16, 36, 0.7)",
          backdropFilter: "blur(12px)",
          color: "#C1E8FF",
        }}
      >
        <div className="text-center mb-4">
          <img src="/logo.jpg" alt="Logo" className="mb-2" style={{ height: "50px" }} />
          <h2 className="fw-bold">Create Account</h2>
          <p className="text-light mb-0">Smart service starts here</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={userData.name}
              onChange={handleChange}
              required
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={userData.email}
              onChange={handleChange}
              required
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={userData.password}
              onChange={handleChange}
              required
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="form-label">Register As</label>
            <select
              id="role"
              name="role"
              className="form-select"
              value={userData.role}
              onChange={handleChange}
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
            >
              <option value="client">Client</option>
              <option value="technician">Technician</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              backgroundColor: "#5483B3",
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            Register
          </button>
        </form>
      </div>

      <footer
        style={{
          width: "100%",
          padding: "1rem 0",
          background: "rgba(2, 16, 36, 0.75)",
          color: "#C1E8FF",
          textAlign: "center",
          fontSize: "0.95rem",
          backdropFilter: "blur(8px)",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.4)",
          marginTop: "4rem",
        }}
      >
        <div>
          <div style={{ fontWeight: "600", fontSize: "1.1rem", color: "#B7D3F4" }}>
            🔧 FixFriend <span style={{ fontWeight: "400" }}>– Reliable Service Starts Here</span>
          </div>
          <div style={{ marginTop: "0.3rem" }}>
            &copy; {new Date().getFullYear()} FixFriend. All rights reserved.
          </div>
          <div style={{ fontSize: "0.85rem", color: "#A8CBE8" }}>
            v1.0.0 – Empowering clients & technicians
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
