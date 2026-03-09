import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token found, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Otherwise, allow access to the protected route
    return children;
};

export default ProtectedRoute;
