import React from 'react';
import { useNavigate } from 'react-router-dom';

import HomeNavbar from '@/components/Home/HomeNavbar';
import HeroSection from '@/components/Home/HeroSection';
import FeaturesSection from '@/components/Home/FeaturesSection';
import HighlightBanner from '@/components/Home/HighlightBanner';
import CTASection from '@/components/Home/CTASection';
import HomeFooter from '@/components/Home/HomeFooter';

/**
 * Home page — ráp nối 6 component con theo đúng cấu trúc Stitch HTML:
 * <body> → bg-background text-on-background
 *   <nav>        → HomeNavbar
 *   <main pt-24> → HeroSection + FeaturesSection + HighlightBanner + CTASection
 *   <footer>     → HomeFooter
 */
function Home() {
    const navigate = useNavigate();
    const handleJoin = () => navigate('/register');

    return (
        <div className="bg-[#f8f5ff] text-[#2a2b51]">
            <HomeNavbar onJoin={handleJoin} />
            <main className="pt-24 overflow-x-hidden">
                <HeroSection onJoin={handleJoin} />
                <FeaturesSection />
                <HighlightBanner />
                <CTASection onJoin={handleJoin} />
            </main>
            <HomeFooter />
        </div>
    );
}

export default Home;
