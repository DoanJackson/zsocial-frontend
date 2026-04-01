import React, { useRef, useState } from 'react';
import MediaCarouselViewer from '@/components/MediaCarouselViewer';
import SendMessageModal from '@/components/messenger/SendMessageModal';

const formatDob = (dob) => {
    if (!dob) return null;
    const date = new Date(dob);
    if (isNaN(date)) return null;
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatGender = (gender) => {
    if (!gender) return null;
    const map = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' };
    return map[gender] || gender;
};

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
                {/* ── Cover Photo ── */}
                {/* center */}
                <div className="relative w-full h-[350px] md:h-[400px] bg-[#e4e6eb] group overflow-hidden">
                    {profileUser?.cover?.url ? (
                        <img
                            src={profileUser.cover.url}
                            alt="Ảnh bìa"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => openViewer(profileUser.cover.url, 'Ảnh bìa')}
                            title="Xem ảnh bìa"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#dce3f0] to-[#b8c9e8]" />
                    )}

                    {isOwner && (
                        <>
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-[#050505] font-semibold text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Chỉnh sửa ảnh bìa
                            </button>
                            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverFileChange} />
                        </>
                    )}
                </div>

                {/* ── Info Section ── */}
                <div className="max-w-[1100px] mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 pt-0">

                        {/* Avatar */}
                        <div className="relative flex-shrink-0 -mt-[72px]">
                            <div
                                className="w-[152px] h-[152px] rounded-full border-4 border-white bg-[#1877f2] overflow-hidden shadow-md cursor-pointer"
                                onClick={() => profileUser?.avatar?.url && openViewer(profileUser.avatar.url, 'Ảnh đại diện')}
                                title={profileUser?.avatar?.url ? 'Xem ảnh đại diện' : undefined}
                            >
                                {profileUser?.avatar?.url ? (
                                    <img
                                        src={profileUser.avatar.url}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#1877f2] flex items-center justify-center text-white text-5xl font-bold select-none">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            {isOwner && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
                                        className="absolute bottom-2 right-1 bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] rounded-full w-9 h-9 flex items-center justify-center shadow cursor-pointer transition-colors"
                                        title="Cập nhật ảnh đại diện"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} />
                                </>
                            )}
                        </div>

                        {/* Name, Stats & Actions */}
                        <div className="flex flex-1 flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 pt-2">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#050505] leading-tight">
                                    {profileUser?.fullName || profileUser?.username || 'Người dùng'}
                                </h1>
                                <p className="text-[#65676b] text-sm mt-0.5">@{profileUser?.username}</p>
                                <div className="flex gap-6 mt-2">
                                    <div>
                                        <span className="font-bold text-[#050505] text-base">{profileUser?.followerCount ?? 0}</span>
                                        <span className="text-[#65676b] text-sm ml-1">người theo dõi</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-[#050505] text-base">{profileUser?.followingCount ?? 0}</span>
                                        <span className="text-[#65676b] text-sm ml-1">đang theo dõi</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#65676b]">
                                    {profileUser?.dob && (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDob(profileUser.dob)}
                                        </span>
                                    )}
                                    {profileUser?.gender && (
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {formatGender(profileUser.gender)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 flex-shrink-0">
                                {!isOwner ? (
                                    <>
                                        <button
                                            onClick={onFollowToggle}
                                            disabled={followLoading}
                                            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${isFollowing
                                                ? 'bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505]'
                                                : 'bg-[#1877f2] hover:bg-[#166fe5] text-white'
                                                } disabled:opacity-60 disabled:cursor-not-allowed`}
                                        >
                                            {isFollowing ? (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                                    </svg>
                                                    Đang theo dõi
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    Theo dõi
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setSendMessageOpen(true)}
                                            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] transition-colors cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.352 5.373 3.47 7.043V22l3.268-1.793C9.76 20.4 10.865 20.586 12 20.586c5.523 0 10-4.145 10-9.243S17.523 2 12 2z" />
                                            </svg>
                                            Nhắn tin
                                        </button>
                                    </>
                                ) : (
                                    <button className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] transition-colors cursor-pointer">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Chỉnh sửa trang cá nhân
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-[#e4e6eb]" />
                </div>
            </div>

            {/* Media viewer (cover & avatar) */}
            <MediaCarouselViewer
                isOpen={isMediaViewerOpen}
                onClose={closeViewer}
                medias={mediaViewerMedias}
                initialIndex={0}
            />

            {/* Send Message Modal */}
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
