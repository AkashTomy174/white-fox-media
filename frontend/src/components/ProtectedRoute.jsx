import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-ink-primary text-ink-text">
      <Sidebar />
      <div className="min-h-screen pb-20 md:pb-0 md:pl-[220px]">
        <main className="min-w-0 px-4 py-5 sm:px-5 md:px-8 md:py-8">
          <div className="mb-6 md:mb-8">
            <p className="section-label truncate">SchoolOS / Student Management</p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
