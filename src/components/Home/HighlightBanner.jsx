import React from 'react';

/**
 * HighlightBanner — pixel-perfect từ Stitch HTML (lines 190-220)
 * "Asymmetric Bento Section"
 *
 * HTML gốc (section):
 * <section class="py-32 px-8 max-w-7xl mx-auto">
 *   <div class="flex flex-col lg:flex-row gap-12 items-center">
 *     <div class="lg:w-1/2 space-y-6">  ← text left
 *     <div class="lg:w-1/2 grid grid-cols-2 gap-6 w-full">  ← images right
 */
function HighlightBanner() {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Left: text */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-[#2a2b51] leading-tight">
            Định nghĩa lại cách bạn <br />
            <span className="text-[#004be2] italic">tương tác</span>
          </h2>
          <p className="text-[#575881] text-lg leading-relaxed">
            Không chỉ là những dòng trạng thái, ZSocial mang đến một không gian sáng tạo không giới
            hạn để bạn là chính mình.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#004be2]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#004be2] text-sm">check</span>
              </div>
              <span className="font-medium">Chế độ tối ưu hóa dữ liệu di động</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#004be2]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#004be2] text-sm">check</span>
              </div>
              <span className="font-medium">Hệ thống AI gợi ý cộng đồng theo sở thích</span>
            </li>
          </ul>
        </div>

        {/* Right: images */}
        <div className="lg:w-1/2 grid grid-cols-2 gap-6 w-full">
          {/* Image 1 — offset down */}
          <div className="aspect-[4/5] bg-[#e8e6ff] rounded-lg overflow-hidden shadow-lg transform translate-y-8">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMFr5kU7ZbO7RBrrBzJH3sYZdU5_bRxTVFCA9mAEfWFs79RBHG8X-mNNe90k39hSS4NsHMZboO2Sgp72tPlOh_nSNm5qURYZZDjpvFObWEdXr_JM6T-XRYEAFcG4ZYMstn_0_XnXrOLEs5DjljX06yPmfdksEsmQrYjAL8blIfEfrN2Ce5OsKg9dDEH7fhnUhnwYp5W-9dsA_b7SDcEV14iSHqyL3T6JqoOx0gGamSmxNs3iVO_oSIb8qefGREaCvpK7xauBNraJq6"
              alt="Ảnh chân dung nghệ thuật của giới trẻ"
            />
          </div>
          {/* Image 2 */}
          <div className="aspect-[4/5] bg-[#e8e6ff] rounded-lg overflow-hidden shadow-lg">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtM7S2J4c1ikAGNt296QnmMiYCEsNC7uy2Maj9s1wRcubrDWS-VvVor-tMLNS-eAGnA3PeJJRbZ-fzrokjIpFndnbWBmJPwAHesXWX9o0Tyndq6m5utsW7Rcqzks-mBVLLiUQpLqyuaY1NiFL3hXDHru53iVJDcDpiy3Ko0yrjWz11KRBz4EplCnFWR9ES9ZDOOXpcPv4G7GYSDCvDiBw48KtIQQqvJVsgCPSN1kieUbqWSX6qoAZswH5_t5SJMMisXn12ZbAe9cfu"
              alt="Phong cách sống đô thị hiện đại"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HighlightBanner;
