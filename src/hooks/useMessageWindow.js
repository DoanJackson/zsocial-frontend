import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import chatService from '@/services/chatService';
import { useStompClient } from '@/hooks/useStompClient';
import { TOPIC_CHAT_PREFIX, SOCKET_EVENT } from '@/constants/socketConfig';

export const useMessageWindow = (conversationId, onMessageSent) => {
    const [messages, setMessages] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [viewerImage, setViewerImage] = useState(null);

    const loadingRef = useRef(false);
    const threadRef = useRef(null);
    const isFirstLoad = useRef(true);
    const { subscribe } = useStompClient();

    const hasMoreRef = useRef(true);
    const nextCursorRef = useRef(null);

    const loadMessages = useCallback(async (lastMessageId = null) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await chatService.getMessages(conversationId, 10, lastMessageId);
            const { content, nextCursor: nc, hasNext } = res.data;
            if (content && content.length > 0) {
                const msgs = [...content].reverse();
                if (lastMessageId) {
                    setMessages(prev => [...msgs, ...prev]);
                } else {
                    setMessages(msgs);
                }
                setNextCursor(nc || null);
            }
            setHasMore(!!hasNext);
        } catch (e) {
            console.error(e);
            toast.error('Không thể tải tin nhắn');
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        setMessages([]);
        setNextCursor(null);
        setHasMore(true);
        setInput('');
        setAttachedFiles([]);
        isFirstLoad.current = true;
        loadMessages(null);

        const destination = `${TOPIC_CHAT_PREFIX}${conversationId}`;
        
        const unsubscribe = subscribe(destination, (stompMsg) => {
            try {
                const socketResp = JSON.parse(stompMsg.body);
                if (socketResp.type !== SOCKET_EVENT.NEW_MESSAGE) return;
                const newMsg = socketResp.payload;
                setMessages(prev => {
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
                setTimeout(() => {
                    if (threadRef.current) {
                        threadRef.current.scrollTop = threadRef.current.scrollHeight;
                    }
                }, 50);
            } catch (err) {
                console.error('[STOMP] Failed to parse message', err);
            }
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [conversationId, loadMessages, subscribe]);

    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => { nextCursorRef.current = nextCursor; }, [nextCursor]);

    useEffect(() => {
        if (isFirstLoad.current && messages.length > 0) {
            if (threadRef.current) {
                threadRef.current.scrollTop = threadRef.current.scrollHeight;
            }
            isFirstLoad.current = false;
        }
    }, [messages]);

    useEffect(() => {
        if (loading) return;
        const el = threadRef.current;
        if (!el || !hasMoreRef.current || loadingRef.current) return;
        requestAnimationFrame(() => {
            if (el.scrollHeight <= el.clientHeight + 4) {
                loadMessages(nextCursorRef.current);
            }
        });
    }, [loading, loadMessages]);

    const handleScroll = async () => {
        const el = threadRef.current;
        if (!el) return;
        if (el.scrollTop < 80 && hasMore && !loadingRef.current) {
            const prevScrollHeight = el.scrollHeight;
            await loadMessages(nextCursor);
            requestAnimationFrame(() => {
                if (threadRef.current) {
                    threadRef.current.scrollTop = threadRef.current.scrollHeight - prevScrollHeight;
                }
            });
        }
    };

    const handleSend = async (conversation) => {
        if (!conversation) return;
        const text = input.trim();
        if ((!text && attachedFiles.length === 0) || sending) return;
        setSending(true);
        const cachedText = text;
        const cachedFiles = [...attachedFiles];
        setInput('');
        setAttachedFiles([]);
        try {
            const res = await chatService.sendMessage({
                conversationId: conversationId,
                content: cachedText,
                files: cachedFiles,
            });
            if (res?.data) {
                setMessages(prev => {
                    if (prev.some(m => m.id === res.data.id)) return prev;
                    return [...prev, res.data];
                });
                setTimeout(() => {
                    if (threadRef.current) {
                        threadRef.current.scrollTop = threadRef.current.scrollHeight;
                    }
                }, 50);
                if (onMessageSent) onMessageSent(res.data, conversation);
            }
        } catch (e) {
            toast.error('Không thể gửi tin nhắn');
            setInput(cachedText);
            setAttachedFiles(cachedFiles);
        } finally {
            setSending(false);
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files || []);
        setAttachedFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const handleRemoveFile = (idx) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return {
        messages,
        loading,
        sending,
        input,
        setInput,
        attachedFiles,
        viewerImage,
        setViewerImage,
        threadRef,
        handleScroll,
        handleSend,
        handleFileChange,
        handleRemoveFile
    };
};
