import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ---------- simple helpers ---------- */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- input change ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* client‑side validation */
    if (form.name.trim().length < 2) {
      return setError("Name must be at least 2 characters.");
    }
    if (!validateEmail(form.email)) {
      return setError("Please enter a valid email address.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setSubmitting(true);
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message); // server‑side message (e.g., "Email already in use")
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2 className="mb-4">Create account</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <input
          name="name"
          placeholder="Name"
          className="form-control"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn heroBtn text-light w-100" disabled={submitting}>
          {submitting ? "Creating…" : "Sign up"}
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
