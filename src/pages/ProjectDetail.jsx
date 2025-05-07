import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const fetcher = useFetch();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetcher(`/api/projects/${id}`);
        setProject(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const newComment = await fetcher(`/api/projects/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText }),
      });
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
      <h1 className="mb-2">{project.title}</h1>
      <p className="text-muted">
        by {project.author.name}
        {project.author.socials?.github && (
          <>
            {" "}
            ·{" "}
            <a
              href={project.author.socials.github}
              target="_blank"
              rel="noreferrer">
              GitHub
            </a>
          </>
        )}
      </p>

      {project.coverUrl && (
        <img
          src={project.coverUrl}
          alt="cover"
          className="img-fluid rounded mb-3"
        />
      )}

      <p>{project.description}</p>

      {project.links?.length > 0 && (
        <>
          <h5>Links</h5>
          <ul>
            {project.links.map((l) => (
              <li key={l}>
                <a href={l} target="_blank" rel="noreferrer">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {canEdit && (
        <Link
          to={`/projects/${project._id}/edit`}
          className="btn btn-outline-primary btn-sm mb-4">
          Edit project
        </Link>
      )}

      <hr />
      <h4>Comments</h4>

      {user ? (
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
      )}

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
                      await fetcher(`/api/projects/${id}/comments/${c._id}`, {
                        method: "DELETE",
                      });
                      setProject((prev) => ({
                        ...prev,
                        comments: prev.comments.filter((x) => x._id !== c._id),
                      }));
                    } catch (err) {
                      alert(err.message);
                    }
                  }}>
                  delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
