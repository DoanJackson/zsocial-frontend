import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * TopNavBar — pixel-perfect từ Stitch HTML (line 94-105)
 * HTML gốc:
 * <nav class="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl
 *   flex justify-between items-center px-8 py-4 max-w-full no-border bg-surface-container-low shadow-none">
 */
function HomeNavbar({ onJoin }) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex justify-between items-center px-8 py-4">
      {/* Logo */}
      <div className="text-2xl font-black tracking-tighter text-blue-600 font-['Plus_Jakarta_Sans']">
        ZSocial
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] font-medium tracking-tight">
        <a
          className="text-blue-700 font-bold border-b-2 border-blue-600 hover:text-blue-500 transition-colors duration-300"
          href="#"
        >
          Discover
        </a>
        <a
          className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
          href="#"
        >
          Vibe
        </a>
        <a
          className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
          href="#"
        >
          Community
        </a>
        <a
          className="text-slate-600 hover:text-blue-500 transition-colors duration-300"
          href="#"
        >
          Join
        </a>
      </div>

      {/* CTA button */}
      <button
        onClick={onJoin}
        className="bg-[#004be2] text-[#f2f1ff] px-6 py-2.5 rounded-full font-bold scale-95 active:scale-90 transition-transform"
        style={{
          background: 'linear-gradient(to right, #004be2, #809bff)',
        }}
      >
        Get Started
      </button>
    </nav>
  );
}

export default HomeNavbar;
