import React from 'react';

const PostImages = ({ medias, onImageClick }) => {
    if (!medias || medias.length === 0) return null;

    const imageCount = medias.length;
    const displayImages = medias.slice(0, 4);
    const remainingCount = imageCount - 4;

    const getGridClass = (count) => {
        if (count === 1) return 'grid-cols-1 [&>.media-item]:pt-[60%]';
        if (count === 2) return 'grid-cols-2';
        if (count === 3) return 'grid-cols-2 grid-rows-2 [&>.span-2]:row-span-2 [&>.span-2]:pt-[200%]';
        return 'grid-cols-2';
    };

    return (
        <div className={`grid gap-[2px] w-full overflow-hidden bg-white ${getGridClass(imageCount)}`}>
            {displayImages.map((media, index) => {
                const src = typeof media === 'string' ? media : media.url;
                const isVideo = typeof media === 'string' ? media.type === 'VIDEO' : false;

                return (
                    <div
                        key={index}
                        className={`media-item relative w-full overflow-hidden cursor-pointer group ${index === 0 && imageCount === 3 ? 'span-2' : 'pt-[100%]'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onImageClick) onImageClick(index);
                        }}
                    >
                        {isVideo ? (
                            <video src={src} className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90" />
                        ) : (
                            <img src={src} alt={`Post media ${index + 1}`} className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90" />
                        )}

                        {index === 3 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-[2rem] font-bold">
                                <span>+{remainingCount}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PostImages;
