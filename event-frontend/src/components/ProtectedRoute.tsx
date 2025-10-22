import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps routes that require authentication.
 * If no user is logged in, redirects to /login.
 */
const ProtectedRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the nested routes
  return <Outlet />;
};

export default ProtectedRoute;