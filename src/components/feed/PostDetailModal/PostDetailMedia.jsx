import React, { useState } from 'react';

const PostDetailMedia = ({ medias, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!medias || medias.length === 0) return null;

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : medias.length - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev < medias.length - 1 ? prev + 1 : 0));
    };

    const currentMedia = medias[currentIndex];
    const mediaUrl = typeof currentMedia === 'string' ? currentMedia : currentMedia?.url;
    const isVideo = typeof currentMedia === 'string' 
        ? mediaUrl?.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null 
        : currentMedia?.type === 'VIDEO' || mediaUrl?.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;

    return (
        <div className="relative group px-4 cursor-pointer" onClick={() => onImageClick && onImageClick(currentIndex)}>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-container-high shadow-inner">
                {isVideo ? (
                    <video 
                        className="w-full h-full object-cover" 
                        src={mediaUrl} 
                        muted
                        autoPlay
                        loop
                    />
                ) : (
                    <img 
                        className="w-full h-full object-cover" 
                        src={mediaUrl} 
                        alt={`Media ${currentIndex + 1}`} 
                    />
                )}
                
                {medias.length > 1 && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handlePrev}
                                className="cursor-pointer w-10 h-10 rounded-lg bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button 
                                onClick={handleNext}
                                className="cursor-pointer w-10 h-10 rounded-lg bg-white/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/50 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                            {medias.map((_, idx) => (
                                <span 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white shadow-sm' : 'bg-white/40'}`}
                                ></span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostDetailMedia;
