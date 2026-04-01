import React from 'react';

const PostDetailStats = ({ likeCount, commentCount, shareCount }) => {
    return (
        <div className="px-6 py-4 flex items-center justify-between border-b border-surface-container-low/50">
            <div className="flex items-center gap-1">
                <div className="flex -space-x-1.5">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-primary flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-[12px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </div>
                </div>
                <span className="text-xs font-bold text-on-surface-variant ml-1">{likeCount || 0} lượt thích</span>
            </div>
            <span className="text-xs font-medium text-on-surface-variant">
                {commentCount || 0} bình luận {shareCount ? `• ${shareCount} chia sẻ` : ''}
            </span>
        </div>
    );
};

export default PostDetailStats;
