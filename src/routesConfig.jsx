import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewProject from "./pages/NewProject";
import EditProject from "./pages/EditProject";
import ProjectDetail from "./pages/ProjectDetail";
import Search from "./pages/Search";

import RequireAuth from "./components/RequireAuth";

// export for <Routes>
export const routesConfig = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/search", element: <Search /> },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/projects/new",
    element: (
      <RequireAuth>
        <NewProject />
      </RequireAuth>
    ),
  },
  {
    path: "/projects/:id/edit",
    element: (
      <RequireAuth>
        <EditProject />
      </RequireAuth>
    ),
  },
  { path: "/projects/:id", element: <ProjectDetail /> },
];
