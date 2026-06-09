import { Eye, EyeOff, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validators";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateLogin(values);
    setErrors(validationErrors);
    setApiError("");
    if (Object.keys(validationErrors).length) return;

    setLoading(true);
    try {
      await login(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink-primary px-4 py-10 text-ink-text">
      <section className="w-full max-w-[400px] rounded border border-ink-border bg-ink-surface p-8 sm:p-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-ink-accent">SchoolOS</h1>
          <p className="mt-2 text-sm text-ink-muted">Student Management System</p>
        </div>

        {apiError && <div className="mb-4 rounded border border-ink-danger px-3 py-2 text-sm text-ink-danger">{apiError}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="username">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
              <input
                autoComplete="username"
                className="input pl-10"
                id="username"
                name="username"
                onChange={(event) => setValues((current) => ({ ...current, username: event.target.value }))}
                value={values.username}
              />
            </div>
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                autoComplete="current-password"
                className="input pr-11"
                id="password"
                name="password"
                onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                type={showPassword ? "text" : "password"}
                value={values.password}
              />
              <button
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-ink-secondary hover:bg-ink-elevated hover:text-ink-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                title={showPassword ? "Hide password" : "Show password"}
                type="button"
              >
                {showPassword ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
