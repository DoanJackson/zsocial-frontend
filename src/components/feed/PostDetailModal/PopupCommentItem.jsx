import React, { useState } from 'react';
import { timeAgo } from '@/utils/timeAgo';
import { getDefaultAvatarUrl } from '@/utils/avatarUtils';
import commentService from '@/services/commentService';
import PostImages from '@/components/feed/PostImages';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';

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

                <div className="flex gap-4 mt-2 px-2">
                    <button className="cursor-pointer text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hover:text-primary transition-colors">Thích</button>
                    <button
                        className="cursor-pointer text-[10px] font-bold text-on-surface-variant uppercase tracking-wider hover:text-primary transition-colors"
                        onClick={handleReply}
                    >
                        Phản hồi
                    </button>
                    <span className="text-[10px] font-medium text-outline">{timeAgo(comment.createdAt)}</span>

                    {canDelete && (
                        <button
                            className="cursor-pointer text-[10px] font-bold text-error uppercase tracking-wider hover:text-error-dim transition-colors"
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
        </div>
    );
};

export default PopupCommentItem;
