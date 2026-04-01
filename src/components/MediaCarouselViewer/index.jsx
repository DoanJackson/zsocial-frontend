import React, { useState, useEffect } from 'react';

const MediaCarouselViewer = ({ isOpen, onClose, medias = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex >= 0 && initialIndex < medias.length ? initialIndex : 0);
            document.body.style.overflow = 'hidden';
            
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowRight') handleNext(e);
                if (e.key === 'ArrowLeft') handlePrev(e);
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, initialIndex, medias.length]);

    if (!isOpen || !medias || medias.length === 0) return null;

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % medias.length);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + medias.length) % medias.length);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const currentMedia = medias[currentIndex];
    const src = typeof currentMedia === 'string' ? currentMedia : currentMedia.url;
    // Check type explicitly or fallback to checking the extension in URL
    const isVideo = typeof currentMedia === 'string' 
        ? src.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null
        : currentMedia.type === 'VIDEO' || src.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;

    const hasMultiple = medias.length > 1;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
            onClick={handleBackdropClick}
        >
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 transition-all z-50 shadow-lg cursor-pointer active:scale-95"
                title="Đóng (Esc)"
            >
                <span className="material-symbols-outlined text-[28px]">close</span>
            </button>

            {hasMultiple && (
                <button
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 transition-all z-50 shadow-xl cursor-pointer active:scale-95"
                >
                    <span className="material-symbols-outlined text-[32px]">chevron_left</span>
                </button>
            )}

            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-24" onClick={handleBackdropClick}>
                {isVideo ? (
                    <video 
                        key={src} // force remount on src change
                        src={src} 
                        controls 
                        autoPlay 
                        className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain bg-black pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <img 
                        key={src}
                        src={src} 
                        alt={`Media ${currentIndex + 1}`} 
                        className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain pointer-events-auto animate-[scaleIn_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                        draggable={false}
                    />
                )}
            </div>

            {hasMultiple && (
                <button
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 transition-all z-50 shadow-xl cursor-pointer active:scale-95"
                >
                    <span className="material-symbols-outlined text-[32px]">chevron_right</span>
                </button>
            )}

            {hasMultiple && (
                <div className="absolute bottom-6 flex gap-2.5 px-6 py-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    {medias.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer shadow-sm ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default MediaCarouselViewer;
