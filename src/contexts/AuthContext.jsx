import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import socketService from '../services/socketService';
import { TOPIC_USER_PREFIX, SOCKET_EVENT } from '../constants/socketConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Set of listener functions that want to be notified of NEW_MESSAGE_ALERT
    // Using a ref so it's stable across renders and avoids stale closures
    const alertListenersRef = useRef(new Set());
    const userChannelSubRef = useRef(null);

    /**
     * Subscribe to /topic/user.{userId} and broadcast NEW_MESSAGE_ALERT to all registered listeners.
     */
    const subscribeUserChannel = useCallback((userId) => {
        const destination = `${TOPIC_USER_PREFIX}${userId}`;

        const doSubscribe = () => {
            const sub = socketService.subscribe(destination, (stompMsg) => {
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
            if (sub) {
                userChannelSubRef.current = sub;
            }
            return sub;
        };

        const sub = doSubscribe();
        // Retry once after 1.5s if STOMP wasn't ready yet
        if (!sub) {
            const timer = setTimeout(() => {
                if (!userChannelSubRef.current) doSubscribe();
            }, 1500);
            // Store timer id so we can clear it on logout (best-effort)
            userChannelSubRef._retryTimer = timer;
        }
    }, []);

    /**
     * Unsubscribe user channel (called on logout).
     */
    const unsubscribeUserChannel = useCallback(() => {
        if (userChannelSubRef._retryTimer) {
            clearTimeout(userChannelSubRef._retryTimer);
            userChannelSubRef._retryTimer = null;
        }
        if (userChannelSubRef.current) {
            socketService.unsubscribe(userChannelSubRef.current);
            userChannelSubRef.current = null;
        }
    }, []);

    // Khôi phục trạng thái đăng nhập từ localStorage khi app khởi động
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const role = localStorage.getItem('role');
        const avatar = localStorage.getItem('avatar');
        const fullName = localStorage.getItem('fullName');

        if (token) {
            setUser({ token, userId, role, avatar, fullName });
            // Tái lập kết nối WebSocket nếu đã đăng nhập trước đó
            socketService.connect(userId, token);
            // Subscribe kênh user ngay sau khi reconnect (retry built in)
            // Dùng timeout nhỏ vì STOMP cần chút thời gian để kết nối lại
            setTimeout(() => subscribeUserChannel(userId), 500);
        }
        setLoading(false);

        return () => {
            socketService.disconnect();
        };
    }, [subscribeUserChannel]);

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
        // Kết nối WebSocket sau khi đăng nhập thành công
        socketService.connect(userId, token);
        // Subscribe kênh user — STOMP vừa kết nối nên cần delay nhỏ
        setTimeout(() => subscribeUserChannel(userId), 500);
    };

    /**
     * Đăng xuất — xóa toàn bộ thông tin user.
     */
    const logout = () => {
        unsubscribeUserChannel();
        socketService.disconnect();
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
