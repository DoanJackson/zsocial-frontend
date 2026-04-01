import React from 'react';

const CreatePostBox = ({ user, onOpen }) => {
    return (
        <section className="bg-surface-container-lowest p-4 md:p-6 rounded-lg shadow-[0_8px_32px_rgba(42,43,81,0.04)] border border-outline-variant/10">
            <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 bg-[#f0f2f5] flex items-center justify-center">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={`${user.fullName || 'User'} avatar`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-primary font-bold text-sm md:text-base">
                            {user?.fullName?.[0]?.toUpperCase() || user?.userId?.[0]?.toUpperCase() || 'U'}
                        </span>
                    )}
                </div>
                <div className="flex-1 space-y-3 md:space-y-4 cursor-pointer" onClick={onOpen}>
                    <textarea
                        className="w-full border-none focus:ring-0 text-base md:text-lg bg-transparent p-0 placeholder:text-slate-300 resize-none font-medium cursor-pointer"
                        placeholder="Hôm nay bạn thế nào?"
                        rows="1"
                        readOnly
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 md:gap-0 pt-3 md:pt-4 border-t border-surface-container">
                        <div className="flex flex-wrap items-center gap-1 md:gap-2">
                            <button
                                type="button"
                                className="cursor-pointer flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-primary/5 text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px] md:text-xl">image</span>
                                <span className="text-[13px] md:text-sm font-bold">Ảnh</span>
                            </button>
                            <button
                                type="button"
                                className="cursor-pointer flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-secondary-container/10 text-secondary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px] md:text-xl">videocam</span>
                                <span className="text-[13px] md:text-sm font-bold">Video</span>
                            </button>
                            <button
                                type="button"
                                className="cursor-pointer flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full hover:bg-tertiary/5 text-tertiary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px] md:text-xl">mood</span>
                                <span className="text-[13px] md:text-sm font-bold">Vibe</span>
                            </button>
                        </div>
                        <button
                            type="button"
                            className="cursor-pointer bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 md:px-8 py-1.5 md:py-2 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform ml-auto sm:ml-0"
                        >
                            Đăng
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreatePostBox;
