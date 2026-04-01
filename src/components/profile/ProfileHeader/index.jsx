import React, { useRef, useState } from 'react';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import SendMessageModal from '@/components/messenger/SendMessageModal';
import ProfileCover from '@/components/profile/ProfileHeader/ProfileCover';
import ProfileAvatar from '@/components/profile/ProfileHeader/ProfileAvatar';
import ProfileInfo from '@/components/profile/ProfileHeader/ProfileInfo';

const ProfileHeader = ({
    profileUser,
    isOwner,
    onAvatarChange,
    onCoverChange,
    onFollowToggle,
    isFollowing,
    followLoading,
}) => {
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Send message modal state
    const [isSendMessageOpen, setSendMessageOpen] = useState(false);

    // Media viewer state
    const [isMediaViewerOpen, setMediaViewerOpen] = useState(false);
    const [mediaViewerMedias, setMediaViewerMedias] = useState([]);

    const openViewer = (src, alt) => {
        if (src) {
            setMediaViewerMedias([{ url: src, type: 'IMAGE' }]);
            setMediaViewerOpen(true);
        }
    };
    const closeViewer = () => setMediaViewerOpen(false);

    const handleAvatarFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onAvatarChange) onAvatarChange(file);
        e.target.value = '';
    };

    const handleCoverFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onCoverChange) onCoverChange(file);
        e.target.value = '';
    };

    const initials = profileUser?.fullName?.[0]?.toUpperCase() || '?';

    return (
        <>
            <div className="bg-white shadow-sm">
                <ProfileCover
                    profileUser={profileUser}
                    isOwner={isOwner}
                    coverInputRef={coverInputRef}
                    handleCoverFileChange={handleCoverFileChange}
                    openViewer={openViewer}
                />

                <div className="max-w-[1100px] mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 pt-0">
                        <ProfileAvatar
                            profileUser={profileUser}
                            isOwner={isOwner}
                            avatarInputRef={avatarInputRef}
                            handleAvatarFileChange={handleAvatarFileChange}
                            openViewer={openViewer}
                            initials={initials}
                        />

                        <ProfileInfo
                            profileUser={profileUser}
                            isOwner={isOwner}
                            isFollowing={isFollowing}
                            followLoading={followLoading}
                            onFollowToggle={onFollowToggle}
                            onSendMessage={() => setSendMessageOpen(true)}
                        />
                    </div>

                    <div className="border-t border-[#e4e6eb]" />
                </div>
            </div>

            <MediaCarouselViewer
                isOpen={isMediaViewerOpen}
                onClose={closeViewer}
                medias={mediaViewerMedias}
                initialIndex={0}
            />

            <SendMessageModal
                isOpen={isSendMessageOpen}
                onClose={() => setSendMessageOpen(false)}
                receiverId={profileUser?.id}
                receiverName={profileUser?.fullName || profileUser?.username}
                receiverAvatar={profileUser?.avatar?.url || null}
            />
        </>
    );
};

export default ProfileHeader;
