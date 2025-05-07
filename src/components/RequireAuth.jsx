import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // spinner / skeleton

  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
