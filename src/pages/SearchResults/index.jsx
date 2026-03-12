import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import Post from '../../components/feed/Post';
import PostDetailModal from '../../components/feed/PostDetailModal';
import MediaViewerModal from '../../components/feed/MediaViewerModal';
import postService from '../../services/postService';
import { POST_PAGE_SIZE, SCROLL_THRESHOLD } from '../../constants/pagination';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') || '';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    // Cursor stored as state so useCallback deps update correctly (mirrors Feed's lastPostId)
    const [lastPostId, setLastPostId] = useState(null);

    // Component-level ref prevents concurrent requests across re-renders (same as Feed)
    const loadingRef = useRef(false);

    // Post detail modal
    const [selectedPost, setSelectedPost] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    // Media viewer
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerPost, setViewerPost] = useState(null);
    const [viewerIndex, setViewerIndex] = useState(0);

    // ── Reset all feed state when keyword changes ──────────────────────────────
    useEffect(() => {
        loadingRef.current = false;
        setPosts([]);
        setLastPostId(null);
        setHasMore(!!keyword.trim());
        setError(null);
        setLoading(false);
    }, [keyword]);

    // ── Load one page (mirrors Feed's loadPosts) ───────────────────────────────
    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore || !keyword.trim()) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            const res = await postService.searchPosts(keyword, POST_PAGE_SIZE, lastPostId);
            const { content = [], nextCursor, hasNext } = res.data ?? {};

            if (content.length > 0) {
                setPosts(prev => [...prev, ...content]);
                setLastPostId(nextCursor ?? null);
            }
            if (!hasNext) setHasMore(false);
        } catch {
            setError('Không thể tải kết quả tìm kiếm. Vui lòng thử lại.');
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [keyword, lastPostId, hasMore]);

    // ── Scroll listener + initial load (identical pattern to Feed) ─────────────
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - SCROLL_THRESHOLD
            ) {
                loadMore();
            }
        };

        handleScroll(); // trigger first load if page is short

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    const handleCommentClick = (post) => {
        setSelectedPost(post);
        setDetailOpen(true);
    };

    const handleImageClick = (post, index) => {
        setViewerPost({
            ...post,
            user: post.author?.fullName,
            avatar: post.author?.avatar?.url,
            time: post.createdAt,
            likes: post.likeCount || 0,
            comments: post.commentCount || 0,
            images: post.medias?.map(m => m.url || m),
        });
        setViewerIndex(index);
        setViewerOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5]">
            <Header variant="feed" />

            <div className="max-w-2xl mx-auto pt-6 px-4 pb-10">
                {/* Heading */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#1877f2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Kết quả tìm kiếm cho &ldquo;<span className="text-[#1877f2]">{keyword}</span>&rdquo;
                    </h2>
                    {!loading && posts.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">Đã tải {posts.length} bài viết</p>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Empty keyword */}
                {!keyword.trim() && (
                    <div className="text-center py-20 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="text-lg font-medium">Nhập từ khóa để tìm kiếm bài viết</p>
                    </div>
                )}

                {/* Posts list */}
                {posts.map((post, index) => (
                    <Post
                        key={`${post.id}-${index}`}
                        post={post}
                        onCommentClick={handleCommentClick}
                        onImageClick={(i) => handleImageClick(post, i)}
                    />
                ))}

                {/* Loading skeleton */}
                {loading && (
                    <div className="space-y-4 mt-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                        <div className="h-2 bg-gray-100 rounded w-1/4" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No results */}
                {!loading && keyword.trim() && posts.length === 0 && !hasMore && !error && (
                    <div className="text-center py-20 text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">Không tìm thấy bài viết nào</p>
                        <p className="text-sm mt-1">Thử tìm với từ khóa khác nhé!</p>
                    </div>
                )}

                {/* End of results */}
                {!loading && !hasMore && posts.length > 0 && (
                    <p className="text-center text-sm text-gray-400 py-4">Bạn đã xem hết kết quả.</p>
                )}
            </div>

            {/* Post detail modal */}
            <PostDetailModal
                isOpen={detailOpen}
                post={selectedPost}
                onClose={() => { setDetailOpen(false); setSelectedPost(null); }}
                onImageClick={handleImageClick}
            />

            {/* Media viewer */}
            <MediaViewerModal
                isOpen={viewerOpen}
                post={viewerPost}
                initialIndex={viewerIndex}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
};

export default SearchResults;
