import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

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
    setLoading(true); // Start loading
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
      toast.error("Failed to fetch dashboard data.");
    }
    setLoading(false); // Stop loading
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
      await axios.post(`${API}/api/admin/create-${role}`, { name, email, password }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      setShowModal(false);
      setNewUser({ name: "", email: "", password: "", role: "technician" });
      toast.success(`${role} created successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating user.");
    }
  };

  const deleteUser = async (id, role) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/api/admin/delete-${role}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      toast.success(`${role} deleted successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user.");
    }
  };

  const deleteServiceRequest = async (id) => {
    if (!window.confirm("Delete this service request?")) return;
    try {
      await axios.delete(`${API}/api/admin/delete-service-request/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchData();
      toast.success("Service request deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting service request.");
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
      toast.success("Technician assigned successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error assigning technician.");
    }
  };

  const getImageUrl = (path) => {
    return `${API}${path}`;
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
    <div className="admin-dashboard-container">
      <ToastContainer />
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>

        </>
      )}
    </div>
  );
};

export default AdminDashboard;
