import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className }) => {
    const navigate = useNavigate();
    const [value, setValue] = useState('');
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    
    const desktopInputRef = useRef(null);
    const mobileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        navigate(`/search?q=${encodeURIComponent(q)}`);
        desktopInputRef.current?.blur();
        mobileInputRef.current?.blur();
        setIsMobileExpanded(false); // Close expanded mobile view on submit
    };

    // Auto focus mobile input when expansion triggers
    useEffect(() => {
        if (isMobileExpanded) {
            mobileInputRef.current?.focus();
        }
    }, [isMobileExpanded]);

    const containerClass = className || "hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full w-80 group transition-all focus-within:bg-white focus-within:ring-2 ring-blue-600/20 shadow-sm";

    return (
        <>
            {/* Desktop View (and hidden on mobile by default using md:flex) */}
            <form onSubmit={handleSubmit} className={containerClass}>
                <span className="material-symbols-outlined text-slate-400 mr-2 transition-colors group-focus-within:text-blue-500 select-none">
                    search
                </span>
                <input
                    ref={desktopInputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Tìm kiếm trên ZSocial..."
                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none text-slate-800"
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => { setValue(''); desktopInputRef.current?.focus(); }}
                        className="cursor-pointer text-slate-400 hover:text-slate-600 flex-shrink-0 transition-colors flex items-center justify-center rounded-full active:scale-95"
                        title="Xóa tìm kiếm"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                )}
            </form>

            {/* Mobile View: Collapsed icon button */}
            {!isMobileExpanded && (
                <button
                    type="button"
                    onClick={() => setIsMobileExpanded(true)}
                    className="md:hidden cursor-pointer p-2 hover:bg-slate-100 transition-colors rounded-full text-slate-500 flex items-center justify-center -ml-2"
                    aria-label="Mở tìm kiếm"
                >
                    <span className="material-symbols-outlined text-2xl">search</span>
                </button>
            )}

            {/* Mobile View: Expanded overlay form */}
            {isMobileExpanded && (
                <div className="md:hidden absolute inset-y-0 left-0 right-0 w-full px-4 bg-white/95 backdrop-blur-xl z-[100] flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                    <button
                        type="button"
                        onClick={() => setIsMobileExpanded(false)}
                        className="cursor-pointer p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors active:scale-95 flex-shrink-0"
                        aria-label="Quay lại"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    
                    <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-slate-100 px-4 py-2 rounded-full focus-within:bg-white focus-within:ring-2 ring-blue-600/20 transition-all shadow-sm">
                        <input
                            ref={mobileInputRef}
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 outline-none text-slate-800"
                        />
                        {value && (
                            <button
                                type="button"
                                onClick={() => { setValue(''); mobileInputRef.current?.focus(); }}
                                className="cursor-pointer text-slate-400 hover:text-slate-600 flex-shrink-0 transition-colors flex items-center justify-center rounded-full active:scale-95 ml-2"
                                title="Xóa"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </form>
                </div>
            )}
        </>
    );
};

export default SearchBar;
