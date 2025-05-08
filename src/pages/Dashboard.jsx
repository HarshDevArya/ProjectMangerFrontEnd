import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Pagination from "../components/Pagination/Pagination";
import swal from "sweetalert";
import { PlusCircle, Edit3, Trash2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const fetcher = useFetch();

  const [page, setPage] = useState(1);
  const [data, setData] = useState({ projects: [], totalPages: 1 });
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const limit = 2; // page size for dashboard

  /* ---------- fetch on page or user change ---------- */
  useEffect(() => {
    if (loading || !user?._id) return;

    (async () => {
      try {
        const res = await fetcher(
          `${baseURL}/api/projects?author=${user._id}&page=${page}&limit=${limit}`
        );
        setData(res);
        setError("");
      } catch (err) {
        setError(err.message);
        setData({ projects: [], totalPages: 1 });
      } finally {
        setFetched(true);
      }
    })();
  }, [loading, user?._id, page]);

  /* ---------- delete ---------- */
  const handleDelete = (id) => {
    swal({
      title: "Delete this project?",
      text: "Once deleted, you won’t be able to recover it!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (!willDelete) return;

      try {
        await fetcher(`${baseURL}/api/projects/${id}`, { method: "DELETE" });
        // refetch current page (could end up empty; adjust page down if needed)
        const res = await fetcher(
          `${baseURL}/api/projects?author=${user._id}&page=${page}&limit=${limit}`
        );
        // if page is now empty and not first, step back a page
        if (res.projects.length === 0 && page > 1) setPage(page - 1);
        else setData(res);
        swal("Deleted!", "Your project has been removed.", "success");
      } catch (err) {
        swal("Error", err.message, "error");
      }
    });
  };

  /* ---------- UI ---------- */
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>Your Projects</h1>
        <Link
          to="/projects/new"
          className="btn btn-success d-flex align-items-center">
          <PlusCircle size={18} className="me-1" /> New Project
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* {fetched && data.projects.length === 0 && !error && (
        <p>
          No projects yet. <Link to="/projects/new">Create one</Link>.
        </p>
      )} */}

      {fetched && data.projects.length === 0 && !error && (
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

      {data.projects.length > 0 && (
        <>
          <div className="row g-4">
            {data.projects.map((p) => (
              <div key={p._id} className="col-md-4">
                <ProjectCard project={p}>
                  <div className="d-flex gap-2 align-items-center">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="btn btn-link text-danger p-0"
                      title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <Link
                      to={`/projects/${p._id}/edit`}
                      className="btn btn-link text-primary p-0"
                      title="Edit">
                      <Edit3 size={16} />
                    </Link>
                  </div>
                </ProjectCard>
              </div>
            ))}
          </div>

          {/* ---------- Pagination ---------- */}
          {data.totalPages > 1 && (
            <Pagination
              current={page}
              total={data.totalPages}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
