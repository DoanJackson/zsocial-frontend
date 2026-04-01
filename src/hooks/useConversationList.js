import { useState, useCallback, useEffect, useRef } from 'react';
import chatService from '@/services/chatService';

export const useConversationList = (onFirstLoaded) => {
    const [conversations, setConversations] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const loadingRef = useRef(false);
    const listRef = useRef(null);
    const firstLoadedRef = useRef(false);

    const loadConversations = useCallback(async (cursor = null) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await chatService.getConversations(15, cursor);
            const { content, nextCursor: nc, hasNext } = res.data;
            if (content && content.length > 0) {
                setConversations(prev => cursor ? [...prev, ...content] : content);
                setNextCursor(nc || null);
                // Auto-select first conversation only on initial load
                if (!cursor && !firstLoadedRef.current && content.length > 0) {
                    firstLoadedRef.current = true;
                    if (onFirstLoaded) onFirstLoaded(content[0]);
                }
            }
            setHasMore(!!hasNext);
        } catch (e) {
            console.error(e);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [onFirstLoaded]);

    useEffect(() => {
        loadConversations(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = () => {
        const el = listRef.current;
        if (!el) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60 && hasMore && !loadingRef.current) {
            loadConversations(nextCursor);
        }
    };

    const upsertToTop = useCallback((msgSocketResp) => {
        const conversationId = msgSocketResp.conversationId;
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.id === conversationId);

            if (existingIndex !== -1) {
                const updated = { ...prev[existingIndex] };
                updated.lastMessageContent = msgSocketResp.content || '';
                updated.lastMessageAt = msgSocketResp.createdAt;
                updated.lastMessageSender = msgSocketResp.sender;
                updated.lastMessageMediaCount = msgSocketResp.medias?.length || 0;

                const newList = prev.filter(c => c.id !== conversationId);
                return [updated, ...newList];
            } else {
                const newConv = {
                    id: conversationId,
                    avatar: msgSocketResp.avatar || null,
                    groupName: msgSocketResp.groupName || null,
                    lastMessageContent: msgSocketResp.content || '',
                    lastMessageAt: msgSocketResp.createdAt,
                    lastMessageSender: msgSocketResp.sender,
                    lastMessageMediaCount: msgSocketResp.medias?.length || 0,
                    type: msgSocketResp.type,
                    isGroup: msgSocketResp.isGroup,
                };
                return [newConv, ...prev];
            }
        });
    }, []);

    return {
        conversations,
        loading,
        listRef,
        upsertToTop,
        handleScroll
    };
};
