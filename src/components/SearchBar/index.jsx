import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        inputRef.current?.blur();
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <div
                className={`flex items-center gap-2 bg-[#f0f2f5] rounded-full px-3 py-1.5 transition-all duration-200 ${focused ? 'ring-2 ring-[#1877f2]/40 bg-white shadow-sm w-56' : 'w-44'
                    }`}
            >
                <svg
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${focused ? 'text-[#1877f2]' : 'text-gray-400'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                    ref={inputRef}
                    id="header-search-input"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Tìm kiếm bài viết..."
                    className="bg-transparent outline-none border-none text-sm text-gray-700 placeholder-gray-400 w-full min-w-0"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => { setValue(''); inputRef.current?.focus(); }}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </form>
    );
};

export default SearchBar;
