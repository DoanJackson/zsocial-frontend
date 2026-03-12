function EmptyConversation() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-white text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <p className="font-semibold text-gray-600 text-base">Chọn một đoạn chat để bắt đầu</p>
            <p className="text-sm mt-1">Các tin nhắn sẽ hiển thị tại đây</p>
        </div>
    );
}

export default EmptyConversation;
