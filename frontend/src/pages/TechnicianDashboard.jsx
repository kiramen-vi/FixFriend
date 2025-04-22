import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const TechnicianDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [assignedServices, setAssignedServices] = useState([]);
  const [completedServices, setCompletedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("assigned");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [assignedRes, completedRes] = await Promise.all([
        axios.get("/api/technician/assigned", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/technician/completed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAssignedServices(assignedRes.data);
      setCompletedServices(completedRes.data);
    } catch (err) {
      console.error("Error loading technician data:", err);
      toast.error("❌ Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Logout?")) logout();
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/technician/update-status/${id}`,
        { status: action === "accept" ? "In Progress" : "Unable to Resolve" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      toast[action === "accept" ? "success" : "warn"](`✅ Service ${action}ed!`);
    } catch (err) {
      toast.error("❌ Action failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCompletion = async (id, image) => {
    try {
      const formData = new FormData();
      formData.append("status", "Completed");
      formData.append("closureImage", image);
      setUpdatingId(id);

      await axios.put(`/api/technician/update-status/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData();
      toast.success("🎉 Service marked as completed!");
    } catch (err) {
      toast.error("❌ Failed to complete service: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

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
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        flexDirection: "column",
      }}
    >
      <div
        className="container py-4 mb-5"
        style={{
          maxWidth: "1100px",
          backgroundColor: "rgba(5, 38, 89, 0.85)",
          borderRadius: "1rem",
          color: "#ffffff",
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded" style={{ backgroundColor: "#00192F" }}>
          <div>
            <h2 className="fw-bold text-light">Technician Dashboard</h2>
            <p className="mb-0">Welcome, <strong>{user?.name}</strong></p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={fetchData}>Refresh</button>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4" style={{ borderBottom: "2px solid #B7D3F4" }}>
          {["assigned", "completed"].map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                style={{
                  color: "#B7D3F4",
                  border: "none",
                  backgroundColor: activeTab === tab ? "#ffffff" : "transparent",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "assigned" ? "Assigned Services" : "Completed Services"}
              </button>
            </li>
          ))}
        </ul>

        {/* Content */}
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-warning"></div>
            <p className="mt-2">Loading your services...</p>
          </div>
        ) : (
          <>
            {activeTab === "assigned" && (
              <div className="bg-white bg-opacity-10 p-4 rounded shadow mb-4">
                {assignedServices.length === 0 ? (
                  <p>No services assigned yet.</p>
                ) : (
                  assignedServices.map(service => (
                    <div key={service._id} className="p-3 my-2 bg-light text-dark rounded">
                      <p><strong>Client:</strong> {service.client?.name}</p>
                      <p><strong>Description:</strong> {service.description}</p>
                      <p><strong>Status:</strong> {service.status}</p>

                      {service.status === "Assigned" && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => handleAction(service._id, "accept")}>Accept</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleAction(service._id, "skip")}>Skip</button>
                        </div>
                      )}

                      {service.status === "In Progress" && (
                        <form
                          className="mt-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            const image = e.target.closureImage.files[0];
                            if (!image) return toast.warning("Please upload a photo.");
                            handleCompletion(service._id, image);
                          }}
                        >
                          <div className="mb-2">
                            <input type="file" name="closureImage" accept="image/*" className="form-control" />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-warning btn-sm"
                            disabled={updatingId === service._id}
                          >
                            {updatingId === service._id ? "Updating..." : "Mark as Completed"}
                          </button>
                        </form>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div className="bg-white bg-opacity-10 p-4 rounded shadow">
                {completedServices.length === 0 ? (
                  <p>No completed services yet.</p>
                ) : (
                  completedServices.map(service => {
                    const imageUrl = `${API_BASE_URL.replace("/api", "")}${service.closureImage}`;
                    return (
                      <div key={service._id} className="p-3 my-2 bg-light text-dark rounded">
                        <p><strong>Client:</strong> {service.client?.name}</p>
                        <p><strong>Description:</strong> {service.description}</p>
                        <p><strong>Status:</strong> {service.status}</p>
                        <p><strong>Closed At:</strong> {new Date(service.closedAt).toLocaleString()}</p>

                        {service.closureImage && (
                          <img
                            src={imageUrl}
                            alt="closure"
                            className="img-fluid rounded mt-2"
                            style={{ maxHeight: 200 }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              console.warn("🛑 Failed to load image:", imageUrl);
                            }}
                          />
                        )}

                        {service.feedback && typeof service.feedback === "object" ? (
                          <div className="alert alert-info mt-3">
                            <h6>Client Feedback:</h6>
                            <p>{service.feedback.feedback || "No feedback text."}</p>
                            <p><strong>Rating:</strong> {service.feedback.rating ?? "N/A"} / 5</p>
                          </div>
                        ) : (
                          <p className="text-muted mt-2">No feedback received.</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
