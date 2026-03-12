export function formatTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút`;
    if (diffHour < 24) return `${diffHour} giờ`;
    if (diffDay < 7) return `${diffDay} ngày`;
    return date.toLocaleDateString('vi-VN');
}

export function isImageFile(file) {
    return file.type.startsWith('image/');
}

export function isVideoFile(file) {
    return file.type.startsWith('video/');
}

/**
 * Tạo chuỗi preview hiển thị trong danh sách hội thoại.
 * - Nếu không có nội dung text → dùng số lượng media ("đã gửi X file đính kèm")
 * - Với cuộc trò chuyện 1-1: thêm tiền tố người gửi ("Bạn: ..." / "{name}: ..." / "Bạn đã gửi..." / "{name} đã gửi...")
 * @param {object} conv - conversation object
 * @param {string|number} currentUserId
 */
export function getLastMessagePreview(conv, currentUserId) {
    const sender = conv.lastMessageSender;
    const content = conv.lastMessageContent;
    const mediaCount = conv.lastMessageMediaCount || 0;

    const isMe = sender && String(sender.userId) === String(currentUserId);
    const isGroup = conv.isGroup;

    if (!content && mediaCount === 0) return 'Chưa có tin nhắn';

    if (content) {
        if (isGroup || !sender) return content;
        return isMe ? `Bạn: ${content}` : `${sender.fullName}: ${content}`;
    }

    // No text content, show media count
    const mediaSuffix = `đã gửi ${mediaCount} file đính kèm`;
    if (isGroup || !sender) return `Đã gửi ${mediaCount} file đính kèm`;
    return isMe ? `Bạn ${mediaSuffix}` : `${sender.fullName} ${mediaSuffix}`;
}

