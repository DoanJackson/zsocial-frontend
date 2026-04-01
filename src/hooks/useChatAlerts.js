import { useEffect, useRef } from 'react';
import { useStompClient } from '@/hooks/useStompClient';
import { useAuth } from '@/contexts/AuthContext';
import { TOPIC_CHAT_PREFIX } from '@/constants/socketConfig';

/**
 * useChatAlerts Hook
 * Custom hook to handle global messaging socket constraints and update the chat list.
 */
export const useChatAlerts = (selectedConversation, conversationListRef) => {
    const { addMessageAlertListener, removeMessageAlertListener } = useAuth();
    const { subscribe } = useStompClient();

    // Alert listener to bump conversations to top
    useEffect(() => {
        const handleAlert = (msgAlert) => {
            conversationListRef.current?.upsertToTop(msgAlert);
        };

        addMessageAlertListener(handleAlert);
        return () => {
            removeMessageAlertListener(handleAlert);
        };
    }, [addMessageAlertListener, removeMessageAlertListener, conversationListRef]);

    // Debugging / Event channel subscription for currently selected chat
    useEffect(() => {
        if (!selectedConversation?.id) return;

        const destination = `${TOPIC_CHAT_PREFIX}${selectedConversation.id}`;

        const unsubscribe = subscribe(destination, (stompMsg) => {
            try {
                const socketResp = JSON.parse(stompMsg.body);
                console.log('[STOMP] Conversation event:', socketResp.type, socketResp);
            } catch (err) {
                console.error('[STOMP] Failed to parse conversation message', err);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [selectedConversation?.id, subscribe]);
};
