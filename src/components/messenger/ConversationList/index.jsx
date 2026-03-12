import { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import chatService from '../../../services/chatService';
import { useAuth } from '../../../contexts/AuthContext';
import Avatar from '../Avatar';
import { formatTime, getLastMessagePreview } from '../../../utils/messengerHelpers';

const ConversationList = forwardRef(function ConversationList({ selectedId, onSelect, onFirstLoaded }, ref) {
    const { user } = useAuth();
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
                // Must be OUTSIDE the state updater to avoid setState-in-render violation
                if (!cursor && !firstLoadedRef.current && content.length > 0) {
                    firstLoadedRef.current = true;
                    onFirstLoaded(content[0]);
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

    /**
     * Đẩy cuộc hội thoại lên đầu danh sách khi nhận được NEW_MESSAGE_ALERT.
     * @param {object} msgSocketResp - MessageSocketResponse từ server
     */
    const upsertToTop = useCallback((msgSocketResp) => {
        const conversationId = msgSocketResp.conversationId;
        setConversations(prev => {
            const existingIndex = prev.findIndex(c => c.id === conversationId);

            if (existingIndex !== -1) {
                // Cập nhật thông tin cuộc hội thoại đã có và đẩy lên đầu
                const updated = { ...prev[existingIndex] };
                updated.lastMessageContent = msgSocketResp.content || '';
                updated.lastMessageAt = msgSocketResp.createdAt;
                updated.lastMessageSender = msgSocketResp.sender;
                updated.lastMessageMediaCount = msgSocketResp.medias?.length || 0;

                const newList = prev.filter(c => c.id !== conversationId);
                return [updated, ...newList];
            } else {
                // Chưa load cuộc hội thoại này → xây dựng từ dữ liệu nhận được
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

    // Expose upsertToTop cho component cha thông qua ref
    useImperativeHandle(ref, () => ({ upsertToTop }), [upsertToTop]);

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
            <div className="px-4 pt-5 pb-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Đoạn chat</h2>
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
                        placeholder="Tìm kiếm trên Messenger"
                    />
                </div>
            </div>

            <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
                {conversations.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-400 text-sm">Chưa có đoạn hội thoại nào</div>
                )}
                {conversations.map(conv => (
                    <button
                        key={conv.id}
                        onClick={() => onSelect(conv)}
                        className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors text-left ${selectedId === conv.id ? 'bg-blue-50' : ''
                            }`}
                    >
                        <div className="relative flex-shrink-0">
                            <Avatar src={conv.avatar} name={conv.groupName || '?'} size={48} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-900 truncate">{conv.groupName || 'Cuộc trò chuyện'}</span>
                                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                                {getLastMessagePreview(conv, user?.userId)}
                            </p>
                        </div>
                    </button>
                ))}
                {loading && (
                    <div className="py-3 flex justify-center">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </div>
    );
});

export default ConversationList;
