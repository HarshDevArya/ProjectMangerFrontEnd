import { useEffect, useState } from "react";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Pagination from "../components/Pagination/Pagination";
import { Github, User, Code } from "lucide-react";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const page = Number(params.get("page") || 1);

  const fetcher = useFetch();
  const [data, setData] = useState({ users: [], projects: [], totalPages: 1 });
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  /* ---------- fetch results ---------- */
  useEffect(() => {
    if (!query.trim()) return; // nothing to search

    (async () => {
      try {
        const res = await fetcher(
          `${baseURL}/api/search?q=${encodeURIComponent(query)}&page=${page}`
        );
        setData(res);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [query, page]);

  const handlePage = (n) => {
    params.set("page", n);
    setParams(params, { replace: true });
  };

  /* ---------- UI ---------- */
  return (
    <div className="container">
      {query && (
        <div className="d-flex mt-4 align-items-center mb-4">
          <h2 className="mb-0 me-2">Results for</h2>
          <div className="badge bg-primary bg-opacity-10 text-primary fs-5 py-2 px-3">
            {query}
          </div>
          <div className="ms-auto">
            <span className="badge bg-success">
              {data.users.length + data.projects.length} results
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert">
          <div className="me-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
              viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </div>
          <div>{error}</div>
        </div>
      )}

      {query && !error && (
        <div className="row g-4">
          {/* Left Column: Users */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom d-flex align-items-center">
                <User size={18} className="text-primary me-2" />
                <h5 className="card-title mb-0">Users</h5>
                <span className="ms-auto badge bg-secondary">
                  {data.users.length}
                </span>
              </div>

              <div className="card-body p-0">
                {data.users.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <div className="mb-3">
                      <User size={40} className="text-muted opacity-50" />
                    </div>
                    <p>No matching users found</p>
                  </div>
                ) : (
                  <ul className="list-group list-group-flush">
                    {data.users.map((user) => (
                      <li key={user._id} className="list-group-item px-3 py-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-flex
                                     justify-content-center align-items-center flex-shrink-0"
                            style={{ width: 48, height: 48 }}>
                            <span className="text-primary fw-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-1">{user.name}</h6>
                            <div className="d-flex align-items-center">
                              <Link
                                to={`/users/${user._id}`}
                                className="btn btn-sm btn-outline-primary me-2">
                                View Profile
                              </Link>
                              {user.socials?.github && (
                                <a
                                  href={user.socials.github}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-sm btn-outline-secondary"
                                  title="GitHub Profile">
                                  <Github size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Projects */}
          <div className="col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-white border-bottom d-flex align-items-center">
                <Code size={18} className="text-primary me-2" />
                <h5 className="card-title mb-0">Projects</h5>
                <span className="ms-auto badge bg-secondary">
                  {data.projects.length}
                </span>
              </div>

              <div className="card-body">
                {data.projects.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <div className="mb-3">
                      <Code size={40} className="text-muted opacity-50" />
                    </div>
                    <p>No matching projects found</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {data.projects.map((project) => (
                      <div key={project._id} className="col-md-6">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data.totalPages > 1 && (
        <Pagination
          current={page}
          total={data.totalPages}
          onChange={handlePage}
        />
      )}
    </div>
  );
}
