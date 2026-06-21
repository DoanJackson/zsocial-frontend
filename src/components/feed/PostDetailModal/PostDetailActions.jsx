import React from 'react';

const PostDetailActions = ({ reactedByMe, onToggleLike, handleShare }) => {
    return (
        <div className="px-6 flex items-center justify-between pt-2 pb-2 border-b border-surface-container-low/50">
            <button
                className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-colors font-bold text-sm ${reactedByMe ? 'text-error hover:bg-primary/10' : 'text-on-surface-variant hover:bg-surface-container'}`}
                onClick={onToggleLike}
            >
                <span className="material-symbols-outlined" style={reactedByMe ? { fontVariationSettings: "'FILL' 1" } : {}}>favorite</span> Thích
            </button>
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors font-bold text-sm bg-primary/5">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span> Bình luận
            </button>
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors font-bold text-sm" onClick={handleShare}>
                <span className="material-symbols-outlined">share</span> Chia sẻ
            </button>
        </div>
    );
};

export default PostDetailActions;
