import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useFetch } from "../hooks/useFetch";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const fetcher = useFetch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  /* ---------- get current user on mount ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { user } = await fetcher(`${baseURL}/api/auth/me`);
        setUser(user);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- actions ---------- */
  const login = useCallback(
    async (credentials) => {
      const res = await fetcher(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      setUser(res.user);
    },
    [fetcher]
  );

  const signup = useCallback(
    async (payload) => {
      const res = await fetcher(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setUser(res.user);
    },
    [fetcher]
  );

  const logout = useCallback(async () => {
    await fetcher(`${baseURL}/api/auth/logout`, { method: "POST" });
    setUser(null);
  }, [fetcher]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
