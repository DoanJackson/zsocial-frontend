import React, { useState, useEffect, useRef } from 'react';
import commentService from '../../../services/commentService';
import CommentItem from '../CommentItem';
import CommentInput from '../CommentInput';
import { timeAgo } from '../../../utils/timeAgo';
import { getDefaultAvatarUrl } from '../../../utils/avatarUtils';

const MediaViewerModal = ({ isOpen, onClose, post, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    // Fetch comments whenever post changes and modal is open
    const fetchComments = async () => {
        if (!post?.id) return;
        setLoadingComments(true);
        try {
            const res = await commentService.getCommentsByPostId(post.id);
            setComments(res.data?.content || []);
        } catch {
            // ignore
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

    if (!isOpen || !post) return null;

    const mediaList = post.images || [];
    const currentMedia = mediaList[currentIndex];
    const hasNext = mediaList.length > 1;

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này không?')) return;
        try {
            await commentService.deleteComment(commentId);
            fetchComments();
        } catch {
            // ignore
        } finally {
            setActiveDropdown(null);
        }
    };

    const handleCommentAdded = () => {
        fetchComments();
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-[2000] flex flex-col md:flex-row">
            {/* Close button */}
            <div
                className="absolute top-[10px] left-[10px] text-white text-[2rem] cursor-pointer z-[2001] w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={onClose}
            >
                &times;
            </div>

            <div className="flex flex-1 h-full overflow-hidden flex-col md:flex-row w-full">
                {/* ── Media panel ── */}
                <div className="flex flex-1 items-center justify-center relative bg-black md:h-full h-[60%] w-full">
                    {hasNext && (
                        <button
                            className="absolute left-[20px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white border-none text-[2rem] p-4 cursor-pointer rounded-full w-[60px] h-[60px] flex items-center justify-center transition-colors duration-200 z-10"
                            onClick={handlePrev}
                        >
                            &#10094;
                        </button>
                    )}

                    <div className="w-full h-full flex items-center justify-center">
                        {currentMedia?.endsWith('.mp4') ? (
                            <video src={currentMedia} controls autoPlay className="max-w-full max-h-[100vh] object-contain" />
                        ) : (
                            <img src={currentMedia} alt={`Post media ${currentIndex}`} className="max-w-full max-h-[100vh] object-contain" />
                        )}
                    </div>

                    {hasNext && (
                        <button
                            className="absolute right-[20px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white border-none text-[2rem] p-4 cursor-pointer rounded-full w-[60px] h-[60px] flex items-center justify-center transition-colors duration-200 z-10"
                            onClick={handleNext}
                        >
                            &#10095;
                        </button>
                    )}
                </div>

                {/* ── Side panel: post info + comments ── */}
                <div className="w-full md:w-[380px] bg-white flex flex-col border-t md:border-t-0 md:border-l border-[#ddd] h-[40%] md:h-full shrink-0">
                    {/* Post author row */}
                    <div className="p-4 border-b border-[#eee] flex items-center gap-3">
                        <img
                            src={post.avatar || getDefaultAvatarUrl()}
                            alt={post.user}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-[0.95rem] text-[#050505]">{post.user}</span>
                            <span className="text-[0.8rem] text-[#65676b]">{post.time ? timeAgo(post.time) : ''}</span>
                        </div>
                    </div>

                    {/* Post content */}
                    {post.content && (
                        <div className="px-4 py-2 text-[0.93rem] text-[#050505] whitespace-pre-wrap border-b border-[#eee]">
                            {post.content}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between items-center px-4 py-2 text-[#65676b] text-[0.85rem] border-b border-[#eee]">
                        <span className="flex items-center gap-1">
                            <span className="bg-[#1877f2] text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[0.65rem]">👍</span>
                            {post.likes}
                        </span>
                        <span>{post.comments} bình luận</span>
                    </div>

                    {/* Comments list */}
                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        {loadingComments ? (
                            <div className="space-y-3 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-2 animate-pulse">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                                        <div className="flex-1 space-y-1 pt-1">
                                            <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            <div className="h-2 bg-gray-100 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : comments.length > 0 ? (
                            <>
                                {comments.map(comment => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        activeDropdown={activeDropdown}
                                        setActiveDropdown={setActiveDropdown}
                                        onReply={(c) => setReplyingTo({ id: c.id, authorName: c.author.fullName })}
                                        onDelete={handleDeleteComment}
                                    />
                                ))}
                                <div ref={commentsEndRef} />
                            </>
                        ) : (
                            <p className="text-[#65676b] text-sm text-center mt-4">Chưa có bình luận nào.</p>
                        )}
                    </div>

                    {/* Comment input */}
                    <div className="px-4 border-t border-[#eee]">
                        <CommentInput
                            postId={post.id}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            onCommentAdded={handleCommentAdded}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaViewerModal;
