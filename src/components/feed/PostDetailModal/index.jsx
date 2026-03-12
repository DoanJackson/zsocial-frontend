import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Modal';
import PostImages from '../PostImages';
import commentService from '../../../services/commentService';
import CommentItem from '../CommentItem';
import CommentInput from '../CommentInput';
import { timeAgo } from '../../../utils/timeAgo';
import { getDefaultAvatarUrl } from '../../../utils/avatarUtils';

const PostDetailModal = ({ isOpen, onClose, post, onImageClick, onCommentAdded }) => {
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

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
            fetchComments();
        } else {
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

    if (!post) return null;

    const handleDeleteComment = async (commentId) => {
        try {
            if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
                await commentService.deleteComment(commentId);
                fetchComments();
            }
        } catch (error) {
            console.error("Failed to delete comment", error);
        } finally {
            setActiveDropdown(null);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${post.author.fullName}'s Post`}
            footer={
                <div className="px-4">
                    <CommentInput
                        postId={post.id}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        onCommentAdded={handleCommentAdded}
                    />
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="border-b border-[#eee] pb-4">
                    <div className="flex items-center px-4 pt-2 pb-2 gap-2">
                        <img
                            src={post.author.avatar?.url || getDefaultAvatarUrl()}
                            alt={post.author.username}
                            className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer"
                            onClick={goToProfile}
                        />
                        <div className="flex flex-col">
                            <h4
                                className="m-0 text-base font-semibold cursor-pointer hover:underline"
                                onClick={goToProfile}
                            >
                                {post.author.fullName}
                            </h4>
                            <span className="text-[0.8rem] text-[#65676b]">{timeAgo(post.createdAt)}</span>
                        </div>
                    </div>

                    <div className="px-4 text-[0.95rem] leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</div>

                    <div className="post-detail-images-wrapper">
                        <PostImages
                            medias={post.medias}
                            onImageClick={(index) => onImageClick && onImageClick(post, index)}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center px-4 py-2 text-[#65676b] text-[0.9rem] border-b border-[#ced0d4]">
                    <span className="flex items-center">
                        <span className="bg-[#1877f2] text-white rounded-full p-[2px] text-[0.7rem] mr-1 w-[18px] h-[18px] flex justify-center items-center">👍</span> {post.likeCount || 0}
                    </span>
                    <span>
                        {post.commentCount || comments.length || 0} bình luận
                    </span>
                </div>

                <div className="flex px-4 py-1 mb-2 border-b border-[#ced0d4]">
                    <button className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200">
                        <span className="text-[1.1rem]">👍</span> Thích
                    </button>
                    <button className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200">
                        <span className="text-[1.1rem]">💬</span> Bình luận
                    </button>
                    <button className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200">
                        <span className="text-[1.1rem]">📤</span> Gửi
                    </button>
                </div>

                <div className="flex flex-col">
                    <div className="px-4 mb-2">
                        <span className="font-semibold text-[#65676b] cursor-pointer dropdown-arrow">Phù hợp nhất ▾</span>
                    </div>

                    <div className="mt-2 px-4 pb-2">
                        {loadingComments ? (
                            <p>Đang tải bình luận...</p>
                        ) : comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    depth={0}
                                    activeDropdown={activeDropdown}
                                    setActiveDropdown={setActiveDropdown}
                                    onReply={handleReplyClick}
                                    onDelete={handleDeleteComment}
                                >
                                    {replyingTo?.id === comment.id && (
                                        <div className="mt-1 mb-2 w-full box-border">
                                            <CommentInput
                                                postId={post.id}
                                                replyingTo={replyingTo}
                                                setReplyingTo={setReplyingTo}
                                                onCommentAdded={handleCommentAdded}
                                                autoFocus={true}
                                            />
                                        </div>
                                    )}
                                </CommentItem>
                            ))
                        ) : (
                            <p>Chưa có bình luận nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetailModal;
