import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const urlRegex =
  /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[/\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i;
const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetcher = useFetch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    links: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- load existing ---------- */
  useEffect(() => {
    (async () => {
      try {
        const p = await fetcher(`${baseURL}/api/projects/${id}`);
        setForm({
          title: p.title,
          description: p.description,
          links: p.links?.join(", ") || "",
        });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  /* ---------- validation ---------- */
  const validate = () => {
    if (form.title.trim().length < 3)
      return "Title must be at least 3 characters.";

    if (form.description.trim().length < 10)
      return "Description must be at least 10 characters.";

    const linkArr = form.links
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    if (linkArr.length === 0) return "At least one project URL is required.";

    const invalid = linkArr.find((l) => !urlRegex.test(l));
    if (invalid) return `Invalid URL: ${invalid}`;

    return "";
  };

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setSaving(true);
      await fetcher(`${baseURL}/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate(`/projects/${id}`);
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
        <h2>Edit Project</h2>
        <Link to="/dashboard" className="btn heroBtn-outline px-4 py-2 rounded">
          Go back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          className="form-control"
          rows={5}
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="links"
          className="form-control"
          value={form.links}
          onChange={handleChange}
          placeholder="Links (comma separated)"
          required
        />

        <button className="btn btn-primary align-self-end" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
