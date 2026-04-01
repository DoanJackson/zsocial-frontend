import React from 'react';

/**
 * HomeFooter — pixel-perfect từ Stitch HTML (lines 238-258)
 *
 * HTML gốc:
 * <footer class="bg-slate-50 w-full rounded-t-[3rem] mt-20 flex flex-col md:flex-row
 *   justify-between items-center px-12 py-16 w-full font-['Be_Vietnam_Pro'] text-sm tracking-wide">
 *   <div class="mb-8 md:mb-0 space-y-4">  ← logo + copyright
 *   <div class="flex flex-wrap justify-center gap-8 items-center">  ← links
 *   <div class="mt-8 md:mt-0 flex gap-4">  ← social icons
 */
function HomeFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-50 w-full rounded-t-[3rem] mt-20 flex flex-col md:flex-row justify-between items-center px-12 py-16 font-['Be_Vietnam_Pro'] text-sm tracking-wide">
      {/* Left: logo + copyright */}
      <div className="mb-8 md:mb-0 space-y-4">
        <div className="text-lg font-bold text-slate-900">ZSocial</div>
        <p className="text-slate-500 max-w-xs">© {year} ZSocial.</p>
      </div>

      {/* Center: nav links */}
      <div className="flex flex-wrap justify-center gap-8 items-center">
        <a
          className="text-slate-500 hover:underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          href="#"
        >
          Privacy
        </a>
        <a
          className="text-slate-500 hover:underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          href="#"
        >
          Terms
        </a>
        <a
          className="text-slate-500 hover:underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          href="#"
        >
          Safety
        </a>
        <a
          className="text-slate-500 hover:underline decoration-2 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
          href="#"
        >
          Contact
        </a>
      </div>

      {/* Right: social icon buttons */}
      <div className="mt-8 md:mt-0 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#e8e6ff] flex items-center justify-center text-[#004be2] cursor-pointer hover:bg-[#004be2] hover:text-white transition-colors">
          <span className="material-symbols-outlined text-xl">share</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#e8e6ff] flex items-center justify-center text-[#004be2] cursor-pointer hover:bg-[#004be2] hover:text-white transition-colors">
          <span className="material-symbols-outlined text-xl">language</span>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
