export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n} className={`page-item ${n === current ? "active" : ""}`}>
            <button className="page-link" onClick={() => onChange(n)}>
              {n}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
