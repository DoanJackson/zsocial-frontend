import React from 'react';

/**
 * HeroSection — pixel-perfect từ Stitch HTML (lines 107-146)
 *
 * HTML gốc (section):
 * <section class="relative px-8 md:px-16 py-20 md:py-32 flex flex-col md:flex-row
 *   items-center justify-between gap-12 max-w-7xl mx-auto">
 */
function HeroSection({ onJoin }) {
  return (
    <section className="relative px-8 md:px-16 py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
      {/* Left: text content */}
      <div className="flex-1 space-y-8 z-10">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#26e6ff33] rounded-full text-[#006571] font-semibold text-sm tracking-wide">
          <span className="material-symbols-outlined text-sm">rocket_launch</span>
          Thế hệ mới, Kết nối mới
        </div>

        {/* H1 */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-[#2a2b51]">
          Kết nối không giới hạn với{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(to right, #004be2, #006571)',
            }}
          >
            ZSocial
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-[#575881] max-w-xl leading-relaxed">
          Mạng xã hội hiện đại, nơi bạn chia sẻ khoảnh khắc, kết nối bạn bè và trò chuyện thời
          gian thực.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={onJoin}
            className="cursor-pointer text-[#f2f1ff] px-10 py-5 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform"
            style={{
              background: 'linear-gradient(to right, #004be2, #809bff)',
              boxShadow: '0 20px 25px -5px rgb(0 75 226 / 0.1)',
            }}
          >
            Tham gia ngay
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer bg-[#dbd9ff] text-[#004be2] px-10 py-5 rounded-full text-lg font-bold hover:bg-[#e1e0ff] transition-colors"
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>

      {/* Right: decorative bento image grid */}
      <div className="flex-1 relative w-full aspect-square">
        {/* Blur blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#26e6ff] blur-[120px] opacity-40 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#809bff] blur-[140px] opacity-30 rounded-full" />

        {/* Bento grid */}
        <div className="relative grid grid-cols-6 grid-rows-6 gap-4 w-full h-full">
          {/* Large image top-left */}
          <div className="col-span-4 row-span-4 bg-[#ffffff] rounded-xl shadow-2xl overflow-hidden border border-[#a9a9d7]/10">
            <img
              className="w-full h-full object-cover"
              src="/assets/home-img1.png"
              alt="Nhóm bạn trẻ đang cười đùa vui vẻ"
            />
          </div>

          {/* Small image top-right */}
          <div className="col-span-2 row-span-3 col-start-5 row-start-2 bg-[#26e6ff] rounded-xl shadow-xl overflow-hidden self-end">
            <img
              className="w-full h-full object-cover"
              src="/assets/home-img2.png"
              alt="Giao diện trò chuyện điện thoại hiện đại"
            />
          </div>

          {/* Bottom image */}
          <div className="col-span-3 row-span-2 col-start-2 row-start-5 bg-[#ff8fa9] rounded-xl shadow-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="/assets/home-img3.png"
              alt="Mọi người tương tác trên mạng xã hội"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
