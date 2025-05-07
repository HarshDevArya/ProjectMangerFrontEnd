// src/components/ProjectCard/ProjectCard.jsx
import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css"; // optional CSS‑module overrides

export default function ProjectCard({ project, children }) {
  return (
    <div className={`card h-100 shadow-sm ${styles.card || ""}`}>
      {/* Cover image */}
      {project.coverUrl && (
        <img
          src={project.coverUrl}
          alt="cover"
          className="card-img-top"
          style={{ objectFit: "cover", height: 180 }}
        />
      )}

      <div className="card-body d-flex flex-column">
        {/* Title */}
        <h5 className="card-title mb-1">{project.title}</h5>

        {/* Author */}
        {project.author && (
          <p className="card-subtitle text-muted mb-2">
            by {project.author.name}
          </p>
        )}

        {/* Description snippet */}
        <p className="card-text flex-grow-1">
          {project.description.length > 100
            ? project.description.slice(0, 100) + "…"
            : project.description}
        </p>

        {/* View button */}
        <Link
          to={`/projects/${project._id}`}
          className="btn btn-outline-primary btn-sm mt-auto">
          View details
        </Link>

        {/* Extra slot (e.g., Edit / Delete in Dashboard) */}
        {children}
      </div>
    </div>
  );
}
