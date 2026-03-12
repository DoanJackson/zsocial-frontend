import React, { useEffect } from 'react';

/**
 * Reusable confirmation dialog.
 *
 * Props:
 *   isOpen      - boolean
 *   title       - string
 *   message     - string | ReactNode
 *   confirmLabel - string (default "Xác nhận")
 *   cancelLabel  - string (default "Hủy")
 *   variant      - "danger" | "warning" | "info"  (default "danger")
 *   onConfirm   - () => void
 *   onCancel    - () => void
 */
const ConfirmDialog = ({
    isOpen,
    title = 'Xác nhận',
    message,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Hủy',
    variant = 'danger',
    onConfirm,
    onCancel,
}) => {
    // Lock body scroll while open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const iconMap = {
        danger: (
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
        ),
        warning: (
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
            </div>
        ),
        info: (
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        ),
    };

    const confirmBtnClass = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        info: 'bg-[#1877f2] hover:bg-[#166fe5] text-white',
    }[variant];

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[modalFadeIn_0.18s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {iconMap[variant]}

                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">{title}</h3>
                {message && (
                    <p className="text-sm text-center text-gray-500 mb-6 leading-relaxed">{message}</p>
                )}

                <div className="flex gap-3">
                    <button
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${confirmBtnClass}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ConfirmDialog;
