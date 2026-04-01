import React from 'react';

const PopupOverlay = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    // Optional: click outside to close
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-on-surface/20 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div className="bg-surface-container-lowest w-full h-full sm:h-auto sm:max-w-xl sm:max-h-[85vh] flex flex-col rounded-none sm:rounded-xl shadow-2xl overflow-hidden ring-1 shadow-surface-tint/50 sm:ring-primary/10">
                {children}
            </div>
        </div>
    );
};

export default PopupOverlay;
