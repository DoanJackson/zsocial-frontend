import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Bảo vệ route — chỉ cho phép vào nếu user đã đăng nhập.
 * Nếu chưa đăng nhập sẽ redirect về /login.
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Đợi AuthContext khôi phục trạng thái từ localStorage trước khi quyết định redirect
    if (loading) {
        return null;
    }

    if (!user?.token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
