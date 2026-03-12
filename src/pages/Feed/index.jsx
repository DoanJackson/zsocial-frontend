import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from '../../components/Header';
import Post from '../../components/feed/Post';
import CreatePostModal from '../../components/feed/CreatePostModal';
import PostDetailModal from '../../components/feed/PostDetailModal';
import MediaViewerModal from '../../components/feed/MediaViewerModal';
import postService from '../../services/postService';
import { POST_PAGE_SIZE, SCROLL_THRESHOLD } from '../../constants/pagination';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Feed Logic State
    const [feedType, setFeedType] = useState('FRIENDS'); // 'FRIENDS' or 'SUGGESTED'
    const [lastPostId, setLastPostId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Ref to track loading state synchronously to prevent race conditions
    const loadingRef = useRef(false);

    // Modal States
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isMediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [mediaViewerPost, setMediaViewerPost] = useState(null);
    const [initialMediaIndex, setInitialMediaIndex] = useState(0);

    // Load Posts Function
    const loadPosts = useCallback(async () => {
        // Check ref instead of state to prevent double calls
        if (loadingRef.current || !hasMore) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            let response;
            if (feedType === 'FRIENDS') {
                response = await postService.getFriendsFeed(POST_PAGE_SIZE, lastPostId);
            } else {
                response = await postService.getSuggestedFeed(POST_PAGE_SIZE, lastPostId);
            }

            const { content, nextCursor, hasNext } = response.data;

            if (content && content.length > 0) {
                setPosts(prevPosts => [...prevPosts, ...content]);
                setLastPostId(nextCursor);
            }

            if (!hasNext) {
                if (feedType === 'FRIENDS') {
                    // Switch to Suggested Feed
                    setFeedType('SUGGESTED');
                    setLastPostId(null); // Reset cursor for new feed
                    setHasMore(true); // Continue loading
                } else {
                    setHasMore(false); // No more posts in Suggested either
                }
            }
        } catch (error) {
            console.error("Error loading posts:", error);
            toast.error("Không thể tải bài viết mới");
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [feedType, lastPostId, hasMore]);

    // Consolidated Effect for Initial Load and Scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - SCROLL_THRESHOLD
            ) {
                loadPosts();
            }
        };

        // Trigger load immediately if page is not full (e.g. initial load)
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadPosts]);


    const handlePostSubmit = () => {
        setCreateModalOpen(false);
        // Optionally refresh feed or prepend new post
    };

    const openPostDetail = (post) => {
        setSelectedPost(post);
        setDetailModalOpen(true);
    };

    const closePostDetail = () => {
        setSelectedPost(null);
        setDetailModalOpen(false);
    };

    const handleImageClick = (post, index) => {
        setMediaViewerPost({
            ...post,
            user: post.author.fullName,
            avatar: post.author.avatar?.url,
            time: post.createdAt,
            likes: 0,
            comments: post.commentCount,
            images: post.medias.map(m => m.url || m)
        });
        setInitialMediaIndex(index);
        setMediaViewerOpen(true);
    };

    const handleCommentAdded = (postId) => {
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                return { ...p, commentCount: (p.commentCount || 0) + 1 };
            }
            return p;
        }));

        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#050505] font-['Inter',system-ui,Avenir,Helvetica,Arial,sans-serif]">
            <Header />

            <div className="max-w-[700px] mx-auto my-8 px-4 w-full box-border">
                {/* Create Post Trigger */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)] mb-6">
                    <div className="flex gap-4 mb-4 items-center">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full bg-[#ddd] object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0">
                                {user?.fullName?.[0]?.toUpperCase() || user?.userId?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div
                            className="flex-1 bg-[#f0f2f5] rounded-full py-3 px-5 text-base text-[#65676b] cursor-pointer flex items-center hover:bg-[#e4e6eb] transition-colors"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            Bạn đang nghĩ gì thế?
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#eee] pt-4">
                        <button
                            className="bg-transparent border-none text-[#65676b] font-semibold flex items-center gap-2 p-2 rounded hover:bg-[#f0f2f5] cursor-pointer transition-colors"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            📷 Ảnh/Video
                        </button>
                    </div>
                </div>

                {/* Posts List */}
                <div className="flex flex-col gap-4">
                    {posts.map((post, index) => (
                        <Post
                            key={`${post.id}-${index}`}
                            post={post}
                            onCommentClick={openPostDetail}
                            onImageClick={(imgIndex) => handleImageClick(post, imgIndex)}
                        />
                    ))}
                    {loading && <div className="text-center py-4 text-[#65676b] font-medium">Đang tải thêm bài viết...</div>}
                    {!hasMore && <div className="text-center py-4 text-[#65676b] font-medium">Bạn đã xem hết bài viết.</div>}
                </div>
            </div>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handlePostSubmit}
                userAvatar={user?.avatar || null}
            />

            <PostDetailModal
                isOpen={isDetailModalOpen}
                onClose={closePostDetail}
                post={selectedPost}
                onImageClick={handleImageClick}
                onCommentAdded={handleCommentAdded}
            />

            <MediaViewerModal
                isOpen={isMediaViewerOpen}
                onClose={() => setMediaViewerOpen(false)}
                post={mediaViewerPost}
                initialIndex={initialMediaIndex}
            />
        </div>
    );
};

export default Feed;
