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

/**
 * Left sidebar on the profile page.
 * Shows personal info (dob, gender, email) and social stats (follower / following counts).
 */
const ProfileSidebar = ({ profileUser, isOwner }) => {
    const hasDob = !!profileUser?.dob;
    const hasGender = !!profileUser?.gender;
    const hasEmail = isOwner && !!profileUser?.email;
    const hasAnyInfo = hasDob || hasGender || hasEmail;

    return (
        <aside className="w-[360px] flex-shrink-0 hidden lg:flex flex-col gap-4">
            {/* Personal info */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-bold text-[#050505] mb-3">Thông tin cá nhân</h3>
                <div className="flex flex-col gap-3">
                    {hasDob && (
                        <div className="flex items-center gap-3 text-sm text-[#65676b]">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Sinh ngày <strong className="text-[#050505]">{formatDob(profileUser.dob)}</strong></span>
                        </div>
                    )}
                    {hasGender && (
                        <div className="flex items-center gap-3 text-sm text-[#65676b]">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Giới tính: <strong className="text-[#050505]">{formatGender(profileUser.gender)}</strong></span>
                        </div>
                    )}
                    {hasEmail && (
                        <div className="flex items-center gap-3 text-sm text-[#65676b]">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate"><strong className="text-[#050505]">{profileUser.email}</strong></span>
                        </div>
                    )}
                    {!hasAnyInfo && (
                        <p className="text-sm text-[#65676b]">Chưa có thông tin</p>
                    )}
                </div>
            </div>

            {/* Social stats */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-lg font-bold text-[#050505] mb-3">Mạng xã hội</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#f0f2f5] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[#1877f2]">{profileUser?.followerCount ?? 0}</p>
                        <p className="text-xs text-[#65676b] mt-1">Người theo dõi</p>
                    </div>
                    <div className="bg-[#f0f2f5] rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[#1877f2]">{profileUser?.followingCount ?? 0}</p>
                        <p className="text-xs text-[#65676b] mt-1">Đang theo dõi</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProfileSidebar;
