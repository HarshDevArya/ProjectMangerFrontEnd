import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Pagination from "../components/Pagination/Pagination";
import { useAuth } from "../context/AuthContext";
import {
  Github,
  Linkedin,
  MapPin,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth(); // ← logged-in user
  const fetcher = useFetch();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const limit = 2;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const CenterSpinner = () => (
    <div className="d-flex justify-content-center py-5">
      <Loader2 size={32} className="spin" />
    </div>
  );
  /* ---------- load profile + projects ---------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const u = await fetcher(`${baseURL}/api/users/${id}`);
        const { projects, totalPages } = await fetcher(
          `${baseURL}/api/projects?author=${id}&page=${page}&limit=${limit}`
        );
        setProfile(u);
        setProjects(projects);
        setTotalPages(totalPages);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, page]);

  useEffect(() => {
    setPage(1); // jump to first page if id param changes
  }, [id]);

  if (error) return <div className="container mt-5">{error}</div>;
  if (loading) return <CenterSpinner />;
  if (!profile) return null;

  /* show edit button only for owner  */
  const canEdit = currentUser && currentUser._id === profile._id;

  return (
    /* Profile.jsx (excerpt) */
    <div className="container py-4" style={{ maxWidth: "80rem" }}>
      {/* ------------------------------------------------------------------ */}
      {/* Profile header                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded shadow overflow-hidden mb-4">
        {/* Banner strip */}
        <div
          style={{
            height: "8rem",
            background: "linear-gradient(to right,#3b82f6,#6366f1)",
          }}
        />
        {/* Header body */}
        <div className="px-4 pb-4 position-relative">
          <div className="d-flex flex-column flex-md-row align-items-md-end">
            {/* Avatar */}
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border border-white shadow"
              style={{
                width: "6rem",
                height: "6rem",
                fontWeight: 700,
                fontSize: "2rem",
                marginTop: "-3rem",
              }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>

            {/* Name · Edit button · Bio */}
            <div className="flex-grow-1 ms-md-4 mt-3 mt-md-0">
              <div className="d-flex mt-3 flex-column flex-md-row align-items-md-center justify-content-between">
                <h1 className="h4 fw-bold mb-0">{profile.name}</h1>

                {canEdit && (
                  <Link
                    to="/profile"
                    className="btn heroBtn-outline px-4 py-2 rounded">
                    Edit
                  </Link>
                )}
              </div>

              {profile.bio && (
                <p
                  className="text-muted mt-2 mb-0"
                  style={{ maxWidth: "40rem" }}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social + meta */}
          <div className="d-flex flex-wrap gap-3 mt-4">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center text-muted text-decoration-none">
                <Github size={16} className="me-1" /> GitHub
              </a>
            )}

            {profile.socials?.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="d-flex align-items-center text-muted text-decoration-none">
                <Linkedin size={16} className="me-1" /> LinkedIn
              </a>
            )}

            {profile.location && (
              <span className="d-flex align-items-center text-muted">
                <MapPin size={16} className="me-1" /> {profile.location}
              </span>
            )}

            {profile.email && (
              <span className="d-flex align-items-center text-muted">
                <Mail size={16} className="me-1" /> {profile.email}
              </span>
            )}

            {profile.joinDate && (
              <span className="d-flex align-items-center text-muted">
                <Calendar size={16} className="me-1" /> Joined&nbsp;
                {new Date(profile.joinDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs                                                               */}
      {/* ------------------------------------------------------------------ */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "projects" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => setActiveTab("projects")}>
            Projects&nbsp;({projects.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "about" ? "active" : ""}`}
            type="button"
            role="tab"
            onClick={() => setActiveTab("about")}>
            About
          </button>
        </li>
      </ul>

      {/* ------------------------------------------------------------------ */}
      {/* Tab panes                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white rounded shadow p-4">
        {/* ---------- Projects ---------- */}
        {activeTab === "projects" && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">
                  This user hasn’t posted any projects yet.
                </p>
              </div>
            ) : (
              <>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {projects.map((p) => (
                    <div key={p._id} className="col">
                      <div className="h-100 card-lift">
                        <ProjectCard project={p} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */ console.log("totalPages", totalPages)}
                {totalPages > 0 && (
                  <div className="mt-4 d-flex justify-content-center">
                    <Pagination
                      current={page}
                      total={totalPages}
                      onChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ---------- About ---------- */}
        {activeTab === "about" && (
          <div className="vstack gap-4">
            {/* Bio */}
            <div>
              <h5 className="fw-semibold mb-2">Bio</h5>
              <p className="text-muted mb-0">
                {profile.bio || "No bio available."}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h5 className="fw-semibold mb-2">Contact</h5>
              <div className="vstack gap-2">
                {profile.email && (
                  <span className="d-flex align-items-center">
                    <Mail size={16} className="me-2 text-muted" />
                    {profile.email}
                  </span>
                )}
                {profile.socials?.github && (
                  <span className="d-flex align-items-center">
                    <Github size={16} className="me-2 text-muted" />
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-decoration-none">
                      GitHub&nbsp;Profile
                    </a>
                  </span>
                )}
                {profile.socials?.linkedin && (
                  <span className="d-flex align-items-center">
                    <Linkedin size={16} className="me-2 text-muted" />
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-decoration-none">
                      LinkedIn&nbsp;Profile
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
