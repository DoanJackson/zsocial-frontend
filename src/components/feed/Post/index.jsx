import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostImages from '../PostImages';
import { timeAgo } from '../../../utils/timeAgo';
import { getDefaultAvatarUrl } from '../../../utils/avatarUtils';


const Post = ({ post, onCommentClick, onImageClick, isOwner = false, onDelete }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const goToProfile = () => {
        if (post.author?.userId) navigate(`/profile/${post.author.userId}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    const handleDeleteClick = () => {
        setMenuOpen(false);
        if (onDelete) onDelete(post);
    };

    return (
        <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] mb-6 overflow-hidden">
            <div className="flex items-center px-4 pt-4 pb-2 gap-2">
                <img
                    src={post.author.avatar?.url || getDefaultAvatarUrl()}
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer"
                    onClick={goToProfile}
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <h4
                        className="m-0 text-base font-semibold cursor-pointer hover:underline"
                        onClick={goToProfile}
                    >
                        {post.author.fullName}
                    </h4>
                    <span className="text-[0.8rem] text-[#65676b]">{timeAgo(post.createdAt)}</span>
                </div>

                {/* 3-dot menu — only visible to owner */}
                {isOwner && (
                    <div className="relative" ref={menuRef}>
                        <button
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[#65676b] hover:bg-[#f0f2f5] transition-colors cursor-pointer border-none bg-transparent text-xl font-bold"
                            onClick={() => setMenuOpen(prev => !prev)}
                            title="Tùy chọn"
                        >
                            ···
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.2)] z-50 min-w-[180px] overflow-hidden">
                                <button
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer border-none bg-transparent"
                                    onClick={handleDeleteClick}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Xóa bài viết
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="px-4 text-base leading-relaxed mb-3">
                {post.title && <h3 className="font-bold text-lg mb-2">{post.title}</h3>}
                <p className="m-0 whitespace-pre-wrap">{post.content}</p>
            </div>

            <PostImages
                medias={post.medias}
                onImageClick={(index) => onImageClick(index)}
            />

            <div className="px-4 py-3 flex justify-between text-[#65676b] text-[0.9rem] border-b border-[#eee]">
                <span>0 lượt thích</span>
                <span>{post.commentCount} bình luận</span>
            </div>

            <div className="flex p-2">
                <button className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200">
                    👍 Thích
                </button>
                <button
                    className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200"
                    onClick={() => onCommentClick(post)}
                >
                    💬 Bình luận
                </button>
                <button className="flex-1 bg-transparent border-none text-[#65676b] font-semibold py-2 px-1 rounded flex justify-center items-center gap-2 hover:bg-[#f0f2f5] cursor-pointer transition-colors duration-200">
                    📤 Chia sẻ
                </button>
            </div>
        </div>
    );
};

export default Post;
