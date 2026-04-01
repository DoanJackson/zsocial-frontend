import React from 'react';

const ChatSearch = () => {
    return (
        <div className="relative group mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors cursor-pointer">
                search
            </span>
            <input
                className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-full focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline outline-none shadow-sm transition-all"
                placeholder="Tìm kiếm hội thoại"
                type="text"
            />
        </div>
    );
};

export default ChatSearch;
