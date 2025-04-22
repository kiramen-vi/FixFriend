import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [openServices, setOpenServices] = useState([]);
  const [assignedServices, setAssignedServices] = useState([]);
  const [completedServices, setCompletedServices] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [clients, setClients] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [assigning, setAssigning] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "technician" });
  const [techSearch, setTechSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const services = res.data.openServiceRequests || [];
      setOpenServices(services.filter((s) => !s.technician));
      setAssignedServices(services.filter((s) => s.technician));
      setCompletedServices(res.data.completedServiceRequests || []);
      setTechnicians(res.data.technicians || []);
      setClients(res.data.clients || []);
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) logout();
  };

  const renderStars = (rating) => "⭐".repeat(rating);

  const handleCreateUser = async () => {
    const { name, email, password, role } = newUser;
    if (!name || !email || !password) return alert("All fields required");
    try {
      await axios.post(`/api/admin/create-${role}`, { name, email, password }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      setShowModal(false);
      setNewUser({ name: "", email: "", password: "", role: "technician" });
      alert(`${role} created`);
    } catch (err) {
      console.error(err);
      alert("Error creating user.");
    }
  };

  const deleteUser = async (id, role) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/api/admin/delete-${role}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteServiceRequest = async (id) => {
    if (!window.confirm("Delete this service request?")) return;
    try {
      await axios.delete(`/api/admin/delete-service-request/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getImageUrl = (path) => {
    return `${import.meta.env.VITE_API_URL.replace("/api", "")}${path}`;
  };

  const tabs = [
    { key: "users", label: "Users" },
    { key: "open", label: "Open Requests" },
    { key: "assigned", label: "Assigned Requests" },
    { key: "completed", label: "Completed Requests" },
    { key: "feedback", label: "Feedback" },
  ];

  const filteredTechs = technicians.filter(t =>
    t.name.toLowerCase().includes(techSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(techSearch.toLowerCase())
  );

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

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
          color: "#ffffff",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded" style={{ backgroundColor: "#00192F" }}>
          <div>
            <h2 className="fw-bold text-light">Admin Dashboard</h2>
            <p className="mb-0">Welcome, <strong>{user?.name || "Admin"}</strong></p>
          </div>
          <div className="d-flex gap-2">
            <button onClick={fetchData} className="btn btn-light">Refresh</button>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>
        </div>

        <ul className="nav nav-tabs mb-4" style={{ borderBottom: "2px solid #B7D3F4" }}>
          {tabs.map(tab => (
            <li className="nav-item" key={tab.key}>
              <button
                className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                style={{
                  color: "#B7D3F4",
                  border: "none",
                  backgroundColor: activeTab === tab.key ? "#ffffff" : "transparent",
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

       
        <div className="text-start">
          {activeTab === "users" && (
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-warning d-flex justify-content-between align-items-center">
                  Technicians
                  <button className="btn btn-sm btn-light" onClick={() => { setNewUser({ ...newUser, role: "technician" }); setShowModal(true); }}>Add</button>
                </h5>
                <input type="text" className="form-control mb-2" placeholder="Search technician..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
                <ul className="list-group">
                  {filteredTechs.map(t => (
                    <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {t.name} - {t.email}
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUser(t._id, "technician")}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-md-6">
                <h5 className="text-info d-flex justify-content-between align-items-center">
                  Clients
                  <button className="btn btn-sm btn-light" onClick={() => { setNewUser({ ...newUser, role: "client" }); setShowModal(true); }}>Add</button>
                </h5>
                <input type="text" className="form-control mb-2" placeholder="Search client..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} />
                <ul className="list-group">
                  {filteredClients.map(c => (
                    <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                      {c.name} - {c.email}
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUser(c._id, "client")}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "open" && openServices.map(s => (
            <div key={s._id} className="card mb-3">
              <div className="card-body">
                <p><strong>Client:</strong> {s.client?.name}</p>
                <p><strong>Description:</strong> {s.description}</p>
                <div className="d-flex align-items-center gap-2">
                  <select className="form-select" value={assigning[s._id] || ""} onChange={(e) => setAssigning((prev) => ({ ...prev, [s._id]: e.target.value }))}>
                    <option value="">Select Technician</option>
                    {technicians.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                  <button className="btn btn-primary" onClick={async () => {
                    const technicianId = assigning[s._id];
                    if (!technicianId) return alert("Select a technician.");
                    await axios.put(`/api/admin/assign-technician/${s._id}`, { technicianId }, {
                      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    });
                    fetchData();
                  }}>Assign</button>
                </div>
                <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => deleteServiceRequest(s._id)}>
                  Delete Service Request
                </button>
              </div>
            </div>
          ))}

          {activeTab === "assigned" && assignedServices.map(s => (
            <div key={s._id} className="card mb-3">
              <div className="card-body">
                <p><strong>Client:</strong> {s.client?.name}</p>
                <p><strong>Description:</strong> {s.description}</p>
                <p><strong>Technician:</strong> {s.technician?.name}</p>
                <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => deleteServiceRequest(s._id)}>
                  Delete Service Request
                </button>
              </div>
            </div>
          ))}

          {activeTab === "completed" && completedServices.map(s => (
            <div key={s._id} className="card mb-3">
              <div className="card-body">
                <p><strong>Client:</strong> {s.client?.name}</p>
                <p><strong>Description:</strong> {s.description}</p>
                <p><strong>Technician:</strong> {s.technician?.name}</p>
                <p><strong>Status:</strong> {s.status}</p>
                <p><strong>Closed At:</strong> {s.closedAt ? new Date(s.closedAt).toLocaleString() : "N/A"}</p>
                {s.closureImage && (
                  <img src={getImageUrl(s.closureImage)} alt="Closure" className="img-fluid rounded mt-2" style={{ maxHeight: 200 }} />
                )}
                <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => deleteServiceRequest(s._id)}>
                  Delete Service Request
                </button>
              </div>
            </div>
          ))}

          {activeTab === "feedback" && feedbacks.map(f => (
            <div key={f._id} className="card mb-3">
              <div className="card-body">
                <p><strong>Client:</strong> {f.client?.name}</p>
                <p><strong>Technician:</strong> {f.technician?.name}</p>
                <p><strong>Rating:</strong> {renderStars(f.rating)}</p>
                <p><strong>Comment:</strong> {f.feedback || "No comment"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="w-100 text-center py-3 bg-dark text-light mt-4">
        <small>&copy; {new Date().getFullYear()} Service Management Admin Panel</small>
      </footer>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create {newUser.role}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <input className="form-control mb-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <input className="form-control mb-2" placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateUser}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
