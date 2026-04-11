import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import { timeAgo as calculateTimeAgo } from '@/utils/timeAgo';
import { toast } from 'react-toastify';

const FeedPost = ({ post, onCommentClick, onImageClick, isOwner, onDelete }) => {
    const navigate = useNavigate();
    const timeAgo = post.createdAt ? calculateTimeAgo(post.createdAt) : 'Vừa xong';

    const goToProfile = () => {
        if (post.author?.userId) navigate(`/profile/${post.author.userId}`);
    };

    // Derived states
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = post.content && (post.content.length > 250 || post.content.split('\n').length > 4);

    const authorName = post.author?.fullName || post.author?.username || 'Unknown User';
    const authorAvatar = post.author?.avatar?.url || null;
    const authorInitials = authorName[0]?.toUpperCase() || 'U';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
            toast.success("Đã sao chép liên kết!");
        } catch (err) {
            toast.error("Không thể sao chép liên kết");
        }
    };

    return (
        <article className="bg-surface-container-lowest rounded-lg shadow-[0_8px_32px_rgba(42,43,81,0.04)] overflow-hidden transition-transform">
            <div className="p-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/10 bg-[#f0f2f5] flex items-center justify-center cursor-pointer" onClick={goToProfile}>
                        {authorAvatar ? (
                            <img
                                alt={`${authorName} profile photo`}
                                className="w-full h-full object-cover"
                                src={authorAvatar}
                                loading='lazy'
                            />
                        ) : (
                            <span className="text-primary font-bold">{authorInitials}</span>
                        )}
                    </div>
                    <div>
                        <h4 className="font-headline font-bold text-on-background leading-none cursor-pointer hover:underline" onClick={goToProfile}>
                            {authorName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{timeAgo} • 🌍</p>
                    </div>
                </div>
                <div className="relative group/dots">
                    <button className="cursor-pointer text-slate-400 hover:text-on-background p-2 rounded-full hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined">more_horiz</span>
                    </button>
                    {isOwner && (
                        <div className="absolute right-0 top-10 w-32 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover/dots:block z-10 overflow-hidden">
                            <button
                                className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors cursor-pointer"
                                onClick={() => onDelete && onDelete(post)}
                            >
                                Xóa bài viết
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 pb-4">
                {post.title && (
                    <h3 className="text-lg font-bold text-on-background mb-2 leading-snug">
                        {post.title}
                    </h3>
                )}
                <p className={`text-on-surface leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongText ? 'line-clamp-4' : ''}`}>
                    {post.content}
                </p>
                {isLongText && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="mt-1 text-sm font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                    >
                        {isExpanded ? 'Thu gọn' : 'Xem thêm...'}
                    </button>
                )}
            </div>

            {/* Carousel Implementation */}
            {post.medias && post.medias.length > 0 && (
                <div className="relative group mx-2">
                    <ImageCarousel images={post.medias} onImageClick={onImageClick} aspectRatio="4/3" />
                </div>
            )}

            <div className="p-6 pt-2">
                <div className="flex items-center justify-between border-b border-surface-container pb-4">
                    <div className="flex items-center -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-2 ring-white">
                            <span
                                className="material-symbols-outlined text-[12px] text-white"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                thumb_up
                            </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center ring-2 ring-white">
                            <span
                                className="material-symbols-outlined text-[12px] text-white"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                favorite
                            </span>
                        </div>
                        <span className="pl-4 text-xs font-medium text-slate-500">
                            {post.likeCount || 0}
                        </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                        {post.commentCount || 0} bình luận • 0 chia sẻ
                    </span>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <button className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full hover:bg-primary/5 text-primary transition-colors font-bold text-sm">
                        <span className="material-symbols-outlined">thumb_up</span> Thích
                    </button>
                    <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors font-bold text-sm"
                        onClick={() => onCommentClick(post)}
                    >
                        <span className="material-symbols-outlined">chat_bubble</span> Bình luận
                    </button>
                    <button
                        className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors font-bold text-sm"
                        onClick={handleCopyLink}
                    >
                        <span className="material-symbols-outlined">share</span> Chia sẻ
                    </button>
                </div>
            </div>
        </article>
    );
};

export default FeedPost;
