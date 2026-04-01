import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';
import AvatarWithDropdown from '@/components/Header/AvatarWithDropdown';

/**
 * Header dùng chung cho toàn app.
 *
 * @param {'home' | 'feed'} variant
 *   - 'home'  → nav anchor (Tính năng, Giới thiệu) + nút đăng nhập/đăng ký
 *   - 'feed'  → glassmorphism header giống Stitch design
 */
const Header = ({ variant = 'feed' }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // ─── Feed variant: Stitch glassmorphism header ────────────────────────────
    if (variant === 'feed') {
        return (
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm shadow-blue-500/5">
                <div className="flex justify-between items-center px-6 py-3 max-w-[1440px] mx-auto font-['Plus_Jakarta_Sans'] font-medium antialiased relative">
                    {/* Left: Logo + Search */}
                    <div className="flex items-center gap-8">
                        <Link to="/feed">
                            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
                                ZSocial
                            </span>
                        </Link>
                        <SearchBar />
                    </div>

                    {/* Right: Notification + Message + Avatar */}
                    <div className="flex items-center gap-2">
                        <button
                            className="cursor-pointer p-2 hover:bg-slate-100 transition-all duration-300 rounded-full scale-95 active:scale-90 text-slate-500"
                            onClick={() => navigate('/notifications')}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button
                            className="cursor-pointer p-2 hover:bg-slate-100 transition-all duration-300 rounded-full scale-95 active:scale-90 text-slate-500"
                            onClick={() => navigate('/messages')}
                        >
                            <span className="material-symbols-outlined">mail</span>
                        </button>
                        <AvatarWithDropdown />
                    </div>

                    {/* Bottom separator */}
                    <div className="bg-slate-100 h-[1px] w-full absolute bottom-0 left-0" />
                </div>
            </header>
        );
    }

    // ─── Home variant: original header ────────────────────────────────────────
    return (
        <header className="grid grid-cols-3 items-center px-8 py-2 bg-white sticky top-0 z-[100] shadow-sm h-[60px] box-border">
            {/* ── Cột trái: Logo ── */}
            <div className="flex items-center gap-3">
                <Link
                    to="/"
                    className="text-2xl font-bold text-[var(--primary-color)] flex items-center hover:drop-shadow-[0_0_2em_#646cffaa] cursor-pointer no-underline flex-shrink-0"
                >
                    ZSocial
                </Link>
            </div>

            {/* ── Cột giữa ── */}
            <div className="flex justify-center">
                <nav className="flex gap-6 items-center">
                    <a href="#features" className="no-underline text-gray-700 font-medium hover:text-[var(--primary-color)]">
                        Tính năng
                    </a>
                    <a href="#about" className="no-underline text-gray-700 font-medium hover:text-[var(--primary-color)]">
                        Giới thiệu
                    </a>
                    {user?.token && (
                        <Link to="/feed" className="no-underline text-gray-700 font-medium hover:text-[var(--primary-color)]">
                            Bảng tin
                        </Link>
                    )}
                </nav>
            </div>

            {/* ── Cột phải ── */}
            <div className="flex justify-end items-center gap-3">
                {user?.token ? (
                    <>
                        <button
                            onClick={() => navigate('/messages')}
                            className="cursor-pointer w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                            title="Messenger"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.352 5.373 3.47 7.043V22l3.268-1.793C9.76 20.4 10.865 20.586 12 20.586c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1 12.43l-2.551-2.715-4.98 2.715 5.48-5.814 2.614 2.715 4.916-2.715L13 14.43z" />
                            </svg>
                        </button>
                        <AvatarWithDropdown />
                    </>
                ) : (
                    <button
                        className="bg-white text-[#1877f2] border border-[#1877f2] py-1.5 px-4 rounded-md font-semibold hover:bg-[#f0f2f5] cursor-pointer transition-colors"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
