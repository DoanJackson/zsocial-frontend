import React from 'react';
import { timeAgo } from '@/utils/timeAgo';
import { getDefaultAvatarUrl } from '@/utils/avatarUtils';

const PostDetailHeader = ({ author, createdAt, location, onClose, goToProfile }) => {
    return (
        <header className="flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl border-b border-surface-container-low z-20 shrink-0">
            <div className="flex items-center gap-3">
                <div 
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer"
                    onClick={goToProfile}
                >
                    <img 
                        className="w-full h-full object-cover" 
                        alt={author?.username || 'Gia Lâm'} 
                        src={author?.avatar?.url || getDefaultAvatarUrl()}
                    />
                </div>
                <div>
                    <h3 
                        className="font-headline font-bold text-sm leading-tight cursor-pointer hover:underline"
                        onClick={goToProfile}
                    >
                        {author?.fullName}
                    </h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">
                        {timeAgo(createdAt)} {location ? `• ${location}` : ''}
                    </p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-error-container hover:text-on-error transition-all active:scale-95"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
        </header>
    );
};

export default PostDetailHeader;
