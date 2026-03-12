/**
 * Chuyển đổi chuỗi thời gian ISO thành dạng tương đối:
 *  - < 60 phút   : "X phút trước"
 *  - < 24 giờ    : "X giờ trước"
 *  - < 7 ngày    : "X ngày trước"
 *  - < 365 ngày  : "X tuần trước"
 *  - >= 365 ngày : "X năm trước"
 *
 * @param {string|Date} dateInput - Chuỗi ISO hoặc đối tượng Date
 * @returns {string}
 */
export function timeAgo(dateInput) {
    if (!dateInput) return '';

    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return dateInput; // Trả về nguyên nếu không parse được

    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours   = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks   = Math.floor(diffDays / 7);
    const diffYears   = Math.floor(diffDays / 365);

    if (diffMinutes < 1)   return 'Vừa xong';
    if (diffMinutes < 60)  return `${diffMinutes} phút trước`;
    if (diffHours   < 24)  return `${diffHours} giờ trước`;
    if (diffDays    < 7)   return `${diffDays} ngày trước`;
    if (diffDays    < 365) return `${diffWeeks} tuần trước`;
    return `${diffYears} năm trước`;
}
