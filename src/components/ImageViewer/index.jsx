import { useState, useEffect } from 'react';

/**
 * ImageViewer – Reusable image lightbox with zoom buttons.
 * Props:
 *   src      {string}   – image URL
 *   alt      {string}   – alt text
 *   onClose  {function} – called when viewer closes
 */
function ImageViewer({ src, alt = '', onClose }) {
    const [scale, setScale] = useState(1);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

    return (
        /* Backdrop – z-[9999] to go above header */
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/85 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Image */}
            <img
                src={src}
                alt={alt}
                draggable={false}
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.15s ease',
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    userSelect: 'none',
                }}
            />

            {/* Top-right: Close button */}
            <button
                onClick={onClose}
                style={{ zIndex: 10000 }}
                className="fixed top-5 right-5 w-10 h-10 cursor-pointer rounded-full bg-black/70 hover:bg-black/90 border border-white/40 text-white flex items-center justify-center transition-colors shadow-xl"
                title="Đóng (Esc)"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Bottom: Zoom controls */}
            <div
                className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-full px-5 py-2.5 backdrop-blur-sm border border-white/10"
                style={{ zIndex: 10000 }}
            >
                {/* Zoom out */}
                <button
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    className="w-8 h-8 rounded-full cursor-pointer text-white hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                    title="Thu nhỏ"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                </button>

                <div className="w-px h-4 bg-white/20" />

                {/* Zoom in */}
                <button
                    onClick={handleZoomIn}
                    disabled={scale >= 5}
                    className="w-8 h-8 rounded-full cursor-pointer text-white hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                    title="Phóng to"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ImageViewer;
