import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Pagination from "../components/Pagination/Pagination";
import { Link } from "react-router-dom";
import { Search, Filter, TrendingUp } from "lucide-react";

export default function Home() {
  const fetcher = useFetch();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ projects: [], totalPages: 1 });
  const [error, setError] = useState("");

  //   console.log("data in Home", data?.projects?.length ?? 0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetcher(`/api/projects?page=${page}`);
        setData(res);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [page]);

  return (
    <div className="">
      {/* <h1 className="mb-4">Latest Projects</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {(data.projects || []).map((p) => (
          <div key={p._id} className="col-md-4">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      <Pagination
        current={page}
        total={data.totalPages}
        onChange={(n) => setPage(n)}
      />

      {(data.projects?.length ?? 0) === 0 && !error && (
        <p className="text-center text-muted my-4">
          No projects found. Be the first to{" "}
          <Link to="/projects/new">share your work</Link>!
        </p>
      )}

      <div className="text-center mt-5">
        <Link to="/projects/new" className="btn btn-success">
          Share Your Project
        </Link>
      </div> */}

      <div className="bg-light min-vh-100 py-5">
        <div className="container px-4">
          {/* ────────────────  Hero  ──────────────── */}
          <div className=" heroCard rounded-3 p-5 mb-5 text-white">
            <div className="mw-100" style={{ maxWidth: "32rem" }}>
              <h1 className="h3 fw-bold mb-2">
                Discover and showcase amazing creative work
              </h1>
              <p className="mb-4 opacity-75">
                Join our community of creators to share your portfolio and get
                inspired.
              </p>
              <Link
                to="/projects/new"
                className="btn btn-light text-primary fw-medium">
                Share Your Project
              </Link>
            </div>
          </div>

          <h2 className="h4 fw-bold mb-4">Latest Projects</h2>

          {/* ────────────────  Search / Filters  ──────────────── */}
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center justify-content-between">
              {/* ────────────────  Projects grid  ──────────────── */}
              {data.projects?.length ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                  {data.projects.map((p, idx) => (
                    <div className="col" key={idx}>
                      <ProjectCard project={p} />
                    </div>
                  ))}
                </div>
              ) : !error ? (
                <div className="card w-100 text-center">
                  <div className="card-body">
                    <div className="bg-primary-subtle d-inline-flex p-4 rounded-circle mb-3">
                      <TrendingUp size={32} className="text-primary" />
                    </div>
                    <h3 className="h5 fw-bold mb-2">No projects found</h3>
                    <p className="text-muted mb-4">
                      Be the first to share your work and get noticed by our
                      community.
                    </p>
                    <Link
                      to="/projects/new"
                      className="btn heroBtn text-white fw-medium">
                      Share Your Project
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* ────────────────  Pagination  ──────────────── */}
              {data.totalPages > 1 && (
                <Pagination
                  current={page}
                  total={data.totalPages}
                  onChange={(n) => setPage(n)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
