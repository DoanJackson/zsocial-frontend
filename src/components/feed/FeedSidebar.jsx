import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const FeedSidebar = () => {
    const { user } = useAuth();
    return (
        <aside className="hidden md:block md:col-span-3 space-y-8 sticky top-24 self-start">
            <nav className="space-y-2">
                <Link
                    to="/feed"
                    className="flex items-center gap-4 px-4 py-3 rounded-full text-blue-600 font-bold bg-blue-600/10 transition-all duration-300"
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        home
                    </span>
                    <span className="font-headline tracking-tight">Trang chủ</span>
                </Link>
                <Link
                    to="#"
                    className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-500 hover:bg-blue-600/5 transition-all duration-300"
                >
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-headline tracking-tight">Khám phá</span>
                </Link>
                <Link
                    to="#"
                    className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-500 hover:bg-blue-600/5 transition-all duration-300"
                >
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="font-headline tracking-tight">Thông báo</span>
                </Link>
                <Link
                    to="/messages"
                    className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-500 hover:bg-blue-600/5 transition-all duration-300"
                >
                    <span className="material-symbols-outlined">mail</span>
                    <span className="font-headline tracking-tight">Tin nhắn</span>
                </Link>
                <Link
                    to={`/profile/${user?.userId}`}
                    className="flex items-center gap-4 px-4 py-3 rounded-full text-slate-500 hover:bg-blue-600/5 transition-all duration-300"
                >
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-headline tracking-tight">Cá nhân</span>
                </Link>
            </nav>

            <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
                <h3 className="font-headline font-extrabold text-sm uppercase tracking-widest text-on-surface-variant px-2">
                    Cộng đồng Hot
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">palette</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none">Art &amp; GenZ</p>
                            <p className="text-xs text-slate-400">12.5k thành viên</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-tertiary to-tertiary-container flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">stadia_controller</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none">E-Sports Việt</p>
                            <p className="text-xs text-slate-400">45k thành viên</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default FeedSidebar;
