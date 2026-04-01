import React, { useRef, useState } from 'react';

/**
 * @param {Object} props
 * @param {Array<string>} props.images - array of image URLs
 * @param {string} [props.aspectRatio] - "4/3" | "video" (16/9) | custom
 * @param {function} [props.onImageClick] - (index) => void
 */
const ImageCarousel = ({ images = [], aspectRatio = '4/3', onImageClick }) => {
    const scrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const scrollTo = (index) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
        setCurrentIndex(index);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        scrollTo(Math.max(0, currentIndex - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        scrollTo(Math.min(images.length - 1, currentIndex + 1));
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.offsetWidth;
        const index = Math.round(scrollRef.current.scrollLeft / width);
        setCurrentIndex(index);
    };

    const aspectClass = aspectRatio === 'video' ? 'aspect-video' : 'aspect-[4/3]';

    return (
        <div className="relative group mx-2">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={`carousel-container flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-xl ${aspectClass}`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((media, idx) => {
                    const src = typeof media === 'string' ? media : media.url;
                    const isVideo = typeof media === 'string'
                        ? src.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null
                        : media.type === 'VIDEO' || src.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;

                    return (
                        <div
                            key={idx}
                            className="shrink-0 w-full h-full snap-center cursor-pointer"
                            onClick={() => onImageClick && onImageClick(idx)}
                        >
                            {isVideo ? (
                                <video
                                    src={src}
                                    className="w-full h-full object-cover pointer-events-none"
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img
                                    alt={`Image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    src={src}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
