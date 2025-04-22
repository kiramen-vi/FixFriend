import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/17543705_1911.i126.029_video_bloggers_set-09[1].jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="p-5 rounded-4 shadow-lg w-100"
        style={{
          maxWidth: "960px",
          backgroundColor: "rgba(2, 16, 36, 0.6)",
          backdropFilter: "blur(12px)",
          border: "2px solid #7DA0C4",
          color: "#C1E8FF",
        }}
      >
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5" style={{ color: "#C1E8FF" }}>
            Register for Safety
          </h1>
          <p className="lead" style={{ color: "#C1E8FF" }}>
            Protect your home with fast and reliable service support.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Register */}
          <div className="col-12 col-md-6">
            <div
              className="card h-100 shadow border-0"
              style={{
                backgroundColor: "#5483B3",
                color: "#fff",
              }}
            >
              <div className="card-body d-flex flex-column justify-content-between text-center">
                <h4 className="fw-bold">New Here?</h4>
                <p>Create your account to start booking services instantly.</p>
                <Link
                  to="/register"
                  className="btn fw-bold mt-3"
                  style={{
                    backgroundColor: "#C1E8FF",
                    color: "#052659",
                    borderRadius: "8px",
                  }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Login */}
          <div className="col-12 col-md-6">
            <div
              className="card h-100 shadow border-0"
              style={{
                backgroundColor: "#052659",
                color: "#fff",
              }}
            >
              <div className="card-body d-flex flex-column justify-content-between text-center">
                <h4 className="fw-bold">Already a Member?</h4>
                <p>Sign in and manage your service requests easily.</p>
                <Link
                  to="/login"
                  className="btn fw-bold mt-3"
                  style={{
                    backgroundColor: "#C1E8FF",
                    color: "#021024",
                    borderRadius: "8px",
                  }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center mt-4 p-3"
        style={{
          color: "#C1E8FF",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} FixFriend — All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
