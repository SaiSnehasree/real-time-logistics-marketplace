import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);
        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return <Navigate to="/" replace />;
        }
    } catch {
        return <Navigate to="/login" replace />;
    }

    return children;
}