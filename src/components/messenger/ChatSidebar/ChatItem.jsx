import React from 'react';
import Avatar from '@/components/messenger/Avatar';
import { formatTime, getLastMessagePreview } from '@/utils/messengerHelpers';

const ChatItem = ({ conv, isActive, onClick, userId }) => {
    // Unread count is hardcoded to 0 for now as it's not in the original logic
    const unreadCount = 0; 

    // Time formatting requires checking if it's recent, but we'll use existing formatTime.
    // If you need exact matching 'Vừa xong', formatTime handles it or we leave it.

    const baseClasses = "flex items-center gap-[8px] p-[8px] rounded-[12px] cursor-pointer transition-all duration-200 group";
    const activeClasses = isActive 
        ? "bg-surface-container-highest" 
        : "hover:bg-surface-container-high";

    // In active state, text is bolder and primary color
    const titleClasses = "font-bold text-on-surface truncate flex-1 min-w-0 group-hover:text-primary transition-colors";
    const timeClasses = isActive
        ? "text-[10px] font-bold text-primary uppercase tracking-wider flex-shrink-0"
        : "text-[10px] text-on-surface-variant font-label flex-shrink-0";
        
    const previewClasses = isActive
        ? "text-[13px] text-primary font-semibold truncate flex-1 min-w-0"
        : "text-[13px] text-on-surface-variant truncate flex-1 min-w-0";

    return (
        <div onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
            <div className="relative flex-shrink-0 cursor-pointer">
                <Avatar src={conv.avatar} name={conv.groupName || '?'} size={44} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                    <h3 className={titleClasses}>{conv.groupName || 'Cuộc trò chuyện'}</h3>
                    <span className={timeClasses}>{formatTime(conv.lastMessageAt)}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                    <p className={previewClasses}>
                        {getLastMessagePreview(conv, userId)}
                    </p>
                    {isActive && unreadCount > 0 && (
                        <div className="w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                            {unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;
