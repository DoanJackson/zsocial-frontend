import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MobileBottomNav = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Derived active states based on pathnames
    const isHome = location.pathname.startsWith('/feed');
    const isExplore = location.pathname.startsWith('/search');
    const isMessages = location.pathname.startsWith('/messages');
    const isProfile = location.pathname.startsWith('/profile');

    return (
        <div
            className="md:hidden fixed bottom-6 left-6 right-6 z-50 h-16 rounded-full shadow-2xl flex items-center justify-around px-4 border border-white/20"
            style={{ background: 'rgba(248, 245, 255, 0.7)', backdropFilter: 'blur(20px)' }}
        >
            <Link
                to="/feed"
                className={`cursor-pointer active:scale-90 transition-transform ${isHome ? 'text-primary' : 'text-slate-400'}`}
            >
                <span
                    className={`material-symbols-outlined text-2xl ${isHome ? 'filled-icon' : ''}`}
                    style={isHome ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                    home
                </span>
            </Link>

            <Link
                to="/search"
                className={`cursor-pointer active:scale-90 transition-transform ${isExplore ? 'text-primary' : 'text-slate-400'}`}
            >
                <span
                    className={`material-symbols-outlined text-2xl ${isExplore ? 'filled-icon' : ''}`}
                    style={isExplore ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                    explore
                </span>
            </Link>

            <Link
                to="/messages"
                className={`cursor-pointer active:scale-90 transition-transform ${isMessages ? 'text-primary' : 'text-slate-400'}`}
            >
                <span
                    className={`material-symbols-outlined text-2xl ${isMessages ? 'filled-icon' : ''}`}
                    style={isMessages ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                    chat_bubble
                </span>
            </Link>

            <Link
                to={user ? `/profile/${user.userId}` : '/login'}
                className={`cursor-pointer active:scale-90 transition-transform ${isProfile ? 'text-primary' : 'text-slate-400'}`}
            >
                <span
                    className={`material-symbols-outlined text-2xl ${isProfile ? 'filled-icon' : ''}`}
                    style={isProfile ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                    person
                </span>
            </Link>
        </div>
    );
};

export default MobileBottomNav;
