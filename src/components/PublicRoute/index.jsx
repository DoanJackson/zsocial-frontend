import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Route công khai — chỉ dành cho guest.
 * Nếu user đã đăng nhập sẽ redirect về /feed.
 */
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user?.token) {
        return <Navigate to="/feed" replace />;
    }

    return children;
};

export default PublicRoute;
