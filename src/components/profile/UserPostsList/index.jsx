import React, { useState, useEffect } from 'react';
import FeedPost from '@/components/feed/FeedPost';
import PostDetailModal from '@/components/feed/PostDetailModal';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import ConfirmDialog from '@/components/ConfirmDialog';
import postService from '@/services/postService';
import { toast } from 'react-toastify';
import { POST_PAGE_SIZE, SCROLL_THRESHOLD } from '@/constants/pagination';

/**
 * Infinite-scroll post list for a user's profile page.
 *
 * Single combined effect (reset + scroll) with closure-local state prevents
 * React StrictMode from firing double API calls: run-1's `ignored` flag is
 * set to true by its own cleanup, so its result is discarded; run-2 applies
 * the result normally. In production (no StrictMode) only one run occurs.
 */
const UserPostsList = ({ userId, isOwner, onCreatePost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [sortDirection, setSortDirection] = useState('DESC');

    const [selectedPost, setSelectedPost] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isMediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [mediaViewerMedias, setMediaViewerMedias] = useState([]);
    const [initialMediaIndex, setInitialMediaIndex] = useState(0);
    const [pendingDeletePost, setPendingDeletePost] = useState(null);

    /* ── Single combined effect: reset + load + scroll ── */
    useEffect(() => {
        if (!userId) return;

        // Closure-local state — isolated per effect invocation.
        // StrictMode: run-1's `ignored` becomes true on cleanup; run-2 is fresh.
        let ignored = false;
        let isLoading = false;
        let currentPage = 0;
        let localHasMore = true;

        setPosts([]);
        setHasMore(true);
        setLoading(false);

        const doLoad = async () => {
            if (isLoading || !localHasMore || ignored) return;
            isLoading = true;
            setLoading(true);
            try {
                const response = await postService.getUserPosts(
                    userId, currentPage, POST_PAGE_SIZE, 'id', sortDirection,
                );
                if (ignored) return;
                const { content, totalPages } = response.data;
                if (content && content.length > 0) {
                    setPosts(prev => [...prev, ...content]);
                    currentPage++;
                    if (currentPage >= totalPages) {
                        localHasMore = false;
                        setHasMore(false);
                    }
                } else {
                    localHasMore = false;
                    setHasMore(false);
                }
            } catch {
                if (!ignored) toast.error('Không thể tải bài viết');
            } finally {
                isLoading = false;
                if (!ignored) setLoading(false);
            }
        };

        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - SCROLL_THRESHOLD
            ) {
                doLoad();
            }
        };

        handleScroll(); // initial load if page isn't full yet
        window.addEventListener('scroll', handleScroll);
        return () => {
            ignored = true;
            window.removeEventListener('scroll', handleScroll);
        };
    }, [userId, sortDirection]);

    const handleSortChange = (dir) => {
        if (dir === sortDirection) return;
        setSortDirection(dir);
    };

    /* ── Modal helpers ── */
    const openPostDetail = (post) => { setSelectedPost(post); setDetailModalOpen(true); };
    const closePostDetail = () => { setSelectedPost(null); setDetailModalOpen(false); };

    const handleImageClick = (post, index) => {
        setMediaViewerMedias(post.medias);
        setInitialMediaIndex(index);
        setMediaViewerOpen(true);
    };

    const handleCommentAdded = (postId) => {
        setPosts(current => current.map(p =>
            p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
        ));
        if (selectedPost?.id === postId) {
            setSelectedPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
        }
    };

    const handleDeletePost = (post) => setPendingDeletePost(post);

    const confirmDeletePost = async () => {
        if (!pendingDeletePost) return;
        try {
            await postService.deletePost(pendingDeletePost.id);
            setPosts(prev => prev.filter(p => p.id !== pendingDeletePost.id));
            toast.success('Đã xóa bài viết');
        } catch {
            toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
        } finally {
            setPendingDeletePost(null);
        }
    };

    return (
        <div>
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#050505]">Bài viết</h2>
                <div className="flex gap-2">
                    {['DESC', 'ASC'].map((dir) => (
                        <button
                            key={dir}
                            onClick={() => handleSortChange(dir)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${sortDirection === dir
                                ? 'bg-[#1877f2] text-white'
                                : 'bg-[#e4e6eb] text-[#050505] hover:bg-[#d8dadf]'
                                }`}
                        >
                            {dir === 'DESC' ? 'Mới nhất' : 'Cũ nhất'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Post list */}
            {posts.length === 0 && !loading ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-[#65676b]">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#bcc0c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium">Chưa có bài viết nào</p>
                    {isOwner && (
                        <button
                            onClick={onCreatePost}
                            className="mt-4 px-5 py-2 bg-[#1877f2] text-white rounded-lg font-medium hover:bg-[#166fe5] transition-colors cursor-pointer"
                        >
                            Tạo bài viết đầu tiên
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {posts.map((post, idx) => (
                        <FeedPost
                            key={`${post.id}-${idx}`}
                            post={post}
                            isOwner={isOwner}
                            onDelete={handleDeletePost}
                            onCommentClick={openPostDetail}
                            onImageClick={(imgIndex) => handleImageClick(post, imgIndex)}
                        />
                    ))}
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="text-center py-6">
                    <div className="inline-block w-8 h-8 border-4 border-[#1877f2] border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* End of feed */}
            {!hasMore && posts.length > 0 && (
                <div className="text-center py-5 text-[#65676b] font-medium text-sm">
                    Bạn đã xem hết bài viết.
                </div>
            )}

            {/* Modals */}
            <PostDetailModal
                isOpen={isDetailModalOpen}
                onClose={closePostDetail}
                post={selectedPost}
                onImageClick={handleImageClick}
                onCommentAdded={handleCommentAdded}
            />
            <MediaCarouselViewer
                isOpen={isMediaViewerOpen}
                onClose={() => setMediaViewerOpen(false)}
                medias={mediaViewerMedias}
                initialIndex={initialMediaIndex}
            />
            <ConfirmDialog
                isOpen={!!pendingDeletePost}
                title="Xóa bài viết"
                message="Bạn có chắc muốn xóa bài viết này không? Hành động này không thể hoàn tác."
                confirmLabel="Xóa"
                variant="danger"
                onConfirm={confirmDeletePost}
                onCancel={() => setPendingDeletePost(null)}
            />
        </div>
    );
};

export default UserPostsList;
