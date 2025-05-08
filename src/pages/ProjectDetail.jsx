import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";
import {
  Github,
  ExternalLink,
  Calendar,
  Clock,
  Tag,
  User,
  Send,
  Trash2,
  AlertCircle,
} from "lucide-react";
export default function ProjectDetail() {
  const { id } = useParams();
  const fetcher = useFetch();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    (async () => {
      try {
        const data = await fetcher(`${baseURL}/api/projects/${id}`);
        console.log("data in detail ", data);
        setProject(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = await fetcher(
        `${baseURL}/api/projects/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentText }),
        }
      );
      setProject((prev) => ({
        ...prev,
        comments: [newComment, ...(prev.comments || [])],
      }));
      setCommentText("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <div className="container">{error}</div>;
  if (!project) return null;

  const canEdit = user && project.author._id === user._id;

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      {/* Optional Cover Image */}
      {project.coverUrl && (
        <div className="mb-4 overflow-hidden rounded shadow-sm">
          <img
            src={project.coverUrl}
            alt="Cover"
            className="img-fluid w-100"
            style={{ height: "16rem", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Article Header */}
      <h1 className="display-4 fw-bold mb-4">{project.title}</h1>
      <div className="d-flex align-items-center mb-5">
        <div
          className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
          style={{ width: "2.5rem", height: "2.5rem" }}>
          <span className="text-primary fw-bold">
            {project.author.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="mb-1">
            by <span className="fw-semibold">{project.author.name}</span>
          </p>
          <div className="d-flex align-items-center text-muted small">
            <Calendar size={14} className="me-1" />
            <span className="me-3">
              {new Date(project.createdAt).toLocaleDateString("default", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <Clock size={14} className="me-1" />
            <span>5 min read</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="mb-5">
        <p className="lead">
          {project.description || "No description provided"}
        </p>
      </div>

      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="badge bg-secondary me-1 mb-1">
              <Tag size={14} className="me-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Resources & Links */}
      {project.links?.length > 0 && (
        <div className="bg-light rounded p-4 mb-5">
          <h5 className="fw-semibold mb-3">Resources &amp; Links</h5>
          <ul className="list-unstyled mb-0">
            {project.links.map((link, i) => (
              // <li key={i} className="d-flex align-items-center mb-2">
              //   <ExternalLink size={16} className="text-primary me-2" />
              //   <a
              //     href={link}
              //     target="_blank"
              //     rel="noreferrer"
              //     className="text-primary text-decoration-none">
              //     {link}
              //   </a>
              // </li>
              <li
                key={i}
                className="
    d-flex 
    flex-column flex-sm-row 
    align-items-start align-items-sm-center 
    mb-2
  ">
                <ExternalLink
                  size={16}
                  className="text-primary mb-1 mb-sm-0 me-sm-2 flex-shrink-0"
                />
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="
      text-primary 
      text-decoration-none 
      text-break 
      flex-grow-1
    ">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Author Social Links */}
      {project.author.socials?.github && (
        <div className="mb-5">
          <a
            href={project.author.socials.github}
            target="_blank"
            rel="noreferrer"
            className="text-secondary fs-4 me-3">
            <Github size={20} />
          </a>
        </div>
      )}

      {/* Edit Button */}
      {canEdit && (
        <div className="mb-5">
          <Link
            to={`/projects/${project._id}/edit`}
            className="btn heroBtn-outline  px-4 py-2 rounded">
            Edit
            {/* <Edit3 size={16} /> */}
          </Link>
        </div>
      )}

      <hr />
      <h4>Comments</h4>

      {/* {user ? (
        <form onSubmit={addComment} className="vstack gap-2 mb-3">
          <textarea
            className="form-control"
            rows="3"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button className="btn btn-primary align-self-end">
            Add comment
          </button>
        </form>
      ) : (
        <p>
          <Link to="/login">Login</Link> to leave feedback.
        </p>
      )} */}

      {(project.comments || []).length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
          {project.comments.map((c) => (
            <li key={c._id} className="list-group-item">
              <strong>{c.author.name}: </strong>
              {c.content}
              {user && (user.role === "admin" || c.author._id === user._id) && (
                <button
                  className="btn btn-sm btn-link text-danger float-end"
                  onClick={async () => {
                    try {
                      await fetcher(
                        `${baseURL}/api/projects/${id}/comments/${c._id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      setProject((prev) => ({
                        ...prev,
                        comments: prev.comments.filter((x) => x._id !== c._id),
                      }));
                    } catch (err) {
                      alert(err.message);
                    }
                  }}>
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <div className="bg-white my-4 rounded shadow p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2">
              <User size={20} />
            </div>
            <p className="fw-bold mb-0">Your feedback</p>
          </div>

          <div>
            <div className="position-relative mb-4">
              <textarea
                className="form-control"
                rows={4}
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              {/* <div className="d-flex justify-content-between align-items-center mt-2 small text-secondary">
                <div className="d-flex align-items-center">
                  {charCount > 0 && charCount < 10 && (
                    <div className="d-flex align-items-center text-warning">
                      <AlertCircle size={14} className="me-1" />
                      <span>Comment is too short</span>
                    </div>
                  )}
                </div>
                <span>{charCount} characters</span>
              </div> */}
            </div>

            <div className="d-flex justify-content-end">
              <button
                onClick={addComment}
                disabled={commentText.length < 10}
                className="btn btn-primary d-flex align-items-center gap-2 px-5 py-2">
                <Send size={16} />
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-light my-4 border rounded p-4 text-center">
          <div className="mb-4">
            <User size={40} className="text-secondary d-block mx-auto" />
          </div>
          <h4 className="fs-5 fw-bold text-dark mb-2">Join the conversation</h4>
          <p className="text-muted mb-4">
            Sign in to share your thoughts and connect with other users.
          </p>
          <a href="/login" className="btn btn-primary px-4 py-2">
            Log in
          </a>
        </div>
      )}
    </div>
  );
}
