import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../SearchBar';

/**
 * Header dùng chung cho toàn app.
 *
 * @param {'home' | 'feed'} variant
 *   - 'home'  → nav anchor (Tính năng, Giới thiệu) + nút đăng nhập/đăng ký
 *               nếu đã đăng nhập: thêm link Bảng tin + avatar có dropdown
 *   - 'feed'  → nav link (Trang chủ, Bảng tin) + avatar có dropdown
 */
const Header = ({ variant = 'feed' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/');
    };

    // ─── Avatar + Dropdown ────────────────────────────────────────────────────
    const AvatarWithDropdown = ({ size = 'w-9 h-9' }) => (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar button */}
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`${size} rounded-full overflow-hidden border-2 border-[#1877f2] cursor-pointer focus:outline-none hover:ring-2 hover:ring-[#1877f2]/40 transition-all flex-shrink-0`}
                title="Tùy chọn tài khoản"
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-sm select-none">
                        {user?.fullName?.[0]?.toUpperCase() || user?.userId?.[0]?.toUpperCase() || 'U'}
                    </div>
                )}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-[200] animate-fade-in">
                    {/* Header dropdown: tên + userId */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {user?.fullName || 'Người dùng'}
                        </p>
                        {user?.userId && (
                            <p className="text-xs text-gray-400 truncate">@{user.userId}</p>
                        )}
                    </div>

                    {/* Trang cá nhân */}
                    <button
                        onClick={() => { setDropdownOpen(false); navigate(`/profile/${user?.userId}`); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Trang cá nhân
                    </button>

                    {/* Cài đặt */}
                    <button
                        onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Cài đặt
                    </button>

                    <div className="border-t border-gray-100 mt-1" />

                    {/* Đăng xuất */}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <header className="grid grid-cols-3 items-center px-8 py-2 bg-white sticky top-0 z-[100] shadow-sm h-[60px] box-border">
            {/* ── Cột trái: Logo + Search Bar ── */}
            <div className="flex items-center gap-3">
                <Link
                    to="/"
                    className="text-2xl font-bold text-[var(--primary-color)] flex items-center hover:drop-shadow-[0_0_2em_#646cffaa] cursor-pointer no-underline flex-shrink-0"
                >
                    ZSocial
                </Link>
                {variant === 'feed' && <SearchBar />}
            </div>

            {/* ── Cột giữa: Nav (luôn căn giữa) ── */}
            <div className="flex justify-center">
                {variant === 'home' && (
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
                )}
                {variant === 'feed' && (
                    <nav className="flex gap-6 items-center">
                        <Link to="/" className="no-underline text-[var(--text-color)] font-medium hover:text-[var(--primary-color)]">
                            Trang chủ
                        </Link>
                        <Link to="/feed" className="no-underline text-[var(--text-color)] font-medium hover:text-[var(--primary-color)]">
                            Bảng tin
                        </Link>
                    </nav>
                )}
            </div>

            {/* ── Cột phải: User controls ── */}
            <div className="flex justify-end items-center gap-3">
                {variant === 'home' && (
                    user?.token ? (
                        <>
                            <button
                                onClick={() => navigate('/messenger')}
                                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                                title="Messenger"
                            >
                                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.352 5.373 3.47 7.043V22l3.268-1.793C9.76 20.4 10.865 20.586 12 20.586c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1 12.43l-2.551-2.715-4.98 2.715 5.48-5.814 2.614 2.715 4.916-2.715L13 14.43z" />
                                </svg>
                            </button>
                            <AvatarWithDropdown size="w-10 h-10" />
                        </>
                    ) : (
                        <button
                            className="bg-white text-[#1877f2] border border-[#1877f2] py-1.5 px-4 rounded-md font-semibold hover:bg-[#f0f2f5] cursor-pointer transition-colors"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập
                        </button>
                    )
                )}
                {variant === 'feed' && (
                    <>
                        {user?.fullName && (
                            <span className="text-sm text-gray-600 font-medium hidden sm:block">
                                {user.fullName}
                            </span>
                        )}
                        <button
                            onClick={() => navigate('/messenger')}
                            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
                            title="Messenger"
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.836 1.352 5.373 3.47 7.043V22l3.268-1.793C9.76 20.4 10.865 20.586 12 20.586c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1 12.43l-2.551-2.715-4.98 2.715 5.48-5.814 2.614 2.715 4.916-2.715L13 14.43z" />
                            </svg>
                        </button>
                        <AvatarWithDropdown />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
