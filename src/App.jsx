import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./MainLayout";
import Explore    from "./Explore";
import AdminPage  from "./AdminPage";

function AppRoutes() {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/"        element={<MainLayout key={location.key} />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/admin"   element={<AdminPage />} />
    </Routes>
  );
}

export default function App() {
  return (
      <AppRoutes />
  );
}
