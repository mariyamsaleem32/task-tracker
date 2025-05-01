import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_API_BASEURL;

const ProtectedRoutes = () => {
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVerified(res.data.success);
      } catch (err) {
        setVerified(false);
      }
    };

    verifyToken();
  }, []);

  if (verified === null) return <p>Loading...</p>;

  return verified ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
