import React from 'react';

function CTASection({ onJoin }) {
  return (
    <section className="mx-8 mb-24">
      <div className="max-w-7xl mx-auto bg-[#004be2] rounded-xl overflow-hidden relative text-center space-y-8 p-10 md:p-16">
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-90 mb-0"
          style={{
            background: 'linear-gradient(to bottom right, #004be2, #0041c7, #006571)',
          }}
        />

        {/* Blur blob top-left */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Blur blob bottom-right */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00d7f0]/20 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-6xl font-black text-[#f2f1ff] tracking-tight">
            Sẵn sàng bùng nổ?
          </h2>
          <p className="text-[#f2f1ff]/80 text-xl max-w-2xl mx-auto">
            Tham gia cùng hàng triệu bạn trẻ khác để khám phá, kết nối và chia sẻ những khoảnh khắc
            đáng nhớ mỗi ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onJoin}
              className="text-[#f2f1ff] px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #004be2, #809bff)',
                boxShadow: '0 25px 50px -12px rgb(0 75 226 / 0.2)',
              }}
            >
              Trải nghiệm ngay trên Website
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
