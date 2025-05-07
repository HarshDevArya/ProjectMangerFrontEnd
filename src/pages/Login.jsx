import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  //   console.log("error", error);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 420 }}>
      <h2 className="mb-4">Sign in</h2>

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn heroBtn text-white w-100">Login</button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error.message}
        </div>
      )}

      <p className="text-center mt-3">
        No account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}
