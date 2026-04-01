import React from 'react';

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

const ProfileInfo = ({ profileUser, isOwner, isFollowing, followLoading, onFollowToggle, onSendMessage }) => {
    return (
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
                                    {profileUser?.followingMe ? 'Theo dõi lại' : 'Theo dõi'}
                                </>
                            )}
                        </button>
                        <button
                            onClick={onSendMessage}
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
    );
};

export default ProfileInfo;
