import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-[860px]' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]" onClick={onClose}>
            <div
                className={`bg-white rounded-lg w-[90%] ${maxWidth} max-h-[90vh] flex flex-col shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-[modalFadeIn_0.2s_ease-out]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center relative">
                    <h3 className="m-0 flex-1 text-center text-lg">{title}</h3>
                    <button
                        className="bg-[#e4e6eb] hover:bg-[#d8dadf] border-none rounded-full w-9 h-9 p-0 flex items-center justify-center text-2xl text-[#65676b] cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {children}
                </div>
                {footer && (
                    <div className="border-t border-gray-200 bg-white">
                        {footer}
                    </div>
                )}
            </div>
            <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default Modal;
