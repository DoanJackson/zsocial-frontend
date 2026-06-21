import React, { useState, useEffect } from 'react';
import { timeAgo } from '@/utils/timeAgo';
import { getDefaultAvatarUrl } from '@/utils/avatarUtils';
import commentService from '@/services/commentService';
import PostImages from '@/components/feed/PostImages';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import LikeListPopup from '@/components/common/LikeListPopup';
import reactionService from '@/services/reactionService';

const PopupCommentItem = ({ comment, depth = 0, activeDropdown, setActiveDropdown, onReply, onDelete, children, postAuthorId }) => {
    const [repliesOpen, setRepliesOpen] = useState(false);

    const currentUserId = String(localStorage.getItem('userId'));
    const isCommentOwner = currentUserId === String(comment.author?.id);
    const isPostOwner = postAuthorId && currentUserId === String(postAuthorId);
    const canDelete = isCommentOwner || isPostOwner;
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [isLikeListOpen, setIsLikeListOpen] = useState(false);

    const [localReactedByMe, setLocalReactedByMe] = useState(comment.reactedByMe);
    const [localReactionCount, setLocalReactionCount] = useState(comment.reactionCount || 0);

    useEffect(() => {
        setLocalReactedByMe(comment.reactedByMe);
        setLocalReactionCount(comment.reactionCount || 0);
    }, [comment.reactedByMe, comment.reactionCount]);

    const handleToggleLike = async () => {
        const previousState = localReactedByMe;
        const previousCount = localReactionCount;

        // Optimistic update
        setLocalReactedByMe(!previousState);
        setLocalReactionCount(previousState ? Math.max(0, previousCount - 1) : previousCount + 1);

        try {
            await reactionService.toggleReaction(comment.id, 'COMMENT');
        } catch (err) {
            // Revert on error
            setLocalReactedByMe(previousState);
            setLocalReactionCount(previousCount);
        }
    };

    const handleMediaClick = (index) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };

    const isReply = depth > 0;

    const avatarSize = isReply ? "w-6 h-6 mt-0.5" : "w-8 h-8";
    const bgClass = "flex flex-col";
    const nameColor = "text-on-surface";
    const mbValue = "leading-snug mt-0.5";

    const handleReply = () => {
        if (onReply) onReply(comment);
    };

    const handleToggleReplies = async () => {
        if (repliesOpen) {
            setRepliesOpen(false);
            return;
        }
        setLoadingReplies(true);
        try {
            const res = await commentService.getReplies(comment.id);
            if (res.data && res.data.content) {
                setReplies(res.data.content);
            }
            setRepliesOpen(true);
        } catch {
            // silently fail
        } finally {
            setLoadingReplies(false);
        }
    };

    const hasReplies = comment.childCommentCount != null && comment.childCommentCount > 0;

    return (
        <div className={`flex gap-3 ${isReply ? 'mt-4' : ''}`}>
            <div className={`flex-shrink-0 ${avatarSize} rounded-full overflow-hidden shrink-0`}>
                <img
                    className="w-full h-full object-cover"
                    alt={comment.author?.username}
                    src={comment.author?.avatar?.url || getDefaultAvatarUrl()}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className={bgClass}>
                    <div className="flex justify-between items-start leading-none">
                        <h4 className={`text-[13px] font-bold ${nameColor}`}>{comment.author?.fullName}</h4>
                    </div>
                    <p className={`text-sm text-on-surface ${mbValue}`}>{comment.content}</p>

                    {comment.medias && comment.medias.length > 0 && (
                        <>
                            <div className="mt-2 max-w-[300px] w-full rounded-[12px] overflow-hidden border border-surface-container-high shadow-sm [&_.post-detail-images-wrapper]:!max-w-full">
                                <PostImages medias={comment.medias} onImageClick={handleMediaClick} />
                            </div>
                            <MediaCarouselViewer
                                isOpen={viewerOpen}
                                onClose={() => setViewerOpen(false)}
                                medias={comment.medias}
                                initialIndex={viewerIndex}
                            />
                        </>
                    )}
                </div>

                <div className="flex gap-2 mt-2 items-center">
                    <span className="text-[10px] font-medium text-outline">{timeAgo(comment.createdAt)}</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            className={`cursor-pointer text-[10px] font-bold tracking-wider transition-colors ${localReactedByMe ? 'text-error' : 'text-on-surface-variant hover:underline'}`}
                            onClick={handleToggleLike}
                        >
                            Thích
                        </button>
                        {localReactionCount > 0 && (
                            <div
                                className="flex items-center gap-1 cursor-pointer px-1 py-0.5 rounded transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLikeListOpen(true);
                                }}
                            >
                                <div className="w-[14px] h-[14px] rounded-full bg-white flex items-center justify-center ring-1 ring-white">
                                    <span className="material-symbols-outlined text-[8px] text-error" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>favorite</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 hover:underline text-on-surface-variant">
                                    {localReactionCount}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        className="cursor-pointer text-[10px] font-bold text-on-surface-variant tracking-wider hover:underline transition-colors"
                        onClick={handleReply}
                    >
                        Trả lời
                    </button>

                    {canDelete && (
                        <button
                            className="cursor-pointer text-[10px] font-bold text-error tracking-wider hover:underline transition-colors"
                            onClick={() => onDelete && onDelete(comment.id)}
                        >
                            Xóa
                        </button>
                    )}
                </div>

                {hasReplies && (
                    <button
                        className="mt-2 ml-2 flex items-center gap-1 text-[11px] font-bold text-primary bg-transparent border-none p-0 cursor-pointer hover:underline w-fit transition-colors"
                        onClick={handleToggleReplies}
                        disabled={loadingReplies}
                    >
                        {loadingReplies ? (
                            <span className="animate-pulse">Đang tải...</span>
                        ) : repliesOpen ? (
                            <>
                                Ẩn phản hồi
                            </>
                        ) : (
                            <>
                                Xem {comment.childCommentCount} phản hồi
                            </>
                        )}
                    </button>
                )}

                {repliesOpen && replies.length > 0 && (
                    <div className="mt-2 flex flex-col pl-4 border-l-2 border-surface-container-low ml-2">
                        {replies.map(reply => (
                            <PopupCommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                activeDropdown={activeDropdown}
                                setActiveDropdown={setActiveDropdown}
                                onReply={onReply}
                                onDelete={onDelete}
                                postAuthorId={postAuthorId}
                            />
                        ))}
                    </div>
                )}
                {children}
            </div>

            <LikeListPopup
                isOpen={isLikeListOpen}
                onClose={() => setIsLikeListOpen(false)}
                targetId={comment.id}
                targetType="COMMENT"
            />
        </div>
    );
};

export default PopupCommentItem;
