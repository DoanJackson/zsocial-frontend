import React from 'react';

const PopupUserInfo = ({ userAvatar, userName, status, onChangeStatus }) => {
    const handleStatusToggle = () => {
        // Toggle between PUBLIC and ARCHIVED
        onChangeStatus(status === 'PUBLIC' ? 'ARCHIVED' : 'PUBLIC');
    };

    return (
        <div className="flex items-center gap-4 mb-6">
            <img 
                alt="Avatar người dùng" 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 bg-[#f0f2f5]" 
                src={userAvatar} 
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            {/* Fallback if no avatar provided / img err */}
            {!userAvatar && (
                 <div className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 bg-[#f0f2f5] flex items-center justify-center font-bold text-primary">
                     {userName?.[0]?.toUpperCase() || 'U'}
                 </div>
            )}
            
            <div>
                <div className="font-bold text-on-surface">{userName || 'User Name'}</div>
                <button 
                    onClick={handleStatusToggle}
                    type="button"
                    className="cursor-pointer mt-1 flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                    <span className="material-symbols-outlined text-[14px]">
                        {status === 'PUBLIC' ? 'public' : 'lock'}
                    </span>
                    {status === 'PUBLIC' ? 'Công khai' : 'Lưu nháp'}
                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </button>
            </div>
        </div>
    );
};

export default PopupUserInfo;
