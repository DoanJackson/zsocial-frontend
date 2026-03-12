export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
export const TOPIC_USER_PREFIX = '/topic/user.';
export const TOPIC_CHAT_PREFIX = '/topic/conversation.';
 
export const SOCKET_EVENT = {
    NEW_MESSAGE: 'NEW_MESSAGE',
    NEW_MESSAGE_ALERT: 'NEW_MESSAGE_ALERT',
    USER_TYPING: 'USER_TYPING',
};