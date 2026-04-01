import React from 'react';
import Avatar from '@/components/messenger/Avatar';

const MobileChatHeader = ({ conversation, onBack, onInfoClick }) => {
    return (
        <header className="fixed top-0 w-full z-50 bg-[#f8f5ff]/70 backdrop-blur-xl md:hidden border-b border-outline-variant/10">
            <div className="flex justify-between items-center px-[12px] py-[8px] w-full max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-[8px]">
                    <button 
                        onClick={onBack}
                        className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:scale-95 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-primary text-[20px]">arrow_back</span>
                    </button>
                    <div className="flex items-center gap-[8px] ml-[4px] cursor-pointer hover:opacity-90 transition-opacity" onClick={onInfoClick}>
                        <div className="relative">
                            <Avatar 
                                src={conversation?.avatar} 
                                name={conversation?.groupName || '?'} 
                                size={36} 
                            />
                            <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-secondary-fixed-dim border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-headline font-bold text-on-surface text-[14px] tracking-tight leading-tight line-clamp-1 max-w-[150px]">
                                {conversation?.groupName || 'Chat'}
                            </span>
                            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase mt-[2px]">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-[4px]">
                    <button className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-primary active:scale-95 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">videocam</span>
                    </button>
                    <button className="w-[32px] h-[32px] flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-primary active:scale-95 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">call</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default MobileChatHeader;
