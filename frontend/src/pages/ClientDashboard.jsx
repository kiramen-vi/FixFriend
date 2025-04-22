import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ClientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [openRequests, setOpenRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const [feedbackMessages, setFeedbackMessages] = useState({});
  const [activeTab, setActiveTab] = useState("new");

  const palette = {
    dark: "#021024",
    navy: "#052659",
    blue: "#5483B3",
    lilac: "#7DA0C4",
    light: "#C1E8FF",
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/user/my-requests", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOpenRequests(res.data.openRequests || []);
      setCompletedRequests(res.data.completedRequests || []);
    } catch (err) {
      console.error("Error loading service requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) logout();
  };

  const handleServiceRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/service/request-service",
        { title, description },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRequestMessage(" Service request submitted.");
      setTitle("");
      setDescription("");
      fetchRequests();
      setTimeout(() => setRequestMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setRequestMessage(" Failed to submit request.");
      setTimeout(() => setRequestMessage(""), 3000);
    }
  };

  const handleFeedbackChange = (serviceId, field, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: field === "rating" ? Number(value) : value,
      },
    }));
  };

  const renderStarRating = (serviceId, currentRating) => (
    <div className="mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= currentRating ? "#ffc107" : "#ccc",
            fontSize: "1.5rem",
            marginRight: "5px",
          }}
          onClick={() => handleFeedbackChange(serviceId, "rating", star)}
        >
          ★
        </span>
      ))}
    </div>
  );

  const submitFeedback = async (e, serviceId) => {
    e.preventDefault();
    const fbText = feedbacks[serviceId]?.text || "";
    const rating = feedbacks[serviceId]?.rating || 0;
    if (!fbText || rating < 1 || rating > 5) {
      return setFeedbackMessages((prev) => ({
        ...prev,
        [serviceId]: " Please enter valid feedback and rating.",
      }));
    }
    try {
      await axios.post(
        "/api/feedback",
        { serviceId, feedback: fbText, rating },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setFeedbackMessages((prev) => ({
        ...prev,
        [serviceId]: " Feedback submitted.",
      }));
      setFeedbacks((prev) => ({ ...prev, [serviceId]: { text: "", rating: 5 } }));
      fetchRequests();
    } catch (err) {
      setFeedbackMessages((prev) => ({
        ...prev,
        [serviceId]: " Failed to submit feedback.",
      }));
    }
  };

  const getFeedbackText = (fb) => {
    if (!fb) return "No comment provided.";
    if (typeof fb === "string") return fb;
    return fb.feedback || fb.comment || fb.text || "No comment provided.";
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
          maxWidth: "1200px",
          backgroundColor: "rgba(5, 38, 89, 0.85)",
          borderRadius: "1rem",
          color: palette.light,
        }}
      >
        
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded" style={{ backgroundColor: palette.dark }}>
          <div>
            <h2 className="fw-bold text-light">Client Dashboard</h2>
            <p className="mb-0">Welcome, <strong>{user?.name}</strong></p>
          </div>
          <div className="d-flex gap-2">
            <button onClick={fetchRequests} className="btn btn-light">Refresh</button>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>

       
        <ul className="nav nav-tabs mb-4" style={{ borderBottom: `2px solid ${palette.blue}` }}>
          {[
            { key: "new", label: "New Request" },
            { key: "open", label: "Open Requests" },
            { key: "feedback", label: "Give Feedback" },
            { key: "history", label: "History" },
          ].map((tab) => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                style={{
                  color: palette.blue,
                  border: "none",
                  backgroundColor: activeTab === tab.key ? palette.light : "transparent",
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

       
        {activeTab === "new" && (
          <div className="bg-white bg-opacity-10 p-4 rounded shadow mb-4">
            <h4 className="text-info">Create Service Request</h4>
            <form onSubmit={handleServiceRequest}>
              <input type="text" className="form-control my-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea className="form-control my-2" rows="3" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
              <button type="submit" className="btn btn-success w-100">Submit</button>
              {requestMessage && <div className="alert alert-info mt-3">{requestMessage}</div>}
            </form>
          </div>
        )}

    
        {activeTab === "open" && (
          <div className="bg-white bg-opacity-10 p-4 rounded shadow">
            <h4 className="text-info">My Open Requests</h4>
            {openRequests.length === 0 ? (
              <p>No open requests.</p>
            ) : (
              openRequests.map((req) => (
                <div key={req._id} className="p-3 my-2 bg-light text-dark rounded">
                  <p><strong>Title:</strong> {req.title}</p>
                  <p><strong>Status:</strong> {req.status}</p>
                  <p><strong>Technician:</strong> {req.technician?.name || "Not assigned yet"}</p>
                </div>
              ))
            )}
          </div>
        )}

        
        {activeTab === "feedback" && (
          <div className="bg-white bg-opacity-10 p-4 rounded shadow">
            <h4 className="text-warning">Feedback for Completed Services</h4>

           
            {completedRequests.filter((r) => !r.feedback).length === 0 ? (
              <p>No services pending feedback.</p>
            ) : (
              completedRequests.filter((r) => !r.feedback).map((req) => (
                <div key={req._id} className="p-3 my-2 bg-light text-dark rounded">
                  <p><strong>Title:</strong> {req.title}</p>
                  <p><strong>Technician:</strong> {req.technician?.name || "N/A"}</p>
                  <form onSubmit={(e) => submitFeedback(e, req._id)}>
                    <textarea
                      className="form-control my-2"
                      rows="2"
                      placeholder="Your feedback"
                      value={feedbacks[req._id]?.text || ""}
                      onChange={(e) => handleFeedbackChange(req._id, "text", e.target.value)}
                      required
                    />
                    {renderStarRating(req._id, feedbacks[req._id]?.rating || 0)}
                    <button className="btn btn-primary w-100">Submit Feedback</button>
                    {feedbackMessages[req._id] && (
                      <div className="alert alert-info mt-2">{feedbackMessages[req._id]}</div>
                    )}
                  </form>
                </div>
              ))
            )}

            
            {completedRequests.filter((r) => r.feedback).length > 0 && (
              <div className="mt-4">
                <h5 className="text-info">My Submitted Feedback</h5>
                {completedRequests.filter((r) => r.feedback).map((r) => (
                  <div key={r._id} className="card my-3">
                    <div className="card-body">
                      <p><strong>Client:</strong> {user?.name}</p>
                      <p><strong>Technician:</strong> {r.technician?.name || "N/A"}</p>
                      <p><strong>Rating:</strong> {"⭐".repeat(r.feedback?.rating || 0)}</p>
                      <p><strong>Comment:</strong> {getFeedbackText(r.feedback)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

       
        {activeTab === "history" && (
          <div className="bg-white bg-opacity-10 p-4 rounded shadow">
            <h4 className="text-success">Completed Service History</h4>
            {completedRequests.length === 0 ? (
              <p>No completed services yet.</p>
            ) : (
              completedRequests.map((req) => {
                const imageUrl = `${API_BASE_URL.replace(/\/api$/, "")}${req.closureImage?.startsWith("/") ? req.closureImage : "/" + req.closureImage}`;
                const feedbackText = getFeedbackText(req.feedback);
                const ratingStars = req.feedback?.rating ? "⭐".repeat(Number(req.feedback.rating)) : "No rating given.";

                return (
                  <div key={req._id} className="p-3 my-2 bg-light text-dark rounded">
                    <p><strong>Title:</strong> {req.title}</p>
                    <p><strong>Technician:</strong> {req.technician?.name || "N/A"}</p>
                    <p><strong>Status:</strong> {req.status}</p>
                    <p><strong>Completed At:</strong> {req.closedAt ? new Date(req.closedAt).toLocaleString() : "N/A"}</p>
                    {req.closureImage && (
                      <img
                        src={imageUrl}
                        alt="Service Closure"
                        className="img-fluid rounded mt-2"
                        style={{ maxHeight: 200 }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          console.warn("Failed to load client image:", imageUrl);
                        }}
                      />
                    )}
                    {req.feedback ? (
                      <div className="alert alert-info mt-2">
                        <p><strong>Client Feedback:</strong> {feedbackText}</p>
                        <p><strong>Rating:</strong> {ratingStars}</p>
                      </div>
                    ) : (
                      <p className="text-muted">No feedback submitted.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>


      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "rgba(2, 16, 36, 0.8)",
          color: "#C1E8FF",
          fontSize: "0.9rem",
          borderTop: "1px solid #7DA0C4",
        }}
      >
        <div>© {new Date().getFullYear()} FixFriend • Home Repairs & Support • All rights reserved.</div>
      </footer>
    </div>
  );
};

export default ClientDashboard;
