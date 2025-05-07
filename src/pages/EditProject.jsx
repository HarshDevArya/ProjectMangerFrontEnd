import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

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

  /* load existing */
  useEffect(() => {
    (async () => {
      try {
        const p = await fetcher(`/api/projects/${id}`);
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetcher(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h2 className="mb-4">Edit Project</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="vstack gap-3">
        <input
          name="title"
          className="form-control"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="form-control"
          rows={5}
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="links"
          className="form-control"
          value={form.links}
          onChange={handleChange}
          placeholder="Links (comma separated)"
        />
        <button className="btn btn-primary align-self-end">Save</button>
      </form>
    </div>
  );
}
