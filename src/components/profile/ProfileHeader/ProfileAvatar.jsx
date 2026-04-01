import React from 'react';

const ProfileAvatar = ({ profileUser, isOwner, avatarInputRef, handleAvatarFileChange, openViewer, initials }) => {
    return (
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
                        className="absolute bottom-[5px] right-[5px] md:bottom-[5px] md:right-[5px] bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] rounded-full w-9 h-9 flex items-center justify-center shadow cursor-pointer transition-colors"
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
    );
};

export default ProfileAvatar;
