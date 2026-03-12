import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import chatService from '../../../services/chatService';
import socketService from '../../../services/socketService';
import { useAuth } from '../../../contexts/AuthContext';
import { TOPIC_CHAT_PREFIX, SOCKET_EVENT } from '../../../constants/socketConfig';
import Avatar from '../Avatar';
import MediaPreview from '../MediaPreview';
import ImageViewer from '../../ImageViewer';
import { formatTime } from '../../../utils/messengerHelpers';

function MessageThread({ conversation, onMessageSent }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [input, setInput] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [viewerImage, setViewerImage] = useState(null); // { src, alt }
    const loadingRef = useRef(false);
    const threadRef = useRef(null);
    const bottomRef = useRef(null);
    const isFirstLoad = useRef(true);
    const fileInputRef = useRef(null);
    const subscriptionRef = useRef(null);
    // Refs to avoid stale closures in effects
    const hasMoreRef = useRef(true);
    const nextCursorRef = useRef(null);

    // ── Load messages ──────────────────────────────────────────────────────
    const loadMessages = useCallback(async (lastMessageId = null) => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await chatService.getMessages(conversation.id, 10, lastMessageId);
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
    }, [conversation.id]);

    // ── Reset + subscribe when conversation changes ────────────────────────
    useEffect(() => {
        setMessages([]);
        setNextCursor(null);
        setHasMore(true);
        setInput('');
        setAttachedFiles([]);
        isFirstLoad.current = true;
        loadMessages(null);

        // WebSocket: subscribe to conversation topic
        const destination = `${TOPIC_CHAT_PREFIX}${conversation.id}`;
        // Small delay to ensure STOMP is connected after potential page refresh
        const attemptSubscribe = () => {
            const sub = socketService.subscribe(destination, (stompMsg) => {
                try {
                    const socketResp = JSON.parse(stompMsg.body);
                    // Chỉ xử lý sự kiện NEW_MESSAGE, bỏ qua các loại khác
                    if (socketResp.type !== SOCKET_EVENT.NEW_MESSAGE) return;
                    const newMsg = socketResp.payload;
                    setMessages(prev => {
                        // Avoid duplicate if we already have it (e.g. optimistic UI)
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    // Scroll to bottom for incoming messages
                    setTimeout(() => {
                        if (threadRef.current) {
                            threadRef.current.scrollTop = threadRef.current.scrollHeight;
                        }
                    }, 50);
                } catch (err) {
                    console.error('[STOMP] Failed to parse message', err);
                }
            });
            subscriptionRef.current = sub;
        };

        // Try immediately, retry once after 1s if STOMP not yet active
        attemptSubscribe();
        const retryTimer = setTimeout(() => {
            if (!subscriptionRef.current) attemptSubscribe();
        }, 1000);

        return () => {
            clearTimeout(retryTimer);
            if (subscriptionRef.current) {
                socketService.unsubscribe(subscriptionRef.current);
                subscriptionRef.current = null;
            }
        };
    }, [conversation.id]);

    // Keep refs in sync with state
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => { nextCursorRef.current = nextCursor; }, [nextCursor]);

    // ── First-load scroll to bottom ───────────────────────────────────────
    useEffect(() => {
        if (isFirstLoad.current && messages.length > 0) {
            if (threadRef.current) {
                threadRef.current.scrollTop = threadRef.current.scrollHeight;
            }
            isFirstLoad.current = false;
        }
    }, [messages]);

    // ── Auto-fill viewport: if messages don't overflow, load more silently ─
    useEffect(() => {
        if (loading) return; // wait until current load finishes
        const el = threadRef.current;
        if (!el || !hasMoreRef.current || loadingRef.current) return;
        // If all loaded messages fit without needing a scrollbar, fetch more
        requestAnimationFrame(() => {
            if (el.scrollHeight <= el.clientHeight + 4) {
                loadMessages(nextCursorRef.current);
            }
        });
    }, [loading, loadMessages]);

    // ── Scroll up to load older ───────────────────────────────────────────
    const handleScroll = async () => {
        const el = threadRef.current;
        if (!el) return;
        // Load more when scrolled near the top and there are more messages
        if (el.scrollTop < 80 && hasMore && !loadingRef.current) {
            const prevScrollHeight = el.scrollHeight;
            await loadMessages(nextCursor);
            // Restore scroll position so user stays at same message
            requestAnimationFrame(() => {
                if (threadRef.current) {
                    threadRef.current.scrollTop = threadRef.current.scrollHeight - prevScrollHeight;
                }
            });
        }
    };

    // ── File attachment ───────────────────────────────────────────────────
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files || []);
        setAttachedFiles(prev => [...prev, ...newFiles]);
        e.target.value = '';
    };

    const handleRemoveFile = (idx) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Send ──────────────────────────────────────────────────────────────
    const handleSend = async () => {
        const text = input.trim();
        if ((!text && attachedFiles.length === 0) || sending) return;
        setSending(true);
        const cachedText = text;
        const cachedFiles = [...attachedFiles];
        setInput('');
        setAttachedFiles([]);
        try {
            const res = await chatService.sendMessage({
                conversationId: conversation.id,
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
                // Thông báo cho parent cập nhật danh sách hội thoại
                onMessageSent?.(res.data, conversation);
            }
        } catch (e) {
            toast.error('Không thể gửi tin nhắn');
            setInput(cachedText);
            setAttachedFiles(cachedFiles);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const myId = user?.userId?.toString();

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
                <Avatar src={conversation.avatar} name={conversation.groupName} size={40} />
                <div>
                    <p className="font-semibold text-sm text-gray-900">{conversation.groupName || 'Cuộc trò chuyện'}</p>
                    <p className="text-xs text-green-500 font-medium">Đang hoạt động</p>
                </div>
            </div>

            {/* Messages */}
            <div ref={threadRef} onScroll={handleScroll} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {/* Loading spinner for initial load */}
                {loading && messages.length === 0 && (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {/* Sticky top loader when pulling up older messages */}
                {loading && messages.length > 0 && (
                    <div className="sticky top-0 z-10 flex justify-center py-1.5">
                        <div className="bg-white shadow rounded-full px-4 py-1.5 flex items-center gap-2 border border-gray-100">
                            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-gray-500 font-medium">Đang tải tin nhắn...</span>
                        </div>
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isMe = msg.sender?.userId?.toString() === myId;
                    const showName = !isMe && (idx === 0 || messages[idx - 1]?.sender?.userId !== msg.sender?.userId);
                    return (
                        <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isMe && <Avatar src={msg.sender?.avatar?.url} name={msg.sender?.fullName} size={28} />}
                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[65%]`}>
                                {showName && (
                                    <span className="text-xs text-gray-500 mb-1 px-1">{msg.sender?.fullName}</span>
                                )}
                                {msg.content && (
                                    <div
                                        className={`px-3 py-2 rounded-2xl text-sm break-words ${isMe
                                            ? 'bg-[#1877f2] text-white rounded-br-sm'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                )}
                                {msg.medias && msg.medias.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {msg.medias.map(m => (
                                            m.type === 'VIDEO' ? (
                                                <video
                                                    key={m.id}
                                                    src={m.url}
                                                    controls
                                                    preload="metadata"
                                                    className="rounded-lg"
                                                    style={{ maxWidth: '280px', maxHeight: '200px', display: 'block' }}
                                                />
                                            ) : (
                                                <img
                                                    key={m.id}
                                                    src={m.url}
                                                    alt=""
                                                    className="rounded-lg max-w-[220px] max-h-[220px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                    onClick={() => setViewerImage({ src: m.url, alt: '' })}
                                                />
                                            )
                                        ))}
                                    </div>
                                )}
                                <span className="text-[10px] text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Media preview */}
            <MediaPreview files={attachedFiles} onRemove={handleRemoveFile} />

            {/* Image lightbox */}
            {viewerImage && (
                <ImageViewer
                    src={viewerImage.src}
                    alt={viewerImage.alt}
                    onClose={() => setViewerImage(null)}
                />
            )}

            {/* Input */}
            <div className="border-t border-gray-200 px-3 py-3 flex items-center gap-2 bg-white flex-shrink-0">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Attach button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                    title="Đính kèm ảnh/video"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* Text input */}
                <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                        className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
                        placeholder="Aa"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={(!input.trim() && attachedFiles.length === 0) || sending}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${(input.trim() || attachedFiles.length > 0) && !sending
                        ? 'bg-[#1877f2] text-white hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

export default MessageThread;
