const StatusBadge = ({ status }) => {
  const active = status === "active";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "border border-ink-success/30 bg-ink-success/10 text-ink-success" : "border border-ink-border bg-ink-elevated text-ink-secondary"
      }`}
    >
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
};

export default StatusBadge;
