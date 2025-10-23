import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/events" replace /> : <Outlet />;
};

export default PublicRoute;