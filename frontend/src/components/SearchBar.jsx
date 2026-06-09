import { Search } from "lucide-react";

const SearchBar = ({ value, onChange }) => (
  <label className="relative block w-full sm:max-w-xs">
    <span className="sr-only">Search students</span>
    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
    <input
      className="input pl-10"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search name or email"
      value={value}
    />
  </label>
);

export default SearchBar;
