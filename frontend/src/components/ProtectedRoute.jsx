import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-ink-primary text-ink-text">
      <Sidebar />
      <div className="min-h-screen pl-16 md:pl-[220px]">
        <main className="min-w-0 px-5 py-6 md:px-8 md:py-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="section-label">SchoolOS / Student Management</p>
            <div className="grid h-10 w-10 place-items-center rounded bg-ink-elevated text-sm font-bold uppercase text-ink-accent">
              {(user?.username || "A").charAt(0)}
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
