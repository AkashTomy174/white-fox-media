import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ open, title, message, loading, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded border border-ink-border bg-ink-surface p-6">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-ink-danger text-ink-danger">
            <AlertTriangle size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-text">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-secondary">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" disabled={loading} onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="btn-danger" disabled={loading} onClick={onConfirm} type="button">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
