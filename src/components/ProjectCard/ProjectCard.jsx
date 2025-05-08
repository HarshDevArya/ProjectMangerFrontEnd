// src/components/ProjectCard/ProjectCard.jsx
import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css"; // optional CSS‑module overrides

import {
  PlusCircle,
  FolderPlus,
  Edit3,
  Trash2,
  AlertCircle,
  Calendar,
  ChevronRight,
} from "lucide-react";

export default function ProjectCard({ project, children }) {
  return (
    <div className="card h-100 rounded overflow-hidden shadow-sm hover-shadow transition-shadow">
      {project.coverUrl ? (
        <img
          src={project.coverUrl}
          alt={project.title}
          className="card-img-top"
          style={{ height: "12rem", objectFit: "cover" }}
        />
      ) : (
        <div
          className="card-img-top d-flex align-items-center justify-content-center"
          style={{
            height: "12rem",
            background: "linear-gradient(to right, #4f46e5, #9333ea)",
          }}>
          <h3 className="text-white fw-bold mb-0">{project.title.charAt(0)}</h3>
        </div>
      )}

      <div className="card-body p-4">
        <h5 className="card-title text-truncate mb-2">{project.title}</h5>
        <p className="card-text text-muted small mb-3">
          {project.description.length > 100
            ? project.description.slice(0, 100) + "…"
            : project.description}
        </p>

        {/* <div className="d-flex align-items-center text-muted small mb-3">
            <Calendar size={14} className="me-1" />
            <span>{formattedDate}</span>
          </div> */}

        {/* {tags.length > 0 && (
            <div className="mb-3">
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="badge bg-light text-secondary me-1">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="small text-secondary">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )} */}

        <div className="d-flex justify-content-between align-items-center border-top pt-3">
          <div>{children}</div>

          <Link
            to={`/projects/${project._id}`}
            className="small text-primary text-decoration-none d-flex align-items-center">
            View details
            <ChevronRight size={16} className="ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
