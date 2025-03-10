import { Navigate, Outlet } from "react-router-dom";

const RedirectToMainPageIfAuthenticatedRoute = () => {
    const isAuthenticated = !!localStorage.getItem("access_token"); // Example: Check token
  
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
  };

export default RedirectToMainPageIfAuthenticatedRoute;