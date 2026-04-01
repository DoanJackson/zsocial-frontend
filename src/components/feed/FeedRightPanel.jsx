import React from 'react';

const FeedRightPanel = () => {
    return (
        <aside className="hidden md:block md:col-span-3 space-y-8 sticky top-24 self-start">
            {/* Friends Suggestions */}
            <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
                <h3 className="font-headline font-extrabold text-sm uppercase tracking-widest text-on-surface-variant">
                    Gợi ý kết bạn
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                alt="Portrait of a young woman"
                                className="w-10 h-10 rounded-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqFNV1xZVFIaWACYAtXvnmS2dGackIWTDtSOazEAy8oZeyWvaMfF554nqBBmIU_-5_c5rRaIIhkzvA2n3o-laJV_jiG6lr11YlOMIpWn-K1R8hnRSA4upLvtfyRdZN3o04EgeGWB5LjZ3x-5bXxJfkCMlckDbg9UsUoiZ-CQXMmDXu0Tjhl_PYtcSzhsg4biwbXuDEIdAMlTBC1dTIOVtrZMTRlpHHCEwUEn3FUymIU0oXivkRnCdtvXdJ4PUSd8j3bPIqRmwV-SIK"
                            />
                            <div>
                                <p className="text-sm font-bold leading-none">Linh Ka</p>
                                <p className="text-xs text-slate-400">Bạn chung: 5</p>
                            </div>
                        </div>
                        <button className="cursor-pointer text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-xl">person_add</span>
                        </button>
                    </div>
                </div>
                <button className="cursor-pointer w-full text-center text-sm font-bold text-primary hover:underline">
                    Xem tất cả
                </button>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
                <h3 className="font-headline font-extrabold text-sm uppercase tracking-widest text-on-surface-variant">
                    Xu hướng
                </h3>
                <div className="space-y-4">
                    <div className="group cursor-pointer">
                        <p className="text-xs text-slate-400">Văn hóa • Đang hot</p>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">#GenZVietNam</p>
                        <p className="text-xs text-slate-400">25.4k bài đăng</p>
                    </div>
                </div>
            </div>

            {/* Events */}
            <div className="bg-gradient-to-br from-[#2962FF] to-primary-container p-6 rounded-lg text-white space-y-4 shadow-xl shadow-primary/20">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">event</span>
                    <h3 className="font-headline font-bold text-sm uppercase tracking-wide">Sự kiện sắp tới</h3>
                </div>
                <div>
                    <p className="font-bold">Hội thảo AI &amp; Nghệ thuật</p>
                    <p className="text-xs opacity-80 mt-1">Chủ nhật, 19:00 • Trực tuyến</p>
                </div>
                <button className="cursor-pointer w-full bg-white/20 hover:bg-white/30 py-2 rounded-full text-sm font-bold transition-colors">
                    Tham gia ngay
                </button>
            </div>
        </aside>
    );
};

export default FeedRightPanel;
