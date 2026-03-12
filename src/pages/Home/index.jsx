import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function Home() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen text-[#050505] font-['Inter',system-ui,Avenir,Helvetica,Arial,sans-serif]">
            <Header variant="home" />

            <main className="flex-1">
                <section className="py-24 px-8 text-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] rounded-b-[50%_4%]">
                    <div className="max-w-[800px] mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-gray-900">Kết nối không giới hạn với ZSocial</h1>
                        <p className="text-lg md:text-xl text-gray-700 max-w-[600px] mx-auto mb-10 leading-relaxed">Mạng xã hội hiện đại, nơi bạn chia sẻ khoảnh khắc, kết nối bạn bè và trò chuyện thời gian thực.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                className="bg-[#1877f2] text-white py-3 px-8 rounded-lg font-semibold hover:bg-[#166fe5] border-none cursor-pointer shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                                onClick={() => navigate('/register')}
                            >
                                Tham gia ngay
                            </button>
                            <button className="bg-white text-gray-800 py-3 px-8 rounded-lg font-semibold hover:bg-gray-50 border border-gray-200 cursor-pointer shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                                Tìm hiểu thêm
                            </button>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-20 px-8 max-w-[1200px] mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Tại sao chọn ZSocial?</h2>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-300 hover:-translate-y-2 text-center group">
                            <div className="w-16 h-16 bg-blue-50 text-[#1877f2] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-[#1877f2] group-hover:text-white transition-colors duration-300">📸</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Chia sẻ khoảnh khắc</h3>
                            <p className="text-gray-600 leading-relaxed">Đăng bài viết, hình ảnh và video để lưu giữ những kỷ niệm đáng nhớ cùng bạn bè.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-300 hover:-translate-y-2 text-center group">
                            <div className="w-16 h-16 bg-blue-50 text-[#1877f2] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-[#1877f2] group-hover:text-white transition-colors duration-300">🤝</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Kết nối bạn bè</h3>
                            <p className="text-gray-600 leading-relaxed">Tìm kiếm và kết bạn dễ dàng. Theo dõi những người bạn quan tâm để không bỏ lỡ tin tức.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-300 hover:-translate-y-2 text-center group">
                            <div className="w-16 h-16 bg-blue-50 text-[#1877f2] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-[#1877f2] group-hover:text-white transition-colors duration-300">💬</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Trò chuyện thả ga</h3>
                            <p className="text-gray-600 leading-relaxed">Nhắn tin riêng tư hoặc tạo nhóm chat sôi động với tính năng gửi tin nhắn thời gian thực.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-300 hover:-translate-y-2 text-center group">
                            <div className="w-16 h-16 bg-blue-50 text-[#1877f2] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-[#1877f2] group-hover:text-white transition-colors duration-300">❤️</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Tương tác đa chiều</h3>
                            <p className="text-gray-600 leading-relaxed">Bình luận, trả lời bình luận và thả cảm xúc vào các bài viết bạn yêu thích.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer id="about" className="py-8 px-8 bg-white text-gray-500 text-center border-t border-gray-100 mt-auto">
                <p className="m-0">&copy; 2024 ZSocial. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
