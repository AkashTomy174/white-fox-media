import { ChevronDown, Save, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { validateField, validateStudentForm } from "../utils/validators";

const emptyStudent = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  grade: "",
  address: "",
  status: "active",
};

const gradeOptions = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];
const splitDate = (value) => {
  if (!value) return { day: "", month: "", year: "" };
  const [year, month, day] = value.split("-");
  return { day: day || "", month: month || "", year: year || "" };
};

const getDobError = (parts, dateValue) => {
  const hasAnyPart = Boolean(parts.day || parts.month || parts.year);
  const hasAllParts = Boolean(parts.day && parts.month && parts.year);

  if (hasAnyPart && !hasAllParts) {
    if (!parts.month && parts.day && parts.year) {
      return "Select a month to complete date of birth.";
    }
    return "Enter day, month, and year to complete date of birth.";
  }

  return validateField("date_of_birth", dateValue);
};

const StudentForm = ({ initialValues = emptyStudent, submitLabel, onSubmit, loading = false }) => {
  const [values, setValues] = useState({ ...emptyStudent, ...initialValues });
  const [dobParts, setDobParts] = useState(splitDate(initialValues.date_of_birth));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSelect, setOpenSelect] = useState("");
  const navigate = useNavigate();
  const submitDisabled = loading || isSubmitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  };

  const handleSelect = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: validateField(name, value) }));
    setOpenSelect("");
  };

  const handleDobPartChange = (name, value) => {
    if (name === "day" && value.length > 2) return;
    if (name === "year" && value.length > 4) return;

    const nextParts = { ...dobParts, [name]: value };
    setDobParts(nextParts);
    const day = nextParts.day ? nextParts.day.padStart(2, "0") : "";
    const dateValue = day && nextParts.month && nextParts.year ? `${nextParts.year}-${nextParts.month}-${day}` : "";
    setValues((current) => ({ ...current, date_of_birth: dateValue }));
    if (errors.date_of_birth) {
      setErrors((current) => ({ ...current, date_of_birth: getDobError(nextParts, dateValue) }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateStudentForm(values);
    const dobError = getDobError(dobParts, values.date_of_birth);
    if (dobError) {
      validationErrors.date_of_birth = dobError;
    }
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const apiErrors = err.response?.data?.errors || {};
      const normalized = Object.entries(apiErrors).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value[0] : String(value);
        return acc;
      }, {});
      setErrors(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (name, label, type = "text", placeholder = "") => (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        className="input"
        id={name}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={values[name]}
      />
      {errors[name] && <p className="error-text">{errors[name]}</p>}
    </div>
  );

  const selectField = (name, label, options, placeholder) => (
    <div className="relative">
      <label className="label" htmlFor={`${name}-button`}>
        {label}
      </label>
      <button
        className="input flex items-center justify-between text-left"
        id={`${name}-button`}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement.contains(event.relatedTarget)) {
            setErrors((current) => ({ ...current, [name]: validateField(name, values[name]) }));
            setOpenSelect("");
          }
        }}
        onClick={() => setOpenSelect((current) => (current === name ? "" : name))}
        type="button"
      >
        <span className={values[name] ? "text-ink-text" : "text-[#6A6A6A]"}>
          {options.find((option) => option.value === values[name])?.label || placeholder}
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      {openSelect === name && (
        <div className="dropdown-panel absolute z-30 mt-1 max-h-44 w-full overflow-y-auto border border-ink-border bg-[#1E1E1E]">
          {options.map((option) => (
            <button
              className={`block w-full px-3 py-1.5 text-left text-sm transition hover:bg-[#2A2A2A] hover:text-ink-accent ${
                values[name] === option.value ? "bg-[#2A2A2A] text-ink-accent" : "text-ink-text"
              }`}
              key={option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(name, option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {errors[name] && <p className="error-text">{errors[name]}</p>}
    </div>
  );

  const dobMonthSelect = (options, placeholder) => (
    <select
      className={`input ${errors.date_of_birth && !dobParts.month ? "border-ink-danger focus:border-ink-danger" : ""}`}
      onBlur={() => setErrors((current) => ({ ...current, date_of_birth: getDobError(dobParts, values.date_of_birth) }))}
      onChange={(event) => handleDobPartChange("month", event.target.value)}
      value={dobParts.month}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );

  const dobInput = (name, placeholder, maxLength) => (
    <input
      className={`input ${errors.date_of_birth && !dobParts[name] ? "border-ink-danger focus:border-ink-danger" : ""}`}
      inputMode="numeric"
      maxLength={maxLength}
      onBlur={() => setErrors((current) => ({ ...current, date_of_birth: getDobError(dobParts, values.date_of_birth) }))}
      onChange={(event) => handleDobPartChange(name, event.target.value.replace(/\D/g, ""))}
      placeholder={placeholder}
      value={dobParts[name]}
    />
  );

  return (
    <form className="border border-ink-border bg-ink-surface p-4 sm:p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {field("first_name", "First Name", "text", "Akash")}
        {field("last_name", "Last Name", "text", "O'Connor")}
        {field("email", "Email", "email", "student@school.edu")}
        {field("phone", "Phone", "tel", "9876543210")}
        <div>
          <label className="label" htmlFor="dob-day">
            Date of Birth
          </label>
          <div className="grid grid-cols-[0.75fr_1.25fr_1fr] gap-2 max-[420px]:grid-cols-1">
            <div id="dob-day">{dobInput("day", "DD", 2)}</div>
            <div>{dobMonthSelect(months, "Month")}</div>
            <div>{dobInput("year", "YYYY", 4)}</div>
          </div>
          {errors.date_of_birth && <p className="error-text">{errors.date_of_birth}</p>}
        </div>
        {selectField(
          "grade",
          "Grade",
          gradeOptions.map((grade) => ({ label: grade, value: grade })),
          "Select grade",
        )}
        <div className="md:col-span-2">
          {selectField(
            "status",
            "Status",
            [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            "Select status",
          )}
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="address">
            Address
          </label>
          <textarea
            className="input min-h-32 resize-y"
            id="address"
            name="address"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="123 Main Street, Kochi"
            value={values.address}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
        <button className="btn-secondary w-full sm:w-auto" disabled={submitDisabled} onClick={() => navigate(-1)} type="button">
          <X size={18} aria-hidden="true" />
          Cancel
        </button>
        <button className="btn-primary w-full sm:w-auto" disabled={submitDisabled} type="submit">
          <Save size={18} aria-hidden="true" />
          {submitDisabled ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
