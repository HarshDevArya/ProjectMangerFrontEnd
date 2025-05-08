import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";

export default function EditProfile() {
  const { user, setUser } = useAuth(); // current user from context
  const fetcher = useFetch();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState({
    name: "",
    bio: "",
    socials: { github: "", linkedin: "" },
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- populate initial ---------- */
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        bio: user.bio || "",
        socials: {
          github: user.socials?.github || "",
          linkedin: user.socials?.linkedin || "",
        },
      });
    }
  }, [user]);

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSocial = (e) =>
    setForm({
      ...form,
      socials: { ...form.socials, [e.target.name]: e.target.value },
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2)
      return setError("Name must be at least 2 characters.");

    try {
      setSaving(true);
      const updated = await fetcher(`${baseURL}/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setUser(updated); // update global auth context
      navigate(`/users/${user._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center justify-content-between my-4">
        <h2>Edit Profile</h2>
        <Link
          to={`/users/${user._id}`}
          className="btn heroBtn-outline px-4 py-2 rounded">
          Go back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <label className="form-label mb-0">Name</label>
        <input
          name="name"
          className="form-control"
          value={form.name}
          onChange={handleChange}
        />

        <label className="form-label mb-0">Bio</label>
        <textarea
          name="bio"
          className="form-control"
          rows={4}
          value={form.bio}
          onChange={handleChange}
          maxLength={300}
        />

        <label className="form-label mb-0">GitHub URL</label>
        <input
          name="github"
          className="form-control"
          value={form.socials.github}
          onChange={handleSocial}
        />

        <label className="form-label mb-0">LinkedIn URL</label>
        <input
          name="linkedin"
          className="form-control"
          value={form.socials.linkedin}
          onChange={handleSocial}
        />

        <button className="btn btn-primary align-self-end" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
