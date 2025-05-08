import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const urlRegex =
  /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[/\w\-._~:/?#[\]@!$&'()*+,;=.]*$/i;
const MAX_SIZE_MB = 2;
const isImageMime = (type) => /^image\/(png|jpe?g|webp|gif)$/i.test(type);
const baseURL = import.meta.env.VITE_API_BASE_URL;

export default function NewProject() {
  const navigate = useNavigate();
  const fetcher = useFetch();

  const [form, setForm] = useState({
    title: "",
    description: "",
    links: "",
    cover: null,
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------- handlers ---------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) =>
    setForm({ ...form, cover: e.target.files[0] ?? null });

  /* ---------- client-side validation ---------- */
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

    if (form.cover) {
      if (!isImageMime(form.cover.type))
        return "Cover must be a PNG, JPEG, WEBP or GIF image.";
      if (form.cover.size > MAX_SIZE_MB * 1024 * 1024)
        return `Cover image must be ≤ ${MAX_SIZE_MB} MB.`;
    }

    return "";
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) return setError(msg);

    try {
      setSubmitting(true);
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => v && body.append(k, v));

      const project = await fetcher(`${baseURL}/api/projects`, {
        method: "POST",
        body,
      });

      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center justify-content-between my-4">
        <h2>Add New Project</h2>
        <Link to="/dashboard" className="btn heroBtn-outline px-4 py-2 rounded">
          Go back
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <input
          name="title"
          className="form-control"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          className="form-control"
          placeholder="Description"
          rows={5}
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="links"
          className="form-control"
          placeholder="Links (comma separated)"
          value={form.links}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFile}
        />

        <button
          className="btn btn-primary align-self-end"
          disabled={submitting}>
          {submitting ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
