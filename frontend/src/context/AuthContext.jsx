import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { isTokenExpired } from "../utils/tokenUtils";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        if (isTokenExpired(token)) {
          localStorage.removeItem("token");
          setUser(null);
          toast.info("Session expired. Please log in again.");
        } else {
          try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
          } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
