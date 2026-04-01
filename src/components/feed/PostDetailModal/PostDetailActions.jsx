import React from 'react';

const PostDetailActions = () => {
    return (
        <div className="px-6 py-2 flex gap-4 border-b border-surface-container-low/50">
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-primary/5 text-primary font-bold text-sm transition-all active:scale-95">
                <span className="material-symbols-outlined">favorite</span> Thích
            </button>
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/5 text-primary font-bold text-sm transition-all active:scale-95">
                <span className="material-symbols-outlined">chat_bubble</span>
                Bình luận
            </button>
            <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant font-bold text-sm transition-all">
                <span className="material-symbols-outlined">send</span>
                Gửi
            </button>
        </div>
    );
};

export default PostDetailActions;
