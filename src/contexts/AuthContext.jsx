import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useStompClient } from '@/hooks/useStompClient';
import { TOPIC_USER_PREFIX, SOCKET_EVENT } from '@/constants/socketConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { connect, disconnect, subscribe } = useStompClient();

    // Set of listener functions that want to be notified of NEW_MESSAGE_ALERT
    // Using a ref so it's stable across renders and avoids stale closures
    const alertListenersRef = useRef(new Set());

    // Subscribe to the global user channel when 'user' state changes
    useEffect(() => {
        if (!user?.userId) return;

        const destination = `${TOPIC_USER_PREFIX}${user.userId}`;

        const unsubscribe = subscribe(destination, (stompMsg) => {
            try {
                const socketResp = JSON.parse(stompMsg.body);
                if (socketResp.type !== SOCKET_EVENT.NEW_MESSAGE_ALERT) return;
                const msgAlert = socketResp.payload;
                // Broadcast to every registered listener
                alertListenersRef.current.forEach(fn => fn(msgAlert));
            } catch (err) {
                console.error('[AuthContext] Failed to handle NEW_MESSAGE_ALERT', err);
            }
        });

        // Cleanup function reliably removes the subscription when user logs out or unmounts
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user?.userId, subscribe]);

    // Khôi phục trạng thái đăng nhập từ localStorage khi app khởi động
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const avatar = localStorage.getItem('avatar');
        const fullName = localStorage.getItem('fullName');

        if (token) {
            setUser({ token, userId, role, avatar, fullName });
            connect(token);
        }
        setLoading(false);

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    /**
     * Gọi sau khi đăng nhập thành công.
     * @param {object} data - { token, userId, role, avatar, fullName }
     */
    const login = (data) => {
        const { token, userId, role, avatar, fullName } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('role', role || '');
        localStorage.setItem('avatar', avatar || '');
        localStorage.setItem('fullName', fullName || '');
        setUser({ token, userId, role, avatar, fullName });
        connect(token);
    };

    /**
     * Đăng xuất — xóa toàn bộ thông tin user.
     */
    const logout = () => {
        disconnect();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('avatar');
        localStorage.removeItem('fullName');
        setUser(null);
    };

    /**
     * Đăng ký một hàm lắng nghe sự kiện NEW_MESSAGE_ALERT.
     * @param {function} fn - (msgAlert: MessageSocketResponse) => void
     */
    const addMessageAlertListener = useCallback((fn) => {
        alertListenersRef.current.add(fn);
    }, []);

    /**
     * Hủy đăng ký lắng nghe sự kiện NEW_MESSAGE_ALERT.
     * @param {function} fn - cùng reference đã đăng ký
     */
    const removeMessageAlertListener = useCallback((fn) => {
        alertListenersRef.current.delete(fn);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, addMessageAlertListener, removeMessageAlertListener }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook tiện lợi để truy cập AuthContext.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
