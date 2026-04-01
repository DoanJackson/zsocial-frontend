import React from 'react';

function EmptyConversation() {
    return (
        <div className="flex flex-col flex-1 h-full items-center justify-center bg-surface-container-lowest text-on-surface-variant p-6">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[40px] text-outline">
                    chat_bubble
                </span>
            </div>
            <h3 className="font-bold font-headline text-xl text-on-surface mb-2">Chưa chọn đoạn chat</h3>
            <p className="text-sm font-label text-center max-w-xs">
                Vui lòng chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.
            </p>
        </div>
    );
}

export default EmptyConversation;
