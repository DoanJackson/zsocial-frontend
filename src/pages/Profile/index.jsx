import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '@/components/Header';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import CreatePostBox from '@/components/profile/CreatePostBox';
import UserPostsList from '@/components/profile/UserPostsList';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/userService';

const Profile = () => {
    const { userId } = useParams();
    const { user, login } = useAuth();

    const isOwner = String(user?.userId) === String(userId);

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Follow state
    // Note: API doesn't explicitly return isFollowing in UserDetailResponse, 
    // so we track it locally (starts as false, user can toggle)
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    // Modals
    const [isCreatePostOpen, setCreatePostOpen] = useState(false);

    // Used to force-refresh the posts list after creating a new post
    const [postListKey, setPostListKey] = useState(0);

    /* ── Fetch Profile ── */
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                let response;
                if (isOwner) {
                    response = await userService.getMe();
                } else {
                    response = await userService.getUserById(userId);
                }
                if (response.success) {
                    setProfileUser(response.data);
                } else {
                    toast.error('Không thể tải thông tin người dùng');
                }
            } catch (err) {
                console.error(err);
                toast.error('Lỗi kết nối server');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchProfile();
    }, [userId, isOwner]);

    /* ── Avatar Update ── */
    const handleAvatarChange = async (file) => {
        try {
            const response = await userService.updateAvatar(file);
            if (response.success) {
                const newAvatar = response.data; // MediaBaseResponse { id, url, type }
                setProfileUser(prev => ({ ...prev, avatar: newAvatar }));
                // Update AuthContext so Header also reflects the new avatar
                login({ ...user, avatar: newAvatar.url });
                toast.success('Cập nhật ảnh đại diện thành công!');
            } else {
                toast.error(response.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi kết nối server');
        }
    };

    /* ── Cover Update ── */
    const handleCoverChange = async (file) => {
        try {
            const response = await userService.updateCover(file);
            if (response.success) {
                const newCover = response.data;
                setProfileUser(prev => ({ ...prev, cover: newCover }));
                toast.success('Cập nhật ảnh bìa thành công!');
            } else {
                toast.error(response.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi kết nối server');
        }
    };

    /* ── Follow / Unfollow ── */
    const handleFollowToggle = async () => {
        if (followLoading) return;
        setFollowLoading(true);
        try {
            if (isFollowing) {
                await userService.unfollowUser(userId);
                setIsFollowing(false);
                toast.success('Đã bỏ theo dõi');
            } else {
                await userService.followUser(userId);
                setIsFollowing(true);
                toast.success('Đã theo dõi');
            }
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra, thử lại sau');
        } finally {
            setFollowLoading(false);
        }
    };

    const handlePostCreated = () => {
        setCreatePostOpen(false);
        // Refresh posts list by changing key
        setPostListKey(k => k + 1);
    };

    /* ── Loading State ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f2f5]">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block w-12 h-12 border-4 border-[#1877f2] border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-[#65676b]">Đang tải trang cá nhân...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] font-['Inter',system-ui,Avenir,Helvetica,Arial,sans-serif] pt-[56px]">
            <Header />

            {/* Profile Header (cover + avatar + info + actions) */}
            <ProfileHeader
                profileUser={profileUser}
                isOwner={isOwner}
                onAvatarChange={handleAvatarChange}
                onCoverChange={handleCoverChange}
                onFollowToggle={handleFollowToggle}
                isFollowing={isFollowing}
                followLoading={followLoading}
            />

            {/* ── Main 2-Column Layout ── */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-6 mt-6 flex gap-4 items-start">

                {/* Left Sidebar */}
                <ProfileSidebar profileUser={profileUser} isOwner={isOwner} />

                {/* Main Content */}
                <main className="flex-1 min-w-0 flex flex-col gap-4">

                    {/* Create Post (owner only) */}
                    {isOwner && (
                        <CreatePostBox
                            profileUser={profileUser}
                            onOpen={() => setCreatePostOpen(true)}
                        />
                    )}

                    {/* Posts */}
                    <UserPostsList
                        key={postListKey}
                        userId={userId}
                        isOwner={isOwner}
                        onCreatePost={() => setCreatePostOpen(true)}
                    />
                </main>
            </div>

            {/* Create Post Modal (owner only) */}
            {isOwner && (
                <CreatePostModal
                    isOpen={isCreatePostOpen}
                    onClose={() => setCreatePostOpen(false)}
                    onSubmit={handlePostCreated}
                    userAvatar={profileUser?.avatar?.url || null}
                    userName={profileUser?.fullName || user?.fullName}
                />
            )}
        </div>
    );
};

export default Profile;
