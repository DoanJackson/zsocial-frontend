import React from 'react';

/**
 * The "Bạn đang nghĩ gì thế?" bar on the profile page (owner only).
 * Clicking it opens the CreatePostModal.
 */
const CreatePostBox = ({ profileUser, onOpen }) => {
    const initials = profileUser?.fullName?.[0]?.toUpperCase() || '?';

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex gap-3 items-center">
                {profileUser?.avatar?.url ? (
                    <img
                        src={profileUser.avatar.url}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm select-none flex-shrink-0">
                        {initials}
                    </div>
                )}
                <div
                    className="flex-1 bg-[#f0f2f5] rounded-full py-2.5 px-5 text-[#65676b] cursor-pointer hover:bg-[#e4e6eb] transition-colors text-sm"
                    onClick={onOpen}
                >
                    Bạn đang nghĩ gì thế?
                </div>
            </div>
            <div className="flex justify-around mt-3 border-t border-[#e4e6eb] pt-3">
                <button
                    onClick={onOpen}
                    className="flex items-center gap-2 text-[#65676b] text-sm font-medium hover:bg-[#f0f2f5] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    📷 Ảnh/Video
                </button>
            </div>
        </div>
    );
};

export default CreatePostBox;
