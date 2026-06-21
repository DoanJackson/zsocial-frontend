import React from 'react';

const PostDetailStats = ({ reactionCount, commentCount, shareCount, onLikesClick }) => {
    return (
        <div className="px-6 py-2 flex items-center justify-between border-b border-surface-container-low/50">
            <div 
                className="flex items-center -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onLikesClick}
            >
                <div className="w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white">
                    <span 
                        className="material-symbols-outlined text-[12px] text-error" 
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
                    >
                        favorite
                    </span>
                </div>
                <span className="pl-3 text-xs font-bold text-slate-500 hover:underline">{reactionCount || 0} lượt thích</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
                {commentCount || 0} bình luận
            </span>
        </div>
    );
};

export default PostDetailStats;
