import React, { useState } from "react";
import AdminLogin     from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const [token,    setToken]    = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = (tok, user) => {
    setToken(tok);
    setUsername(user);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminDashboard
      token={token}
      username={username}
      onLogout={handleLogout}
    />
  );
}
