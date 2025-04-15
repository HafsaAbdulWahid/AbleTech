import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./Pages/UserAuthentication/LoginForm";
import UserDashboard from "./Pages/UserAuthentication/UserDashboard";
import RegisterParent from "./Pages/UserAuthentication/RegisterParent";

export default function ProjectRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterParent />} />
      <Route path="/userDashboard" element={<UserDashboard />} />
      {/* <Route path="/home" element={<HomePageMain />} /> */}

    </Routes>
  );
}
