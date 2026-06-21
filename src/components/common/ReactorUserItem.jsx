import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/userService';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const ReactorUserItem = ({ reactor }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Safety check in case data is malformed
    const user = reactor?.user;
    if (!user) return null;

    const isMe = String(currentUser?.userId || currentUser?.id) === String(user?.userId || user?.id);

    const [isFollowing, setIsFollowing] = useState(reactor?.followedByMe || false);
    const [isLoading, setIsLoading] = useState(false);

    const authorName = user.fullName || user.username || 'Unknown User';
    const authorAvatar = user.avatar?.url || null;
    const authorInitials = authorName[0]?.toUpperCase() || 'U';

    const handleToggleFollow = async (e) => {
        e.stopPropagation();
        if (isMe) return;

        setIsLoading(true);
        try {
            if (isFollowing) {
                await userService.unfollowUser(user.userId);
                setIsFollowing(false);
                toast.success(`Đã bỏ theo dõi ${authorName}`);
            } else {
                await userService.followUser(user.userId);
                setIsFollowing(true);
                toast.success(`Đang theo dõi ${authorName}`);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, thử lại sau");
        } finally {
            setIsLoading(false);
        }
    };

    const goToProfile = (e) => {
        e.stopPropagation();
        navigate(`/profile/${user.userId}`);
    };

    return (
        <div
            className="flex items-center justify-between p-2 rounded hover:bg-surface-container-low transition-colors group cursor-pointer"
            onClick={goToProfile}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    {authorAvatar ? (
                        <img
                            alt={authorName}
                            className="w-10 h-10 object-cover ring-1 ring-primary/10 rounded-full"
                            src={authorAvatar}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#f0f2f5] ring-1 ring-primary/10 flex items-center justify-center">
                            <span className="text-primary font-bold text-sm">{authorInitials}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-headline font-bold text-on-surface text-xs">{authorName}</span>
                    <span className="text-[10px] text-on-surface-variant font-medium tracking-wide">
                        @{user.username}
                    </span>
                </div>
            </div>
            {!isMe && (
                <button
                    onClick={handleToggleFollow}
                    disabled={isLoading}
                    className={`px-4 py-1.5 rounded text-xs font-semibold cursor-pointer active:scale-95 transition-all ${isFollowing
                            ? "bg-surface-container-highest text-primary hover:bg-primary/10"
                            : "bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/20"
                        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                >
                    {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                </button>
            )}
        </div>
    );
};

export default ReactorUserItem;
