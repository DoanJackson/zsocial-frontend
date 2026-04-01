import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PostDetailModal from '@/components/feed/PostDetailModal';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import postService from '@/services/postService';
import { toast } from 'react-toastify';

const PostDetailModalRoute = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { postId } = useParams();

    // The post is passed via router state from the feed
    const [post, setPost] = useState(location.state?.post || null);
    const [loading, setLoading] = useState(!location.state?.post);
    const fetchRef = React.useRef(false); // Ref to track if fetch has started

    const [isMediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [mediaViewerMedias, setMediaViewerMedias] = useState([]);
    const [initialMediaIndex, setInitialMediaIndex] = useState(0);

    useEffect(() => {
        if (!post && postId && !fetchRef.current) {
            fetchRef.current = true;
            const fetchPost = async () => {
                try {
                    setLoading(true);
                    const response = await postService.getPostById(postId);
                    if (response.data) {
                        setPost(response.data);
                    } else {
                        toast.error("Không tìm thấy bài viết");
                        navigate('/feed', { replace: true });
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                    toast.error("Không thể tải bài viết");
                    navigate('/feed', { replace: true });
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [postId, post, navigate]);

    const handleClose = () => {
        // Go back to the previous location (the Feed)
        // If there's no history (e.g. direct link), navigate(-1) might fail or go to an external site
        // A safer approach when state.backgroundLocation is absent is replacing with /feed
        if (location.state?.backgroundLocation) {
            navigate(-1);
        } else {
            navigate('/feed', { replace: true });
        }
    };

    const handleImageClick = (postData, index) => {
        setMediaViewerMedias(postData.medias);
        setInitialMediaIndex(index);
        setMediaViewerOpen(true);
    };

    if (loading) {
        // Optionally render a loading state inside a modal
        return null;
    }

    if (!post) return null;

    return (
        <>
            <PostDetailModal
                isOpen={true}
                onClose={handleClose}
                post={post}
                onImageClick={handleImageClick}
                onCommentAdded={(id) => {
                    // Could optionally sync with feed or just rely on local state
                }}
            />

            <MediaCarouselViewer
                isOpen={isMediaViewerOpen}
                onClose={() => setMediaViewerOpen(false)}
                medias={mediaViewerMedias}
                initialIndex={initialMediaIndex}
            />
        </>
    );
};

export default PostDetailModalRoute;
