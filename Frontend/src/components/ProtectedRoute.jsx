import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("mvec_token");
    return token ? <Outlet /> : <Navigate to="/login-signup" />;
};

export default ProtectedRoute;