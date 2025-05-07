import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Pagination from "../components/Pagination/Pagination";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const pageParam = Number(params.get("page") || 1);

  const fetcher = useFetch();
  const [data, setData] = useState({ users: [], projects: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher(
          `/api/search?q=${encodeURIComponent(query)}&page=${pageParam}`
        );
        setData(res);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [query, pageParam]);

  const handlePage = (n) => {
    params.set("page", n);
    setParams(params);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Search results for “{query}”</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Users */}
      <h4>Users</h4>
      {data.users.length === 0 ? (
        <p>No matching users.</p>
      ) : (
        <ul>
          {data.users.map((u) => (
            <li key={u._id}>
              {u.name}{" "}
              {u.socials?.github && (
                <a
                  href={u.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-2">
                  GitHub
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Projects */}
      <h4 className="mt-4">Projects</h4>
      {data.projects.length === 0 ? (
        <p>No matching projects.</p>
      ) : (
        <div className="row g-4">
          {data.projects.map((p) => (
            <div key={p._id} className="col-md-4">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}

      {/* Simple pagination: backend returns totalPages in projects list;
          here we just assume 6‑per‑page => check length to guess more */}
      {data.projects.length > 0 && (
        <Pagination
          current={pageParam}
          total={pageParam + 1} // naive; backend could return totalPages
          onChange={handlePage}
        />
      )}
    </div>
  );
}
