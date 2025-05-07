// src/App.jsx
import { useRoutes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { routesConfig } from "./routesConfig";
import "./App.css";

export default function App() {
  // React‑Router will pick the right element based on the URL
  const element = useRoutes(
    routesConfig.concat([
      {
        path: "*",
        element: <h2 className="text-center mt-5">404 • Not Found</h2>,
      },
    ])
  );

  return (
    <>
      <Navbar />
      <main className="">{element}</main>
    </>
  );
}
