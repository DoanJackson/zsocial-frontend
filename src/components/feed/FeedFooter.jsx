import React from 'react';

const FeedFooter = () => {
    return (
        <footer className="w-full rounded-t-[3rem] mt-12 bg-slate-50 font-['Plus_Jakarta_Sans'] text-sm tracking-wide">
            <div className="flex flex-col md:flex-row justify-between items-center px-10 py-12 w-full max-w-[1440px] mx-auto gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-lg font-bold text-slate-900">ZSocial</span>
                    <p className="text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
                        © 2024 ZSocial Kinetic. All rights reserved.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                    <a className="text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">
                        Privacy Policy
                    </a>
                    <a className="text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">
                        Terms of Service
                    </a>
                    <a className="text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">
                        Help Center
                    </a>
                    <a className="text-slate-500 hover:text-blue-500 transition-colors opacity-80 hover:opacity-100" href="#">
                        Cookie Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default FeedFooter;
