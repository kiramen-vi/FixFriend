import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { setUser } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`, // 👈 you add /api here
        credentials,
        { withCredentials: true }
      );
      

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "technician") navigate("/technician-dashboard");
      else navigate("/client-intro");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
      }}
    >
      <div
        className="p-5 shadow-lg rounded-4 w-100 mx-3"
        style={{
          maxWidth: "420px",
          backgroundColor: "rgba(2, 16, 36, 0.7)",
          backdropFilter: "blur(12px)",
          color: "#C1E8FF",
        }}
      >
        <div className="text-center mb-4">
          <img src="/logo.jpg" alt="Logo" style={{ height: "50px" }} className="mb-2" />
          <h2 className="fw-bold">Login</h2>
          <p className="text-light mb-0">Access your FixFriend account</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
              id="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-light">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              style={{ backgroundColor: "#C1E8FF", color: "#021024" }}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn fw-bold w-100"
            style={{
              backgroundColor: "#5483B3",
              color: "#fff",
              borderRadius: "8px",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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

export default LoginPage;
