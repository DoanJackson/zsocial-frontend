import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import FeedPost from '@/components/feed/FeedPost';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import postService from '@/services/postService';
import { POST_PAGE_SIZE, SCROLL_THRESHOLD } from '@/constants/pagination';
import Header from '@/components/Header';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q') || '';
    const navigate = useNavigate();
    const location = useLocation();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);

    // Cursor stored as state so useCallback deps update correctly
    const [lastPostId, setLastPostId] = useState(null);

    // Component-level ref prevents concurrent requests across re-renders
    const loadingRef = useRef(false);

    // Media viewer
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerMedias, setViewerMedias] = useState([]);
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

    // ── Load one page ───────────────────────────────
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

    // ── Scroll listener + initial load ─────────────
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
        navigate(`/post/${post.id}`, { state: { backgroundLocation: location, post } });
    };

    const handleImageClick = (post, index) => {
        setViewerMedias(post.medias);
        setViewerIndex(index);
        setViewerOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container font-body">
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-6 max-w-2xl mx-auto min-h-screen flex flex-col space-y-8">
                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Empty keyword */}
                {!keyword.trim() && (
                    <div className="text-center py-20 text-on-surface-variant flex flex-col items-center">
                        <span className="material-symbols-outlined text-[64px] mb-4 opacity-40">manage_search</span>
                        <p className="text-lg font-medium">Nhập từ khóa để tìm kiếm bài viết</p>
                    </div>
                )}

                {/* Posts list */}
                <div className="space-y-8">
                    {posts.map((post, index) => (
                        <FeedPost
                            key={`${post.id}-${index}`}
                            post={post}
                            onCommentClick={handleCommentClick}
                            onImageClick={(i) => handleImageClick(post, i)}
                        />
                    ))}

                    {/* Loading state */}
                    {loading && (
                        <p className="text-center py-4 text-on-surface-variant font-medium">
                            Đang tải thêm kết quả...
                        </p>
                    )}

                    {/* End of results */}
                    {!loading && !hasMore && posts.length > 0 && (
                        <p className="text-center text-sm text-on-surface-variant font-medium py-4">
                            Bạn đã xem hết kết quả.
                        </p>
                    )}
                </div>

                {/* No results */}
                {!loading && keyword.trim() && posts.length === 0 && !hasMore && !error && (
                    <div className="text-center py-20 text-on-surface-variant flex flex-col items-center">
                        <span className="material-symbols-outlined text-[64px] mb-4 opacity-40">search_off</span>
                        <p className="text-lg font-medium">Không tìm thấy bài viết nào</p>
                        <p className="text-sm mt-1">Thử tìm với từ khóa khác nhé!</p>
                    </div>
                )}
            </main>

            {/* Media viewer */}
            <MediaCarouselViewer
                isOpen={viewerOpen}
                medias={viewerMedias}
                initialIndex={viewerIndex}
                onClose={() => setViewerOpen(false)}
            />
        </div>
    );
};

export default SearchResults;
