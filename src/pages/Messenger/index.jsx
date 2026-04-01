import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ChatSidebar from '@/components/messenger/ChatSidebar';
import MessageWindow from '@/components/messenger/MessageWindow';
import ConversationDetails from '@/components/messenger/ConversationDetails';
import EmptyConversation from '@/components/messenger/EmptyConversation';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useChatAlerts } from '@/hooks/useChatAlerts';

const MessengerPage = () => {
    const { user } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);

    const conversationListRef = useRef(null);

    const handleFirstLoaded = useCallback((firstConv) => {
        // setSelectedConversation(firstConv);
    }, []);

    useChatAlerts(selectedConversation, conversationListRef);

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
        <div className="text-on-surface overflow-hidden bg-background">
            {/* Desktop SideNavBar */}
            <aside className={`fixed left-0 top-0 h-full hidden md:flex flex-col p-4 ${isNavCollapsed ? 'w-[80px] items-center' : 'w-[240px]'} bg-white z-50 transition-all duration-200 ease-in-out border-r border-outline-variant/10`}>
                <div className={`mb-8 flex items-center w-full ${isNavCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                    {!isNavCollapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-blue-600 font-headline">ZSocial</h1>
                        </div>
                    )}
                </div>
                {/* Floating collapse button on the edge */}
                <button
                    onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                    className="absolute -right-[14px] top-[30px] w-[28px] h-[28px] flex items-center justify-center bg-white border border-outline-variant/20 shadow-sm rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant z-50 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[16px]">
                        {isNavCollapsed ? 'chevron_right' : 'chevron_left'}
                    </span>
                </button>
                <nav className="flex-1 space-y-[6px] w-full">
                    <Link to="/feed" className={`flex items-center text-slate-600 hover:bg-slate-100 rounded-full group transition-all cursor-pointer ${isNavCollapsed ? 'justify-center p-[10px]' : 'gap-3 px-[14px] py-[10px]'}`}>
                        <span className="material-symbols-outlined text-2xl">home</span>
                        {!isNavCollapsed && <span className="font-medium">Trang chủ</span>}
                    </Link>
                    <Link to="/messages" className={`flex items-center bg-blue-50 text-blue-700 rounded-full group transition-all cursor-pointer ${isNavCollapsed ? 'justify-center p-[10px]' : 'gap-3 px-[14px] py-[10px]'}`}>
                        <span className="material-symbols-outlined text-2xl filled-icon">chat_bubble</span>
                        {!isNavCollapsed && <span className="font-medium">Tin nhắn</span>}
                    </Link>
                    <Link to="/notifications" className={`flex items-center text-slate-600 hover:bg-slate-100 rounded-full group transition-all cursor-pointer ${isNavCollapsed ? 'justify-center p-[10px]' : 'gap-3 px-[14px] py-[10px]'}`}>
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                        {!isNavCollapsed && <span className="font-medium">Thông báo</span>}
                    </Link>
                    <a href="#" className={`flex items-center text-slate-600 hover:bg-slate-100 rounded-full group transition-all cursor-pointer ${isNavCollapsed ? 'justify-center p-[10px]' : 'gap-3 px-[14px] py-[10px]'}`}>
                        <span className="material-symbols-outlined text-2xl">search</span>
                        {!isNavCollapsed && <span className="font-medium">Tìm kiếm</span>}
                    </a>
                    <Link to={`/profile/${user?.userId}`} className={`flex items-center text-slate-600 hover:bg-slate-100 rounded-full group transition-all cursor-pointer ${isNavCollapsed ? 'justify-center p-[10px]' : 'gap-3 px-[14px] py-[10px]'}`}>
                        <span className="material-symbols-outlined text-2xl">person</span>
                        {!isNavCollapsed && <span className="font-medium">Hồ sơ</span>}
                    </Link>
                </nav>
            </aside>

            {/* Main Container */}
            <main className={`${isNavCollapsed ? 'md:ml-[80px]' : 'md:ml-[240px]'} h-screen flex flex-col md:flex-row bg-background transition-all duration-200 ease-in-out`}>
                {/* Left Column: Conversations List */}
                <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-auto h-full`}>
                    <ChatSidebar
                        ref={conversationListRef}
                        selectedId={selectedConversation?.id}
                        onSelect={setSelectedConversation}
                        onFirstLoaded={handleFirstLoaded}
                    />
                </div>

                {/* Center: Message window */}
                {selectedConversation ? (
                    <div className="flex-1 flex flex-col w-full h-full min-w-0">
                        <MessageWindow
                            key={selectedConversation.id}
                            conversation={selectedConversation}
                            onMessageSent={handleMessageSent}
                            onInfoClick={() => setIsInfoVisible(!isInfoVisible)}
                            onBack={() => setSelectedConversation(null)}
                        />
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col h-full relative">
                        <EmptyConversation />
                    </div>
                )}

                {/* Right: Conversation info (Desktop only) */}
                {selectedConversation && isInfoVisible && (
                    <ConversationDetails
                        key={`details-${selectedConversation.id}`}
                        conversation={selectedConversation}
                        onClose={() => setIsInfoVisible(false)}
                    />
                )}
            </main>

            {/* Mobile Navigation (Floating Bottom) */}
            {!selectedConversation && <MobileBottomNav />}
        </div>
    );
};

export default MessengerPage;
