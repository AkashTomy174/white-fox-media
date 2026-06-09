import { LayoutDashboard, LogOut, UserPlus, Users } from "lucide-react";
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
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] border-r border-ink-border bg-ink-surface md:block">
        <div className="flex h-full flex-col px-5 py-6">
          <div className="mb-10 text-2xl font-extrabold tracking-[-0.02em] text-ink-text">
            SchoolOS<span className="text-ink-accent">.</span>
          </div>

          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                className={({ isActive }) =>
                  `flex h-11 items-center gap-3 border-l-2 px-3 text-sm font-semibold transition ${
                    isActive ? "border-ink-accent text-ink-accent" : "border-transparent text-ink-secondary hover:bg-ink-elevated hover:text-ink-text"
                  }`
                }
                end={end}
                key={to}
                to={to}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t border-ink-border pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Logged in as</p>
            <p className="mt-1 truncate text-sm font-bold text-ink-text">{user?.username}</p>
            <button className="mt-4 text-sm font-semibold text-ink-secondary transition hover:text-ink-accent" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink-border bg-ink-surface md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            className={({ isActive }) =>
              `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                isActive ? "text-ink-accent" : "text-ink-secondary"
              }`
            }
            end={end}
            key={to}
            to={to}
          >
            <Icon size={18} aria-hidden="true" />
            {label.replace(" Student", "")}
          </NavLink>
        ))}
        <button className="flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-ink-secondary" onClick={logout} type="button">
          <LogOut size={18} aria-hidden="true" />
          Logout
          </button>
      </nav>
    </>
  );
};

export default Sidebar;
