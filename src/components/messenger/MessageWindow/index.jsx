import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageWindow } from '@/hooks/useMessageWindow';
import MediaPreview from '@/components/messenger/MediaPreview';
import ImageViewer from '@/components/ImageViewer';
import MessageWindowHeader from './MessageWindowHeader';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import MobileChatHeader from './MobileChatHeader';
import MobileChatInput from './MobileChatInput';

function MessageWindow({ conversation, onMessageSent, onInfoClick, onBack }) {
    const { user } = useAuth();
    const myId = user?.userId?.toString();

    const {
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
    } = useMessageWindow(conversation.id, onMessageSent);

    return (
        <section className="flex flex-1 flex-col bg-surface-container-lowest h-full w-full relative cursor-auto">
            <div className="hidden md:block w-full">
                <MessageWindowHeader conversation={conversation} onInfoClick={onInfoClick} />
            </div>
            
            <MobileChatHeader 
                conversation={conversation} 
                onBack={onBack} 
                onInfoClick={onInfoClick} 
            />

            <div ref={threadRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 pt-24 pb-24 md:p-6 space-y-6 custom-scrollbar bg-surface-container-lowest">
                {/* Loader placeholders */}
                {loading && messages.length === 0 && (
                    <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {loading && messages.length > 0 && (
                    <div className="sticky top-0 z-10 flex justify-center py-1.5">
                        <div className="bg-surface-container-low shadow rounded-full px-4 py-1.5 flex items-center gap-2 border border-outline-variant/10 cursor-pointer">
                            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs text-on-surface-variant font-medium">Đang tải tin nhắn...</span>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isMe = msg.sender?.userId?.toString() === myId;
                    const showName = !isMe && (idx === 0 || messages[idx - 1]?.sender?.userId !== msg.sender?.userId);
                    return (
                        <MessageBubble
                            key={msg.id}
                            msg={msg}
                            isMe={isMe}
                            showName={showName}
                            setViewerImage={setViewerImage}
                        />
                    );
                })}
                <div className="h-2" />
            </div>

            {attachedFiles?.length > 0 && (
                <div className="pb-20 md:pb-0 shrink-0">
                    <MediaPreview files={attachedFiles} onRemove={handleRemoveFile} />
                </div>
            )}

            {viewerImage && (
                <ImageViewer
                    src={viewerImage.src}
                    alt={viewerImage.alt}
                    onClose={() => setViewerImage(null)}
                />
            )}

            <div className="hidden md:block w-full">
                <ChatInput
                    input={input}
                    setInput={setInput}
                    handleKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(conversation);
                        }
                    }}
                    handleSend={() => handleSend(conversation)}
                    sending={sending}
                    attachedFiles={attachedFiles}
                    handleFileChange={handleFileChange}
                />
            </div>
            
            <MobileChatInput
                input={input}
                setInput={setInput}
                handleKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(conversation);
                    }
                }}
                handleSend={() => handleSend(conversation)}
                sending={sending}
                handleFileChange={handleFileChange}
                attachedFiles={attachedFiles}
            />
        </section>
    );
}

export default MessageWindow;
