import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard/ProjectCard";

export default function Dashboard() {
  const { user, loading } = useAuth(); // loading = true until /auth/me resolves
  const fetcher = useFetch();

  const [projects, setProjects] = useState([]); // always an array
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false); // indicates request finished

  /* fetch only when user._id is available */
  useEffect(() => {
    if (loading || !user?._id) return; // wait for auth

    (async () => {
      try {
        const { projects = [] } = await fetcher(
          `/api/projects?author=${user._id}`
        );
        setProjects(projects);
        setError("");
      } catch (err) {
        setError(err.message);
        setProjects([]); // keep it an array
      } finally {
        setFetched(true);
      }
    })();
  }, [loading, user?._id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await fetcher(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>Your Projects</h1>
        <Link to="/projects/new" className="btn btn-success">
          + New Project
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* empty‑state shown only after first fetch */}
      {fetched && projects.length === 0 && !error && (
        <div className="text-center py-5 my-4">
          <div className="mb-4">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 mx-auto">
              <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
              <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-6l-3.4-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.8 1.1z" />
            </svg>
          </div>
          <h3 className="font-semibold text-xl">No projects yet</h3>
          <p className="text-gray-500 mb-4 mx-auto max-w-lg">
            Your portfolio is waiting for your creative work. Start by creating
            your first project to showcase your skills and achievements.
          </p>
          <Link
            to="/projects/new"
            className="btn heroBtn text-white px-4 py-2 rounded">
            Create Your First Project
          </Link>
          <div className="mt-4 pt-3">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 no-underline">
              Or explore projects from other creators for inspiration
            </a>
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="row g-4">
          {projects.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProjectCard project={p}>
                <div className="d-flex gap-2 mt-2">
                  <Link
                    to={`/projects/${p._id}/edit`}
                    className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </div>
              </ProjectCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
