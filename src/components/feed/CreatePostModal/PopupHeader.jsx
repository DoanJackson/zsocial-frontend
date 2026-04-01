import React from 'react';

const PopupHeader = ({ onClose, title }) => {
    return (
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-surface-container flex-shrink-0 bg-surface-container-lowest">
            <div className="flex-1"></div>
            <h2 className="text-lg font-bold text-on-surface text-center flex-1">{title}</h2>
            <div className="flex-1 flex justify-end">
                <button 
                    className="cursor-pointer p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant flex items-center justify-center"
                    onClick={onClose}
                    type="button"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};

export default PopupHeader;
