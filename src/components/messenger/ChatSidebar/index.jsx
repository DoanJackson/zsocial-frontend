import React, { forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversationList } from '@/hooks/useConversationList';
import ChatSearch from './ChatSearch';
import ActiveUsersList from './ActiveUsersList';
import ChatItem from './ChatItem';

const ChatSidebar = forwardRef(function ChatSidebar({ selectedId, onSelect, onFirstLoaded }, ref) {
    const { user } = useAuth();
    
    // Inject Custom Hook
    const { conversations, loading, listRef, handleScroll, upsertToTop } = useConversationList(onFirstLoaded);

    useImperativeHandle(ref, () => ({ upsertToTop }), [upsertToTop]);

    return (
        <section className="flex w-full md:w-[340px] flex-shrink-0 flex-col border-r border-outline-variant/10 md:bg-surface-container-low h-full overflow-hidden">
            <div className="p-4 pb-2">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black font-headline tracking-tight text-on-surface">Tin nhắn</h2>
                </div>
                <ChatSearch />
                <ActiveUsersList />
            </div>

            <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar space-y-1 px-3 pb-24 md:pb-0">
                {conversations.length === 0 && !loading && (
                    <div className="text-center py-8 text-on-surface-variant text-sm font-label">Chưa có đoạn hội thoại nào</div>
                )}
                {conversations.map(conv => (
                    <ChatItem 
                        key={conv.id}
                        conv={conv}
                        isActive={selectedId === conv.id}
                        onClick={() => onSelect(conv)}
                        userId={user?.userId}
                    />
                ))}
                {loading && (
                    <div className="py-3 flex justify-center">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>
        </section>
    );
});

export default ChatSidebar;
