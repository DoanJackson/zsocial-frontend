import React from 'react';
import Avatar from '@/components/messenger/Avatar';

const MessageWindowHeader = ({ conversation, onInfoClick }) => {
    return (
        <header className="h-20 flex items-center justify-between px-6 bg-surface-container-lowest/80 backdrop-blur-xl z-20 border-b border-outline-variant/10">
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-primary cursor-pointer active:scale-95 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="relative cursor-pointer transition-transform active:scale-95" onClick={() => onInfoClick()}>
                    <Avatar src={conversation.avatar} name={conversation.groupName || '?'} size={44} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h2 className="font-bold text-on-surface font-headline leading-none">{conversation.groupName || 'Cuộc trò chuyện'}</h2>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Đang hoạt động</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors active:scale-95">
                    <span className="material-symbols-outlined">call</span>
                </button>
                <button className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors active:scale-95">
                    <span className="material-symbols-outlined">videocam</span>
                </button>
                <button onClick={onInfoClick} className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant transition-colors active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                </button>
            </div>
        </header>
    );
};

export default MessageWindowHeader;
