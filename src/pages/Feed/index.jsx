import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import CreatePostModal from '@/components/feed/CreatePostModal';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import postService from '@/services/postService';
import { POST_PAGE_SIZE, SCROLL_THRESHOLD } from '@/constants/pagination';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

// New Stitch-styled components
import FeedSidebar from '@/components/feed/FeedSidebar';
import CreatePostBox from '@/components/feed/CreatePostBox';
import FeedPost from '@/components/feed/FeedPost';
import FeedRightPanel from '@/components/feed/FeedRightPanel';

const Feed = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
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
    const [isMediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [mediaViewerMedias, setMediaViewerMedias] = useState([]);
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
    };

    const openPostDetail = (post) => {
        navigate(`/post/${post.id}`, { state: { backgroundLocation: location, post } });
    };

    const handleImageClick = (post, index) => {
        setMediaViewerMedias(post.medias);
        setInitialMediaIndex(index);
        setMediaViewerOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container font-body">
            <Header />

            <main className="pt-24 pb-12 px-4 md:px-6 max-w-[1440px] mx-auto min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Column: Navigation & Communities */}
                    <FeedSidebar />

                    {/* Center Column: Feed & Creation */}
                    <div className="col-span-1 md:col-span-6 space-y-8">

                        {/* Create Post Box */}
                        <CreatePostBox user={user} onOpen={() => setCreateModalOpen(true)} />

                        {/* Posts List */}
                        <div className="space-y-8">
                            {posts.map((post, index) => (
                                <FeedPost
                                    key={`${post.id}-${index}`}
                                    post={post}
                                    onCommentClick={openPostDetail}
                                    onImageClick={(imgIndex) => handleImageClick(post, imgIndex)}
                                />
                            ))}
                            {loading && (
                                <p className="text-center py-4 text-on-surface-variant font-medium">
                                    Đang tải thêm bài viết...
                                </p>
                            )}
                            {!hasMore && (
                                <p className="text-center py-4 text-on-surface-variant font-medium">
                                    Bạn đã xem hết bài viết.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Trends & Suggestions */}
                    <FeedRightPanel />

                </div>
            </main>

            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handlePostSubmit}
                userAvatar={user?.avatar || null}
            />

            <MediaCarouselViewer
                isOpen={isMediaViewerOpen}
                onClose={() => setMediaViewerOpen(false)}
                medias={mediaViewerMedias}
                initialIndex={initialMediaIndex}
            />
        </div>
    );
};

export default Feed;
