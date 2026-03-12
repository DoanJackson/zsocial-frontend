import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { SOCKET_URL, TOPIC_USER_PREFIX } from '../constants/socketConfig';

let stompClient = null;

/**
 * Kết nối tới WebSocket server qua STOMP + SockJS và subscribe vào kênh của user.
 * @param {string|number} userId
 * @param {string} token - JWT token để xác thực qua header
 */
const connect = (userId, token) => {
    if (stompClient && stompClient.active) {
        console.log('[STOMP] Already connected.');
        return;
    }

    stompClient = new Client({
        // Dùng SockJS factory thay vì brokerURL vì backend cấu hình .withSockJS()
        webSocketFactory: () => new SockJS(SOCKET_URL),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000, // tự động reconnect sau 5s nếu mất kết nối
        onConnect: () => {
            const destination = `${TOPIC_USER_PREFIX}${userId}`;
            stompClient.subscribe(destination, (message) => {
                console.log('[STOMP] Message received on', destination, ':', message.body);
            });
            console.log(`[STOMP] Connected. Subscribed to ${destination}`);
        },
        onStompError: (frame) => {
            console.error('[STOMP] Error:', frame.headers['message'], frame.body);
        },
        onDisconnect: () => {
            console.log('[STOMP] Disconnected.');
        },
        onWebSocketError: (error) => {
            console.error('[STOMP] WebSocket error:', error);
        },
    });

    stompClient.activate();
};

/**
 * Ngắt kết nối STOMP client.
 */
const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        console.log('[STOMP] Disconnected.');
    }
};

/**
 * Trả về STOMP client hiện tại (để send message từ các module khác).
 * @returns {Client|null}
 */
const getClient = () => stompClient;

/**
 * Subscribe vào một STOMP destination.
 * @param {string} destination - ví dụ: '/topic/conversation.5'
 * @param {function} callback  - nhận (message) khi có tin mới
 * @returns {object|null} subscription object (dùng để unsubscribe)
 */
const subscribe = (destination, callback) => {
    if (!stompClient || !stompClient.active) {
        console.warn('[STOMP] Cannot subscribe: not connected.', destination);
        return null;
    }
    try {
        const sub = stompClient.subscribe(destination, callback);
        console.log('[STOMP] Subscribed to', destination);
        return sub;
    } catch (err) {
        console.warn('[STOMP] Subscribe failed (connection not ready):', err.message);
        return null;
    }
};

/**
 * Hủy subscribe một subscription đã có.
 * @param {object} subscription - object trả về từ subscribe()
 */
const unsubscribe = (subscription) => {
    if (subscription) {
        try {
            subscription.unsubscribe();
            console.log('[STOMP] Unsubscribed.');
        } catch (err) {
            console.warn('[STOMP] Unsubscribe failed (stale subscription):', err.message);
        }
    }
};

const socketService = { connect, disconnect, getClient, subscribe, unsubscribe };

export default socketService;
