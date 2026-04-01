import React, { useRef, useEffect } from 'react';

const PostBodyInput = ({ title, onChangeTitle, content, onChangeContent, mediaPreviews, onRemoveMedia, onFileClick }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [content]);

    return (
        <>
            <div className="mb-3">
                <input 
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-on-surface placeholder:text-on-surface-variant/50 outline-none" 
                    placeholder="Tiêu đề bài viết..."
                    value={title}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    autoFocus
                />
            </div>
            <div className="mb-6">
                <textarea 
                    ref={textareaRef}
                    className="w-full min-h-[120px] max-h-[300px] overflow-y-auto bg-transparent border-none focus:ring-0 text-xl font-body text-on-surface placeholder:text-on-surface-variant/50 resize-none outline-none" 
                    placeholder="Bạn đang nghĩ gì thế?"
                    value={content}
                    onChange={(e) => onChangeContent(e.target.value)}
                    rows={3}
                ></textarea>
            </div>
            
            {mediaPreviews.length === 0 ? (
                <div 
                    onClick={onFileClick}
                    className="group relative bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container hover:border-primary/40 transition-all duration-300"
                >
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-3xl">image</span>
                    </div>
                    <div className="text-on-surface font-semibold">Thêm hình ảnh/video</div>
                    <div className="text-on-surface-variant text-sm mt-1">hoặc kéo và thả vào đây</div>
                </div>
            ) : (
                <div className="mb-6">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-[10px]">
                        {mediaPreviews.map((media, index) => (
                            <div key={index} className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-surface-container-low [&>img]:absolute [&>img]:top-0 [&>img]:left-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>video]:absolute [&>video]:top-0 [&>video]:left-0 [&>video]:w-full [&>video]:h-full [&>video]:object-cover">
                                {media.type === 'VIDEO' ? (
                                    <video src={media.url} controls />
                                ) : (
                                    <img src={media.url} alt={`preview-${index}`} />
                                )}
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface rounded-full p-0 w-6 h-6 flex items-center justify-center cursor-pointer text-[1.2rem] leading-none transition-colors border-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveMedia(index);
                                    }}
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button 
                        type="button"
                        onClick={onFileClick} 
                        className="mt-4 text-sm font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer"
                    >
                        + Thêm hình ảnh/video nữa
                    </button>
                </div>
            )}
        </>
    );
};

export default PostBodyInput;
