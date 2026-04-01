import React from 'react';

const ProfileCover = ({ profileUser, isOwner, coverInputRef, handleCoverFileChange, openViewer }) => {
    return (
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
                        type="button"
                        onClick={(e) => { e.stopPropagation(); coverInputRef.current?.click(); }}
                        className="absolute z-10 bottom-[10px] right-[10px] md:bottom-[15px] md:right-[15px] bg-white/90 hover:bg-white text-[#050505] font-semibold text-sm px-4 py-2 rounded-lg shadow-md flex items-center gap-2 cursor-pointer transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
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
    );
};

export default ProfileCover;
