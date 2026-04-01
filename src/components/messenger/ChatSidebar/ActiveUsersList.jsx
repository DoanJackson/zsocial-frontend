import React from 'react';

const ActiveUsersList = () => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
            <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="relative w-14 h-14 rounded-full p-0.5 border-2 border-primary group-hover:scale-105 transition-transform">
                    <img
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                        src="/assets/chat-img1.png"
                    />
                </div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Bạn</span>
            </div>
            {/* Active Items */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="relative w-14 h-14 rounded-full group-hover:scale-105 transition-transform">
                    <img
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                        src="/assets/chat-img2.png"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
                </div>
                <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">Linh</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="relative w-14 h-14 rounded-full group-hover:scale-105 transition-transform">
                    <img
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                        src="/assets/chat-img3.png"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
                </div>
                <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">Nam</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer group">
                <div className="relative w-14 h-14 rounded-full group-hover:scale-105 transition-transform">
                    <img
                        alt="User"
                        className="w-full h-full rounded-full object-cover"
                        src="/assets/chat-img4.png"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
                </div>
                <span className="text-[10px] font-medium text-on-surface-variant group-hover:text-primary transition-colors">Thảo</span>
            </div>
        </div>
    );
};

export default ActiveUsersList;
