import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import commentService from '@/services/commentService';
import reactionService from '@/services/reactionService';
import PostDetailBody from './PostDetailBody';
import PostDetailMedia from './PostDetailMedia';
import PostDetailStats from './PostDetailStats';
import PostDetailActions from './PostDetailActions';
import PostDetailCommentList from './PostDetailCommentList';
import PopupCommentItem from './PopupCommentItem';
import PopupCommentInput from './PopupCommentInput';
import ConfirmDialog from '@/components/ConfirmDialog';
import LikeListPopup from '@/components/common/LikeListPopup';
import PostDetailHeader from './PostDetailHeader';
import { toast } from 'react-toastify';

const PostDetailModal = ({ isOpen, onClose, post, onImageClick, onCommentAdded }) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const [localReactedByMe, setLocalReactedByMe] = useState(false);
    const [localReactionCount, setLocalReactionCount] = useState(0);
    const [isLikeListOpen, setIsLikeListOpen] = useState(false);

    useEffect(() => {
        if (post) {
            setLocalReactedByMe(post.reactedByMe);
            setLocalReactionCount(post.reactionCount || 0);
        }
    }, [post]);

    const handleToggleLike = async () => {
        if (!post) return;
        const previousState = localReactedByMe;
        const previousCount = localReactionCount;

        setLocalReactedByMe(!previousState);
        setLocalReactionCount(previousState ? Math.max(0, previousCount - 1) : previousCount + 1);

        try {
            await reactionService.toggleReaction(post.id, 'POST');
        } catch (err) {
            setLocalReactedByMe(previousState);
            setLocalReactionCount(previousCount);
        }
    };

    const goToProfile = () => {
        if (post?.author?.userId) {
            onClose();
            navigate(`/profile/${post.author.userId}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.comment-options-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchedForPostRef = useRef(null);

    const fetchComments = async () => {
        if (!post) return;
        setLoadingComments(true);
        try {
            const response = await commentService.getCommentsByPostId(post.id);
            if (response.data && response.data.content) {
                setComments(response.data.content);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (isOpen && post?.id) {
            if (fetchedForPostRef.current !== post.id) {
                fetchedForPostRef.current = post.id;
                fetchComments();
            }
        } else {
            fetchedForPostRef.current = null;
            setComments([]);
            setReplyingTo(null);
            setActiveDropdown(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, post?.id]);

    const handleReplyClick = (comment) => {
        setReplyingTo({ id: comment.id, authorName: comment.author.fullName });
    };

    const handleCommentAdded = (postId) => {
        // Reload comment list so the new comment appears immediately
        fetchComments();
        // Also notify the parent (e.g. to update comment count badge)
        if (onCommentAdded) onCommentAdded(postId);
    };

    const handleDeleteComment = (commentId) => {
        setCommentToDelete(commentId);
        setConfirmDeleteOpen(true);
        setActiveDropdown(null);
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            await commentService.deleteComment(commentToDelete);
            fetchComments();
        } catch (error) {
            console.error("Failed to delete comment", error);
        } finally {
            setConfirmDeleteOpen(false);
            setCommentToDelete(null);
        }
    };

    const handleShare = () => {
        try {
            navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            toast.success("Đã sao chép liên kết!");
        } catch (err) {
            toast.error("Không thể sao chép liên kết");
        }
    };

    if (!post || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-md transition-all">
            <div className="bg-surface-container-lowest w-full max-w-2xl h-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
                <PostDetailHeader
                    author={post.author}
                    createdAt={post.createdAt}
                    location={post.location}
                    onClose={onClose}
                    goToProfile={goToProfile}
                />

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <PostDetailBody content={post.content} title={post.title} />
                    <PostDetailMedia
                        medias={post.medias}
                        onImageClick={(index) => onImageClick && onImageClick(post, index)}
                    />
                    <PostDetailStats
                        reactionCount={localReactionCount}
                        commentCount={post.commentCount || comments.length}
                        onLikesClick={() => {
                            if (localReactionCount > 0) setIsLikeListOpen(true);
                        }}
                    />
                    <PostDetailActions
                        reactedByMe={localReactedByMe}
                        onToggleLike={handleToggleLike}
                        handleShare={handleShare}
                    />

                    <PostDetailCommentList>
                        {loadingComments ? (
                            <p className="text-sm text-on-surface-variant px-5 font-medium">Đang tải bình luận...</p>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <PopupCommentItem
                                    key={comment.id}
                                    comment={comment}
                                    depth={0}
                                    activeDropdown={activeDropdown}
                                    setActiveDropdown={setActiveDropdown}
                                    onReply={handleReplyClick}
                                    onDelete={handleDeleteComment}
                                    postAuthorId={post?.author?.id || post?.author?.userId}
                                >
                                    {replyingTo?.id === comment.id && (
                                        <div className="mt-1 mb-2 w-full box-border">
                                            <PopupCommentInput
                                                postId={post.id}
                                                replyingTo={replyingTo}
                                                setReplyingTo={setReplyingTo}
                                                onCommentAdded={handleCommentAdded}
                                                autoFocus={true}
                                            />
                                        </div>
                                    )}
                                </PopupCommentItem>
                            ))
                        ) : (
                            <p className="text-sm text-on-surface-variant px-5 font-medium">Chưa có bình luận nào.</p>
                        )}
                    </PostDetailCommentList>
                </div>

                <PopupCommentInput
                    postId={post.id}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    onCommentAdded={handleCommentAdded}
                />
            </div>

            <ConfirmDialog
                isOpen={confirmDeleteOpen}
                title="Xóa bình luận"
                message="Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmDeleteOpen(false);
                    setCommentToDelete(null);
                }}
            />

            <LikeListPopup
                isOpen={isLikeListOpen}
                onClose={() => setIsLikeListOpen(false)}
                targetId={post?.id}
                targetType="POST"
            />
        </div>
    );
};

export default PostDetailModal;
