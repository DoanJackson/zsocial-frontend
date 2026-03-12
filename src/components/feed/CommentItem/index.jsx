import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostImages from '../PostImages';
import { timeAgo } from '../../../utils/timeAgo';
import commentService from '../../../services/commentService';
import { getDefaultAvatarUrl } from '../../../utils/avatarUtils';

const CommentItem = ({
    comment,
    depth = 0,
    activeDropdown,
    setActiveDropdown,
    onReply,
    onDelete,
    children
}) => {
    const navigate = useNavigate();
    const [repliesOpen, setRepliesOpen] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    const goToProfile = () => {
        if (comment.author?.userId) navigate(`/profile/${comment.author.userId}`);
    };

    const handleToggleReplies = async () => {
        if (repliesOpen) {
            setRepliesOpen(false);
            return;
        }
        setLoadingReplies(true);
        try {
            const res = await commentService.getReplies(comment.id);
            setReplies(res.data?.content || []);
            setRepliesOpen(true);
        } catch {
            // silently fail — button still toggles
        } finally {
            setLoadingReplies(false);
        }
    };

    const hasReplies = comment.childCommentCount != null; // null → hide button

    return (
        <div className="flex flex-col gap-2 mb-[6px] relative group">
            <div className="flex gap-2">
                <img
                    src={comment.author.avatar?.url || getDefaultAvatarUrl()}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer"
                    onClick={goToProfile}
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center flex-row max-w-[85%] gap-2 mb-[2px]">
                        <div className="bg-[#f0f2f5] rounded-[18px] py-[0.4rem] px-[0.8rem] inline-block break-words">
                            <span
                                className="font-semibold text-[0.85rem] block text-[#050505] cursor-pointer hover:underline"
                                onClick={goToProfile}
                            >
                                {comment.author.fullName}
                            </span>
                            <p className="m-0 text-[0.9rem] leading-[1.4] text-[#050505]">{comment.content}</p>
                        </div>

                        <div className={`relative flex items-center opacity-0 transition-opacity duration-200 shrink-0 group-hover:opacity-100 hover:opacity-100 ${activeDropdown === comment.id ? 'opacity-100' : ''}`}>
                            <button
                                className="bg-transparent border-none outline-none text-[1.2rem] leading-[0.5] font-bold cursor-pointer px-2 text-[#65676b] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#e4e6eb] transition-colors"
                                onClick={() => setActiveDropdown(activeDropdown === comment.id ? null : comment.id)}
                            >
                                ...
                            </button>
                            {activeDropdown === comment.id && (
                                <div className="absolute top-full left-0 bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.2)] z-[100] min-w-[150px] overflow-hidden flex flex-col">
                                    {localStorage.getItem('userId') === String(comment.author.id) && (
                                        <div className="px-4 py-[0.6rem] cursor-pointer text-[0.9rem] text-[#050505] font-medium transition-colors duration-200 hover:bg-[#f0f2f5]" onClick={() => onDelete(comment.id)}>
                                            Xóa
                                        </div>
                                    )}
                                    <div className="px-4 py-[0.6rem] cursor-pointer text-[0.9rem] text-[#050505] font-medium transition-colors duration-200 hover:bg-[#f0f2f5]">Ẩn bình luận</div>
                                    <div className="px-4 py-[0.6rem] cursor-pointer text-[0.9rem] text-[#050505] font-medium transition-colors duration-200 hover:bg-[#f0f2f5]">Báo cáo bình luận</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {comment.medias && comment.medias.length > 0 && (
                        <div className="mt-2 max-w-[300px] w-full rounded-[12px] overflow-hidden [&_.post-detail-images-wrapper]:!max-w-full">
                            <PostImages medias={comment.medias} />
                        </div>
                    )}

                    <div className="flex gap-[12px] ml-[12px] mt-[2px] text-[0.75rem] font-bold text-[#65676b]">
                        <span className="font-normal">{timeAgo(comment.createdAt)}</span>
                        <button className="bg-transparent border-none p-0 text-[#65676b] font-bold cursor-pointer hover:underline">Thích</button>
                        <button
                            className="bg-transparent border-none p-0 text-[#65676b] font-bold cursor-pointer hover:underline"
                            onClick={() => onReply(comment)}
                        >
                            Trả lời
                        </button>
                        {/* <button className="bg-transparent border-none p-0 text-[#65676b] font-bold cursor-pointer hover:underline">Chia sẻ</button> */}
                    </div>

                    {/* View / hide replies button */}
                    {hasReplies && (
                        <button
                            className="mt-1 ml-[12px] flex items-center gap-1 text-[0.8rem] font-bold text-[#65676b] bg-transparent border-none p-0 cursor-pointer hover:underline w-fit"
                            onClick={handleToggleReplies}
                            disabled={loadingReplies}
                        >
                            {loadingReplies ? (
                                <span className="animate-pulse">Đang tải...</span>
                            ) : repliesOpen ? (
                                <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
                                    </svg>
                                    Ẩn phản hồi
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {comment.childCommentCount > 0
                                        ? `Xem ${comment.childCommentCount} phản hồi`
                                        : 'Xem phản hồi'}
                                </>
                            )}
                        </button>
                    )}

                    {/* Replies list */}
                    {repliesOpen && replies.length > 0 && (
                        <div className="mt-2 ml-4 border-l-2 border-[#e4e6eb] pl-3 flex flex-col gap-2">
                            {replies.map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
                                    activeDropdown={activeDropdown}
                                    setActiveDropdown={setActiveDropdown}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
};

export default CommentItem;
