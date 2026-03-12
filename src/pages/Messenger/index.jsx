import { useState, useCallback, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import ConversationList from '../../components/messenger/ConversationList';
import MessageThread from '../../components/messenger/MessageThread';
import ConversationInfo from '../../components/messenger/ConversationInfo';
import EmptyConversation from '../../components/messenger/EmptyConversation';
import socketService from '../../services/socketService';
import { useAuth } from '../../contexts/AuthContext';
import { TOPIC_CHAT_PREFIX } from '../../constants/socketConfig';

// ─── Main Page ────────────────────────────────────────────────────────────────
const MessengerPage = () => {
    const { user, addMessageAlertListener, removeMessageAlertListener } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const conversationListRef = useRef(null);
    // Ref to track the active conversation channel subscription
    const conversationSubRef = useRef(null);

    const handleFirstLoaded = useCallback((firstConv) => {
        setSelectedConversation(firstConv);
    }, []);

    // ── Listen for NEW_MESSAGE_ALERT from AuthContext ─────────────────────────
    useEffect(() => {
        const handleAlert = (msgAlert) => {
            conversationListRef.current?.upsertToTop(msgAlert);
        };

        addMessageAlertListener(handleAlert);
        return () => {
            removeMessageAlertListener(handleAlert);
        };
    }, [addMessageAlertListener, removeMessageAlertListener]);

    // ── Subscribe conversation channel when a conversation is selected ────────
    useEffect(() => {
        // Unsubscribe from previous conversation channel
        if (conversationSubRef.current) {
            socketService.unsubscribe(conversationSubRef.current);
            conversationSubRef.current = null;
        }

        if (!selectedConversation?.id) return;

        const destination = `${TOPIC_CHAT_PREFIX}${selectedConversation.id}`;

        const doSubscribe = () => {
            const sub = socketService.subscribe(destination, (stompMsg) => {
                // Placeholder: sẽ handle USER_TYPING và các event khác khi BE sẵn sàng
                try {
                    const socketResp = JSON.parse(stompMsg.body);
                    console.log('[STOMP] Conversation event:', socketResp.type, socketResp);
                } catch (err) {
                    console.error('[STOMP] Failed to parse conversation message', err);
                }
            });
            if (sub) conversationSubRef.current = sub;
            return sub;
        };

        const sub = doSubscribe();
        // Retry once after 1s if STOMP not yet ready
        if (!sub) {
            const timer = setTimeout(() => {
                if (!conversationSubRef.current) doSubscribe();
            }, 1000);
            return () => {
                clearTimeout(timer);
                if (conversationSubRef.current) {
                    socketService.unsubscribe(conversationSubRef.current);
                    conversationSubRef.current = null;
                }
            };
        }

        return () => {
            if (conversationSubRef.current) {
                socketService.unsubscribe(conversationSubRef.current);
                conversationSubRef.current = null;
            }
        };
    }, [selectedConversation?.id]);

    /**
     * Khi người dùng gửi tin nhắn thành công → cập nhật danh sách hội thoại ngay lập tức.
     * Nhận MessageResponse + conversation từ MessageThread.
     */
    const handleMessageSent = useCallback((message, conversation) => {
        conversationListRef.current?.upsertToTop({
            conversationId: conversation.id,
            avatar: conversation.avatar,
            groupName: conversation.groupName,
            type: conversation.type,
            isGroup: conversation.isGroup,
            sender: message.sender,
            content: message.content,
            createdAt: message.createdAt,
            medias: message.medias,
        });
    }, []);

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            <Header variant="feed" />

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Conversation list */}
                <div className="w-[340px] flex-shrink-0 flex flex-col overflow-hidden">
                    <ConversationList
                        ref={conversationListRef}
                        selectedId={selectedConversation?.id}
                        onSelect={setSelectedConversation}
                        onFirstLoaded={handleFirstLoaded}
                    />
                </div>

                {/* Center: Message thread */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedConversation ? (
                        <MessageThread key={selectedConversation.id} conversation={selectedConversation} onMessageSent={handleMessageSent} />
                    ) : (
                        <EmptyConversation />
                    )}
                </div>

                {/* Right: Conversation info */}
                <div className="w-[300px] flex-shrink-0 flex flex-col overflow-hidden">
                    {selectedConversation ? (
                        <ConversationInfo key={selectedConversation.id} conversation={selectedConversation} />
                    ) : (
                        <div className="flex-1 bg-white border-l border-gray-200" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessengerPage;
