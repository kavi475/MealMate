import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/UserLayout.css";

export const UserLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect admin to admin dashboard
  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="user-layout">
      <Navbar />
      <main className="user-main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
