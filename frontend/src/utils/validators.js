const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z\s'.-]+$/;
const phonePattern = /^\d{10}$/;

export const isEmail = (value) => emailPattern.test(value);

const calculateAge = (date) => {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
};

const parseStrictIsoDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
};

export const validateLogin = (values) => {
  const errors = {};
  if (!values.username.trim()) {
    errors.username = "Email or username is required.";
  } else if (values.username.includes("@") && !isEmail(values.username.trim())) {
    errors.username = "Enter a valid email address.";
  }
  if (!values.password) {
    errors.password = "Password is required.";
  }
  return errors;
};

export const validateField = (name, value) => {
  const trimmed = String(value || "").trim();

  if (name === "first_name") {
    if (trimmed.length < 2 || !namePattern.test(trimmed)) {
      return "First name must be at least 2 characters and contain only letters.";
    }
  }

  if (name === "last_name") {
    if (!trimmed || !namePattern.test(trimmed)) {
      return "Last name must contain only letters.";
    }
  }

  if (name === "email") {
    if (!trimmed || !emailPattern.test(trimmed)) {
      return "Please enter a valid email address.";
    }
  }

  if (name === "phone") {
    if (!phonePattern.test(trimmed)) {
      return "Phone number must be exactly 10 digits.";
    }
  }

  if (name === "date_of_birth") {
    const selectedDate = parseStrictIsoDate(trimmed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!selectedDate) {
      return "Date of birth must be a valid date.";
    }
    if (selectedDate >= today) {
      return "Date of birth must be a past date.";
    }
    const age = calculateAge(selectedDate);
    if (age < 3 || age > 100) {
      return "Date of birth must be a past date.";
    }
  }

  if (name === "grade" && !trimmed) {
    return "Grade is required.";
  }

  if (name === "address") {
    if (trimmed.length < 10) {
      return "Address must be at least 10 characters.";
    }
  }

  if (name === "status" && !["active", "inactive"].includes(trimmed)) {
    return "Please select a valid status.";
  }

  return "";
};

export const validateStudentForm = (formData) => {
  const fields = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "date_of_birth",
    "grade",
    "address",
    "status",
  ];

  return fields.reduce((errors, field) => {
    const error = validateField(field, formData[field]);
    return error ? { ...errors, [field]: error } : errors;
  }, {});
};
