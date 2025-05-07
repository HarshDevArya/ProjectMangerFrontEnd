import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export default function NewProject() {
  const navigate = useNavigate();
  const fetcher = useFetch();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    links: "",
    cover: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => setForm({ ...form, cover: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => v && body.append(k, v));
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const project = await fetcher(`${baseURL}/api/projects`, {
        method: "POST",
        body,
      });
      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center justify-content-between my-4">
        <h2 className="">Add New Project</h2>
        <Link
          to="/dashboard"
          className="btn heroBtn-outline  px-4 py-2 rounded">
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
          required
        />
        <textarea
          name="description"
          className="form-control"
          placeholder="Description"
          rows={5}
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="links"
          className="form-control"
          placeholder="Links (comma separated)"
          value={form.links}
          onChange={handleChange}
        />
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFile}
        />
        <div>
          <button className="btn btn-primary align-self-end me-4">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
