import { useEffect, useState } from "react";

import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const statItems = [
  { key: "total_students", label: "Total Students" },
  { key: "active_students", label: "Active" },
  { key: "inactive_students", label: "Inactive" },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const displayName = user?.username ? `${user.username.charAt(0).toUpperCase()}${user.username.slice(1)}` : "Admin";
  const greeting = getGreeting();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data.data);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label">Dashboard</p>
        <h1 className="mt-2 text-xl font-bold tracking-[-0.02em] text-ink-text sm:text-2xl">{greeting}, {displayName}</h1>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {statItems.map(({ key, label }) => (
          <div className="rounded border border-ink-border bg-ink-surface p-2.5 first:border-l-4 first:border-l-ink-accent sm:p-5" key={key}>
            <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-ink-muted sm:text-[11px]">{label}</p>
            <p className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-ink-text sm:mt-3 sm:text-4xl">{loading ? "Loading..." : stats?.[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <section>
        <div>
          <p className="section-label">Recent Enrollments</p>
        </div>
        <div className="mt-3 border border-ink-border">
          <div className="divide-y divide-ink-elevated md:hidden">
            {(stats?.recent_enrollments || []).map((student) => (
              <article className="p-4" key={student.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-text">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="mt-1 break-all text-sm text-ink-secondary">{student.email}</p>
                    <p className="mt-1 text-sm text-ink-secondary">{student.grade}</p>
                  </div>
                  <StatusBadge status={student.status} />
                </div>
              </article>
            ))}
            {!loading && !stats?.recent_enrollments?.length && (
              <div className="px-5 py-8 text-center text-sm text-ink-muted">No enrollments yet.</div>
            )}
          </div>
          <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full">
            <thead className="bg-ink-surface">
              <tr>
                {["Name", "Email", "Grade", "Status"].map((heading) => (
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted" key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.recent_enrollments || []).map((student) => (
                <tr className="border-b border-ink-elevated bg-ink-primary hover:bg-ink-elevated" key={student.id}>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-ink-text">
                    {student.first_name} {student.last_name}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-ink-secondary">{student.email}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-ink-secondary">{student.grade}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
              {!loading && !stats?.recent_enrollments?.length && (
                <tr>
                  <td className="px-5 py-8 text-center text-sm text-ink-muted" colSpan="4">
                    No enrollments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
