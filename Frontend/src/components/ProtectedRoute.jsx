import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("ssbms_token");
    return token ? <Outlet /> : <Navigate to="/login-signup" />;
};

export default ProtectedRoute;