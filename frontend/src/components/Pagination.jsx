const Pagination = ({ count, page, pageSize = 10, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (!count) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-ink-border px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <p className="text-sm text-ink-muted sm:mr-auto">
        Page {page} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <button className="text-sm font-semibold text-ink-secondary transition hover:text-ink-accent disabled:cursor-not-allowed disabled:text-ink-muted" disabled={page === 1} onClick={() => onPageChange(page - 1)} type="button">
          {"<-"} Previous
        </button>
        {pages.map((number) => (
          <button
            className={`text-sm font-semibold transition ${
              number === page ? "text-ink-accent" : "text-ink-secondary hover:text-ink-text"
            }`}
            key={number}
            onClick={() => onPageChange(number)}
            type="button"
          >
            {number}
          </button>
        ))}
        <button className="text-sm font-semibold text-ink-secondary transition hover:text-ink-accent disabled:cursor-not-allowed disabled:text-ink-muted" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} type="button">
          Next {"->"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
