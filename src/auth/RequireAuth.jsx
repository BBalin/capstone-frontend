import { Navigate, useLocation } from "react-router";

import { useAuth } from "./AuthContext";

/** Redirects to the login page if there is no logged-in user */
export default function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
