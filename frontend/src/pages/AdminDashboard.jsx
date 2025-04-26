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
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/dashboard`, {
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
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) logout();
  };

  const handleCreateUser = async () => {
    const { name, email, password, role } = newUser;
    if (!name || !email || !password) return alert("All fields required");
    try {
      await axios.post(`${API}/api/admin/create-${role}`, { name, email, password }, {
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
      await axios.delete(`${API}/api/admin/delete-${role}/${id}`, {
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
      await axios.delete(`${API}/api/admin/delete-service-request/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const assignTechnician = async (serviceId) => {
    const technicianId = assigning[serviceId];
    if (!technicianId) return alert("Select a technician.");
    try {
      await axios.put(`${API}/api/admin/assign-technician/${serviceId}`, { technicianId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
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
    <div className="admin-dashboard-container p-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
          </div>

          <ul className="nav nav-tabs mb-4">
            {tabs.map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          <div>
            {activeTab === "users" && (
              <div className="row">
                <div className="col-md-6">
                  <h5>Technicians</h5>
                  <input type="text" className="form-control mb-2" placeholder="Search technician..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
                  <ul className="list-group">
                    {filteredTechs.map(t => (
                      <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {t.name} ({t.email})
                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(t._id, "technician")}>Delete</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-md-6">
                  <h5>Clients</h5>
                  <input type="text" className="form-control mb-2" placeholder="Search client..." value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} />
                  <ul className="list-group">
                    {filteredClients.map(c => (
                      <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                        {c.name} ({c.email})
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
                    <button className="btn btn-primary" onClick={() => assignTechnician(s._id)}>Assign</button>
                  </div>
                  <button className="btn btn-outline-danger btn-sm mt-2" onClick={() => deleteServiceRequest(s._id)}>
                    Delete Request
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
                    Delete Request
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
                </div>
              </div>
            ))}

            {activeTab === "feedback" && feedbacks.map(f => (
              <div key={f._id} className="card mb-3">
                <div className="card-body">
                  <p><strong>Client:</strong> {f.client?.name}</p>
                  <p><strong>Technician:</strong> {f.technician?.name}</p>
                  <p><strong>Rating:</strong> {"⭐".repeat(f.rating)}</p>
                  <p><strong>Comment:</strong> {f.feedback || "No comment"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
