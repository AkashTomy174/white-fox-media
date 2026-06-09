import { Link } from "react-router-dom";

import StatusBadge from "./StatusBadge";

const StudentTable = ({ students, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-ink-primary p-6 text-sm text-ink-secondary">
        Loading...
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="bg-ink-primary p-10 text-center">
        <p className="text-base font-semibold text-ink-text">No students found</p>
        <p className="mt-1 text-sm text-ink-muted">Try a different search or status filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-ink-primary">
      <div className="divide-y divide-ink-elevated md:hidden">
        {students.map((student) => (
          <article className="bg-ink-primary p-4" key={student.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-ink-text">
                  {student.first_name} {student.last_name}
                </h2>
                <p className="mt-1 break-all text-sm text-ink-secondary">{student.email}</p>
              </div>
              <StatusBadge status={student.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Phone</dt>
                <dd className="mt-1 text-ink-text">{student.phone}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Grade</dt>
                <dd className="mt-1 text-ink-text">{student.grade}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-4 border-t border-ink-elevated pt-3">
              <Link className="text-sm font-semibold text-ink-secondary transition hover:text-ink-accent" to={`/students/${student.id}/edit`} title="Edit student">
                Edit
              </Link>
              <button className="text-sm font-semibold text-ink-danger transition hover:text-ink-text" onClick={() => onDelete(student)} title="Delete student" type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full">
          <thead className="bg-ink-surface">
            <tr>
              {["Name", "Email", "Phone", "Grade", "Status", "Actions"].map((heading) => (
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted" key={heading}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr className="border-b border-ink-elevated bg-ink-primary hover:bg-ink-elevated" key={student.id}>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-ink-text">
                  {student.first_name} {student.last_name}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-secondary">{student.email}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-secondary">{student.phone}</td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-secondary">{student.grade}</td>
                <td className="whitespace-nowrap px-4 py-4">
                  <StatusBadge status={student.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex gap-2">
                    <Link className="text-sm font-semibold text-ink-secondary transition hover:text-ink-accent" to={`/students/${student.id}/edit`} title="Edit student">
                      Edit
                    </Link>
                    <button className="text-sm font-semibold text-ink-danger transition hover:text-ink-text" onClick={() => onDelete(student)} title="Delete student" type="button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
