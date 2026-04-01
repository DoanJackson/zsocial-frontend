import React from 'react';

const PopupActions = ({ onFileClick, onSubmit, isSubmitting, isDisabled }) => {
    return (
        <div className="p-4 sm:px-6 sm:pb-6 mt-auto border-t border-surface-container sm:border-t-0 bg-surface-container-lowest">
            <div className="flex items-center justify-between p-2 sm:p-3 mb-4 sm:mb-6 bg-surface-container-low rounded-xl sm:rounded-full">
                <span className="ml-2 sm:ml-3 text-sm font-semibold text-on-surface-variant truncate">Thêm vào bài viết</span>
                <div className="flex gap-1">
                    <button 
                        type="button"
                        onClick={onFileClick}
                        className="cursor-pointer p-2 hover:bg-surface-container-high rounded-full transition-colors text-primary flex items-center justify-center" 
                        title="Ảnh/Video"
                    >
                        <span className="material-symbols-outlined">photo_library</span>
                    </button>
                    <button type="button" className="cursor-pointer p-2 hover:bg-surface-container-high rounded-full transition-colors text-secondary flex items-center justify-center" title="Gắn thẻ người khác">
                        <span className="material-symbols-outlined">person_add</span>
                    </button>
                    <button type="button" className="cursor-pointer p-2 hover:bg-surface-container-high rounded-full transition-colors text-tertiary flex items-center justify-center" title="Cảm xúc/Hoạt động">
                        <span className="material-symbols-outlined">sentiment_satisfied</span>
                    </button>
                    <button type="button" className="cursor-pointer p-2 hover:bg-surface-container-high rounded-full transition-colors text-error flex items-center justify-center" title="Check in">
                        <span className="material-symbols-outlined">location_on</span>
                    </button>
                </div>
            </div>
            
            <button 
                type="button"
                onClick={onSubmit}
                disabled={isDisabled}
                className="cursor-pointer w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:brightness-100"
            >
                {isSubmitting ? 'Đang đăng...' : 'Đăng'}
            </button>
        </div>
    );
};

export default PopupActions;
