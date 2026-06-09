import { LayoutDashboard, UserPlus, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users, end: true },
  { to: "/students/add", label: "Add Student", icon: UserPlus },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-16 border-r border-ink-border bg-ink-surface md:w-[220px]">
      <div className="flex h-full flex-col px-2 py-6 md:px-5">
        <div className="mb-10 text-center text-2xl font-extrabold tracking-[-0.02em] text-ink-text md:text-left">
          <span className="md:hidden">S<span className="text-ink-accent">.</span></span>
          <span className="hidden md:inline">SchoolOS<span className="text-ink-accent">.</span></span>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              className={({ isActive }) =>
                `flex h-11 items-center justify-center gap-3 border-l-2 px-2 text-sm font-semibold transition md:justify-start md:px-3 ${
                  isActive ? "border-ink-accent text-ink-accent" : "border-transparent text-ink-secondary hover:bg-ink-elevated hover:text-ink-text"
                }`
              }
              end={end}
              key={to}
              to={to}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-ink-border pt-5">
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted md:block">Logged in as</p>
          <p className="mt-1 hidden truncate text-sm font-bold text-ink-text md:block">{user?.username}</p>
          <button className="mt-4 text-sm font-semibold text-ink-secondary transition hover:text-ink-accent" onClick={logout} type="button">
            <span className="md:hidden">Out</span>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
