import React from 'react';

const featureCards = [
  {
    iconName: 'camera_enhance',
    title: 'Chia sẻ khoảnh khắc',
    description: 'Đăng tải những thước phim và hình ảnh chất lượng cao để giữ trọn vẹn kỷ niệm đẹp.',
    // border-b-4 border-primary/20 hover:border-primary
    borderResting: 'border-[#004be2]/20',
    borderHover: 'hover:border-[#004be2]',
    // icon bg: bg-primary-container/20, icon color: text-primary
    iconBg: 'bg-[#809bff]/20',
    iconColor: 'text-[#004be2]',
  },
  {
    iconName: 'group_add',
    title: 'Kết nối bạn bè',
    description: 'Tìm kiếm và kết nối với những người bạn có cùng đam mê và sở thích trên toàn cầu.',
    // border-b-4 border-secondary/20 hover:border-secondary
    borderResting: 'border-[#006571]/20',
    borderHover: 'hover:border-[#006571]',
    // icon bg: bg-secondary-container/20, icon color: text-secondary
    iconBg: 'bg-[#26e6ff]/20',
    iconColor: 'text-[#006571]',
  },
  {
    iconName: 'forum',
    title: 'Trò chuyện thả ga',
    description: 'Nhắn tin không giới hạn với tốc độ cực nhanh và bảo mật tin nhắn đầu cuối an toàn.',
    // border-b-4 border-tertiary-container/40 hover:border-tertiary
    borderResting: 'border-[#ff8fa9]/40',
    borderHover: 'hover:border-[#b60051]',
    // icon bg: bg-tertiary-container/20, icon color: text-tertiary
    iconBg: 'bg-[#ff8fa9]/20',
    iconColor: 'text-[#b60051]',
  },
  {
    iconName: 'auto_awesome',
    title: 'Tương tác đa chiều',
    description: 'Sử dụng icon động, reaction độc đáo để thể hiện cảm xúc một cách sống động nhất.',
    // border-b-4 border-on-background/10 hover:border-on-background
    borderResting: 'border-[#2a2b51]/10',
    borderHover: 'hover:border-[#2a2b51]',
    // icon bg: bg-surface-container-high, icon color: text-on-background
    iconBg: 'bg-[#e1e0ff]',
    iconColor: 'text-[#2a2b51]',
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f2efff] py-32 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-[#2a2b51] tracking-tight">
            Tại sao chọn ZSocial?
          </h2>
          <p className="text-[#575881] text-lg max-w-2xl mx-auto">
            Nâng tầm trải nghiệm xã hội của bạn với những tính năng độc bản chỉ có tại ZSocial.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className={`bg-[#ffffff] p-8 rounded-lg shadow-sm border-b-4 ${card.borderResting} ${card.borderHover} transition-all duration-300 group`}
            >
              <div
                className={`w-16 h-16 ${card.iconBg} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <span className={`material-symbols-outlined ${card.iconColor} text-3xl`}>
                  {card.iconName}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2a2b51]">{card.title}</h3>
              <p className="text-[#575881] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
